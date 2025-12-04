// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Para servir arquivos estáticos

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orchestra', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// ===== SCHEMAS E MODELS =====

// Schema de Usuário
const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tipo: { type: String, enum: ['admin', 'usuario'], default: 'usuario' },
    avatar: String,
    dataCriacao: { type: Date, default: Date.now },
    ultimoAcesso: Date
});

const User = mongoose.model('User', userSchema);

// Schema de Curso
const cursoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    categoria: { 
        type: String, 
        required: true,
        enum: ['Teoria Musical', 'Leitura de Partituras', 'Harmonia', 'Ritmo', 'Composição']
    },
    nivel: { 
        type: String, 
        required: true,
        enum: ['Iniciante', 'Intermediário', 'Avançado']
    },
    duracao: { type: Number, required: true }, // em semanas
    numeroAulas: { type: Number, required: true },
    imagemCapa: String,
    aulas: [{
        numero: Number,
        titulo: String,
        descricao: String,
        duracao: Number, // em minutos
        videoUrl: String,
        materialComplementar: [String]
    }],
    alunos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['Publicado', 'Rascunho'], default: 'Rascunho' },
    avaliacoes: [{
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        nota: { type: Number, min: 1, max: 5 },
        comentario: String,
        data: { type: Date, default: Date.now }
    }],
    dataCriacao: { type: Date, default: Date.now },
    ultimaAtualizacao: { type: Date, default: Date.now }
});

const Curso = mongoose.model('Curso', cursoSchema);

// Schema de Partitura
const partituraSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    compositor: { type: String, required: true },
    instrumento: { 
        type: String, 
        required: true,
        enum: ['Piano', 'Violão', 'Guitarra', 'Violino', 'Saxofone', 'Bateria', 'Flauta', 'Outros']
    },
    genero: String, // Clássica, Jazz, Pop, Folk, etc
    dificuldade: { 
        type: String, 
        required: true,
        enum: ['Fácil', 'Intermediário', 'Difícil']
    },
    duracao: String, // Ex: "3:00"
    tom: String, // Ex: "Lá menor"
    tempo: String, // Ex: "Poco moto ♩ = 72"
    descricao: String,
    arquivoPDF: { type: String, required: true },
    imagemPreview: String,
    tecnicas: [String],
    downloads: { type: Number, default: 0 },
    favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dataCriacao: { type: Date, default: Date.now },
    ultimaAtualizacao: { type: Date, default: Date.now }
});

const Partitura = mongoose.model('Partitura', partituraSchema);

// Schema de Atividade (para o log do admin)
const atividadeSchema = new mongoose.Schema({
    tipo: { 
        type: String, 
        required: true,
        enum: ['curso_criado', 'curso_atualizado', 'partitura_adicionada', 'usuario_registrado', 'avaliacao_recebida']
    },
    descricao: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    referencia: mongoose.Schema.Types.Mixed, // ID do curso/partitura relacionado
    data: { type: Date, default: Date.now }
});

const Atividade = mongoose.model('Atividade', atividadeSchema);

// Schema de Estatísticas
const estatisticaSchema = new mongoose.Schema({
    data: { type: Date, required: true, unique: true },
    visitas: { type: Number, default: 0 },
    novosUsuarios: { type: Number, default: 0 },
    cursosAcessados: { type: Number, default: 0 },
    partiturasDownloads: { type: Number, default: 0 }
});

const Estatistica = mongoose.model('Estatistica', estatisticaSchema);

// ===== MIDDLEWARE DE AUTENTICAÇÃO =====
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_orchestra');
        req.userId = decoded.id;
        req.userTipo = decoded.tipo;
        next();
    } catch (error) {
        res.status(401).json({ erro: 'Token inválido.' });
    }
};

// Middleware para verificar se é admin
const adminMiddleware = (req, res, next) => {
    if (req.userTipo !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
    }
    next();
};

// ===== ROTAS DE AUTENTICAÇÃO =====

// Registrar novo usuário
app.post('/api/auth/registro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        // Verificar se usuário já existe
        const usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ erro: 'Email já cadastrado.' });
        }
        
        // Hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);
        
        // Criar usuário
        const usuario = new User({
            nome,
            email,
            senha: senhaHash
        });
        
        await usuario.save();
        
        // Registrar atividade
        await new Atividade({
            tipo: 'usuario_registrado',
            descricao: `Novo usuário registrado: ${nome}`,
            usuario: usuario._id
        }).save();
        
        res.status(201).json({ 
            mensagem: 'Usuário criado com sucesso!',
            usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email }
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar usuário.', detalhes: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // Buscar usuário
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ erro: 'Email ou senha inválidos.' });
        }
        
        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Email ou senha inválidos.' });
        }
        
        // Atualizar último acesso
        usuario.ultimoAcesso = new Date();
        await usuario.save();
        
        // Gerar token
        const token = jwt.sign(
            { id: usuario._id, tipo: usuario.tipo },
            process.env.JWT_SECRET || 'secret_key_orchestra',
            { expiresIn: '7d' }
        );
        
        res.json({
            token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                avatar: usuario.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao fazer login.', detalhes: error.message });
    }
});

// ===== ROTAS DE CURSOS =====

// Listar todos os cursos (público)
app.get('/api/cursos', async (req, res) => {
    try {
        const { categoria, nivel, busca } = req.query;
        let filtro = { status: 'Publicado' };
        
        if (categoria && categoria !== 'all') filtro.categoria = categoria;
        if (nivel && nivel !== 'all') filtro.nivel = nivel;
        if (busca) {
            filtro.$or = [
                { titulo: { $regex: busca, $options: 'i' } },
                { descricao: { $regex: busca, $options: 'i' } }
            ];
        }
        
        const cursos = await Curso.find(filtro)
            .select('-aulas -avaliacoes')
            .sort({ dataCriacao: -1 });
        
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar cursos.', detalhes: error.message });
    }
});

// Buscar curso por ID (público)
app.get('/api/cursos/:id', async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.id);
        if (!curso) {
            return res.status(404).json({ erro: 'Curso não encontrado.' });
        }
        
        // Calcular média de avaliações
        let mediaAvaliacoes = 0;
        if (curso.avaliacoes.length > 0) {
            const soma = curso.avaliacoes.reduce((acc, av) => acc + av.nota, 0);
            mediaAvaliacoes = (soma / curso.avaliacoes.length).toFixed(1);
        }
        
        const cursoComMedia = curso.toObject();
        cursoComMedia.mediaAvaliacoes = mediaAvaliacoes;
        cursoComMedia.totalAlunos = curso.alunos.length;
        
        res.json(cursoComMedia);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar curso.', detalhes: error.message });
    }
});

// Criar novo curso (admin apenas)
app.post('/api/cursos', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const curso = new Curso(req.body);
        await curso.save();
        
        // Registrar atividade
        await new Atividade({
            tipo: 'curso_criado',
            descricao: `Novo curso criado: ${curso.titulo}`,
            usuario: req.userId,
            referencia: curso._id
        }).save();
        
        res.status(201).json({ mensagem: 'Curso criado com sucesso!', curso });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar curso.', detalhes: error.message });
    }
});

// Atualizar curso (admin apenas)
app.put('/api/cursos/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const curso = await Curso.findByIdAndUpdate(
            req.params.id, 
            { ...req.body, ultimaAtualizacao: new Date() },
            { new: true }
        );
        
        if (!curso) {
            return res.status(404).json({ erro: 'Curso não encontrado.' });
        }
        
        // Registrar atividade
        await new Atividade({
            tipo: 'curso_atualizado',
            descricao: `Curso atualizado: ${curso.titulo}`,
            usuario: req.userId,
            referencia: curso._id
        }).save();
        
        res.json({ mensagem: 'Curso atualizado com sucesso!', curso });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar curso.', detalhes: error.message });
    }
});

// Deletar curso (admin apenas)
app.delete('/api/cursos/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const curso = await Curso.findByIdAndDelete(req.params.id);
        if (!curso) {
            return res.status(404).json({ erro: 'Curso não encontrado.' });
        }
        
        res.json({ mensagem: 'Curso deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar curso.', detalhes: error.message });
    }
});

// ===== ROTAS DE PARTITURAS =====

// Listar todas as partituras (público)
app.get('/api/partituras', async (req, res) => {
    try {
        const { instrumento, dificuldade, busca } = req.query;
        let filtro = {};
        
        if (instrumento && instrumento !== 'all') filtro.instrumento = instrumento;
        if (dificuldade && dificuldade !== 'all') filtro.dificuldade = dificuldade;
        if (busca) {
            filtro.$or = [
                { titulo: { $regex: busca, $options: 'i' } },
                { compositor: { $regex: busca, $options: 'i' } }
            ];
        }
        
        const partituras = await Partitura.find(filtro).sort({ dataCriacao: -1 });
        res.json(partituras);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar partituras.', detalhes: error.message });
    }
});

// Buscar partitura por ID (público)
app.get('/api/partituras/:id', async (req, res) => {
    try {
        const partitura = await Partitura.findById(req.params.id);
        if (!partitura) {
            return res.status(404).json({ erro: 'Partitura não encontrada.' });
        }
        res.json(partitura);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar partitura.', detalhes: error.message });
    }
});

// Criar nova partitura (admin apenas)
app.post('/api/partituras', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const partitura = new Partitura(req.body);
        await partitura.save();
        
        // Registrar atividade
        await new Atividade({
            tipo: 'partitura_adicionada',
            descricao: `Nova partitura adicionada: ${partitura.titulo} por ${partitura.compositor}`,
            usuario: req.userId,
            referencia: partitura._id
        }).save();
        
        res.status(201).json({ mensagem: 'Partitura criada com sucesso!', partitura });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar partitura.', detalhes: error.message });
    }
});

// Atualizar partitura (admin apenas)
app.put('/api/partituras/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const partitura = await Partitura.findByIdAndUpdate(
            req.params.id,
            { ...req.body, ultimaAtualizacao: new Date() },
            { new: true }
        );
        
        if (!partitura) {
            return res.status(404).json({ erro: 'Partitura não encontrada.' });
        }
        
        res.json({ mensagem: 'Partitura atualizada com sucesso!', partitura });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar partitura.', detalhes: error.message });
    }
});

// Deletar partitura (admin apenas)
app.delete('/api/partituras/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const partitura = await Partitura.findByIdAndDelete(req.params.id);
        if (!partitura) {
            return res.status(404).json({ erro: 'Partitura não encontrada.' });
        }
        
        res.json({ mensagem: 'Partitura deletada com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar partitura.', detalhes: error.message });
    }
});

// ===== ROTAS DE ESTATÍSTICAS (Admin) =====

// Dashboard - Estatísticas gerais
app.get('/api/admin/estatisticas', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const totalCursos = await Curso.countDocuments();
        const totalPartituras = await Partitura.countDocuments();
        const totalUsuarios = await User.countDocuments();
        
        // Média de avaliações
        const cursos = await Curso.find();
        let somaAvaliacoes = 0;
        let totalAvaliacoes = 0;
        
        cursos.forEach(curso => {
            curso.avaliacoes.forEach(av => {
                somaAvaliacoes += av.nota;
                totalAvaliacoes++;
            });
        });
        
        const mediaGeral = totalAvaliacoes > 0 ? (somaAvaliacoes / totalAvaliacoes).toFixed(1) : 0;
        
        // Estatísticas dos últimos 7 dias
        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
        
        const estatisticasSemanais = await Estatistica.find({
            data: { $gte: seteDiasAtras }
        }).sort({ data: 1 });
        
        res.json({
            totalCursos,
            totalPartituras,
            totalUsuarios,
            mediaGeral,
            estatisticasSemanais
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar estatísticas.', detalhes: error.message });
    }
});

// Atividades recentes
app.get('/api/admin/atividades', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const atividades = await Atividade.find()
            .sort({ data: -1 })
            .limit(20)
            .populate('usuario', 'nome email');
        
        res.json(atividades);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar atividades.', detalhes: error.message });
    }
});

// Cursos mais acessados
app.get('/api/admin/cursos-populares', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const cursos = await Curso.find({ status: 'Publicado' })
            .select('titulo alunos')
            .sort({ 'alunos.length': -1 })
            .limit(5);
        
        const cursosFormatados = cursos.map(curso => ({
            titulo: curso.titulo,
            acessos: curso.alunos.length
        }));
        
        res.json(cursosFormatados);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar cursos populares.', detalhes: error.message });
    }
});

// ===== ROTA DE HEALTH CHECK =====
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', mensagem: 'API Orchestra funcionando!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 API disponível em: http://localhost:${PORT}/api`);
});

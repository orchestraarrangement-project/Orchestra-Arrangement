// server-supabase.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicializar Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

console.log('✅ Conectado ao Supabase');

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

const adminMiddleware = (req, res, next) => {
    if (req.userTipo !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
    }
    next();
};

// ===== ROTAS DE AUTENTICAÇÃO =====

// Registrar
app.post('/api/auth/registro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        // Verificar se usuário existe
        const { data: usuarioExistente } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();
        
        if (usuarioExistente) {
            return res.status(400).json({ erro: 'Email já cadastrado.' });
        }
        
        // Hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);
        
        // Criar usuário
        const { data: usuario, error } = await supabase
            .from('users')
            .insert([{ nome, email, senha: senhaHash }])
            .select()
            .single();
        
        if (error) throw error;
        
        // Registrar atividade
        await supabase.from('atividades').insert([{
            tipo: 'usuario_registrado',
            descricao: `Novo usuário registrado: ${nome}`,
            usuario_id: usuario.id
        }]);
        
        res.status(201).json({ 
            mensagem: 'Usuário criado com sucesso!',
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao criar usuário.', detalhes: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // Buscar usuário
        const { data: usuario, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error || !usuario) {
            return res.status(401).json({ erro: 'Email ou senha inválidos.' });
        }
        
        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Email ou senha inválidos.' });
        }
        
        // Atualizar último acesso
        await supabase
            .from('users')
            .update({ ultimo_acesso: new Date().toISOString() })
            .eq('id', usuario.id);
        
        // Gerar token
        const token = jwt.sign(
            { id: usuario.id, tipo: usuario.tipo },
            process.env.JWT_SECRET || 'secret_key_orchestra',
            { expiresIn: '7d' }
        );
        
        res.json({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                avatar: usuario.avatar
            }
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao fazer login.' });
    }
});

// Trocar senha
app.post('/api/auth/trocar-senha', authMiddleware, async (req, res) => {
    try {
        const { senhaAtual, novaSenha } = req.body;

        // Buscar usuário
        const { data: usuario, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.userId)
            .single();

        if (error || !usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        // Verificar senha atual
        const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha atual incorreta.' });
        }

        // Hash da nova senha
        const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

        // Atualizar senha
        const { error: updateError } = await supabase
            .from('users')
            .update({ senha: novaSenhaHash })
            .eq('id', req.userId);

        if (updateError) throw updateError;

        res.json({ mensagem: 'Senha alterada com sucesso!' });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao trocar senha.' });
    }
});

// ===== ROTAS DE GERENCIAMENTO DE USUÁRIOS (ADMIN) =====

// Listar todos os usuários (admin)
app.get('/api/admin/usuarios', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { data: usuarios, error } = await supabase
            .from('users')
            .select('id, nome, email, tipo, data_criacao, ultimo_acesso')
            .order('data_criacao', { ascending: false });

        if (error) throw error;

        res.json(usuarios);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao buscar usuários.' });
    }
});

// Criar novo usuário (admin)
app.post('/api/admin/usuarios', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { nome, email, senha, tipo } = req.body;

        // Verificar se usuário existe
        const { data: usuarioExistente } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (usuarioExistente) {
            return res.status(400).json({ erro: 'Email já cadastrado.' });
        }

        // Hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Criar usuário
        const { data: usuario, error } = await supabase
            .from('users')
            .insert([{ nome, email, senha: senhaHash, tipo: tipo || 'usuario' }])
            .select()
            .single();

        if (error) throw error;

        // Registrar atividade
        await supabase.from('atividades').insert([{
            tipo: 'usuario_registrado',
            descricao: `Novo usuário criado: ${nome} (${tipo})`,
            usuario_id: req.userId
        }]);

        res.status(201).json({ 
            mensagem: 'Usuário criado com sucesso!',
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao criar usuário.' });
    }
});

// Atualizar usuário (admin)
app.put('/api/admin/usuarios/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { nome, email, tipo, senha } = req.body;
        const updateData = { nome, email, tipo };

        // Se senha foi fornecida, fazer hash
        if (senha) {
            updateData.senha = await bcrypt.hash(senha, 10);
        }

        const { data: usuario, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        res.json({ mensagem: 'Usuário atualizado com sucesso!', usuario });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
    }
});

// Deletar usuário (admin)
app.delete('/api/admin/usuarios/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // Não permitir deletar a si mesmo
        if (req.params.id === req.userId) {
            return res.status(400).json({ erro: 'Você não pode deletar sua própria conta.' });
        }

        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        res.json({ mensagem: 'Usuário deletado com sucesso!' });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao deletar usuário.' });
    }
});

// ===== ROTAS DE CURSOS =====

// Listar cursos
app.get('/api/cursos', async (req, res) => {
    try {
        const { categoria, nivel, busca } = req.query;
        
        let query = supabase
            .from('cursos')
            .select('*')
            .eq('status', 'Publicado')
            .order('data_criacao', { ascending: false });
        
        if (categoria && categoria !== 'all') {
            query = query.eq('categoria', categoria);
        }
        
        if (nivel && nivel !== 'all') {
            query = query.eq('nivel', nivel);
        }
        
        if (busca) {
            query = query.or(`titulo.ilike.%${busca}%,descricao.ilike.%${busca}%`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        res.json(data);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao buscar cursos.' });
    }
});

// Buscar curso por ID
app.get('/api/cursos/:id', async (req, res) => {
    try {
        const { data: curso, error } = await supabase
            .from('cursos')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error || !curso) {
            return res.status(404).json({ erro: 'Curso não encontrado.' });
        }
        
        // Calcular média de avaliações
        let mediaAvaliacoes = 0;
        if (curso.avaliacoes && curso.avaliacoes.length > 0) {
            const soma = curso.avaliacoes.reduce((acc, av) => acc + av.nota, 0);
            mediaAvaliacoes = (soma / curso.avaliacoes.length).toFixed(1);
        }
        
        curso.mediaAvaliacoes = mediaAvaliacoes;
        curso.totalAlunos = curso.alunos ? curso.alunos.length : 0;
        
        res.json(curso);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao buscar curso.' });
    }
});

// Criar curso (admin)
app.post('/api/cursos', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { data: curso, error } = await supabase
            .from('cursos')
            .insert([req.body])
            .select()
            .single();
        
        if (error) throw error;
        
        // Registrar atividade
        await supabase.from('atividades').insert([{
            tipo: 'curso_criado',
            descricao: `Novo curso criado: ${curso.titulo}`,
            usuario_id: req.userId,
            referencia_id: curso.id
        }]);
        
        res.status(201).json({ mensagem: 'Curso criado com sucesso!', curso });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao criar curso.' });
    }
});

// Atualizar curso (admin)
app.put('/api/cursos/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { data: curso, error } = await supabase
            .from('cursos')
            .update({ ...req.body, ultima_atualizacao: new Date().toISOString() })
            .eq('id', req.params.id)
            .select()
            .single();
        
        if (error || !curso) {
            return res.status(404).json({ erro: 'Curso não encontrado.' });
        }
        
        // Registrar atividade
        await supabase.from('atividades').insert([{
            tipo: 'curso_atualizado',
            descricao: `Curso atualizado: ${curso.titulo}`,
            usuario_id: req.userId,
            referencia_id: curso.id
        }]);
        
        res.json({ mensagem: 'Curso atualizado com sucesso!', curso });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao atualizar curso.' });
    }
});

// Deletar curso (admin)
app.delete('/api/cursos/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { error } = await supabase
            .from('cursos')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        
        res.json({ mensagem: 'Curso deletado com sucesso!' });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao deletar curso.' });
    }
});

// ===== ROTAS DE PARTITURAS =====

// Listar partituras
app.get('/api/partituras', async (req, res) => {
    try {
        const { instrumento, dificuldade, busca } = req.query;
        
        let query = supabase
            .from('partituras')
            .select('*')
            .order('data_criacao', { ascending: false });
        
        if (instrumento && instrumento !== 'all') {
            query = query.eq('instrumento', instrumento);
        }
        
        if (dificuldade && dificuldade !== 'all') {
            query = query.eq('dificuldade', dificuldade);
        }
        
        if (busca) {
            query = query.or(`titulo.ilike.%${busca}%,compositor.ilike.%${busca}%`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        res.json(data);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao buscar partituras.' });
    }
});

// Buscar partitura por ID
app.get('/api/partituras/:id', async (req, res) => {
    try {
        const { data: partitura, error } = await supabase
            .from('partituras')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error || !partitura) {
            return res.status(404).json({ erro: 'Partitura não encontrada.' });
        }
        
        res.json(partitura);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao buscar partitura.' });
    }
});

// Criar partitura (admin)
app.post('/api/partituras', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { data: partitura, error } = await supabase
            .from('partituras')
            .insert([req.body])
            .select()
            .single();
        
        if (error) throw error;
        
        // Registrar atividade
        await supabase.from('atividades').insert([{
            tipo: 'partitura_adicionada',
            descricao: `Nova partitura: ${partitura.titulo} por ${partitura.compositor}`,
            usuario_id: req.userId,
            referencia_id: partitura.id
        }]);
        
        res.status(201).json({ mensagem: 'Partitura criada com sucesso!', partitura });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao criar partitura.' });
    }
});

// Atualizar partitura (admin)
app.put('/api/partituras/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { data: partitura, error } = await supabase
            .from('partituras')
            .update({ ...req.body, ultima_atualizacao: new Date().toISOString() })
            .eq('id', req.params.id)
            .select()
            .single();
        
        if (error || !partitura) {
            return res.status(404).json({ erro: 'Partitura não encontrada.' });
        }
        
        res.json({ mensagem: 'Partitura atualizada com sucesso!', partitura });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao atualizar partitura.' });
    }
});

// Deletar partitura (admin)
app.delete('/api/partituras/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { error } = await supabase
            .from('partituras')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        
        res.json({ mensagem: 'Partitura deletada com sucesso!' });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao deletar partitura.' });
    }
});

// ===== ROTAS ADMIN - ESTATÍSTICAS =====

// Dashboard
app.get('/api/admin/estatisticas', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { count: totalCursos } = await supabase
            .from('cursos')
            .select('*', { count: 'exact', head: true });
        
        const { count: totalPartituras } = await supabase
            .from('partituras')
            .select('*', { count: 'exact', head: true });
        
        const { count: totalUsuarios } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
        
        // Estatísticas semanais
        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
        
        const { data: estatisticasSemanais } = await supabase
            .from('estatisticas')
            .select('*')
            .gte('data', seteDiasAtras.toISOString().split('T')[0])
            .order('data', { ascending: true });
        
        res.json({
            totalCursos: totalCursos || 0,
            totalPartituras: totalPartituras || 0,
            totalUsuarios: totalUsuarios || 0,
            mediaGeral: 4.8,
            estatisticasSemanais: estatisticasSemanais || []
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao buscar estatísticas.' });
    }
});

// Atividades recentes
app.get('/api/admin/atividades', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('atividades')
            .select(`
                *,
                usuario:users(nome, email)
            `)
            .order('data', { ascending: false })
            .limit(20);
        
        if (error) throw error;
        
        res.json(data);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ erro: 'Erro ao buscar atividades.' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', mensagem: 'API Orchestra com Supabase funcionando!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 API disponível em: http://localhost:${PORT}/api`);
});

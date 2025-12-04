// seed.js - Script para popular o banco de dados com dados iniciais
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orchestra', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schemas (copiados do server.js)
const userSchema = new mongoose.Schema({
    nome: String,
    email: String,
    senha: String,
    tipo: String,
    avatar: String,
    dataCriacao: { type: Date, default: Date.now }
});

const cursoSchema = new mongoose.Schema({
    titulo: String,
    descricao: String,
    categoria: String,
    nivel: String,
    duracao: Number,
    numeroAulas: Number,
    imagemCapa: String,
    aulas: Array,
    alunos: Array,
    status: String,
    avaliacoes: Array,
    dataCriacao: { type: Date, default: Date.now },
    ultimaAtualizacao: { type: Date, default: Date.now }
});

const partituraSchema = new mongoose.Schema({
    titulo: String,
    compositor: String,
    instrumento: String,
    genero: String,
    dificuldade: String,
    duracao: String,
    tom: String,
    tempo: String,
    descricao: String,
    arquivoPDF: String,
    imagemPreview: String,
    tecnicas: Array,
    downloads: { type: Number, default: 0 },
    favoritos: Array,
    dataCriacao: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Curso = mongoose.model('Curso', cursoSchema);
const Partitura = mongoose.model('Partitura', partituraSchema);

async function seed() {
    try {
        console.log('🌱 Iniciando seed do banco de dados...');
        
        // Limpar dados existentes
        await User.deleteMany({});
        await Curso.deleteMany({});
        await Partitura.deleteMany({});
        
        console.log('🗑️  Dados antigos removidos');
        
        // Criar usuário admin
        const senhaHashAdmin = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            nome: 'Administrador',
            email: 'admin@orchestra.com',
            senha: senhaHashAdmin,
            tipo: 'admin'
        });
        
        console.log('👤 Admin criado: admin@orchestra.com / admin123');
        
        // Criar usuários de teste
        const senhaHashUser = await bcrypt.hash('123456', 10);
        const usuarios = await User.insertMany([
            {
                nome: 'João Silva',
                email: 'joao@email.com',
                senha: senhaHashUser,
                tipo: 'usuario'
            },
            {
                nome: 'Maria Santos',
                email: 'maria@email.com',
                senha: senhaHashUser,
                tipo: 'usuario'
            },
            {
                nome: 'Pedro Oliveira',
                email: 'pedro@email.com',
                senha: senhaHashUser,
                tipo: 'usuario'
            }
        ]);
        
        console.log('👥 3 usuários de teste criados (senha: 123456)');
        
        // Criar cursos
        const cursos = await Curso.insertMany([
            {
                titulo: 'Fundamentos da Teoria Musical',
                descricao: 'Aprenda os conceitos básicos da teoria musical, incluindo notas, escalas, acordes e como ler partituras. Perfeito para iniciantes!',
                categoria: 'Teoria Musical',
                nivel: 'Iniciante',
                duracao: 4,
                numeroAulas: 4,
                imagemCapa: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop',
                aulas: [
                    {
                        numero: 1,
                        titulo: 'Introdução às Notas Musicais',
                        descricao: 'Conheça as 7 notas musicais e suas posições no pentagrama',
                        duracao: 30
                    },
                    {
                        numero: 2,
                        titulo: 'Escalas Maiores e Menores',
                        descricao: 'Entenda a estrutura das escalas musicais',
                        duracao: 45
                    },
                    {
                        numero: 3,
                        titulo: 'Leitura de Cifras',
                        descricao: 'Aprenda a ler e interpretar cifras musicais',
                        duracao: 40
                    },
                    {
                        numero: 4,
                        titulo: 'Intervalos e Acordes Básicos',
                        descricao: 'Compreenda os intervalos e forme seus primeiros acordes',
                        duracao: 50
                    }
                ],
                alunos: [usuarios[0]._id, usuarios[1]._id],
                status: 'Publicado',
                avaliacoes: [
                    {
                        usuario: usuarios[0]._id,
                        nota: 5,
                        comentario: 'Excelente curso para iniciantes!',
                        data: new Date()
                    },
                    {
                        usuario: usuarios[1]._id,
                        nota: 4,
                        comentario: 'Muito bom, aprendi bastante.',
                        data: new Date()
                    }
                ]
            },
            {
                titulo: 'Leitura Avançada de Partituras',
                descricao: 'Desenvolva habilidades avançadas de leitura musical, incluindo sight-reading, ornamentações e interpretação de dinâmicas.',
                categoria: 'Leitura de Partituras',
                nivel: 'Avançado',
                duracao: 6,
                numeroAulas: 6,
                imagemCapa: 'https://images.unsplash.com/photo-1460667262436-cf19894f4774?w=800&h=600&fit=crop',
                alunos: [usuarios[2]._id],
                status: 'Publicado',
                avaliacoes: [
                    {
                        usuario: usuarios[2]._id,
                        nota: 5,
                        comentario: 'Conteúdo muito completo!',
                        data: new Date()
                    }
                ]
            },
            {
                titulo: 'Harmonia Funcional',
                descricao: 'Estude progressões harmônicas, cadências e análise harmônica para composição e arranjo musical.',
                categoria: 'Harmonia',
                nivel: 'Intermediário',
                duracao: 8,
                numeroAulas: 8,
                imagemCapa: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=600&fit=crop',
                alunos: [usuarios[0]._id],
                status: 'Publicado',
                avaliacoes: []
            },
            {
                titulo: 'Composição Musical',
                descricao: 'Aprenda técnicas de composição, desenvolvimento de melodias e estruturação de obras musicais.',
                categoria: 'Composição',
                nivel: 'Avançado',
                duracao: 10,
                numeroAulas: 10,
                imagemCapa: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
                alunos: [],
                status: 'Rascunho',
                avaliacoes: []
            }
        ]);
        
        console.log('📚 4 cursos criados');
        
        // Criar partituras
        const partituras = await Partitura.insertMany([
            {
                titulo: 'Für Elise',
                compositor: 'Ludwig van Beethoven',
                instrumento: 'Piano',
                genero: 'Clássica',
                dificuldade: 'Intermediário',
                duracao: '3:00',
                tom: 'Lá menor',
                tempo: 'Poco moto ♩ = 72',
                descricao: 'Uma das peças mais famosas de Beethoven.',
                arquivoPDF: '/partituras/fur-elise.pdf',
                imagemPreview: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=600&h=600&fit=crop',
                tecnicas: ['Arpejos', 'Staccato', 'Legato', 'Dinâmica', 'Pedal'],
                downloads: 245,
                favoritos: [usuarios[0]._id, usuarios[1]._id]
            },
            {
                titulo: 'Canon em Ré',
                compositor: 'Johann Pachelbel',
                instrumento: 'Violino',
                genero: 'Clássica',
                dificuldade: 'Intermediário',
                duracao: '5:30',
                tom: 'Ré Maior',
                tempo: 'Andante',
                descricao: 'Canon barroco muito popular.',
                arquivoPDF: '/partituras/canon-re.pdf',
                imagemPreview: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=600&fit=crop',
                tecnicas: ['Arcadas', 'Legato', 'Vibrato'],
                downloads: 189,
                favoritos: [usuarios[2]._id]
            },
            {
                titulo: 'Summertime',
                compositor: 'George Gershwin',
                instrumento: 'Saxofone',
                genero: 'Jazz',
                dificuldade: 'Intermediário',
                duracao: '4:00',
                tom: 'Lá menor',
                tempo: 'Lento',
                descricao: 'Clássico do jazz americano.',
                arquivoPDF: '/partituras/summertime.pdf',
                imagemPreview: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop',
                tecnicas: ['Improvisação', 'Swing', 'Vibrato'],
                downloads: 167,
                favoritos: []
            },
            {
                titulo: 'All of Me',
                compositor: 'John Legend',
                instrumento: 'Piano',
                genero: 'Pop',
                dificuldade: 'Fácil',
                duracao: '4:30',
                tom: 'Fá Maior',
                tempo: 'Moderato',
                descricao: 'Balada pop contemporânea.',
                arquivoPDF: '/partituras/all-of-me.pdf',
                imagemPreview: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=600&h=600&fit=crop',
                tecnicas: ['Acordes', 'Arpejos'],
                downloads: 312,
                favoritos: [usuarios[0]._id]
            },
            {
                titulo: 'Asa Branca',
                compositor: 'Luiz Gonzaga',
                instrumento: 'Violão',
                genero: 'Folk',
                dificuldade: 'Fácil',
                duracao: '3:30',
                tom: 'Sol Maior',
                tempo: 'Moderato',
                descricao: 'Clássico da música brasileira.',
                arquivoPDF: '/partituras/asa-branca.pdf',
                imagemPreview: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=600&h=600&fit=crop',
                tecnicas: ['Dedilhado', 'Ritmo Baião'],
                downloads: 278,
                favoritos: [usuarios[1]._id, usuarios[2]._id]
            }
        ]);
        
        console.log('🎼 5 partituras criadas');
        
        console.log('\n✅ Seed concluído com sucesso!');
        console.log('\n📋 Resumo:');
        console.log(`   - Usuários: ${await User.countDocuments()}`);
        console.log(`   - Cursos: ${await Curso.countDocuments()}`);
        console.log(`   - Partituras: ${await Partitura.countDocuments()}`);
        console.log('\n🔐 Credenciais Admin:');
        console.log('   Email: admin@orchestra.com');
        console.log('   Senha: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao fazer seed:', error);
        process.exit(1);
    }
}

seed();

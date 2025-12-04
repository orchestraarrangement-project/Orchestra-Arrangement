// criar-admin.js
// Script para criar usuário admin no Supabase

const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function criarAdmin() {
    console.log('🔧 Criando usuário administrador...\n');

    // Verificar se variáveis de ambiente estão configuradas
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
        console.error('❌ ERRO: Configure SUPABASE_URL e SUPABASE_KEY no arquivo .env');
        console.log('\nExemplo:');
        console.log('SUPABASE_URL=https://seu-projeto.supabase.co');
        console.log('SUPABASE_KEY=sua_chave_aqui\n');
        process.exit(1);
    }

    // Conectar ao Supabase
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY
    );

    console.log('✅ Conectado ao Supabase\n');

    // Dados do admin
    const dadosAdmin = {
        nome: 'Administrador',
        email: 'admin@orchestra.com',
        senha: 'admin123',
        tipo: 'admin'
    };

    console.log('📝 Dados do admin:');
    console.log(`   Nome: ${dadosAdmin.nome}`);
    console.log(`   Email: ${dadosAdmin.email}`);
    console.log(`   Senha: ${dadosAdmin.senha}`);
    console.log(`   Tipo: ${dadosAdmin.tipo}\n`);

    try {
        // Verificar se já existe
        const { data: adminExistente } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', dadosAdmin.email)
            .single();

        if (adminExistente) {
            console.log('⚠️  Admin já existe! Deletando para recriar...\n');
            await supabase
                .from('users')
                .delete()
                .eq('email', dadosAdmin.email);
        }

        // Gerar hash da senha
        console.log('🔐 Gerando hash da senha...');
        const senhaHash = await bcrypt.hash(dadosAdmin.senha, 10);
        console.log(`   Hash: ${senhaHash}\n`);

        // Criar admin
        console.log('💾 Salvando no banco...');
        const { data: novoAdmin, error } = await supabase
            .from('users')
            .insert([{
                nome: dadosAdmin.nome,
                email: dadosAdmin.email,
                senha: senhaHash,
                tipo: dadosAdmin.tipo
            }])
            .select()
            .single();

        if (error) {
            throw error;
        }

        console.log('\n✅ SUCESSO! Admin criado com sucesso!\n');
        console.log('═══════════════════════════════════════');
        console.log('   CREDENCIAIS DE LOGIN:');
        console.log('═══════════════════════════════════════');
        console.log(`   Email: ${dadosAdmin.email}`);
        console.log(`   Senha: ${dadosAdmin.senha}`);
        console.log('═══════════════════════════════════════\n');
        console.log('🚀 Agora você pode fazer login no painel admin!');
        console.log('   URL: http://localhost:3000/admin-login.html\n');

    } catch (error) {
        console.error('\n❌ ERRO ao criar admin:', error.message);
        console.error('Detalhes:', error);
        process.exit(1);
    }
}

// Executar
criarAdmin();

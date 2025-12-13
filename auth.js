// auth.js - Sistema de autenticação centralizado

function verificarAuth() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const paginaAtual = window.location.pathname.split('/').pop();
    
    // Se estiver na página de login, NÃO redirecionar
    if (paginaAtual === 'admin-login.html') {
        // Se estiver logado, redirecionar para dashboard
        if (token && userId) {
            window.location.href = 'admin-dashboard.html';
        }
        return;
    }
    
    // Se NÃO estiver logado e NÃO estiver na página de login
    if (!token || !userId) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Usuário autenticado
    return true;
}

function fazerLogout() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        window.location.href = 'admin-login.html';
    }
}

// Executar verificação ao carregar QUALQUER página admin
if (window.location.pathname.includes('admin-')) {
    verificarAuth();
}

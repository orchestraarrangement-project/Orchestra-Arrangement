function renderSidebar(pageActive) {
    const pages = {
        dashboard: 'admin-dashboard.html',
        partituras: 'admin-partituras.html',
        ebooks: 'admin-ebooks.html',
        usuarios: 'admin-usuarios.html',
        configuracoes: 'admin-configuracoes.html'
    };

    return `
        <div class="sidebar">
            <h1>ORCHESTRA</h1>
            <a href="${pages.dashboard}" class="${pageActive === 'dashboard' ? 'active' : ''}">
                🏠 Dashboard
            </a>
            <a href="${pages.partituras}" class="${pageActive === 'partituras' ? 'active' : ''}">
                🎼 Partituras
            </a>
            <a href="${pages.ebooks}" class="${pageActive === 'ebooks' ? 'active' : ''}">
                📚 Ebooks
            </a>
            <a href="${pages.usuarios}" class="${pageActive === 'usuarios' ? 'active' : ''}">
                👥 Usuários
            </a>
            <a href="${pages.configuracoes}" class="${pageActive === 'configuracoes' ? 'active' : ''}">
                ⚙️ Configurações
            </a>
            <div style="margin-top: auto;">
                <a href="admin-login.html" onclick="localStorage.clear()">🚪 Sair</a>
            </div>
        </div>
    `;
}

// CSS da Sidebar (compartilhado)
const sidebarCSS = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        background: #f5f5f5;
        display: flex;
        height: 100vh;
    }

    .sidebar {
        width: 200px;
        background: linear-gradient(180deg, #4a148c 0%, #6a1b9a 100%);
        color: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
        position: fixed;
        height: 100vh;
        left: 0;
        top: 0;
    }

    .sidebar h1 {
        font-size: 1.5rem;
        margin-bottom: 30px;
        font-weight: 900;
    }

    .sidebar a {
        display: block;
        color: white;
        text-decoration: none;
        padding: 12px 15px;
        margin-bottom: 8px;
        border-radius: 8px;
        transition: all 0.3s;
    }

    .sidebar a:hover,
    .sidebar a.active {
        background: rgba(255,255,255,0.15);
    }

    .main {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 200px;
    }

    .header {
        background: white;
        padding: 20px 30px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header h1 {
        font-size: 1.8rem;
        font-weight: 700;
    }

    .content {
        padding: 30px;
        overflow-y: auto;
    }

    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s;
        font-family: inherit;
    }

    .btn-primary {
        background: #6a1b9a;
        color: white;
    }

    .btn-primary:hover {
        background: #4a148c;
    }

    table {
        width: 100%;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    th, td {
        padding: 15px;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    th {
        background: #f8f9fa;
        font-weight: 600;
    }

    tr:hover {
        background: #f8f9fa;
    }

    .btn-edit {
        background: #3498db;
        color: white;
        padding: 5px 10px;
        font-size: 0.9rem;
        margin-right: 5px;
    }

    .btn-danger {
        background: #e74c3c;
        color: white;
        padding: 5px 10px;
        font-size: 0.9rem;
    }

    .img-thumb {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 5px;
    }
`;

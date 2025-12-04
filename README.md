# 🎵 Orchestra - Plataforma Musical Completa

Plataforma web para aprendizado de música com cursos, partituras e ferramentas interativas + Painel Administrativo completo.

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- npm ou npx

### Instalação e Execução

1. **Extraia o arquivo ZIP**

2. **Navegue até a pasta do projeto**
   ```bash
   cd orchestra-project
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   ou
   ```bash
   npx live-server --port=3000
   ```

4. **Acesse no navegador**
   O site abrirá automaticamente em: `http://localhost:3000`

## 📁 Estrutura do Projeto

```
orchestra-project/
├── index.html              # Página inicial
├── cursos.html             # Página de cursos
├── curso-detalhes.html     # Detalhes do curso
├── partituras.html         # Página de partituras
├── partitura-detalhes.html # Detalhes da partitura
├── styles.css              # Estilos do site principal
│
├── admin-login.html        # 🔐 Login do painel admin
├── admin-dashboard.html    # 📊 Dashboard com gráficos
├── admin-cursos.html       # ✏️ Gerenciar cursos
├── admin-partituras.html   # 🎼 Gerenciar partituras
├── admin-styles.css        # Estilos do painel admin
│
├── package.json            # Configurações do projeto
└── README.md               # Este arquivo
```

## 🔐 Painel Administrativo

### Acesso ao Painel
1. Acesse: `http://localhost:3000/admin-login.html`
2. Login: Qualquer email e senha (é uma simulação)
3. O sistema redirecionará para o dashboard

### Funcionalidades do Admin

#### 📊 **Dashboard**
- Estatísticas em tempo real (cursos, partituras, usuários, avaliações)
- Gráfico de visitas do site (últimos 7 dias)
- Cursos mais acessados
- Feed de atividades recentes
- Cards com métricas importantes

#### ✏️ **Gerenciar Cursos**
- Listagem de todos os cursos
- Busca e filtros por categoria e dificuldade
- Adicionar novo curso (modal com formulário completo)
- Editar cursos existentes
- Excluir cursos
- Upload de imagem de capa
- Status: Publicado ou Rascunho

#### 🎼 **Gerenciar Partituras**
- Listagem de todas as partituras
- Busca e filtros
- Adicionar nova partitura
- Editar partituras existentes
- Excluir partituras
- Organização por instrumento e dificuldade

#### 👤 **Outras Seções** (preparadas para desenvolvimento)
- Usuários
- Atividades
- Configurações

### Recursos do Painel
- ✅ Sidebar com navegação completa
- ✅ Design responsivo
- ✅ Gráficos interativos (Canvas)
- ✅ Modals para adicionar/editar conteúdo
- ✅ Sistema de autenticação simulado
- ✅ Estatísticas em tempo real
- ✅ Interface moderna e intuitiva

## ✨ Funcionalidades do Site Principal

- ✅ Design responsivo e moderno
- ✅ Efeitos de hover em todos os elementos
- ✅ Animações suaves
- ✅ Filtros funcionais nas páginas
- ✅ Navegação intuitiva
- ✅ Otimizado para mobile
- ✅ Páginas de detalhes completas

## 🎨 Personalizações

### Alterar Cores
Edite as variáveis CSS no arquivo `styles.css`:

```css
:root {
    --primary-color: #4a4a7e;
    --accent-color: #f4c430;
    /* ... outras cores */
}
```

### Adicionar sua Logo
No arquivo HTML, substitua:
```html
<div class="logo-placeholder">ORCHESTRA</div>
```

Por:
```html
<img src="caminho/para/sua-logo.png" alt="Logo" style="height: 40px;">
```

### Conectar Backend Real
O painel admin está preparado para ser conectado a um backend:

1. **Login**: Modifique o script em `admin-login.html` para fazer requisição real
2. **Dashboard**: Conecte os endpoints de estatísticas
3. **CRUD**: Implemente as chamadas de API nos formulários

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm start` - Alias para npm run dev

## 📝 Observações

- O servidor live-server recarrega automaticamente quando você faz alterações
- Porta padrão: 3000 (pode ser alterada no package.json)
- Não precisa instalar dependências, usa npx
- Login do admin aceita qualquer credencial (é simulado)
- Gráficos usam Canvas nativo (sem bibliotecas externas)

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- HTML5
- CSS3 (com variáveis CSS e animações)
- JavaScript Vanilla
- Canvas API (para gráficos)

**Dev Tools:**
- Live Server (para desenvolvimento)
- LocalStorage (para simulação de autenticação)

## 🎯 Próximos Passos Sugeridos

1. **Backend**: Conectar com Node.js/Express ou outra API
2. **Banco de Dados**: MongoDB, PostgreSQL, etc.
3. **Autenticação Real**: JWT, OAuth
4. **Upload de Arquivos**: Sistema real de upload
5. **Biblioteca de Gráficos**: Chart.js ou Recharts para gráficos mais complexos

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato através de:
- Email: contato@orchestra-arrangement.com
- Tel: +55 11 1234-5678

---

Desenvolvido com ❤️ para músicos e estudantes de música

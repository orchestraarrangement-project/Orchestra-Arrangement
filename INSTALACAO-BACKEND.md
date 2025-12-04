# 🚀 Guia de Instalação do Backend - Orchestra

Este guia explica como configurar e rodar o backend completo com banco de dados.

## 📋 Pré-requisitos

Antes de começar, instale:

1. **Node.js** (versão 14 ou superior)
   - Download: https://nodejs.org/
   - Verificar instalação: `node --version`

2. **MongoDB** (versão 4.4 ou superior)
   - **Opção 1 - MongoDB Local:**
     - Windows: https://www.mongodb.com/try/download/community
     - Mac: `brew install mongodb-community`
     - Linux: `sudo apt-get install mongodb`
   
   - **Opção 2 - MongoDB Atlas (Cloud - RECOMENDADO):**
     - Crie conta gratuita: https://www.mongodb.com/cloud/atlas
     - Crie um cluster gratuito
     - Copie a string de conexão

## 🔧 Configuração Passo a Passo

### 1. Instalar Dependências

No terminal, dentro da pasta do projeto:

```bash
npm install
```

Isso instalará todas as dependências necessárias:
- express (servidor web)
- mongoose (conexão com MongoDB)
- bcryptjs (criptografia de senhas)
- jsonwebtoken (autenticação JWT)
- cors (permitir requisições do frontend)
- dotenv (variáveis de ambiente)
- multer (upload de arquivos)

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Se usar MongoDB LOCAL:
MONGODB_URI=mongodb://localhost:27017/orchestra

# Se usar MongoDB Atlas (Cloud):
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/orchestra

JWT_SECRET=minha_chave_secreta_super_segura_123
PORT=5000
```

⚠️ **IMPORTANTE:** Substitua `minha_chave_secreta_super_segura_123` por uma chave aleatória forte!

### 3. Popular o Banco de Dados

Execute o script de seed para criar dados iniciais:

```bash
node seed.js
```

Isso criará:
- ✅ 1 usuário admin (admin@orchestra.com / admin123)
- ✅ 3 usuários de teste
- ✅ 4 cursos de exemplo
- ✅ 5 partituras de exemplo

### 4. Iniciar o Servidor

**Modo Desenvolvimento (com auto-reload):**
```bash
npm run dev:server
```

**Modo Produção:**
```bash
npm start
```

Se tudo deu certo, você verá:
```
✅ Conectado ao MongoDB
🚀 Servidor rodando na porta 5000
📡 API disponível em: http://localhost:5000/api
```

### 5. Testar a API

Teste se a API está funcionando:

```bash
curl http://localhost:5000/api/health
```

Ou abra no navegador: http://localhost:5000/api/health

## 🎯 Rodar Frontend + Backend Juntos

Execute ambos ao mesmo tempo:

```bash
npm run dev:all
```

Isso abrirá:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/registro` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Cursos (Público)
- `GET /api/cursos` - Listar cursos
- `GET /api/cursos/:id` - Ver curso específico

### Cursos (Admin)
- `POST /api/cursos` - Criar curso
- `PUT /api/cursos/:id` - Atualizar curso
- `DELETE /api/cursos/:id` - Deletar curso

### Partituras (Público)
- `GET /api/partituras` - Listar partituras
- `GET /api/partituras/:id` - Ver partitura específica

### Partituras (Admin)
- `POST /api/partituras` - Criar partitura
- `PUT /api/partituras/:id` - Atualizar partitura
- `DELETE /api/partituras/:id` - Deletar partitura

### Admin - Dashboard
- `GET /api/admin/estatisticas` - Estatísticas gerais
- `GET /api/admin/atividades` - Atividades recentes
- `GET /api/admin/cursos-populares` - Top 5 cursos

## 🔐 Autenticação

Para acessar rotas protegidas, inclua o token no header:

```javascript
Authorization: Bearer SEU_TOKEN_AQUI
```

O token é retornado no login e salvo automaticamente no `localStorage`.

## 🧪 Testando com o Frontend

1. Inicie o backend: `npm run dev:server`
2. Inicie o frontend: `npm run dev`
3. Acesse o admin: http://localhost:3000/admin-login.html
4. Login: `admin@orchestra.com` / `admin123`

Agora todas as operações (criar, editar, deletar) funcionarão com dados reais!

## 🗃️ Estrutura do Banco de Dados

### Coleções:

1. **users** - Usuários (admin e normais)
2. **cursos** - Cursos com aulas e avaliações
3. **partituras** - Partituras com informações detalhadas
4. **atividades** - Log de atividades do sistema
5. **estatisticas** - Métricas diárias

## 🐛 Solução de Problemas

### MongoDB não conecta
```
❌ Erro: connect ECONNREFUSED 127.0.0.1:27017
```
**Solução:** Certifique-se que o MongoDB está rodando:
- Windows: Serviços → MongoDB Server → Iniciar
- Mac/Linux: `brew services start mongodb-community`

### Porta 5000 já está em uso
```
❌ Error: listen EADDRINUSE: address already in use :::5000
```
**Solução:** Altere a porta no `.env`:
```
PORT=5001
```

### Erro ao instalar dependências
```
❌ npm ERR! code ENOENT
```
**Solução:** Execute `npm install` novamente

## 📦 Deploy (Produção)

### Heroku
```bash
heroku create orchestra-api
heroku config:set MONGODB_URI=sua_string_atlas
heroku config:set JWT_SECRET=sua_chave_secreta
git push heroku main
```

### Railway
1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Deploy automático!

### DigitalOcean / AWS
1. Configure um droplet/instância
2. Instale Node.js e MongoDB
3. Clone o repositório
4. Configure PM2: `pm2 start server.js`

## 🔒 Segurança em Produção

⚠️ Antes de colocar em produção:

1. ✅ Mude o `JWT_SECRET` para algo forte e aleatório
2. ✅ Use HTTPS (Let's Encrypt é gratuito)
3. ✅ Configure CORS para permitir apenas seu domínio
4. ✅ Use variáveis de ambiente (nunca commite o `.env`)
5. ✅ Ative rate limiting para evitar ataques
6. ✅ Configure backup automático do MongoDB

## 💡 Próximos Passos

Agora que o backend está funcionando:

1. ✅ Integre upload real de imagens (AWS S3, Cloudinary)
2. ✅ Adicione envio de emails (SendGrid, Mailgun)
3. ✅ Implemente reset de senha
4. ✅ Adicione mais filtros e paginação
5. ✅ Configure logs (Winston, Morgan)

## 📞 Suporte

Problemas? Abra uma issue ou entre em contato!

---

**Desenvolvido com ❤️ para músicos e estudantes de música**

# ✅ Guia Rápido - Testar Sistema Completo

## 🎯 O que foi feito:

Agora o sistema está **100% integrado**:
- ✅ Admin cria curso → Salva no Supabase
- ✅ Admin deleta curso → Remove do Supabase
- ✅ Site carrega cursos automaticamente do banco
- ✅ Tudo em tempo real!

---

## 🚀 Passo a Passo para Testar:

### 1️⃣ Certifique-se que o Supabase está configurado

Verifique se você:
- ✅ Criou as tabelas no SQL Editor
- ✅ Configurou o `.env` com SUPABASE_URL e SUPABASE_KEY
- ✅ Rodou `npm install`

### 2️⃣ Inicie o servidor backend

```bash
npm run dev:server
```

Você deve ver:
```
✅ Conectado ao Supabase
🚀 Servidor rodando na porta 5000
```

### 3️⃣ Inicie o frontend (em outro terminal)

```bash
npm run dev
```

Isso abrirá o navegador em `http://localhost:3000`

---

## 🧪 Teste 1: Login no Admin

1. Acesse: `http://localhost:3000/admin-login.html`
2. Login com:
   - **Email:** `admin@orchestra.com`
   - **Senha:** `admin123`
3. Deve redirecionar para o Dashboard

**✅ O que acontece:** Sistema verifica no Supabase se usuário existe e se é admin

---

## 🧪 Teste 2: Criar Novo Curso

1. No painel admin, clique em **"Cursos"** no menu lateral
2. Clique no botão **"+ Novo Curso"**
3. Preencha o formulário:
   - **Título:** "Teste de Música"
   - **Categoria:** "Teoria Musical"
   - **Nível:** "Iniciante"
   - **Descrição:** "Curso de teste"
   - **Duração:** 4
   - **Número de Aulas:** 6
   - **Status:** "Publicado"
4. Clique em **"Criar Curso"**

**✅ O que acontece:**
- Curso salva no Supabase
- Alerta de sucesso aparece
- Lista de cursos recarrega automaticamente
- Novo curso aparece na tabela

---

## 🧪 Teste 3: Ver o Curso no Site

1. Abra uma nova aba: `http://localhost:3000`
2. Role até a seção "Cursos em Destaque"

**✅ O que acontece:**
- Seu curso criado aparece automaticamente!
- Imagem, título, descrição tudo vindo do banco

---

## 🧪 Teste 4: Verificar no Supabase

1. Abra o Supabase no navegador
2. Vá em **Table Editor**
3. Clique na tabela **"cursos"**

**✅ O que acontece:**
- Você vê o curso que acabou de criar
- Todos os dados estão lá!
- Pode editar direto no Supabase também

---

## 🧪 Teste 5: Deletar um Curso

1. No painel admin, em "Gerenciar Cursos"
2. Clique no ícone de **lixeira** 🗑️ em algum curso
3. Confirme a exclusão

**✅ O que acontece:**
- Curso é removido do Supabase
- Lista recarrega automaticamente
- Curso some do site também

---

## 🧪 Teste 6: Filtros em Tempo Real

1. No painel admin, use os filtros:
   - Categoria: "Teoria Musical"
   - Nível: "Iniciante"
2. Busque por texto

**✅ O que acontece:**
- Filtros consultam o Supabase
- Resultados aparecem em tempo real

---

## 🎯 Fluxo Completo de Dados:

```
┌─────────────────────────────────────────────┐
│  Admin cria curso no formulário             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  JavaScript envia dados para API            │
│  POST /api/cursos                           │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Backend valida e salva no Supabase         │
│  INSERT INTO cursos (...)                   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Supabase retorna curso criado              │
│  com ID e data de criação                   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Frontend mostra alerta de sucesso         │
│  e recarrega lista de cursos                │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Site público carrega cursos do banco       │
│  GET /api/cursos                            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  ✅ CURSO APARECE EM TEMPO REAL!            │
└─────────────────────────────────────────────┘
```

---

## 🐛 Solução de Problemas:

### "Failed to fetch" ou erro de CORS
**Causa:** Backend não está rodando  
**Solução:** Execute `npm run dev:server`

### "Token inválido"
**Causa:** Token expirou ou não existe  
**Solução:** Faça login novamente

### "Erro ao carregar cursos"
**Causa:** Supabase não configurado  
**Solução:** Verifique SUPABASE_URL e SUPABASE_KEY no `.env`

### Curso não aparece no site
**Causa:** Status está como "Rascunho"  
**Solução:** Edite no Supabase e mude status para "Publicado"

---

## 🎉 Funcionalidades Completas:

✅ **CRUD de Cursos**
- Criar: Formulário → API → Supabase
- Ler: Carrega automaticamente do banco
- Atualizar: (editar no Supabase por enquanto)
- Deletar: Botão de lixeira funcional

✅ **Autenticação Real**
- Login com JWT
- Verificação de admin
- Token salvo no localStorage

✅ **Sincronização Automática**
- Admin adiciona → Site atualiza
- Admin remove → Site atualiza
- Tudo em tempo real!

✅ **Filtros Dinâmicos**
- Consultas ao banco
- Resultados instantâneos

---

## 📊 Monitorar Requisições:

**Abra o DevTools do navegador (F12):**
- **Console:** Ver logs de API
- **Network:** Ver requisições HTTP
- **Application → Local Storage:** Ver token JWT

---

## 🚀 Próximos Passos:

Agora que está funcionando, você pode:

1. ✅ Adicionar mais cursos pelo admin
2. ✅ Implementar edição de cursos (modal de edição)
3. ✅ Fazer o mesmo para Partituras
4. ✅ Adicionar upload de imagens real (Cloudinary, AWS S3)
5. ✅ Implementar paginação
6. ✅ Adicionar busca avançada

---

**Agora seu sistema está 100% funcional com banco de dados real!** 🎵✨

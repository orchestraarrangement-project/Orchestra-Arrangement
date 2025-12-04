# 🚀 Guia Rápido - Supabase

## ✅ Passo 1: Configurar Supabase (5 minutos)

### 1.1 - Criar Projeto no Supabase

1. Acesse: https://supabase.com
2. Clique em "New Project"
3. Preencha:
   - **Name:** `orchestra`
   - **Database Password:** Crie uma senha forte (anote!)
   - **Region:** South America (São Paulo)
4. Clique em "Create new project" e aguarde ~2 minutos

### 1.2 - Pegar as Credenciais

1. No menu lateral, clique em **⚙️ Settings**
2. Clique em **API**
3. Copie:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 1.3 - Criar as Tabelas

1. No menu lateral, clique em **🗄️ SQL Editor**
2. Clique em "New query"
3. Cole o SQL abaixo:

```sql
-- Tabela de usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    tipo TEXT DEFAULT 'usuario' CHECK (tipo IN ('admin', 'usuario')),
    avatar TEXT,
    data_criacao TIMESTAMP DEFAULT NOW(),
    ultimo_acesso TIMESTAMP
);

-- Tabela de cursos
CREATE TABLE cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    categoria TEXT NOT NULL,
    nivel TEXT NOT NULL,
    duracao INTEGER NOT NULL,
    numero_aulas INTEGER NOT NULL,
    imagem_capa TEXT,
    aulas JSONB DEFAULT '[]',
    alunos UUID[] DEFAULT '{}',
    status TEXT DEFAULT 'Rascunho',
    avaliacoes JSONB DEFAULT '[]',
    data_criacao TIMESTAMP DEFAULT NOW(),
    ultima_atualizacao TIMESTAMP DEFAULT NOW()
);

-- Tabela de partituras
CREATE TABLE partituras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    compositor TEXT NOT NULL,
    instrumento TEXT NOT NULL,
    genero TEXT,
    dificuldade TEXT NOT NULL,
    duracao TEXT,
    tom TEXT,
    tempo TEXT,
    descricao TEXT,
    arquivo_pdf TEXT NOT NULL,
    imagem_preview TEXT,
    tecnicas TEXT[] DEFAULT '{}',
    downloads INTEGER DEFAULT 0,
    favoritos UUID[] DEFAULT '{}',
    data_criacao TIMESTAMP DEFAULT NOW()
);

-- Tabela de atividades
CREATE TABLE atividades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    usuario_id UUID REFERENCES users(id),
    referencia_id UUID,
    data TIMESTAMP DEFAULT NOW()
);

-- Tabela de estatísticas
CREATE TABLE estatisticas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data DATE UNIQUE NOT NULL,
    visitas INTEGER DEFAULT 0,
    novos_usuarios INTEGER DEFAULT 0,
    cursos_acessados INTEGER DEFAULT 0,
    partituras_downloads INTEGER DEFAULT 0
);

-- Criar índices
CREATE INDEX idx_cursos_categoria ON cursos(categoria);
CREATE INDEX idx_cursos_nivel ON cursos(nivel);
CREATE INDEX idx_partituras_instrumento ON partituras(instrumento);
CREATE INDEX idx_partituras_dificuldade ON partituras(dificuldade);

-- Inserir admin padrão
INSERT INTO users (nome, email, senha, tipo) VALUES 
('Administrador', 'admin@orchestra.com', '$2a$10$xW8vJqZ9.L1nN6Z8xqK8heXBGqzXqT8XqT8XqT8XqT8XqT8XqT8Xq', 'admin');
-- Senha: admin123

-- Inserir dados de exemplo
INSERT INTO cursos (titulo, descricao, categoria, nivel, duracao, numero_aulas, status, imagem_capa) VALUES
('Fundamentos da Teoria Musical', 'Aprenda os conceitos básicos da teoria musical', 'Teoria Musical', 'Iniciante', 4, 4, 'Publicado', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'),
('Leitura Avançada de Partituras', 'Desenvolva habilidades avançadas de leitura musical', 'Leitura de Partituras', 'Avançado', 6, 6, 'Publicado', 'https://images.unsplash.com/photo-1460667262436-cf19894f4774?w=800'),
('Harmonia Funcional', 'Estude progressões harmônicas e cadências', 'Harmonia', 'Intermediário', 8, 8, 'Publicado', 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800');

INSERT INTO partituras (titulo, compositor, instrumento, genero, dificuldade, duracao, tom, arquivo_pdf, imagem_preview) VALUES
('Für Elise', 'Ludwig van Beethoven', 'Piano', 'Clássica', 'Intermediário', '3:00', 'Lá menor', '/partituras/fur-elise.pdf', 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=600'),
('Canon em Ré', 'Johann Pachelbel', 'Violino', 'Clássica', 'Intermediário', '5:30', 'Ré Maior', '/partituras/canon.pdf', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600'),
('Asa Branca', 'Luiz Gonzaga', 'Violão', 'Folk', 'Fácil', '3:30', 'Sol Maior', '/partituras/asa-branca.pdf', 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=600');
```

4. Clique em **RUN** (▶️) no canto inferior direito

✅ **Pronto! As tabelas foram criadas e dados inseridos!**

---

## ✅ Passo 2: Configurar o Projeto (2 minutos)

### 2.1 - Instalar Dependências

```bash
npm install
```

### 2.2 - Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e cole suas credenciais:

```env
# Cole a URL do seu projeto Supabase
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Cole a chave pública (anon key)
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Crie uma senha secreta qualquer
JWT_SECRET=minha_senha_super_secreta_123456

PORT=5000
```

⚠️ **IMPORTANTE:** Substitua pelos seus valores reais do Supabase!

---

## ✅ Passo 3: Rodar o Projeto (1 minuto)

### Opção 1 - Rodar tudo junto:
```bash
npm run dev:all
```

Isso abrirá:
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend: http://localhost:5000

### Opção 2 - Rodar separado:

**Terminal 1 (Backend):**
```bash
npm run dev:server
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

---

## ✅ Passo 4: Testar

1. **Abra:** http://localhost:3000/admin-login.html
2. **Login:** 
   - Email: `admin@orchestra.com`
   - Senha: `admin123`
3. **Explore o dashboard!**

---

## 📊 Ver os Dados no Supabase

1. No Supabase, clique em **🗄️ Table Editor**
2. Você verá suas tabelas:
   - `users` - Usuários
   - `cursos` - Cursos
   - `partituras` - Partituras
   - `atividades` - Log de atividades

3. Clique em qualquer tabela para:
   - ✏️ Editar dados direto
   - ➕ Adicionar registros
   - 🗑️ Deletar
   - 🔍 Filtrar e buscar

**É tipo o Beekeeper Studio, mas mais fácil e online!**

---

## 🎯 Vantagens do Supabase

✅ **Sem instalação** - Tudo online  
✅ **Interface visual linda** - Melhor que Beekeeper  
✅ **Grátis** - 500MB + 50,000 requisições/mês  
✅ **Backup automático** - Seus dados seguros  
✅ **Fácil deploy** - Já está pronto pra produção  
✅ **PostgreSQL** - Banco profissional  

---

## 🐛 Problemas?

### "Cannot connect to Supabase"
- ✅ Verifique se copiou a URL e KEY corretas
- ✅ Confirme que o projeto Supabase está ativo (verde)

### "JWT Secret invalid"
- ✅ Defina qualquer senha no JWT_SECRET no `.env`

### Porta 5000 ocupada
- ✅ Mude para 5001 no `.env`: `PORT=5001`

---

## 🚀 Próximos Passos

Agora você pode:

1. ✅ Criar cursos pelo painel admin
2. ✅ Adicionar partituras
3. ✅ Ver estatísticas em tempo real
4. ✅ Gerenciar usuários
5. ✅ Tudo salvo automaticamente no Supabase!

---

**Está muito mais fácil que MongoDB local!** 🎉

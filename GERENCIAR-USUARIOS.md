# 👥 Guia - Gerenciamento de Usuários

## ✅ O que foi adicionado:

### 🆕 **Nova Página: admin-usuarios.html**
- Listar todos os usuários
- Criar novos usuários (admin ou normal)
- Editar usuários existentes
- Deletar usuários
- Buscar e filtrar usuários

### 🔐 **Nova Página: admin-configuracoes.html**
- Ver informações do perfil
- Trocar sua própria senha
- Informações do sistema

### 🔑 **Novas Rotas de API:**
- `GET /api/admin/usuarios` - Listar usuários
- `POST /api/admin/usuarios` - Criar usuário
- `PUT /api/admin/usuarios/:id` - Editar usuário
- `DELETE /api/admin/usuarios/:id` - Deletar usuário
- `POST /api/auth/trocar-senha` - Trocar senha

---

## 🚀 Como Usar:

### **1️⃣ Trocar Sua Própria Senha**

**Opção A - Via Configurações:**
1. Login no painel admin
2. Clique em **"Configurações"** no menu lateral
3. Preencha:
   - Senha Atual
   - Nova Senha
   - Confirmar Nova Senha
4. Clique em **"Alterar Senha"**

**Opção B - Via Usuários:**
1. Vá em **"Usuários"** no menu
2. Clique no ícone de **cadeado** 🔒 na sua linha
3. Preencha o formulário
4. Altere a senha

✅ **Resultado:** Sua senha é alterada e você continua logado!

---

### **2️⃣ Criar Novo Usuário**

1. Acesse **"Usuários"** no menu lateral
2. Clique em **"+ Novo Usuário"**
3. Preencha o formulário:
   - **Nome:** Ex: Maria Silva
   - **Email:** maria@email.com
   - **Tipo:** Usuário Normal ou Administrador
   - **Senha:** Mínimo 6 caracteres
4. Clique em **"Criar Usuário"**

✅ **Resultado:** Novo usuário criado e pode fazer login!

---

### **3️⃣ Criar Novo Administrador**

1. Mesmo processo acima
2. No campo **"Tipo de Usuário"** selecione: **"Administrador"**
3. Crie o usuário

✅ **Resultado:** Novo admin pode acessar o painel!

---

### **4️⃣ Editar Usuário Existente**

1. Na lista de usuários, clique no ícone de **lápis** ✏️
2. Modifique os campos desejados:
   - Nome
   - Email
   - Tipo (pode promover usuário a admin)
   - Senha (deixe em branco para manter a mesma)
3. Clique em **"Salvar Alterações"**

✅ **Resultado:** Usuário atualizado no banco!

---

### **5️⃣ Deletar Usuário**

1. Clique no ícone de **lixeira** 🗑️
2. Confirme a exclusão

⚠️ **Atenção:** Você não pode deletar sua própria conta!

✅ **Resultado:** Usuário removido do sistema!

---

### **6️⃣ Buscar e Filtrar**

**Buscar por nome ou email:**
- Digite na caixa de busca

**Filtrar por tipo:**
- Selecione: "Todos", "Administradores" ou "Usuários"

---

## 📊 Fluxo de Criação de Usuário:

```
Admin preenche formulário
        ↓
JavaScript envia dados
        ↓
POST /api/admin/usuarios
        ↓
Backend valida dados
        ↓
Criptografa senha (bcrypt)
        ↓
Salva no Supabase
        ↓
Retorna usuário criado
        ↓
Lista de usuários recarrega
        ↓
✅ NOVO USUÁRIO PODE FAZER LOGIN!
```

---

## 🔐 Fluxo de Troca de Senha:

```
Usuário preenche formulário
        ↓
JavaScript envia dados
        ↓
POST /api/auth/trocar-senha
        ↓
Backend verifica senha atual
        ↓
Se correto: criptografa nova senha
        ↓
Atualiza no Supabase
        ↓
✅ SENHA ALTERADA!
```

---

## 🧪 Teste Completo:

### **Teste 1: Criar Novo Admin**
```
1. Login como admin@orchestra.com
2. Ir em Usuários → Novo Usuário
3. Criar:
   - Nome: João Admin
   - Email: joao@admin.com
   - Tipo: Administrador
   - Senha: 123456
4. Logout
5. Login com joao@admin.com / 123456
6. ✅ Deve acessar o painel admin!
```

### **Teste 2: Trocar Senha**
```
1. Login no painel
2. Ir em Configurações
3. Trocar senha:
   - Atual: admin123
   - Nova: novasenha123
4. Logout
5. Login com nova senha
6. ✅ Deve funcionar!
```

### **Teste 3: Editar Usuário**
```
1. Ir em Usuários
2. Editar um usuário
3. Promover de "Usuário" para "Admin"
4. Salvar
5. Verificar no Supabase
6. ✅ Tipo deve estar como 'admin'!
```

---

## 🎯 Permissões:

### **Administrador pode:**
✅ Ver todos os usuários
✅ Criar novos usuários
✅ Editar qualquer usuário
✅ Deletar usuários (exceto ele mesmo)
✅ Promover usuários a admin
✅ Trocar própria senha

### **Usuário Normal pode:**
✅ Fazer login no site (não no admin)
✅ Ver cursos e partituras
❌ Não acessa painel admin

---

## 📋 Estrutura no Supabase:

**Tabela: users**
```
id          → UUID (automático)
nome        → TEXT
email       → TEXT (único)
senha       → TEXT (hash bcrypt)
tipo        → TEXT ('admin' ou 'usuario')
avatar      → TEXT (opcional)
data_criacao → TIMESTAMP
ultimo_acesso → TIMESTAMP
```

---

## 🐛 Solução de Problemas:

### "Senha atual incorreta"
**Causa:** Senha digitada está errada
**Solução:** Verifique a senha e tente novamente

### "Email já cadastrado"
**Causa:** Já existe usuário com este email
**Solução:** Use outro email

### "Token inválido"
**Causa:** Sessão expirou
**Solução:** Faça login novamente

### "Acesso negado. Apenas administradores"
**Causa:** Usuário não é admin
**Solução:** Apenas admins podem gerenciar usuários

---

## 🔒 Segurança Implementada:

✅ **Senhas criptografadas** (bcrypt com salt)
✅ **JWT para autenticação**
✅ **Validação de admin** em rotas protegidas
✅ **Não pode deletar própria conta**
✅ **Validação de email único**
✅ **Senha mínima de 6 caracteres**

---

## 🎉 Funcionalidades Completas:

✅ CRUD completo de usuários
✅ Trocar senha própria
✅ Criar novos admins
✅ Promover/rebaixar usuários
✅ Busca e filtros
✅ Interface intuitiva
✅ Segurança robusta

---

**Agora você tem controle total sobre os usuários do sistema!** 🎵✨

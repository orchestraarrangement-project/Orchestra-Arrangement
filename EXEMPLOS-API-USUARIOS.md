# 🧪 Exemplos de Requisições - API de Usuários

## 🔑 Pegar Token de Admin

Primeiro, faça login para pegar o token JWT:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@orchestra.com",
    "senha": "admin123"
  }'
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid-do-usuario",
    "nome": "Administrador",
    "email": "admin@orchestra.com",
    "tipo": "admin"
  }
}
```

📝 **Copie o token** e use nas próximas requisições!

---

## 1️⃣ LISTAR TODOS OS USUÁRIOS

```bash
curl -X GET http://localhost:5000/api/admin/usuarios \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
[
  {
    "id": "uuid-1",
    "nome": "Administrador",
    "email": "admin@orchestra.com",
    "tipo": "admin",
    "data_criacao": "2024-11-13T00:00:00Z",
    "ultimo_acesso": "2024-11-13T10:00:00Z"
  },
  {
    "id": "uuid-2",
    "nome": "Maria Silva",
    "email": "maria@teste.com",
    "tipo": "usuario",
    "data_criacao": "2024-11-13T00:00:00Z",
    "ultimo_acesso": null
  }
]
```

---

## 2️⃣ CRIAR NOVO USUÁRIO

### Criar Usuário Normal:

```bash
curl -X POST http://localhost:5000/api/admin/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "João Santos",
    "email": "joao@teste.com",
    "senha": "senha123",
    "tipo": "usuario"
  }'
```

### Criar Administrador:

```bash
curl -X POST http://localhost:5000/api/admin/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Pedro Admin",
    "email": "pedro@admin.com",
    "senha": "admin123",
    "tipo": "admin"
  }'
```

**Resposta (sucesso):**
```json
{
  "mensagem": "Usuário criado com sucesso!",
  "usuario": {
    "id": "uuid-novo",
    "nome": "João Santos",
    "email": "joao@teste.com",
    "tipo": "usuario"
  }
}
```

**Resposta (erro - email duplicado):**
```json
{
  "erro": "Email já cadastrado."
}
```

---

## 3️⃣ EDITAR USUÁRIO

```bash
curl -X PUT http://localhost:5000/api/admin/usuarios/UUID_DO_USUARIO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "João Santos Silva",
    "email": "joao.silva@teste.com",
    "tipo": "admin"
  }'
```

### Editar e trocar senha:

```bash
curl -X PUT http://localhost:5000/api/admin/usuarios/UUID_DO_USUARIO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "João Santos",
    "email": "joao@teste.com",
    "tipo": "usuario",
    "senha": "novasenha123"
  }'
```

**Resposta:**
```json
{
  "mensagem": "Usuário atualizado com sucesso!",
  "usuario": {
    "id": "uuid",
    "nome": "João Santos Silva",
    "email": "joao.silva@teste.com",
    "tipo": "admin"
  }
}
```

---

## 4️⃣ DELETAR USUÁRIO

```bash
curl -X DELETE http://localhost:5000/api/admin/usuarios/UUID_DO_USUARIO \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta (sucesso):**
```json
{
  "mensagem": "Usuário deletado com sucesso!"
}
```

**Resposta (erro - tentando deletar a si mesmo):**
```json
{
  "erro": "Você não pode deletar sua própria conta."
}
```

---

## 5️⃣ TROCAR PRÓPRIA SENHA

```bash
curl -X POST http://localhost:5000/api/auth/trocar-senha \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "senhaAtual": "admin123",
    "novaSenha": "novasenha456"
  }'
```

**Resposta (sucesso):**
```json
{
  "mensagem": "Senha alterada com sucesso!"
}
```

**Resposta (erro - senha atual incorreta):**
```json
{
  "erro": "Senha atual incorreta."
}
```

---

## 📋 TESTES COM POSTMAN/INSOMNIA:

### **Coleção Completa:**

#### **1. Login**
```
POST http://localhost:5000/api/auth/login
Headers: Content-Type: application/json
Body (JSON):
{
  "email": "admin@orchestra.com",
  "senha": "admin123"
}
```

#### **2. Listar Usuários**
```
GET http://localhost:5000/api/admin/usuarios
Headers: 
  Authorization: Bearer {{token}}
```

#### **3. Criar Usuário**
```
POST http://localhost:5000/api/admin/usuarios
Headers: 
  Content-Type: application/json
  Authorization: Bearer {{token}}
Body (JSON):
{
  "nome": "Teste User",
  "email": "teste@email.com",
  "senha": "123456",
  "tipo": "usuario"
}
```

#### **4. Editar Usuário**
```
PUT http://localhost:5000/api/admin/usuarios/{{userId}}
Headers: 
  Content-Type: application/json
  Authorization: Bearer {{token}}
Body (JSON):
{
  "nome": "Teste User Updated",
  "email": "teste@email.com",
  "tipo": "admin"
}
```

#### **5. Deletar Usuário**
```
DELETE http://localhost:5000/api/admin/usuarios/{{userId}}
Headers: 
  Authorization: Bearer {{token}}
```

---

## 🔒 CÓDIGOS DE STATUS:

| Código | Significado |
|--------|-------------|
| **200** | Sucesso |
| **201** | Criado com sucesso |
| **400** | Erro de validação (ex: email duplicado) |
| **401** | Não autorizado (token inválido ou senha errada) |
| **403** | Proibido (não é admin) |
| **404** | Não encontrado |
| **500** | Erro interno do servidor |

---

## ✅ VALIDAÇÕES:

### **Criar/Editar Usuário:**
- ✅ Nome obrigatório
- ✅ Email obrigatório e válido
- ✅ Email único
- ✅ Senha mínima 6 caracteres (ao criar)
- ✅ Tipo: 'admin' ou 'usuario'

### **Trocar Senha:**
- ✅ Senha atual correta
- ✅ Nova senha mínima 6 caracteres
- ✅ Token válido

### **Deletar:**
- ✅ Não pode deletar a si mesmo
- ✅ Apenas admin pode deletar

---

## 🎯 TESTE COMPLETO VIA TERMINAL:

```bash
# 1. Login e pegar token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@orchestra.com","senha":"admin123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# 2. Listar usuários
curl -X GET http://localhost:5000/api/admin/usuarios \
  -H "Authorization: Bearer $TOKEN"

# 3. Criar usuário
curl -X POST http://localhost:5000/api/admin/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Teste CLI",
    "email": "teste-cli@email.com",
    "senha": "senha123",
    "tipo": "usuario"
  }'

# 4. Listar novamente para ver o novo usuário
curl -X GET http://localhost:5000/api/admin/usuarios \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 VERIFICAR NO BANCO:

Depois de criar usuários via API, verifique no Supabase:

1. Abra Supabase → Table Editor
2. Selecione tabela `users`
3. Veja os novos registros
4. Verifique que senhas estão com hash (`$2a$10$...`)

---

**Todos os endpoints estão funcionais e salvando no banco!** 🎵✨

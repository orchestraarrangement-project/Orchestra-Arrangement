# 🔧 Solução - Erro de Login

## ❌ Problema: "Email ou senha inválidos"

### ✅ **Solução 1: Criar Admin via Script (RECOMENDADO)**

Este é o método mais fácil e seguro!

#### **Passo a Passo:**

1. **Certifique-se que o `.env` está configurado:**
```bash
# Abra o arquivo .env e confirme que tem:
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Rode o script:**
```bash
npm run criar-admin
```

3. **Você verá:**
```
🔧 Criando usuário administrador...
✅ Conectado ao Supabase
📝 Dados do admin:
   Nome: Administrador
   Email: admin@orchestra.com
   Senha: admin123
   Tipo: admin

🔐 Gerando hash da senha...
💾 Salvando no banco...

✅ SUCESSO! Admin criado com sucesso!
═══════════════════════════════════════
   CREDENCIAIS DE LOGIN:
═══════════════════════════════════════
   Email: admin@orchestra.com
   Senha: admin123
═══════════════════════════════════════
```

4. **Agora faça login com:**
   - Email: `admin@orchestra.com`
   - Senha: `admin123`

✅ **Pronto! Deve funcionar!**

---

### ✅ **Solução 2: Criar Direto no Supabase**

Se o script não funcionar, crie direto no banco:

1. **Abra o Supabase** → Seu projeto
2. **Clique em Table Editor**
3. **Selecione a tabela `users`**
4. **Clique em "+ Insert row"**
5. **Preencha:**
   - `nome`: Administrador
   - `email`: admin@orchestra.com
   - `senha`: `$2a$10$rOZxjJHqGhI4vHZ.dJLIXOz.1oZGJ5J.5J.5J.5J.5J.5J.5J.5J.5J` (exemplo)
   - `tipo`: admin
6. **Clique em Save**

⚠️ **Problema:** A senha precisa ser um hash bcrypt válido.

---

### ✅ **Solução 3: Gerar Hash Online**

1. **Acesse:** https://bcrypt-generator.com/
2. **Digite:** `admin123`
3. **Rounds:** 10
4. **Clique em "Generate"**
5. **Copie o hash** gerado (começa com `$2a$10$...`)
6. **Vá no Supabase** → Table Editor → users
7. **Delete o admin antigo** (se existir)
8. **Insira novo com o hash copiado**

---

### ✅ **Solução 4: Via API de Registro**

Se o backend estiver rodando:

```bash
# Em outro terminal, rode:
curl -X POST http://localhost:5000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Administrador",
    "email": "admin@orchestra.com",
    "senha": "admin123"
  }'
```

Depois, **atualize o tipo no Supabase:**
1. Table Editor → users
2. Encontre o usuário criado
3. Edite o campo `tipo` de `usuario` para `admin`
4. Save

---

## 🐛 Outros Problemas:

### **"Failed to fetch"**
**Causa:** Backend não está rodando  
**Solução:** 
```bash
npm run dev:server
```

### **"SUPABASE_URL is not defined"**
**Causa:** `.env` não configurado  
**Solução:** 
```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

### **Senha não confere (mesmo estando certa)**
**Causa:** Hash da senha no banco está errado  
**Solução:** Use o script `npm run criar-admin`

---

## 🔍 Como Verificar se o Admin Existe:

1. **Abra o Supabase** → Table Editor
2. **Clique em `users`**
3. **Procure por:** `admin@orchestra.com`
4. **Verifique:**
   - Campo `tipo` deve ser: `admin`
   - Campo `senha` deve começar com: `$2a$10$...`

---

## ✅ Checklist Final:

- [ ] Backend rodando (`npm run dev:server`)
- [ ] `.env` configurado com SUPABASE_URL e SUPABASE_KEY
- [ ] Tabela `users` existe no Supabase
- [ ] Admin criado no banco (via script ou manual)
- [ ] Campo `tipo` = 'admin'
- [ ] Senha é um hash bcrypt válido

---

## 🎯 Método Recomendado:

**Use o script automatizado:**
```bash
npm run criar-admin
```

Este script:
- ✅ Conecta no Supabase
- ✅ Gera hash correto da senha
- ✅ Cria/recria o admin
- ✅ Mostra as credenciais
- ✅ 100% funcional!

---

## 📞 Ainda com Problema?

Verifique no console do navegador (F12) se aparece algum erro.

**Erros comuns:**
- `401 Unauthorized` → Senha incorreta no banco
- `Failed to fetch` → Backend offline
- `Network error` → URL da API errada

---

**Use o script `npm run criar-admin` e será resolvido!** 🎵✨

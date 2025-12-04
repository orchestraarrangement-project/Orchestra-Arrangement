# 🔧 SOLUÇÃO RÁPIDA - Erro de Login

## ❌ Problema: "Email ou senha inválidos"

---

## ✅ **SOLUÇÃO EM 3 PASSOS:**

### **1. Configure o .env (se ainda não fez)**

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais do Supabase:
```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=qualquer_senha_123
```

### **2. Rode o script para criar o admin**

```bash
npm run criar-admin
```

### **3. Faça login**

- **URL:** http://localhost:3000/admin-login.html
- **Email:** admin@orchestra.com
- **Senha:** admin123

---

## 🎯 **É SÓ ISSO!**

O script `npm run criar-admin`:
- ✅ Conecta no Supabase automaticamente
- ✅ Deleta admin antigo (se existir)
- ✅ Cria hash correto da senha
- ✅ Insere novo admin no banco
- ✅ Mostra as credenciais

---

## 📺 **Saída Esperada:**

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

🚀 Agora você pode fazer login no painel admin!
   URL: http://localhost:3000/admin-login.html
```

---

## 🐛 **Se der erro:**

### **"SUPABASE_URL is not defined"**
→ Configure o `.env` primeiro

### **"Cannot connect to Supabase"**
→ Verifique se SUPABASE_URL e SUPABASE_KEY estão corretos

### **Script funcionou mas ainda não consigo logar**
→ Verifique se o backend está rodando:
```bash
npm run dev:server
```

---

## 📚 **Guias Detalhados:**

- `SOLUCAO-LOGIN.md` - Soluções completas para problemas de login
- `GUIA-SUPABASE.md` - Como configurar o Supabase do zero
- `TESTE-COMPLETO.md` - Como testar todo o sistema

---

**Execute `npm run criar-admin` e pronto!** 🎵✨

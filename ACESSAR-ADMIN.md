# 🔧 Solução - Acessar Painel Admin

## ❌ Problema: "File not found" ao acessar admin-login.html

### 🎯 **SOLUÇÃO:**

Quando você roda `npm run dev:all`, dois servidores são iniciados:
1. **Backend (API):** `http://localhost:5000`
2. **Frontend:** `http://localhost:3000`

---

## ✅ **ACESSO CORRETO:**

### **Páginas do Site:**
```
http://localhost:3000/                    ✅ Página inicial
http://localhost:3000/partituras.html     ✅ Partituras
http://localhost:3000/ebooks.html         ✅ Ebooks
```

### **Painel Admin:**
```
http://localhost:3000/admin-login.html    ✅ Login do Admin
```

---

## 🚀 **Passo a Passo:**

### **1. Iniciar os servidores:**
```bash
npm run dev:all
```

**Você verá:**
```
[0] 🚀 Servidor rodando na porta 5000
[1] Serving "/" at http://localhost:3000
```

### **2. Aguardar os servidores iniciarem:**
- Espere aparecer as mensagens acima (~5 segundos)

### **3. Acessar o navegador:**
```
http://localhost:3000
```

### **4. Para acessar o admin:**
```
http://localhost:3000/admin-login.html
```

**OU** clique direto: [http://localhost:3000/admin-login.html](http://localhost:3000/admin-login.html)

---

## 🐛 **Problemas Comuns:**

### **"File not found"**
**Causa:** Você está tentando acessar antes do servidor iniciar  
**Solução:** Aguarde ~5 segundos após rodar `npm run dev:all`

### **"Cannot GET /admin-login.html"**
**Causa:** Backend (porta 5000) não serve arquivos HTML  
**Solução:** Use porta 3000, não 5000!

### **Página em branco**
**Causa:** JavaScript com erro  
**Solução:** 
1. Abra DevTools (F12)
2. Vá em Console
3. Veja os erros
4. Geralmente é problema de conexão com API

---

## 📊 **Estrutura dos Servidores:**

```
┌─────────────────────────────────────────┐
│  FRONTEND (Porta 3000)                  │
│  live-server                            │
├─────────────────────────────────────────┤
│  index.html                             │
│  partituras.html                        │
│  ebooks.html                            │
│  admin-login.html          ← AQUI!      │
│  admin-dashboard.html                   │
│  admin-ebooks.html                      │
│  admin-partituras.html                  │
│  ...                                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  BACKEND (Porta 5000)                   │
│  server-supabase.js                     │
├─────────────────────────────────────────┤
│  /api/auth/login                        │
│  /api/cursos                            │
│  /api/partituras                        │
│  /api/admin/usuarios                    │
│  ...                                    │
└─────────────────────────────────────────┘
```

---

## ✅ **Checklist de Acesso:**

- [ ] Rodou `npm run dev:all`?
- [ ] Aguardou servidores iniciarem (~5s)?
- [ ] Está usando porta **3000** (não 5000)?
- [ ] URL completa: `http://localhost:3000/admin-login.html`?
- [ ] Backend está rodando (vê mensagem no terminal)?

---

## 🎯 **Teste Rápido:**

```bash
# 1. Terminal - Inicie tudo
npm run dev:all

# 2. Aguarde aparecer:
# [0] 🚀 Servidor rodando na porta 5000
# [1] Serving "/" at http://localhost:3000

# 3. Abra o navegador
# http://localhost:3000

# 4. Acesse admin
# http://localhost:3000/admin-login.html

# 5. Login
# Email: admin@orchestra.com
# Senha: admin123
```

---

## 🔄 **Se ainda não funcionar:**

### **Opção 1: Rodar separado**
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev

# Aguarde ambos iniciarem, depois acesse
# http://localhost:3000/admin-login.html
```

### **Opção 2: Limpar cache**
```bash
# Parar servidores (Ctrl+C)
# Limpar node_modules
rm -rf node_modules package-lock.json
npm install
npm run dev:all
```

### **Opção 3: Verificar portas**
```bash
# Ver o que está rodando
lsof -i :3000
lsof -i :5000

# Se alguma porta estiver ocupada, mate o processo
kill -9 <PID>
```

---

## 📝 **URLs Completas:**

### **Site Público:**
- `http://localhost:3000/` - Início
- `http://localhost:3000/partituras.html` - Partituras
- `http://localhost:3000/ebooks.html` - Ebooks

### **Admin:**
- `http://localhost:3000/admin-login.html` - Login
- `http://localhost:3000/admin-dashboard.html` - Dashboard
- `http://localhost:3000/admin-ebooks.html` - Gerenciar Ebooks
- `http://localhost:3000/admin-partituras.html` - Gerenciar Partituras
- `http://localhost:3000/admin-usuarios.html` - Gerenciar Usuários

---

## 💡 **Dica:**

Salve este link nos favoritos:
```
http://localhost:3000/admin-login.html
```

Assim você acessa direto quando precisar! 🚀

---

**Agora deve funcionar!** 🎵✨

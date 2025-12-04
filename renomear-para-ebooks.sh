#!/bin/bash
# Script para renomear Cursos para Ebooks em todo o projeto

echo "🔄 Renomeando Cursos para Ebooks..."

# Renomear arquivos
mv cursos.html ebooks.html 2>/dev/null || true
mv curso-detalhes.html ebook-detalhes.html 2>/dev/null || true
mv admin-cursos.html admin-ebooks.html 2>/dev/null || true

echo "✅ Arquivos renomeados!"
echo ""
echo "Arquivos atualizados:"
echo "  - cursos.html → ebooks.html"
echo "  - curso-detalhes.html → ebook-detalhes.html"
echo "  - admin-cursos.html → admin-ebooks.html"

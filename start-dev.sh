#!/bin/bash

echo "🚀 Iniciando Sistema de Gestão de Produtos Multi-Tenant"
echo "=================================================="

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js 18.18.0 ou superior."
    exit 1
fi

# Verificar se o PostgreSQL está rodando
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "⚠️  PostgreSQL não está rodando. Certifique-se de que o PostgreSQL esteja ativo."
    echo "   Você pode iniciar o PostgreSQL com: sudo systemctl start postgresql"
fi

echo "📦 Instalando dependências do backend..."
cd base/backend
npm install

echo "📦 Instalando dependências do frontend..."
cd ../admin-frontend
npm install

echo "🔧 Configurando banco de dados..."
cd ../backend

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando a partir do exemplo..."
    cp .env.example .env
    echo "📝 Por favor, edite o arquivo .env com suas configurações de banco de dados"
    echo "   DATABASE_URL deve apontar para seu PostgreSQL"
    read -p "Pressione Enter após configurar o .env..."
fi

echo "🗄️  Configurando banco de dados..."
npm run prisma:generate
npm run prisma:push

echo "🌱 Populando banco com dados de exemplo..."
npm run seed

echo "🚀 Iniciando backend em background..."
npm run dev &
BACKEND_PID=$!

echo "⏳ Aguardando backend inicializar..."
sleep 5

echo "🚀 Iniciando frontend..."
cd ../admin-frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Sistema iniciado com sucesso!"
echo "=================================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:4000"
echo "📊 Health Check: http://localhost:4000/health"
echo ""
echo "Para parar o sistema, pressione Ctrl+C"

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Parando sistema..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Sistema parado"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Manter script rodando
wait
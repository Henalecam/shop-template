#!/bin/bash

echo "🚀 Starting Multi-Tenant Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cat > .env << EOF
DATABASE_URL="postgresql://admin:password123@localhost:5432/multi_tenant_db"
PORT=4000
NODE_ENV=development
EOF
    echo "✅ .env file created"
fi

# Try to install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Try to generate Prisma client
echo "🔧 Generating Prisma client..."
if npx prisma generate; then
    echo "✅ Prisma client generated successfully"
else
    echo "❌ Failed to generate Prisma client"
    echo "⚠️  This might be due to OpenSSL compatibility issues"
fi

# Try to initialize database
echo "🗄️  Initializing database..."
if npm run db:init; then
    echo "✅ Database initialized successfully"
else
    echo "⚠️  Database initialization failed, but continuing..."
    echo "💡 You can try running 'npm run db:init' manually later"
fi

# Start the application
echo "🌐 Starting application..."
npm start
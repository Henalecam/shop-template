# Troubleshooting Guide

## Prisma Schema Engine Error

If you encounter the error:
```
Error: Could not parse schema engine response: SyntaxError: Unexpected token E in JSON at position 0
```

### Common Causes and Solutions:

#### 1. OpenSSL Compatibility Issues
**Symptoms:** Warnings about OpenSSL detection and Prisma may not work as expected.

**Solutions:**
- **Docker:** The Dockerfile has been updated to install OpenSSL explicitly
- **Local:** Ensure you have OpenSSL installed: `sudo apt-get install openssl` (Ubuntu/Debian)
- **Railway:** The deployment should automatically handle OpenSSL dependencies

#### 2. Prisma Client Generation Issues
**Symptoms:** Prisma client fails to generate or has parsing errors.

**Solutions:**
```bash
# Clear Prisma cache and regenerate
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma
npm install
npx prisma generate
```

#### 3. Database Connection Issues
**Symptoms:** Database initialization fails or connection errors.

**Solutions:**
- Check your `.env` file has the correct `DATABASE_URL`
- Ensure the database is running and accessible
- Verify network connectivity to the database

#### 4. Schema Validation Issues
**Symptoms:** Prisma schema parsing errors or validation failures.

**Solutions:**
- Verify the schema.prisma file syntax
- Check for missing required fields
- Ensure all models have proper mappings

## Quick Fix Commands

```bash
# 1. Regenerate Prisma client
npx prisma generate

# 2. Push schema to database
npx prisma db push

# 3. Run database initialization
npm run db:init

# 4. Start without database initialization
npm run start:no-db

# 5. Use the startup script
./start.sh
```

## Environment Variables

Ensure your `.env` file contains:
```env
DATABASE_URL="postgresql://username:password@host:port/database"
PORT=4000
NODE_ENV=development
```

## Railway Deployment

For Railway deployment:
1. Ensure `DATABASE_URL` is set in Railway environment variables
2. The `postinstall` script will automatically run `prisma generate`
3. The `prestart` script will initialize the database
4. If database initialization fails, the app will still start (you can run `npm run db:init` manually)

## Debug Mode

To enable debug logging:
```bash
DEBUG=prisma:* npm start
```

## Fallback Options

If Prisma continues to fail:
1. Use `npm run start:no-db` to start without database initialization
2. Manually run database operations when needed
3. Check Railway logs for specific error messages
4. Consider using a different Node.js version (18.x is recommended)
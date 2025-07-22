# Development Environment Setup

## Prerequisites

1. **Node.js** (v18.20 or higher)
2. **PostgreSQL** (for local database)
3. **Shopify CLI** (already installed via npm)

## Local Development Setup

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Set up Environment Variables**
Create a `.env` file in the root directory:
```bash
cp env.example .env
```

Then edit `.env` with your actual values:
```env
# Shopify App Configuration
SHOPIFY_API_KEY=your_actual_api_key
SHOPIFY_API_SECRET_KEY=your_actual_api_secret_key
SHOPIFY_APP_URL=http://localhost:3000
SHOPIFY_SCOPES=write_products,write_script_tags,write_themes

# Database (for local development)
DATABASE_URL="postgresql://username:password@localhost:5432/superfy_dev"

# Development settings
NODE_ENV=development
```

### 3. **Set up Local Database**

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL (if not already installed)
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
createdb superfy_dev

# Run migrations
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

#### Option B: Docker PostgreSQL
```bash
# Start PostgreSQL with Docker
docker run --name superfy-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=superfy_dev \
  -p 5432:5432 \
  -d postgres:15

# Update DATABASE_URL in .env to:
DATABASE_URL="postgresql://postgres:password@localhost:5432/superfy_dev"
```

### 4. **Start Development Server**
```bash
npm run dev
```

This will:
- Start the development server on `http://localhost:3000`
- Open Shopify CLI tunnel for webhook testing
- Watch for file changes and hot reload

## Development Workflow

### **Available Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

### **Testing with Shopify:**
1. The dev server creates a tunnel URL (e.g., `https://abc123.ngrok.io`)
2. Update your Shopify Partner dashboard:
   - App URL: `https://abc123.ngrok.io`
   - Allowed redirection URLs: `https://abc123.ngrok.io/auth/callback`
3. Install your app on a test store
4. Test all functionality

### **Database Management:**
```bash
# View database in browser
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

## Environment Differences

### **Development vs Production:**
- **Development**: Uses local PostgreSQL, Shopify CLI tunnel
- **Production**: Uses Railway PostgreSQL, Railway domain

### **Environment Variables:**
- **Development**: `.env` file
- **Production**: Railway environment variables

## Troubleshooting

### **Common Issues:**

1. **Database Connection Error:**
   ```bash
   # Check if PostgreSQL is running
   brew services list | grep postgresql
   
   # Start PostgreSQL
   brew services start postgresql
   ```

2. **Shopify API Errors:**
   - Verify API credentials in `.env`
   - Check app URL matches tunnel URL
   - Ensure scopes are correct

3. **Migration Errors:**
   ```bash
   # Reset database
   npx prisma migrate reset
   
   # Or fix specific migration
   npx prisma migrate resolve --applied migration_name
   ```

## Production Deployment

When ready to deploy:
1. Push changes to GitHub
2. Railway automatically deploys
3. Update Shopify Partner dashboard with Railway URL 
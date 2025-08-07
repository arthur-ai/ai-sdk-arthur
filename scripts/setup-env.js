#!/usr/bin/env node

/**
 * Setup script to help developers configure environment variables
 * This script creates a .env.local file with placeholder values
 */

const fs = require('node:fs');
const path = require('node:path');

const envTemplate = `# Environment Variables for Local Development
# Copy this file to .env.local and fill in your actual values

# Authentication
AUTH_SECRET=your-auth-secret-here

# Arthur AI Configuration
ARTHUR_API_KEY=your-arthur-api-key-here
ARTHUR_TASK_ID=your-arthur-model-id-here
ARTHUR_API_BASE=https://api.arthur.ai
ARTHUR_USE_GUARDRAILS=true

# Database (for local development)
POSTGRES_URL=postgresql://username:password@localhost:5432/database_name

# Optional: For testing
NODE_ENV=development
`;

const envPath = path.join(process.cwd(), '.env.local');

console.log('🔧 Setting up environment variables for local development...\n');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Skipping creation.');
  console.log(
    '   If you want to regenerate it, delete the existing file and run this script again.\n',
  );
} else {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local with template values');
  console.log('📝 Please edit .env.local and fill in your actual values\n');
}

console.log('📋 Required GitHub Secrets for CI/CD:');
console.log('   - AUTH_SECRET');
console.log('   - ARTHUR_API_KEY');
console.log('   - ARTHUR_TASK_ID');
console.log('   - ARTHUR_API_BASE');
console.log('   - POSTGRES_URL (if using database in CI)\n');

console.log('🔗 To set up GitHub Secrets:');
console.log('   1. Go to your repository on GitHub');
console.log('   2. Navigate to Settings > Secrets and variables > Actions');
console.log('   3. Click "New repository secret"');
console.log('   4. Add each required secret with its corresponding value\n');

console.log('🚀 You can now run the application locally with:');
console.log('   pnpm dev\n');

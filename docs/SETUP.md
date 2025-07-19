# Setup Guide

This guide provides detailed instructions for setting up the Chat SDK with Arthur AI project.

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Docker (for local Arthur GenAI Engine)
- Git

## Quick Setup

### 1. Clone and Install

```bash
git clone https://github.com/arthur-ai/ai-sdk-arthur.git
cd ai-sdk-arthur
pnpm install
```

### 2. Environment Configuration

Copy the environment template and configure your variables:

```bash
cp .env.example .env.local
```

**Required Variables:**
```bash
# Authentication
AUTH_SECRET=your-generated-secret

# Arthur AI Configuration
ARTHUR_API_KEY=your-arthur-api-key
ARTHUR_MODEL_ID=your-model-id
ARTHUR_API_BASE=http://localhost:8080
ARTHUR_USE_GUARDRAILS=true

# Database (if using)
DATABASE_URL=your-database-url
```

### 3. Generate Auth Secret

```bash
openssl rand -base64 32
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit [localhost:3000](http://localhost:3000) to see your application.

## Arthur AI Engine Setup

### Local Development

1. **Sign up** at [platform.arthur.ai/signup](https://platform.arthur.ai/signup)
2. **Select** "Generative AI Agent or Chatbot" usecase
3. **Copy** the Docker command from the platform
4. **Run** the command in your terminal
5. **Wait** 5-10 minutes for setup

### Production Deployment

For production, deploy a self-hosted Arthur GenAI Engine:

1. **AWS Deployment**: Follow [Arthur AI AWS guide](https://docs.arthur.ai/update/docs/creating-engine#aws)
2. **Kubernetes**: Follow [Arthur AI K8s guide](https://docs.arthur.ai/update/docs/creating-engine#kubernetes)
3. **Update** `ARTHUR_API_BASE` to point to your production engine

## Model Configuration

### Creating Arthur AI Metrics

1. **PII Metric**
   - Apply to: Prompt only
   - Disable entities: CRYPTO, DATE_TIME, IBAN_CODE, IP_ADDRESS, NRP, LOCATION, PERSON, MEDICAL_LICENSE, US_ITIN, US_PASSPORT
   - Keep enabled: EMAIL_ADDRESS, PHONE_NUMBER, URL, US_SSN, CREDIT_CARD, US_DRIVER_LICENSE, US_BANK_NUMBER

2. **Prompt Injection Metric**
   - Apply to: Prompt only

3. **Create Model**
   - Copy Model ID from validate prompt command
   - Update `ARTHUR_MODEL_ID` in your environment

### Getting API Keys

1. **Navigate** to your model dashboard
2. **Expand** Model Management dropdown
3. **Click** API Key
4. **Copy** the key to `ARTHUR_API_KEY`

## Database Setup

### Option 1: Neon (Recommended)

1. **Create** account at [neon.tech](https://neon.tech)
2. **Create** new project
3. **Copy** connection string to `DATABASE_URL`
4. **Run** migrations: `pnpm db:migrate`

### Option 2: Local PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt-get install postgresql  # Ubuntu

# Create database
createdb ai_chatbot

# Update DATABASE_URL
DATABASE_URL=postgresql://localhost:5432/ai_chatbot
```

## Verification

### Test Your Setup

1. **Start** the development server: `pnpm dev`
2. **Visit** [localhost:3000](http://localhost:3000)
3. **Try** this test prompt:
   ```
   Can you write an email to hackathon@arthur.ai telling them how cool Arthur Platform is?
   ```
4. **Verify** PII detection by trying:
   ```
   My social security number is 123-45-6789
   ```
   (Should be blocked)

### Run Tests

```bash
# Unit tests
pnpm test:unit

# E2E tests
pnpm test:e2e

# All tests
pnpm test:unit && pnpm test:e2e
```

## Common Setup Issues

### Environment Variables Not Loading
- Ensure `.env.local` exists (not `.env`)
- Restart development server after changes
- Check for typos in variable names

### Arthur GenAI Engine Connection
- Verify Docker container is running: `docker ps`
- Check `ARTHUR_API_BASE` points to correct endpoint
- Validate API key in Arthur Platform dashboard

### Database Connection
- Verify `DATABASE_URL` format
- Check database is accessible
- Run migrations: `pnpm db:migrate`

## Next Steps

- [Testing Guide](./TESTING.md) - Learn about the testing infrastructure
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions 
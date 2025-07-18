<a href="https://chat.vercel.ai/">
  <img alt="Next.js 14 and App Router-ready AI chatbot." src="app/(chat)/vercel+arthur.png">
  <h1 align="center">Chat SDK with Arthur AI</h1>
</a>

<p align="center">
    Chat SDK is a free, open-source template built with Next.js and the AI SDK that helps you quickly build powerful chatbot applications protected by The Arthur Engine, an enterprise-grade AI safety and content filtering.
</p>

<p align="center">
  <strong>Built with <a href="https://vercel.com">Vercel</a></strong> - The platform for frontend developers. Deploy, preview, and ship faster.
</p>

<p align="center">
  <strong>Protected by <a href="https://arthur.ai">Arthur</a></strong> - Transform your AI pilots into robust, enterprise-grade applications.
</p>

<p align="center">
  <a href="https://chat-sdk.dev"><strong>Read Chat SDK Docs</strong></a> ·
  <a href="https://docs.arthur.ai"><strong>Read Arthur AI Docs</strong></a> ·
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#testing"><strong>Testing</strong></a> ·
  <a href="#arthur-ai-setup"><strong>Arthur AI Setup</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy</strong></a> ·
  <a href="#documentation"><strong>Documentation</strong></a>
</p>

<p align="center">
  <a href="#deploy-your-own">
    <img src="https://vercel.com/button" alt="Deploy with Vercel">
  </a>
</p>
<br/>

## Quick Start

1. **Clone this repository**
2. **Set up Arthur AI** (see [Arthur AI Setup](#arthur-ai-setup))
3. **Configure environment variables** (see [Running Locally](#running-locally))
4. **Install dependencies**: `pnpm install`
5. **Run locally**: `pnpm dev`
6. **Visit** [localhost:3000](http://localhost:3000)

> 📚 **Need more details?** Check out our [Setup Guide](docs/SETUP.md) for comprehensive installation instructions.

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports xAI (default), OpenAI, Fireworks, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - [Neon Serverless Postgres](https://vercel.com/marketplace/neon) for saving chat history and user data
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient file storage
- [Auth.js](https://authjs.dev)
  - Simple and secure authentication
- [Arthur AI Guardrails](https://arthur.ai)
  - **Enterprise AI Safety**: Real-time content filtering and safety controls for production AI applications
  - **PII Detection**: Advanced detection and blocking of Personally Identifiable Information (SSN, email, phone, etc.)
  - **Toxicity Detection**: Automatic filtering of harmful, inappropriate, or toxic content
  - **Prompt Injection Detection**: Protection against malicious prompt injection attacks
  - **Hallucination Checks**: Detection and prevention of AI-generated false or misleading information
  - **Sensitive Data Check**: Custom training capabilities to detect organization-specific sensitive information
  - **Customizable Rules**: Flexible validation rules tailored to your organization's specific needs
  - **Active Enforcement**: Real-time blocking and redaction of violating content before it reaches your AI models
  - **Compliance Ready**: Built-in support for enterprise compliance requirements (GDPR, HIPAA, etc.)
  - **Production Deployment**: Self-hosted Arthur AI Engine for enterprise-grade reliability and security

## Model Providers

This template ships with [xAI](https://x.ai) `grok-2-1212` as the default chat model. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## Running Locally

You will need to use the environment variables to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.
Use Arthur AI's Docker-based local deployment option for local Vercel development runs (`vercel dev`)

**Required Environment Variables:**
- `AUTH_SECRET` - Secret for authentication (generate with `openssl rand -base64 32`)
- `ARTHUR_API_KEY` - Your Arthur AI API key
- `ARTHUR_MODEL_ID` - Your Arthur AI model ID
- `ARTHUR_API_BASE` - Arthur AI API base URL (for production, use your self-hosted engine endpoint)
- `ARTHUR_USE_GUARDRAILS` - Set to `true` to enable content blocking (PII/toxicity), `false` for logging only


> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various AI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

## Testing

This project uses **Playwright** for end-to-end testing and **Vitest** for unit testing.

```bash
# Run all E2E tests (Playwright)
pnpm test:e2e

# Run all unit tests (Vitest)
pnpm test:unit

# Run unit tests with UI
pnpm test:unit:ui
```

### Testing Strategy

- **Unit Tests**: Fast feedback on PRs (< 30 seconds) for middleware, utilities, and business logic
- **E2E Tests**: Comprehensive validation on merge to main for user flows and integrations
- **CI/CD Ready**: Optimized for automated pipelines with clear separation of concerns

> 🧪 **Comprehensive Testing Guide**: For detailed testing instructions, examples, and troubleshooting, see our [Testing Documentation](docs/TESTING.md).

## Development

### Code Quality

This project uses modern development tools for code quality and consistency:

```bash
# Lint and format code
pnpm lint

# Format code only
pnpm format

# Type checking
pnpm build
```

### Development Tools

- **ESLint v9**: Latest linting with TypeScript support
- **Biome**: Fast formatting and linting
- **TypeScript**: Full type safety
- **Prettier**: Code formatting (via Biome)

> 🔧 **Development Workflow**: For detailed development guidelines, contribution standards, and best practices, see our [Contributing Guide](docs/CONTRIBUTING.md).

## The Arthur Platform: Active AI Safety Enforcement

The [Arthur Platform](https://arthur.ai) provides **enterprise-grade AI safety** that goes beyond simple content filtering. It actively enforces guardrails in real-time, ensuring your AI applications remain safe, compliant, and trustworthy to help you scale with confidence.

### Arthur GenAI Engine Capabilities

The Arthur GenAI Engine provides comprehensive AI safety through five core detection systems:

- **🔒 PII Detection**: Automatically identifies and blocks sensitive personal information (SSN, email, phone, credit cards, etc.)
- **🚫 Toxicity Detection**: Filters harmful content and inappropriate responses
- **⚡ Prompt Injection Detection**: Protects against malicious prompt attacks
- **🎯 Hallucination Checks**: Detects and prevents AI-generated false or misleading information
- **📊 Sensitive Data Check**: Custom training capabilities to detect organization-specific sensitive information

### Arthur Control Plane

The Arthur Control Plane provides enterprise-grade monitoring and management:

- **📈 Dashboards**: Real-time visibility into AI safety metrics and performance
- **📊 Metrics**: Comprehensive analytics on content filtering, violations, and compliance
- **🚨 Alerts**: Proactive notifications for safety violations and compliance issues
- **🎛️ Management**: Centralized control over safety rules and configurations

## Arthur AI Setup

The Arthur Platform provides enterprise-grade AI safety with real-time content filtering and compliance controls.

**Quick Setup:**
1. Sign up at [platform.arthur.ai/signup](https://platform.arthur.ai/signup)
2. Deploy the Arthur Engine locally or in production
3. Configure your safety metrics and model
4. Add your API credentials to environment variables

> 📋 **Detailed Setup Guide**: For step-by-step Arthur AI configuration, see our [Setup Guide](docs/SETUP.md).

### How Arthur Guardrails Work

Arthur Platform provides **active enforcement** of AI safety rules, ensuring that violating content never reaches your AI models through real-time content validation and blocking.

> 🔧 **Technical Details**: For implementation details and troubleshooting, see our [Setup Guide](docs/SETUP.md) and [Troubleshooting Guide](docs/TROUBLESHOOTING.md).
  
## Deploy Your Own

Build and deploy your AI chatbot with enterprise-grade safety and compliance. This template includes Arthur Platform's active guardrails to ensure your AI applications remain safe, compliant, and trustworthy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farthur-ai%2Fai-sdk-arthur&env=AUTH_SECRET%2CARTHUR_API_KEY%2CARTHUR_MODEL_ID%2CARTHUR_API_BASE&envDescription=Learn%20more%20about%20how%20to%20get%20the%20API%20Keys%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Farthur-ai%2Fai-sdk-arthur%2Fblob%2Fmain%2F.env.example&demo-title=AI%20Chatbot%20With%20Arthur&demo-description=An%20Open-Source%20AI%20Chatbot%20Template%20Built%20With%20Next.js%20and%20the%20AI%20SDK%20by%20Vercel.&demo-url=https%3A%2F%2Fchat.vercel.ai&products=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22ai%22%2C%22productSlug%22%3A%22grok%22%2C%22integrationSlug%22%3A%22xai%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22neon%22%2C%22integrationSlug%22%3A%22neon%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22upstash-kv%22%2C%22integrationSlug%22%3A%22upstash%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

### **Why Choose This Template?**

- **🛡️ Built-in Safety**: Enterprise-grade AI guardrails with Arthur Platform
- **🔒 Compliance Ready**: HIPAA, GDPR, and regulatory compliance support
- **⚡ Production Ready**: Self-hosted Arthur AI Engine for enterprise reliability
- **🎯 Customizable**: Tailor safety rules to your specific requirements
- **📊 Monitoring**: Real-time safety monitoring and compliance reporting

**Production Deployment Note:** Deploy a self-hosted Arthur AI Engine instance on AWS or Kubernetes as described in the [Arthur AI documentation](https://docs.arthur.ai/update/docs/creating-engine#/) for production Vercel deployments. Update `ARTHUR_API_BASE` to point to your deployed engine endpoint.

> 🚨 **Need Help?** If you encounter issues during setup or deployment, check our [Troubleshooting Guide](docs/TROUBLESHOOTING.md) for common solutions and debugging tips.

## Documentation

This project includes comprehensive documentation to help you get started and succeed:

- **[📋 Setup Guide](docs/SETUP.md)** - Detailed installation and configuration instructions
- **[🧪 Testing Guide](docs/TESTING.md)** - Complete testing strategy and examples
- **[🔧 Contributing Guide](docs/CONTRIBUTING.md)** - Development workflow and contribution standards
- **[🚨 Troubleshooting Guide](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[📚 Documentation Index](docs/README.md)** - Overview of all available documentation

For quick navigation and comprehensive information, start with our [Documentation Index](docs/README.md).

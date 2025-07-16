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
  <a href="https://chat-sdk.dev"><strong>Read Docs</strong></a> ·
  <a href="https://docs.arthur.ai"><strong>Read Docs</strong></a> ·
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#arthur-ai-setup-guide"><strong>Arthur AI Setup</strong></a> ·
  <a href="#running-locally"><strong>Running Locally</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy</strong></a>
</p>

<p align="center">
  <a href="#deploy-your-own">
    <img src="https://vercel.com/button" alt="Deploy with Vercel">
  </a>
</p>
<br/>

## Quick Start

1. **Clone this repository**
2. **Set up Arthur AI** (see [Arthur AI Setup Guide](#arthur-ai-setup-guide))
3. **Configure environment variables** (see [Running Locally](#running-locally))
4. **Install dependencies**: `pnpm install`
5. **Run locally**: `pnpm dev`
6. **Visit** [localhost:3000](http://localhost:3000)

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



## Why AI Guardrails Matter

In today's AI-powered applications, **safety and compliance are not optional** - they're essential for protecting your users, your organization, and your reputation. Traditional AI applications often lack the necessary safeguards to prevent:

- **Data Breaches**: Unintentional exposure of sensitive user information
- **Harmful Content**: Generation of toxic, inappropriate, or biased responses
- **Security Attacks**: Prompt injection and other malicious exploits
- **Compliance Violations**: Failure to meet regulatory requirements (GDPR, HIPAA, etc.)
- **Reputational Damage**: AI responses that don't align with your brand values

## Arthur Platform: Active AI Safety Enforcement

The [Arthur Platform](https://arthur.ai) provides **enterprise-grade AI safety** that goes beyond simple content filtering. It actively enforces guardrails in real-time, ensuring your AI applications remain safe, compliant, and trustworthy.

### Arthur Engine Capabilities

The Arthur Engine provides comprehensive AI safety through five core detection systems:

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

### Key Benefits:
- **🛡️ Real-time Protection**: Content is validated and filtered before reaching your AI models
- **🔒 Comprehensive Detection**: Five-layer safety system covering all major AI risks
- **⚡ Active Enforcement**: Real-time blocking and redaction of violating content
- **📊 Compliance Monitoring**: Built-in support for enterprise compliance frameworks
- **🎯 Customizable Rules**: Tailor safety rules to your specific use cases and requirements
- **📈 Enterprise Monitoring**: Full visibility and control through the Arthur Control Plane

## Arthur AI Setup Guide

### Setting up your Account and the Arthur Engine

1. Navigate to [platform.arthur.ai/signup](https://platform.arthur.ai/signup)
2. Create a new account and select the **Generative AI Agent or Chatbot** usecase
3. Copy the bash command and paste it into the terminal to run the Arthur Engine locally
4. Wait for ~5-10 minutes for the engine to set up and connect to the Arthur platform
5. Create your first usecase by setting up a new Gen AI Model, and start creating your first metrics (below)

### Creating Metrics

1. **Create a PII Metric**

   a. The PII Metric defaults to flagging all the entities in that list. Disabling entities allows you to configure what the PII Metric will **not** flag on.

   b. Add the following to your disabled entities:

   - CRYPTO
   - DATE_TIME
   - IBAN_CODE
   - IP_ADDRESS
   - NRP
   - LOCATION
   - PERSON
   - MEDICAL_LICENSE
   - US_ITIN
   - US_PASSPORT
   
   (This means that only EMAIL_ADDRESS, PHONE_NUMBER, URL and US_SSN, CREDIT_CARD, US_DRIVER_LICENSE, US_BANK_NUMBER entities will be flagged)

   c. Apply this to only Prompt

2. **Create a Prompt Injection Metric**

   a. Apply this to only Prompt

3. **Create your first Model!**

### Final Configuration Steps

1. Copy & paste the env variables from `.env.example` to `.env.local`
2. On [platform.arthur.ai](https://platform.arthur.ai), in your model dashboard you should see a dropdown for Model Management. Expand it and click on API Key, then copy the key and paste it to `ARTHUR_API_KEY` variable
3. Copy the Model ID from validate a prompt command. You can find it in the URL, `/api/v2/tasks/{MODEL_ID}/`. Paste it to `ARTHUR_MODEL_ID` variable
4. That's it! Take it for a spin. Here's an example prompt to get you started:
   ```
   Can you write an email to hackathon@arthur.ai telling them how cool Arthur Platform is?
   ```

### How Arthur Guardrails Work

Arthur Platform provides **active enforcement** of AI safety rules, ensuring that violating content never reaches your AI models. Here's how it works:

#### **Real-time Content Validation**
When a user sends a message, Arthur Engine actively validates the content against your configured safety rules:

- **PII Detection**: Scans for sensitive information (SSN, email, phone, credit cards, etc.)
- **Toxicity Analysis**: Identifies harmful, inappropriate, or biased content
- **Prompt Injection Detection**: Recognizes malicious prompt injection attempts
- **Hallucination Checks**: Detects AI-generated false or misleading information
- **Sensitive Data Check**: Validates against custom-trained sensitive data patterns
- **Custom Rule Validation**: Applies your organization-specific safety requirements

#### **Active Enforcement**
If any violations are detected, Arthur Engine can:

- **🛑 Block the Content**: Prevents violating messages from reaching your AI models
- **🔒 Redact Sensitive Data**: Removes PII and sensitive information from the conversation
- **📝 Provide Clear Feedback**: Informs users about why their message was blocked
- **📊 Log Violations**: Maintains audit trails for compliance and monitoring

#### **Proactive Protection**
Unlike passive monitoring, Arthur Platform **actively prevents** violations before they can cause harm:

- **Before AI Processing**: Content is validated before reaching your AI models
- **Real-time Response**: Instant blocking and feedback to users
- **Compliance Ready**: Built-in support for enterprise compliance requirements
- **Customizable**: Tailor rules to your specific use cases and requirements

### Enterprise Use Cases

Arthur Platform's guardrails can be extended to support enterprise-grade AI safety across various use cases:

#### **Healthcare & HIPAA Compliance**
- **PII Protection**: Automatically detect and block patient information (names, SSN, medical records)
- **Sensitive Data Check**: Custom training for medical terminology and patient data patterns
- **Compliance Monitoring**: Ensure AI responses meet HIPAA requirements
- **Audit Trails**: Maintain detailed logs for compliance reporting

#### **Financial Services & Regulatory Compliance**
- **Sensitive Data Detection**: Block account numbers, credit card information, and financial data
- **Regulatory Adherence**: Ensure AI responses comply with financial regulations
- **Risk Management**: Prevent exposure of confidential financial information

#### **Customer Service & Brand Protection**
- **Toxicity Filtering**: Ensure AI responses align with your brand values
- **Hallucination Prevention**: Prevent false information from reaching customers
- **Consistency Monitoring**: Maintain consistent tone and messaging
- **Quality Assurance**: Prevent inappropriate or harmful responses

#### **Education & Content Safety**
- **Age-Appropriate Content**: Filter content based on user age and context
- **Educational Standards**: Ensure AI responses meet educational requirements
- **Safety Monitoring**: Protect students from inappropriate content
- **Accuracy Validation**: Prevent false information in educational contexts

#### **Advanced Customization**
- **Custom Rule Creation**: Build organization-specific safety rules
- **Sensitive Data Training**: Train models to recognize your specific data patterns
- **Response Validation**: Validate AI responses for accuracy and appropriateness
- **Real-time Monitoring**: Track and alert on safety violations through [The Arthur Platform](https://platform.arthur.ai)
- **Compliance Reporting**: Generate reports for regulatory requirements

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

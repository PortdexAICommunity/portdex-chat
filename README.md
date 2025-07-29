<a href="https://chat.vercel.ai/">
  <img alt="Next.js 14 and App Router-ready AI chatbot." src="app/(chat)/opengraph-image.png">
  <h1 align="center">Chat SDK</h1>
</a>

<p align="center">
    Chat SDK is a free, open-source template built with Next.js and the AI SDK that helps you quickly build powerful chatbot applications.
</p>

<p align="center">
  <a href="https://chat-sdk.dev"><strong>Read Docs</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

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

## Model Providers

This template ships with [xAI](https://x.ai) `grok-2-1212` as the default chat model. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## Deploy Your Own

You can deploy your own version of the Next.js AI Chatbot to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET&envDescription=Learn+more+about+how+to+get+the+API+Keys+for+the+application&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&demo-title=AI+Chatbot&demo-description=An+Open-Source+AI+Chatbot+Template+Built+With+Next.js+and+the+AI+SDK+by+Vercel.&demo-url=https%3A%2F%2Fchat.vercel.ai&products=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22ai%22%2C%22productSlug%22%3A%22grok%22%2C%22integrationSlug%22%3A%22xai%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22neon%22%2C%22integrationSlug%22%3A%22neon%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22upstash-kv%22%2C%22integrationSlug%22%3A%22upstash%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various AI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000).

# Portdex Chat

An open-source AI chatbot built with Next.js, the Vercel AI SDK, and AWS Amplify.

## Features

- Advanced AI-powered conversations
- Document artifacts (text, code, images, spreadsheets)
- Model Context Protocol (MCP) server integration
- AI marketplace with agents, models, and tools
- **Workflow Marketplace with S3 Integration** ⭐

## S3 Workflow Integration

The marketplace now includes a workflows section that integrates with AWS S3 for storing and serving workflow files.

### Environment Variables Required

Add these to your `.env.local` file:

```env
# AWS S3 Configuration for Workflows
NEXT_PUBLIC_AWS_REGION=your-aws-region
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your-access-key-id
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your-secret-access-key
NEXT_PUBLIC_S3_BUCKET_NAME=your-workflow-bucket-name
```

### S3 Bucket Structure

Your S3 bucket should have this structure:

```
your-bucket/
└── workflows/
    ├── marketing/
    │   ├── email-campaign.json
    │   └── social-media-automation.json
    ├── data/
    │   ├── etl-pipeline.json
    │   └── analytics-report.json
    └── general/
        └── basic-workflow.json
```

### Testing S3 Integration

1. **Test S3 Connection**: Visit `/marketplace/api/workflows/test` to run comprehensive S3 tests
2. **Check Logs**: Monitor console logs for detailed S3 operation information
3. **Debug Issues**: The test endpoint provides specific error messages for common issues

### Common S3 Issues & Solutions

| Issue                             | Solution                                       |
| --------------------------------- | ---------------------------------------------- |
| **Missing environment variables** | Ensure all 4 env vars are set in `.env.local`  |
| **Access Denied**                 | Check IAM permissions for your AWS credentials |
| **NoSuchBucket**                  | Verify bucket name and region are correct      |
| **No workflows found**            | Ensure JSON files are in `workflows/` folder   |

### Required IAM Permissions

Your AWS user/role needs these permissions:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": ["s3:GetObject", "s3:ListBucket"],
			"Resource": [
				"arn:aws:s3:::your-bucket-name",
				"arn:aws:s3:::your-bucket-name/*"
			]
		}
	]
}
```

### Debugging

Enable detailed logging by checking the console output when:

- Visiting `/marketplace` → Workflows tab
- Downloading workflow files
- Running the test endpoint

All S3 operations include emoji-prefixed logs for easy identification:

- 🔍 **API requests**
- ☁️ **S3 operations**
- ✅ **Success**
- ❌ **Errors**
- 🧪 **Tests**

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`
5. Test S3 integration: Visit `/marketplace/api/workflows/test`

## Documentation

- [Docker Deployment](README.docker.md)
- [SEO Optimization](SEO-OPTIMIZATION-SUMMARY.md)

## License

This project is licensed under the MIT License.

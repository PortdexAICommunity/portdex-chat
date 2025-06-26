interface FeatureAboutUs {
  title: string;
  description: string;
  link: string;
}

interface HelpItem {
  icon: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Tool {
  title: string;
  description: string;
  image: string;
}

export const featuresAboutUs = [
  {
    title: 'Universal Financial Data Analyzer',
    description: 'Unify, Understand, and Act on Your Financial Data',
    link: 'https://workspace.portdex.ai/signin',
  },
  {
    title: 'Automate Your Workflow',
    description: 'Streamline Repetitive Tasks with Smart Automation',
    link: 'https://workflow.portdex.ai/sign-in?from=%2F',
  },
  {
    title: 'Effortless Content Creations',
    description: 'Generate Insightful Content with a Click',
    link: 'https://digitalcontent.portdex.ai/ai/new',
  },
  {
    title: 'Build Your AI Agent',
    description: 'Design Custom AI That Works for You',
    link: 'https://dev.portdex.ai/',
  },
];

export const blockchainHelpItems = [
  {
    title: 'Ocean Protocol',
    icon: '🌊',
    description: 'Decentralized Data Sharing and AI Marketplace',
  },
  {
    title: 'Fetch.ai',
    icon: '🚀',
    description: 'Autonomous Economic Agents for Decentralized Marketplaces',
  },
  {
    title: 'SingularityNET',
    icon: '🤖',
    description: 'Decentralized AI Marketplace for AI Services',
  },
  {
    title: 'Cortex',
    icon: '🧠',
    description: 'AI-Driven Decentralized Prediction Market',
  },
  {
    title: 'Numeraire (Numerai)',
    icon: '🔢',
    description: 'Decentralized AI-Powered Hedge Fund',
  },
  {
    title: 'Bittensor',
    icon: '🚫',
    description: 'Decentralized AI-Powered Neural Network',
  },
  {
    title: 'DeepBrain Chain',
    icon: '🧠',
    description: 'Decentralized AI Computing Network',
  },
  {
    title: 'Phala Network',
    icon: '🔒',
    description: 'Decentralized AI-Powered Confidential Computing',
  },
  {
    title: 'Gensyn',
    icon: '🔄',
    description: 'Decentralized AI-Powered Synthetic Data Generation',
  },
  {
    title: 'Akash Network',
    icon: '🌐',
    description: 'Decentralized Cloud Computing for AI and Blockchain',
  },
];

export const helpItems = [
  {
    title: 'Interoperable Data Agents',
    icon: '🔄',
    description:
      'Enable Seamless Data Sharing and Interaction Across Multiple Platforms',
  },
  {
    title: 'Interoperable Web 3.0 Agents',
    icon: '🔗',
    description: 'Build and Deploy AI Agents for the Decentralized Web',
  },
  {
    title: 'Automation Agents',
    icon: '⚙️',
    description:
      'Automate Tasks and Workflows Across Multiple Systems with Ease',
  },
];

export const FAQS = [
  {
    question: 'What is Portdex.ai?',
    answer:
      'Portdex.ai is a platform designed to enable businesses and developers to collaboratively build, deploy, and manage AI agents. It provides a virtual environment and a free marketplace where developers can list and import digital content they’ve created. Portdex allows content creators to generate content on any platform or directly on Portdex and list it for free on the marketplace. Businesses can access this content and only pay for the basic model price of the AI agents they wish to use. Additionally, Portdex integrates blockchain protocols to enable developers to deploy agents on blockchain networks, enhancing the security and transparency of digital content and transactions.',
  },
  {
    question:
      'How does Portdex.ai support collaboration between businesses and developers?',
    answer:
      'Portdex.ai fosters collaboration by offering a shared virtual environment where developers can create AI agents and businesses can access them. Developers can build and list their AI agents on the marketplace, while businesses can easily browse, import, and utilize these agents to optimize their workflows. The platform encourages open collaboration by providing a space for both developers and businesses to contribute and benefit from innovative AI solutions, with the added advantage of blockchain integration for secure deployment and transaction.',
  },
  {
    question: 'How does Portdex.ai integrate blockchain protocols?',
    answer:
      'Portdex.ai integrates blockchain protocols to enable developers to deploy AI agents on decentralized networks, ensuring greater transparency, security, and control over intellectual property. Blockchain integration allows content creators and developers to establish ownership rights of their AI agents and assets, ensuring that all transactions and interactions are recorded in a secure, tamper-proof manner. This gives businesses confidence in the authenticity and legitimacy of the content they access.',
  },
  {
    question:
      'How does Portdex.ai support multi-asset transactions in the marketplace?',
    answer:
      'Portdex.ai integrates Web 3.0 and cross-chain technologies to enable multi-asset transactions within the marketplace. This means that users can engage in seamless transactions across various blockchain networks, exchanging different types of digital assets without compatibility issues. Developers and businesses can list and purchase AI agents or content using multiple assets, making the marketplace more flexible and accessible for all users.',
  },
  {
    question: 'Can I create and list content on Portdex.ai?',
    answer:
      'Yes! As a content creator, you can create digital content on any platform and list it on Portdex’s marketplace for free. Portdex supports various formats and types of content, allowing you to reach a wide audience. The platform enables you to easily import and list your content without any upfront costs, helping you gain visibility and expand your reach in the AI agent marketplace. Additionally, blockchain integration allows you to securely establish and prove ownership of your content.',
  },
  {
    question: 'Do businesses have to pay to use the AI agents on Portdex.ai?',
    answer:
      'Businesses only pay for the basic model price of the AI agents they choose to use. There are no additional fees for accessing the marketplace or browsing content. The transparent pricing model ensures businesses only pay for the AI solutions they need, allowing for cost-effective integration of AI agents into their operations. Blockchain integration ensures that all transactions are secure, and Web 3.0 support enables businesses to engage in multi-asset transactions across different blockchain networks.',
  },
  {
    question: 'What are the benefits of using Portdex.ai for developers?',
    answer:
      'Portdex.ai offers several key benefits for developers:' +
      '\n- Free Marketplace: Developers can list their AI agents and digital content at no cost, gaining visibility in the growing AI ecosystem.' +
      '\n- Blockchain Integration: Developers can deploy AI agents on blockchain protocols, ensuring greater security, transparency, and ownership of their content.' +
      '\n- Cross-Chain Asset Support: Developers can integrate their agents and assets across multiple blockchain networks, opening up new possibilities for interoperability.' +
      '\n- Collaboration Opportunities: Developers can collaborate with businesses and other developers, sharing expertise and contributing to larger projects.',
  },
  {
    question:
      'How does Portdex.ai make it easier for businesses to adopt AI solutions?',
    answer:
      'Portdex.ai streamlines the adoption of AI solutions by providing a centralized marketplace for AI agents, with a wide range of models available for businesses. The marketplace enables businesses to browse and select the AI agents that best fit their needs, and the simple, pay-as-you-go pricing structure ensures they only pay for the basic model price. Blockchain integration ensures secure and transparent transactions, while Web 3.0 and cross-chain asset support enable multi-asset transactions, making it easier for businesses to adopt and integrate AI agents into their workflows.',
  },
];

export const TOOLS = [
  {
    title: 'Build Custom AI Tools Quickly',
    description:
      'Save time by using our drag-and-drop interface to create AI tools in minutes without coding.',
    image: 'https://ext.same-assets.com/3673031529/2623067874.png',
  },
  {
    title: 'Tailored AI Solutions for Your Needs',
    description:
      'Discover Artificial Intelligence solutions customizable to your specific requirements. Automate AI-powered story creation, generate batches of images, summarize YouTube content using AI, and more.',
    image: 'https://ext.same-assets.com/3673031529/3458453911.png',
  },
  {
    title: 'Select. Connect. Integrate.',
    description:
      'Easily build and customize APIs for your AI workflows. Automate inputs and retrieve outputs via API requests or webhooks. Integrate your AI flows into your projects.',
    image: 'https://ext.same-assets.com/3673031529/3967127822.png',
  },
];

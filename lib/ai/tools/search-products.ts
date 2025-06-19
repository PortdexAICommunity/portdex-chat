import { generateUUID } from '@/lib/utils';
import { DataStreamWriter, tool } from 'ai';
import { Session } from 'next-auth';
import { z } from 'zod';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
}

interface SearchProductsProps {
  session: Session;
  dataStream: DataStreamWriter;
}

const mockProducts = [
  {
    id: '1',
    name: 'Sony WH-1000XM4 Wireless Headphones',
    description:
      'Industry-leading noise canceling with Dual Noise Sensor technology. Up to 30-hour battery life with quick charge.',
    price: '$349.99',
    rating: 5,
    category: 'Electronics',
    supplier: 'Sony Electronics',
    image:
      'https://images.pexels.com/photos/32488279/pexels-photo-32488279.jpeg?cs=srgb&dl=pexels-studio-lichtfang-2152913672-32488279.jpg&fm=jpg',
    features: [
      'Noise Canceling',
      '30hr Battery',
      'Touch Controls',
      'Voice Assistant',
    ],
  },
  {
    id: '2',
    name: 'Apple AirPods Pro (2nd Generation)',
    description:
      'Active Noise Cancellation, Transparency mode, and Personalized Spatial Audio with dynamic head tracking.',
    price: '$249.99',
    rating: 5,
    category: 'Electronics',
    supplier: 'Apple Inc.',
    image:
      'https://images.pexels.com/photos/32488279/pexels-photo-32488279.jpeg?cs=srgb&dl=pexels-studio-lichtfang-2152913672-32488279.jpg&fm=jpg',
    features: [
      'Active Noise Cancellation',
      'Spatial Audio',
      'MagSafe Charging',
      'Water Resistant',
    ],
  },
  {
    id: '3',
    name: 'Herman Miller Aeron Chahttps://github.com/ArifPayDev/Arifpay-NestJS-SDK/blob/main/src/arifpay-sdk/validators/paymentMethod.validator.tsir',
    description:
      'Ergonomic office chair with advanced PostureFit SL support and breathable mesh design.',
    price: '$1,395.00',
    rating: 4,
    category: 'Furniture',
    supplier: 'Herman Miller',
    image:
      'https://images.pexels.com/photos/32488279/pexels-photo-32488279.jpeg?cs=srgb&dl=pexels-studio-lichtfang-2152913672-32488279.jpg&fm=jpg',
    features: [
      'Ergonomic Design',
      'PostureFit SL',
      'Breathable Mesh',
      '12-Year Warranty',
    ],
  },
  {
    id: '4',
    name: 'Steelcase Leap V2 Office Chair',
    description:
      'Highly adjustable ergonomic chair with LiveBack technology that changes shape to mimic your spine.',
    price: '$415.00',
    rating: 4,
    category: 'Furniture',
    supplier: 'Steelcase Inc.',
    image:
      'https://images.pexels.com/photos/32488279/pexels-photo-32488279.jpeg?cs=srgb&dl=pexels-studio-lichtfang-2152913672-32488279.jpg&fm=jpg',
    features: [
      'LiveBack Technology',
      'Adjustable Arms',
      'Lumbar Support',
      'Weight-Activated Mechanism',
    ],
  },
  {
    id: '5',
    name: 'Bose QuietComfort 45 Headphones',
    description:
      'Wireless Bluetooth headphones with world-class noise cancellation and 24-hour battery life.',
    price: '$329.00',
    rating: 4,
    category: 'Electronics',
    supplier: 'Bose Corporation',
    image:
      'https://images.pexels.com/photos/32488279/pexels-photo-32488279.jpeg?cs=srgb&dl=pexels-studio-lichtfang-2152913672-32488279.jpg&fm=jpg',
    features: [
      'Noise Cancellation',
      '24hr Battery',
      'Comfortable Fit',
      'EQ Control',
    ],
  },
  {
    id: '6',
    name: 'IKEA Markus Office Chair',
    description:
      'High-back office chair with built-in lumbar support and breathable mesh back.',
    price: '$229.00',
    rating: 4,
    category: 'Furniture',
    supplier: 'IKEA',
    image:
      'https://images.pexels.com/photos/32488279/pexels-photo-32488279.jpeg?cs=srgb&dl=pexels-studio-lichtfang-2152913672-32488279.jpg&fm=jpg',
    features: [
      'Built-in Lumbar Support',
      'Mesh Back',
      'Adjustable Height',
      '10-Year Warranty',
    ],
  },
];

export const searchProducts = ({ session, dataStream }: SearchProductsProps) =>
  tool({
    description:
      'Search for products based on user query. Use this when the user is looking for products to buy or wants to see product recommendations.',
    parameters: z.object({
      query: z.string().describe('The search query for products'),
      category: z
        .string()
        .optional()
        .describe('Optional category filter for products'),
      maxResults: z
        .number()
        .optional()
        .default(8)
        .describe('Maximum number of results to return'),
    }),
    execute: async ({ query, category, maxResults = 8 }) => {
      const id = generateUUID();

      // Filter products based on query and category
      let filteredProducts = mockProducts.filter((product) => {
        const matchesQuery =
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase());

        const matchesCategory =
          !category ||
          product.category.toLowerCase().includes(category.toLowerCase());

        return matchesQuery && matchesCategory;
      });

      // If no matches found, return all products as suggestions
      if (filteredProducts.length === 0) {
        filteredProducts = mockProducts;
      }

      // Limit results
      filteredProducts = filteredProducts.slice(0, maxResults);

      dataStream.writeData({
        type: 'kind',
        content: 'product-search',
      });

      dataStream.writeData({
        type: 'id',
        content: id,
      });

      dataStream.writeData({
        type: 'title',
        content: `Product Search: ${query}`,
      });

      dataStream.writeData({
        type: 'clear',
        content: '',
      });

      dataStream.writeData({
        type: 'product-results',
        content: JSON.stringify({
          products: filteredProducts,
          query: query,
          totalResults: filteredProducts.length,
        }),
      });

      dataStream.writeData({ type: 'finish', content: '' });

      return {
        id,
        title: `Product Search: ${query}`,
        kind: 'product-search',
        content: `Found ${filteredProducts.length} products matching "${query}". Results are now visible to the user.`,
        products: mockProducts,
      };
    },
  });

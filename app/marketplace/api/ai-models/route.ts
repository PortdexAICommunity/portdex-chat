import { aiModels } from '@/lib/constants';
import type { DataTypes } from '@/lib/types';
import { type NextRequest, NextResponse } from 'next/server';

interface AnthropicModel {
  created_at: string;
  display_name: string;
  id: string;
  type: string;
}

interface AnthropicResponse {
  data: AnthropicModel[];
  first_id: string;
  has_more: boolean;
  last_id: string;
}

const anthropicFallbackData = {
  created_at: '2025-02-19T00:00:00Z',
  display_name: 'Claude Sonnet 4',
  id: 'claude-sonnet-4-20250514',
  type: 'model',
} as const;

async function fetchAnthropicModels(): Promise<DataTypes[]> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch Anthropic models:', response.statusText);

      return [
        {
          creator: 'Anthropic',
          description: `${anthropicFallbackData.display_name} is a state-of-the-art AI language model developed by Anthropic, designed for helpful, harmless, and honest interactions.`,
          category: 'Language Model',
          icon: 'https://img.icons8.com/?size=100&id=XDigO1YmCwbW&format=png&color=000000',
          gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          date: new Date(anthropicFallbackData.created_at).toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            },
          ),
          id: anthropicFallbackData.id,
          name: anthropicFallbackData.display_name,
        },
      ];
    }

    const data: AnthropicResponse = await response.json();

    return data.data.map((model) => ({
      id: model.id,
      name: model.display_name,
      creator: 'Anthropic',
      description: `${model.display_name} is a state-of-the-art AI language model developed by Anthropic, designed for helpful, harmless, and honest interactions.`,
      category: 'Language Model',
      icon: 'https://img.icons8.com/?size=100&id=XDigO1YmCwbW&format=png&color=000000',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      date: new Date(model.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }));
  } catch (error) {
    console.error('Error fetching Anthropic models:', error);
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    // Fetch Anthropic models
    const anthropicModels = await fetchAnthropicModels();

    // Combine with existing static models
    const allModels = [...aiModels, ...anthropicModels];

    // Apply any filtering or pagination if needed
    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let filteredModels = allModels;

    if (search) {
      filteredModels = filteredModels.filter(
        (model) =>
          model.name.toLowerCase().includes(search.toLowerCase()) ||
          model.description.toLowerCase().includes(search.toLowerCase()) ||
          model.creator.toLowerCase().includes(search.toLowerCase()) ||
          model.category.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category) {
      filteredModels = filteredModels.filter(
        (model) => model.category.toLowerCase() === category.toLowerCase(),
      );
    }

    return NextResponse.json({
      models: filteredModels,
      total: filteredModels.length,
    });
  } catch (error) {
    console.error('Error in AI models API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI models', models: aiModels },
      { status: 500 },
    );
  }
}

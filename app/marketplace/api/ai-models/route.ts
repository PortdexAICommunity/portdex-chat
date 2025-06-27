import { aiModels } from '@/lib/constants';
import { type NextRequest, NextResponse } from 'next/server';
import { fetchAnthropicModels } from './anthropic';
import { fetchQwenAIModels } from './qwen';

export async function GET(req: NextRequest) {
  try {
    const [anthropicModels, qwenModels] = await Promise.all([
      fetchAnthropicModels(),
      fetchQwenAIModels(),
    ]);

    const allModels = [...aiModels, ...anthropicModels, ...qwenModels];

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

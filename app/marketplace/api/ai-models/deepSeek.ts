import type { DataTypes } from '@/lib/types';

type DeepSeekApiResponse = {
  data: { id: string; object: 'model'; owned_by: 'deepseek' }[];
  object: 'list';
};

const deepSeekFallbackData = [
  {
    id: 'deepseek-chat',
    object: 'model',
    owned_by: 'deepseek',
  },
  {
    id: 'deepseek-reasoner',
    object: 'model',
    owned_by: 'deepseek',
  },
] as const;

export async function fetchDeepSeekModels(): Promise<DataTypes[]> {
  try {
    const response = await fetch('https://api.deepseek.com/models', {
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch  models:', response.statusText);

      return deepSeekFallbackData.map((model) => ({
        creator: model.owned_by,
        description: `${model.id} is a state-of-the-art AI language model developed by , designed for helpful, harmless, and honest interactions.`,
        category: 'Language Model',
        icon: 'https://img.icons8.com/?size=100&id=BXsdQPYarISt&format=png&color=000000',
        gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        date: new Date('01-01-2025').toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        id: model.id,
        name: model.object,
      }));
    }

    const data: DeepSeekApiResponse = await response.json();

    return data.data.map((model) => ({
      id: model.id,
      name: model.id,
      creator: '',
      description: `${model.id} is a state-of-the-art AI language model developed by , designed for helpful, harmless, and honest interactions.`,
      category: 'Language Model',
      icon: 'https://img.icons8.com/?size=100&id=BXsdQPYarISt&format=png&color=000000',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      date: new Date('01-01-2025').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }));
  } catch (error) {
    console.error('Error fetching  models:', error);
    return [];
  }
}

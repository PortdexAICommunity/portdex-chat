import type { DataTypes } from '@/lib/types';

export async function fetchQwenAIModels(): Promise<DataTypes[]> {
  try {
    const response = await fetch(
      'https://www.alibabacloud.com/help/en/model-studio/models?spm=a2c63.p38356.0.i3#9f8890ce29g5u',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      },
    );

    if (!response.ok) {
      console.error(
        'Failed to fetch Alibaba Cloud models page:',
        response.statusText,
      );
      return [];
    }

    const html = await response.text();
    const qwenModels: DataTypes[] = [];

    const cleanText = (text: string): string => {
      return text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    };

    const extractBetween = (
      text: string,
      start: string,
      end: string,
    ): string => {
      const startIndex = text.indexOf(start);
      if (startIndex === -1) return '';
      const endIndex = text.indexOf(end, startIndex + start.length);
      if (endIndex === -1) return text.substring(startIndex + start.length);
      return text.substring(startIndex + start.length, endIndex);
    };

    const generateId = (name: string): string => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    // Focus on top flagship models only
    const topModels = [
      {
        name: 'QwQ-32B-Preview',
        searchTerms: ['QwQ', 'reasoning'],
        category: 'Reasoning Model',
      },
      {
        name: 'Qwen-Max',
        searchTerms: ['Qwen-Max', 'flagship'],
        category: 'Language Model',
      },
      {
        name: 'Qwen-Plus',
        searchTerms: ['Qwen-Plus', 'enhanced'],
        category: 'Language Model',
      },
      {
        name: 'Qwen-Turbo',
        searchTerms: ['Qwen-Turbo', 'fast'],
        category: 'Language Model',
      },
      {
        name: 'Qwen2.5-Coder',
        searchTerms: ['Qwen2.5-Coder', 'code'],
        category: 'Code Model',
      },
      {
        name: 'Qwen-VL-Plus',
        searchTerms: ['Qwen-VL', 'vision', 'multimodal'],
        category: 'Multimodal',
      },
      {
        name: 'Qwen2.5-Math',
        searchTerms: ['Qwen2.5-Math', 'mathematics'],
        category: 'Math Model',
      },
      {
        name: 'Qwen-Long',
        searchTerms: ['Qwen-Long', 'long context'],
        category: 'Language Model',
      },
    ];

    const extractDynamicDescription = (
      modelName: string,
      searchTerms: string[],
      htmlContent: string,
    ): string => {
      // First, try to extract description from td tags with p elements
      const extractFromTableCell = (
        content: string,
        modelName: string,
      ): string | null => {
        // Look for table cells containing the model name
        const tdRegex = /<td[^>]*>[\s\S]*?<\/td>/gi;
        const tdMatches = content.match(tdRegex);

        if (tdMatches) {
          for (const td of tdMatches) {
            if (td.toLowerCase().includes(modelName.toLowerCase())) {
              // Extract all p tags from this td
              const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
              const pMatches = td.match(pRegex);

              if (pMatches && pMatches.length >= 2) {
                // Get the second p tag content
                const secondP = pMatches[1];
                const description = cleanText(secondP);

                if (description.length > 20 && description.length < 300) {
                  return description;
                }
              }
            }
          }
        }
        return null;
      };

      // Try table cell extraction first
      const tableCellDescription = extractFromTableCell(htmlContent, modelName);
      if (tableCellDescription) {
        return tableCellDescription;
      }

      // Try to find model-specific description in broader context
      const modelSection = extractBetween(
        htmlContent,
        modelName,
        modelName === 'Qwen-VL-Plus'
          ? 'Image generation'
          : modelName === 'QwQ-32B-Preview'
            ? 'Qwen-Max'
            : 'Qwen2',
      );

      if (modelSection) {
        // Look for p tags in the model section
        const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
        const pMatches = modelSection.match(pRegex);

        if (pMatches) {
          for (const pMatch of pMatches) {
            const description = cleanText(pMatch);
            if (description.length > 30 && description.length < 250) {
              const relevantKeywords = [
                'model',
                'capabilities',
                'performance',
                'designed',
                'optimized',
                'advanced',
                'supports',
              ];
              const hasRelevantKeyword = relevantKeywords.some((keyword) =>
                description.toLowerCase().includes(keyword),
              );

              if (
                hasRelevantKeyword &&
                !description.toLowerCase().includes('table') &&
                !description.toLowerCase().includes('column')
              ) {
                return description;
              }
            }
          }
        }

        // Fallback to sentence-based extraction
        const sentences = modelSection.split(/[.!?]/).map((s) => cleanText(s));
        for (const sentence of sentences) {
          if (sentence.length > 30 && sentence.length < 250) {
            const relevantKeywords = [
              'model',
              'capabilities',
              'performance',
              'designed',
              'optimized',
              'advanced',
              'supports',
            ];
            const hasRelevantKeyword = relevantKeywords.some((keyword) =>
              sentence.toLowerCase().includes(keyword),
            );

            if (
              hasRelevantKeyword &&
              !sentence.toLowerCase().includes('table') &&
              !sentence.toLowerCase().includes('column')
            ) {
              return `${sentence}.`;
            }
          }
        }
      }

      // Try to find description in broader context using search terms
      for (const term of searchTerms) {
        const termIndex = htmlContent.toLowerCase().indexOf(term.toLowerCase());
        if (termIndex !== -1) {
          const contextStart = Math.max(0, termIndex - 500);
          const contextEnd = Math.min(htmlContent.length, termIndex + 800);
          const context = htmlContent.substring(contextStart, contextEnd);

          // Look for p tags in the context
          const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
          const pMatches = context.match(pRegex);

          if (pMatches) {
            for (const pMatch of pMatches) {
              const description = cleanText(pMatch);
              if (
                description.length > 40 &&
                description.length < 200 &&
                (description.toLowerCase().includes(term.toLowerCase()) ||
                  description.toLowerCase().includes('model')) &&
                !description.toLowerCase().includes('table') &&
                !description.toLowerCase().includes('click')
              ) {
                return description;
              }
            }
          }
        }
      }

      // Fallback descriptions based on model type
      const fallbackDescriptions: Record<string, string> = {
        'QwQ-32B-Preview':
          'An experimental reasoning model designed for complex problem-solving and step-by-step analysis.',
        'Qwen-Max':
          'The most advanced flagship model in the Qwen series, offering superior performance across various tasks.',
        'Qwen-Plus':
          'An enhanced version of Qwen with improved capabilities and better performance for complex queries.',
        'Qwen-Turbo':
          'A fast and efficient model optimized for quick responses while maintaining high quality output.',
        'Qwen2.5-Coder':
          'A specialized coding model fine-tuned for programming tasks and code generation.',
        'Qwen-VL-Plus':
          'A multimodal model that combines vision and language understanding for image and text processing.',
        'Qwen2.5-Math':
          'A mathematics-specialized model designed for mathematical reasoning and problem-solving.',
        'Qwen-Long':
          'A long-context model capable of handling extended conversations and lengthy documents.',
      };

      return (
        fallbackDescriptions[modelName] ||
        `Advanced AI model from Alibaba Cloud's Qwen series.`
      );
    };

    // Process only the top flagship models
    for (const model of topModels) {
      const description = extractDynamicDescription(
        model.name,
        model.searchTerms,
        html,
      );

      qwenModels.push({
        id: generateId(model.name),
        name: model.name,
        creator: 'Alibaba Cloud',
        description: description,
        category: model.category,
        icon: 'https://img.icons8.com/?size=100&id=59023&format=png&color=000000',
        gradient: 'linear-gradient(135deg, #FF6900 0%, #FFA500 100%)',
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      });
    }

    console.log(
      `Successfully scraped ${qwenModels.length} top Qwen AI models from Alibaba Cloud`,
    );

    return qwenModels;
  } catch (error) {
    console.error('Error scraping Qwen AI models:', error);
    return [];
  }
}

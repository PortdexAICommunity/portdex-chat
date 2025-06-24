import { Artifact } from '@/components/create-artifact';
import { DocumentSkeleton } from '@/components/document-skeleton';
import { CopyIcon, FilterIcon, SearchIcon } from '@/components/icons';
import { toast } from 'sonner';

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

interface ProductSearchMetadata {
  products: Product[];
  query: string;
  totalResults: number;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            ${product.price}
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm">{product.rating}</span>
            <span className="text-gray-500 text-sm">({product.reviews})</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
}

export const productSearchArtifact = new Artifact<
  'product-search',
  ProductSearchMetadata
>({
  kind: 'product-search',
  description: 'Product search results display',
  initialize: async ({ setMetadata }) => {
    setMetadata({
      products: [],
      query: '',
      totalResults: 0,
    });
  },
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    if (streamPart.type === 'product-results') {
      const data = JSON.parse(streamPart.content as string);
      setMetadata({
        products: data.products,
        query: data.query,
        totalResults: data.totalResults,
      });

      setArtifact((draftArtifact) => {
        return {
          ...draftArtifact,
          content: `Found ${data.totalResults} products`,
          isVisible: true,
          status: 'streaming',
        };
      });
    }
  },
  content: ({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
  }) => {
    if (isLoading) {
      return <DocumentSkeleton artifactKind="product-search" />;
    }

    if (!metadata || !metadata.products || metadata.products.length === 0) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <SearchIcon size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">Try adjusting your search terms.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Search Results for "{metadata.query}"
          </h1>
          <p className="text-gray-600">
            Found {metadata.totalResults} products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {metadata.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  },
  actions: [
    {
      icon: <CopyIcon size={18} />,
      description: 'Copy product list',
      onClick: ({ metadata }) => {
        if (metadata?.products) {
          const productList = metadata.products
            .map((p) => `${p.name} - $${p.price} (${p.category})`)
            .join('\n');
          navigator.clipboard.writeText(productList);
          toast.success('Product list copied to clipboard!');
        }
      },
    },
  ],
  toolbar: [
    {
      icon: <SearchIcon />,
      description: 'Refine search',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content:
            'Please help me refine this product search with more specific criteria.',
        });
      },
    },
    {
      icon: <FilterIcon />,
      description: 'Filter by category',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Show me products from a specific category or price range.',
        });
      },
    },
  ],
});

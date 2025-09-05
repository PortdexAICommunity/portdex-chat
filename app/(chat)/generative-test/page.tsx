export default function GenerativeTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-4">
              Generative UI Integration Complete!
            </h1>
            <p className="text-muted-foreground text-center">
              The searchProducts tool is now integrated with Generative UI in your main chat. Try asking for products!
            </p>
          </div>

          <div className="border rounded-lg shadow-sm min-h-[600px] p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">🎨 Generative UI is Now Active!</h2>
                <p className="text-muted-foreground mb-6">
                  The searchProducts tool is integrated into your main chat. When you ask for products, you&apos;ll see rich, interactive product cards with images, ratings, and details instead of plain text.
                </p>
              </div>

              {/* Example Product Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-foreground line-clamp-2">
                        Sony WH-1000XM4 Wireless Headphones
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Sony Electronics
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                        Electronics
                      </span>
                      <div className="text-lg font-bold text-green-600">
                        $349.99
                      </div>
                    </div>
                  </div>

                  <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                    <div className="size-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-2xl">
                      🎧
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    Industry-leading noise canceling with Dual Noise Sensor technology.
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">(5/5)</span>
                  </div>

                  <button type="button" className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted transition-colors">
                    View Details
                  </button>
                </div>

                <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-foreground line-clamp-2">
                        Herman Miller Aeron Chair
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Herman Miller
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                        Furniture
                      </span>
                      <div className="text-lg font-bold text-green-600">
                        $1,395.00
                      </div>
                    </div>
                  </div>

                  <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                    <div className="size-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-600 text-2xl">
                      🪑
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    Ergonomic office chair with advanced PostureFit SL support.
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                      <span className="text-gray-300 text-sm">★</span>
                    </div>
                    <span className="text-xs text-muted-foreground">(4/5)</span>
                  </div>

                  <button type="button" className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted transition-colors">
                    View Details
                  </button>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">✅ Generative UI Benefits:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                  <li><strong>Rich Components:</strong> Interactive product cards with images, ratings, and actions</li>
                  <li><strong>Type Safety:</strong> Full TypeScript support for component props</li>
                  <li><strong>Consistency:</strong> UI components match your design system</li>
                  <li><strong>Progressive Loading:</strong> Loading states while data is being fetched</li>
                  <li><strong>Server-Side Rendering:</strong> Components rendered on the server for better performance</li>
                </ul>
              </div>

              <div className="text-center text-muted-foreground">
                <p>🎯 <strong>Generative UI Integration Complete!</strong></p>
                <p className="text-sm mt-2">Go to your main chat and try asking for products like &quot;wireless headphones&quot; or &quot;office chairs&quot; to see the rich Generative UI in action.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

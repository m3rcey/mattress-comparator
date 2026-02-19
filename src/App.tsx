import { useState } from 'react';
import { Check, X, Truck, Shield, CreditCard, Calendar, DollarSign, Star } from 'lucide-react';
import { 
  mattressFirmProducts, 
  competitors, 
  comparisonCategories,
  type Product 
} from './data/products';

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const getWinner = (category: string, mfValue: number, compValue: number, lowerIsBetter: boolean): 'mf' | 'comp' | 'tie' => {
    if (lowerIsBetter) {
      return mfValue <= compValue ? 'mf' : 'comp';
    }
    return mfValue >= compValue ? 'mf' : 'comp';
  };

  const renderWinnerBadge = (winner: 'mf' | 'comp' | 'tie') => {
    if (winner === 'tie') return null;
    if (winner === 'mf') {
      return (
        <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full flex items-center gap-1">
          <Check size={12} /> WE BEAT THEM
        </span>
      );
    }
    return (
      <span className="ml-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
        Higher
      </span>
    );
  };

  const formatValue = (category: string, value: number) => {
    switch (category) {
      case 'price':
        return `$${value.toLocaleString()}`;
      case 'financingAPR':
        return value === 0 ? '0% APR' : `${value}% APR`;
      case 'financingTerm':
        return value === 0 ? 'N/A' : `${value} months`;
      case 'warrantyYears':
        return value >= 999 ? 'Lifetime' : `${value} years`;
      case 'deliveryDays':
        return value <= 1 ? 'Same Day' : `${value} days`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🛏️ Mattress Competitor Comparator
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            See why Mattress Firm beats the competition
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Product Selection */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="text-yellow-400" size={20} />
            Select Your Mattress Firm Product
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mattressFirmProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`p-4 rounded-xl text-left transition-all ${
                  selectedProduct?.id === product.id
                    ? 'bg-purple-600/30 border-2 border-purple-500'
                    : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="font-semibold">{product.name}</div>
                <div className="text-gray-400 text-sm">{product.brand}</div>
                <div className="text-purple-400 font-bold mt-2">${product.price.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        {selectedProduct && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Competitor Comparison
              </h2>
              <span className="text-sm text-gray-400">
                vs {selectedProduct.name}
              </span>
            </div>

            {/* We Beat Them Summary */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 mb-6 border border-green-500/30">
              <h3 className="font-bold text-green-400 flex items-center gap-2">
                <Check size={20} />
                Where We Beat The Competition
              </h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {comparisonCategories.map((cat) => {
                  const mfValue = selectedProduct[cat.id as keyof Product] as number;
                  const beatsSome = competitors.some((comp) =>
                    comp.products.some((p) => {
                      const compValue = p[cat.id as keyof Product] as number;
                      return getWinner(cat.id, mfValue, compValue, cat.lowerIsBetter) === 'mf';
                    })
                  );
                  if (beatsSome) {
                    return (
                      <span key={cat.id} className="px-3 py-1 bg-green-500/30 rounded-full text-sm">
                        {cat.icon} {cat.label}
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Competitor Cards */}
            <div className="space-y-4">
              {competitors.map((competitor) => (
                <div key={competitor.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                  <div className="bg-white/10 px-4 py-3 flex items-center gap-3">
                    <span className="text-2xl">{competitor.logo}</span>
                    <span className="font-semibold">{competitor.name}</span>
                  </div>
                  
                  {competitor.products.map((compProduct) => (
                    <div key={compProduct.id} className="p-4 border-t border-white/5">
                      <div className="font-medium mb-4">{compProduct.name}</div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {comparisonCategories.map((cat) => {
                          const mfValue = selectedProduct[cat.id as keyof Product] as number;
                          const compValue = compProduct[cat.id as keyof Product] as number;
                          const winner = getWinner(cat.id, mfValue, compValue, cat.lowerIsBetter);
                          
                          return (
                            <div 
                              key={cat.id} 
                              className={`p-3 rounded-lg ${
                                winner === 'mf' 
                                  ? 'bg-green-500/10 border border-green-500/30' 
                                  : 'bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                                {cat.icon} {cat.label}
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-gray-300">Mattress Firm:</div>
                                  <div className="font-bold text-purple-400">
                                    {formatValue(cat.id, mfValue)}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-gray-300">{competitor.name}:</div>
                                  <div className="font-bold">
                                    {formatValue(cat.id, compValue)}
                                  </div>
                                </div>
                                {renderWinnerBadge(winner)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Summary Footer */}
            <div className="mt-6 p-4 bg-purple-600/20 rounded-xl border border-purple-500/30">
              <h3 className="font-bold text-purple-400 mb-2">Why Buy From Mattress Firm?</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 0% APR financing available on most models</li>
                <li>• Price match guarantee — we beat competitor prices</li>
                <li>• Free delivery & setup on most mattresses</li>
                <li>• 10+ year warranties on premium mattresses</li>
                <li>• 120-night sleep trial — risk free</li>
              </ul>
            </div>
          </section>
        )}

        {!selectedProduct && (
          <div className="text-center py-12 text-gray-400">
            <p>Select a product above to see how we compare</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Mock data — Replace with actual products when available</p>
      </footer>
    </div>
  );
}

export default App;

import { useState, useMemo } from 'react';
import { Check, X, ChevronDown, Clock, RefreshCw } from 'lucide-react';
import { brands } from './data/products';

// Import competitor data
import competitorDataRaw from './data/competitor-data.json';

// Import policies
import policiesData from './data/policies.json';

// Type definitions
interface CompetitorResult {
  price?: number;
  url?: string;
  found?: boolean;
  notAvailable?: boolean;
  reason?: string;
}

interface ProductCompetitors {
  [competitorId: string]: CompetitorResult;
}

interface ProductData {
  brand: string;
  model: string;
  size: string;
  mfPrice: number;
  competitors: ProductCompetitors;
}

interface PolicyData {
  deliveryTime: string;
  deliveryFee: string;
  trialPeriod: string;
  warranty: string;
}

// Competitor info - removed bbb (Bed Bath & Beyond)
const competitorInfo: { [key: string]: { name: string } } = {
  'ashley': { name: 'Ashley Furniture' },
  'macys': { name: "Macy's" },
  'costco': { name: 'Costco' },
  'muellers': { name: "Mueller's Furniture" },
  'carol-house': { name: 'Carol House Furniture' },
  'wayfair': { name: 'Wayfair' },
  'jcpenney': { name: 'JCPenney' }
};

// Parse competitor data
const competitorData = competitorDataRaw as { timestamp: string; products: ProductData[] };

// Parse policies
const policies = policiesData as { [retailer: string]: PolicyData };

// Get product data for exact brand + model + size match
const getProductData = (brand: string, model: string, size: string): ProductData | null => {
  return competitorData.products.find(p =>
    p.brand === brand && p.model === model && p.size === size
  ) || null;
};

// Format timestamp
const formatTimestamp = (ts: string) => {
  const date = new Date(ts);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
    ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

function App() {
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  const [dropdowns, setDropdowns] = useState({
    brand: false,
    model: false,
    size: false
  });

  const availableModels = useMemo(() => {
    return selectedBrand?.models || [];
  }, [selectedBrand]);

  const availableSizes = useMemo(() => {
    return selectedModel?.sizes || [];
  }, [selectedModel]);

  const toggleDropdown = (key: 'brand' | 'model' | 'size') => {
    setDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectOption = (key: 'brand' | 'model' | 'size', value: any) => {
    if (key === 'brand') {
      setSelectedBrand(value);
      setSelectedModel(null);
      setSelectedSize('');
    } else if (key === 'model') {
      setSelectedModel(value);
      setSelectedSize('');
    } else {
      setSelectedSize(value);
    }
    setDropdowns({ brand: false, model: false, size: false });
  };

  const renderDropdown = (
    key: 'brand' | 'model' | 'size',
    label: string,
    options: any[],
    selected: any
  ) => (
    <div className="relative">
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <button
        onClick={() => toggleDropdown(key)}
        className="w-full p-4 bg-white/10 border-2 border-white/20 rounded-xl text-left flex items-center justify-between hover:bg-white/15 transition-colors"
      >
        <span className={selected ? 'text-white' : 'text-gray-500'}>
          {selected?.name || selected || `Select ${label}`}
        </span>
        <ChevronDown className={`transition-transform ${dropdowns[key] ? 'rotate-180' : ''}`} />
      </button>
      
      {dropdowns[key] && options.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white/10 border-2 border-white/20 rounded-xl max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={key === 'brand' ? option.id : key === 'model' ? option.id : option}
              onClick={() => selectOption(key, option)}
              className="w-full p-3 text-left hover:bg-purple-600/30 transition-colors border-b border-white/5 last:border-0"
            >
              {key === 'brand' || key === 'model' ? option.name : option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Get data for selected product - exact match on brand + model + size
  const productData = selectedBrand && selectedModel && selectedSize 
    ? getProductData(selectedBrand.name, selectedModel.name, selectedSize) 
    : null;

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🛏️ Mattress Competitor Comparator
          </h1>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
            <Clock size={14} />
            Last updated: {formatTimestamp(competitorData.timestamp)}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Cascading Dropdowns */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Select Your Mattress</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderDropdown('brand', 'Brand', brands, selectedBrand)}
            {renderDropdown('model', 'Model', availableModels, selectedModel)}
            {renderDropdown('size', 'Size', availableSizes, selectedSize)}
          </div>
        </section>

        {/* Comparison Results */}
        {selectedBrand && selectedModel && selectedSize && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {selectedBrand.name} {selectedModel.name} - {selectedSize}
              </h2>
            </div>

            {productData ? (
              <>
                {/* Mattress Firm with real data */}
                <div className="bg-purple-600/20 rounded-xl p-4 mb-6 border border-purple-500/30">
                  <h3 className="font-bold text-purple-400 mb-3">Mattress Firm</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <div className="text-gray-400 text-xs">Price</div>
                      <div className="text-xl font-bold text-purple-400">${productData.mfPrice.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Financing</div>
                      <div className="text-xl font-bold text-green-400">{policies['Mattress Firm'].trialPeriod.includes('120') ? '0% APR' : 'Varies'}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Term</div>
                      <div className="text-xl font-bold text-white">48 mo</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Warranty</div>
                      <div className="text-xl font-bold text-white">10 years</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Delivery</div>
                      <div className="text-xl font-bold text-white">7 days</div>
                    </div>
                  </div>
                </div>

                {/* Competitors */}
                <div className="space-y-4">
                  {Object.entries(competitorInfo).map(([compId, info]) => {
                    const compDataItem = productData.competitors[compId];
                    const compName = info.name;
                    
                    if (!compDataItem) {
                      // No data for this competitor
                      return (
                        <div key={compId} className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                          <div className="bg-white/10 px-4 py-3 flex items-center gap-3">
                            <span className="font-semibold">{compName}</span>
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs font-bold rounded-full">
                              No data available
                            </span>
                          </div>
                        </div>
                      );
                    }
                    
                    const isWin = compDataItem.found && compDataItem.price && productData.mfPrice && compDataItem.price > productData.mfPrice;
                    const isTie = compDataItem.found && compDataItem.price && productData.mfPrice && compDataItem.price === productData.mfPrice;
                    const notAvailable = compDataItem.notAvailable;

                    return (
                      <div key={compId} className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                        <div className="bg-white/10 px-4 py-3 flex items-center gap-3">
                          <span className="font-semibold">{compName}</span>
                          {notAvailable && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full flex items-center gap-1">
                              <X size={12} /> {compDataItem.reason || "DOESN'T CARRY THIS MODEL"}
                            </span>
                          )}
                        </div>
                        
                        {compDataItem.found && compDataItem.price !== undefined ? (
                          <div className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                              {/* Price */}
                              <div className={`p-3 rounded-lg ${isWin ? 'bg-green-500/10 border border-green-500/30' : isTie ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-white/5'}`}>
                                <div className="text-gray-400 text-xs mb-1">💰 Price</div>
                                <div className="font-bold">${compDataItem.price.toLocaleString()}</div>
                                {isWin && (
                                  <span className="text-green-400 text-xs font-bold flex items-center gap-1 mt-1">
                                    <Check size={12} /> WE BEAT THEM
                                  </span>
                                )}
                                {isTie && (
                                  <span className="text-blue-400 text-xs font-bold flex items-center gap-1 mt-1">
                                    <Check size={12} /> WE MATCH THEM
                                  </span>
                                )}
                                {!isWin && !isTie && (
                                  <span className="text-red-400 text-xs mt-1">Higher price</span>
                                )}
                              </div>

                              {/* Financing APR */}
                              <div className="p-3 rounded-lg bg-white/5">
                                <div className="text-gray-400 text-xs mb-1">💳 Financing APR</div>
                                <div className="font-bold text-gray-300">Varies</div>
                              </div>

                              {/* Financing Term */}
                              <div className="p-3 rounded-lg bg-white/5">
                                <div className="text-gray-400 text-xs mb-1">📅 Term</div>
                                <div className="font-bold text-gray-300">Varies</div>
                              </div>

                              {/* Warranty */}
                              <div className="p-3 rounded-lg bg-white/5">
                                <div className="text-gray-400 text-xs mb-1">🛡️ Warranty</div>
                                <div className="font-bold text-gray-300">Varies</div>
                              </div>

                              {/* Delivery */}
                              <div className="p-3 rounded-lg bg-white/5">
                                <div className="text-gray-400 text-xs mb-1">🚚 Delivery</div>
                                <div className="font-bold text-gray-300">Varies</div>
                              </div>
                            </div>
                          </div>
                        ) : notAvailable ? (
                          <div className="p-4 text-gray-400 text-center">
                            This competitor does not carry this model.
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* Summary Footer */}
                <div className="mt-6 p-4 bg-purple-600/20 rounded-xl border border-purple-500/30">
                  <h3 className="font-bold text-purple-400 mb-2">Why Buy From Mattress Firm?</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• {policies['Mattress Firm'].financingAPR || '0% APR'} financing available on most models</li>
                    <li>• Price match guarantee — we beat competitor prices</li>
                    <li>• {policies['Mattress Firm'].deliveryFee}</li>
                    <li>• {policies['Mattress Firm'].warranty}</li>
                    <li>• {policies['Mattress Firm'].trialPeriod}</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-purple-600/20 rounded-xl p-4 mb-6 border border-purple-500/30">
                <div className="text-center py-4">
                  <p className="text-purple-400 font-semibold">Not available at Mattress Firm</p>
                  <p className="text-gray-400 text-sm mt-1">This product/size combination is not carried by Mattress Firm.</p>
                </div>
              </div>
            )}
          </section>
        )}

        {!(selectedBrand && selectedModel && selectedSize) && (
          <div className="text-center py-12 text-gray-400">
            <p>Select a brand, model, and size above to compare prices</p>
          </div>
        )}

        {/* Policy Comparison Section */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Retailer Policies Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Retailer</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Delivery Time</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Delivery Fee</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Trial Period</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Warranty</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(policies).map(([retailer, policy], index) => (
                  <tr 
                    key={retailer} 
                    className={`border-b border-white/5 ${retailer === 'Mattress Firm' ? 'bg-purple-600/10' : ''}`}
                  >
                    <td className={`py-3 px-4 font-semibold ${retailer === 'Mattress Firm' ? 'text-purple-400' : 'text-white'}`}>
                      {retailer === 'Mattress Firm' && '🏠 '}{retailer}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{policy.deliveryTime}</td>
                    <td className="py-3 px-4 text-gray-300">{policy.deliveryFee}</td>
                    <td className="py-3 px-4 text-gray-300">{policy.trialPeriod}</td>
                    <td className="py-3 px-4 text-gray-300">{policy.warranty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm flex items-center justify-center gap-2">
        <RefreshCw size={14} />
        <p>Data refreshes daily at 6:00 AM</p>
      </footer>
    </div>
  );
}

export default App;

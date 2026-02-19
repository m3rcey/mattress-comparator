import { useState, useMemo } from 'react';
import { Check, X, ChevronDown, Clock, RefreshCw } from 'lucide-react';
import { brands, competitors, type Brand, type Model } from './data/products';

// Generate mock competitor data for demo
const generateMockData = (brand: Brand, model: Model, size: string) => {
  const basePrice = 1000 + Math.random() * 2500;
  return competitors.map(comp => ({
    id: comp.id,
    name: comp.name,
    hasData: Math.random() > 0.3, // 70% chance competitor has the product
    price: basePrice + (Math.random() * 500 - 250),
    financingAPR: Math.random() > 0.5 ? 0 : Math.random() * 15,
    financingTerm: Math.random() > 0.3 ? 36 : 24,
    warrantyYears: Math.floor(Math.random() * 10) + 5,
    deliveryDays: Math.floor(Math.random() * 14) + 3
  }));
};

function App() {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  const [isDropdownOpen, setIsDropdownOpen] = {
    brand: false,
    model: false,
    size: false
  };

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

  const comparisonData = useMemo(() => {
    if (!selectedBrand || !selectedModel || !selectedSize) return null;
    return generateMockData(selectedBrand, selectedModel, selectedSize);
  }, [selectedBrand, selectedModel, selectedSize]);

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

  const getWinner = (mfValue: number, compValue: number | undefined, lowerIsBetter: boolean) => {
    if (compValue === undefined) return 'tie';
    if (lowerIsBetter) {
      return mfValue <= compValue ? 'mf' : 'comp';
    }
    return mfValue >= compValue ? 'mf' : 'comp';
  };

  const formatValue = (value: number | undefined, unit: string) => {
    if (value === undefined) return 'N/A';
    if (unit === '$') return `$${value.toLocaleString()}`;
    if (unit === '%') return `${value}% APR`;
    if (unit === 'months') return `${value} months`;
    if (unit === 'years') return `${value} years`;
    if (unit === 'days') return `${value} days`;
    return value.toString();
  };

  // MF baseline values (mock - would come from product data)
  const mfPrice = 1999;
  const mfFinancingAPR = 0;
  const mfFinancingTerm = 48;
  const mfWarrantyYears = 10;
  const mfDeliveryDays = 7;

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
          {options.map((option, idx) => (
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
            Last updated: Today at 6:00 AM
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
        {comparisonData && selectedBrand && selectedModel && selectedSize && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {selectedBrand.name} {selectedModel.name} - {selectedSize}
              </h2>
            </div>

            {/* Mattress Firm Baseline */}
            <div className="bg-purple-600/20 rounded-xl p-4 mb-6 border border-purple-500/30">
              <h3 className="font-bold text-purple-400 mb-3">Mattress Firm</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <div className="text-gray-400 text-xs">Price</div>
                  <div className="text-xl font-bold text-purple-400">${mfPrice.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Financing</div>
                  <div className="text-xl font-bold text-green-400">0% APR</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Term</div>
                  <div className="text-xl font-bold text-white">{mfFinancingTerm} mo</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Warranty</div>
                  <div className="text-xl font-bold text-white">{mfWarrantyYears} years</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Delivery</div>
                  <div className="text-xl font-bold text-white">{mfDeliveryDays} days</div>
                </div>
              </div>
            </div>

            {/* Competitors */}
            <div className="space-y-4">
              {comparisonData.map((comp: any) => (
                <div key={comp.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                  <div className="bg-white/10 px-4 py-3 flex items-center gap-3">
                    <span className="font-semibold">{comp.name}</span>
                    {!comp.hasData && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full flex items-center gap-1">
                        <X size={12} /> DOESN'T CARRY THIS
                      </span>
                    )}
                  </div>
                  
                  {comp.hasData ? (
                    <div className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {/* Price */}
                        <div className={`p-3 rounded-lg ${getWinner(mfPrice, comp.price, true) === 'mf' ? 'bg-green-500/10 border border-green-500/30' : 'bg-white/5'}`}>
                          <div className="text-gray-400 text-xs mb-1">💰 Price</div>
                          <div className="font-bold">{formatValue(comp.price, '$')}</div>
                          {getWinner(mfPrice, comp.price, true) === 'mf' && (
                            <span className="text-green-400 text-xs font-bold flex items-center gap-1 mt-1">
                              <Check size={12} /> WE BEAT THEM
                            </span>
                          )}
                          {getWinner(mfPrice, comp.price, true) === 'comp' && (
                            <span className="text-red-400 text-xs mt-1">Higher</span>
                          )}
                        </div>

                        {/* Financing APR */}
                        <div className={`p-3 rounded-lg ${getWinner(mfFinancingAPR, comp.financingAPR, true) === 'mf' ? 'bg-green-500/10 border border-green-500/30' : 'bg-white/5'}`}>
                          <div className="text-gray-400 text-xs mb-1">💳 Financing APR</div>
                          <div className="font-bold">{formatValue(comp.financingAPR, '%')}</div>
                          {getWinner(mfFinancingAPR, comp.financingAPR, true) === 'mf' && (
                            <span className="text-green-400 text-xs font-bold flex items-center gap-1 mt-1">
                              <Check size={12} /> WE BEAT THEM
                            </span>
                          )}
                          {mfFinancingAPR === comp.financingAPR && (
                            <span className="text-blue-400 text-xs mt-1">WE MATCH</span>
                          )}
                        </div>

                        {/* Financing Term */}
                        <div className={`p-3 rounded-lg ${getWinner(mfFinancingTerm, comp.financingTerm, false) === 'mf' ? 'bg-green-500/10 border border-green-500/30' : 'bg-white/5'}`}>
                          <div className="text-gray-400 text-xs mb-1">📅 Term</div>
                          <div className="font-bold">{formatValue(comp.financingTerm, 'months')}</div>
                          {getWinner(mfFinancingTerm, comp.financingTerm, false) === 'mf' && (
                            <span className="text-green-400 text-xs font-bold flex items-center gap-1 mt-1">
                              <Check size={12} /> WE BEAT THEM
                            </span>
                          )}
                          {mfFinancingTerm === comp.financingTerm && (
                            <span className="text-blue-400 text-xs mt-1">WE MATCH</span>
                          )}
                        </div>

                        {/* Warranty */}
                        <div className={`p-3 rounded-lg ${getWinner(mfWarrantyYears, comp.warrantyYears, false) === 'mf' ? 'bg-green-500/10 border border-green-500/30' : 'bg-white/5'}`}>
                          <div className="text-gray-400 text-xs mb-1">🛡️ Warranty</div>
                          <div className="font-bold">{formatValue(comp.warrantyYears, 'years')}</div>
                          {getWinner(mfWarrantyYears, comp.warrantyYears, false) === 'mf' && (
                            <span className="text-green-400 text-xs font-bold flex items-center gap-1 mt-1">
                              <Check size={12} /> WE BEAT THEM
                            </span>
                          )}
                          {mfWarrantyYears === comp.warrantyYears && (
                            <span className="text-blue-400 text-xs mt-1">WE MATCH</span>
                          )}
                        </div>

                        {/* Delivery */}
                        <div className={`p-3 rounded-lg ${getWinner(mfDeliveryDays, comp.deliveryDays, true) === 'mf' ? 'bg-green-500/10 border border-green-500/30' : 'bg-white/5'}`}>
                          <div className="text-gray-400 text-xs mb-1">🚚 Delivery</div>
                          <div className="font-bold">{formatValue(comp.deliveryDays, 'days')}</div>
                          {getWinner(mfDeliveryDays, comp.deliveryDays, true) === 'mf' && (
                            <span className="text-green-400 text-xs font-bold flex items-center gap-1 mt-1">
                              <Check size={12} /> WE BEAT THEM
                            </span>
                          )}
                          {mfDeliveryDays === comp.deliveryDays && (
                            <span className="text-blue-400 text-xs mt-1">WE MATCH</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-gray-400 text-center">
                      This competitor does not carry this brand or model.
                    </div>
                  )}
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

        {!comparisonData && (
          <div className="text-center py-12 text-gray-400">
            <p>Select a brand, model, and size above to compare prices</p>
          </div>
        )}
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

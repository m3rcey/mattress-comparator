import { useState, useMemo } from 'react';
import { Check, X, ChevronDown, Clock, RefreshCw } from 'lucide-react';
import { brands, competitors, type Brand, type Model } from './data/products';

// Updated competitors list
const competitorInfo: { [key: string]: { name: string } } = {
  'ashley': { name: 'Ashley Furniture' },
  'macys': { name: "Macy's" },
  'costco': { name: 'Costco' },
  'muellers': { name: "Mueller's Furniture" },
  'carol-house': { name: 'Carol House Furniture' },
  'wayfair': { name: 'Wayfair' },
  'bbb': { name: 'Bed Bath & Beyond' },
  'jcpenney': { name: 'JCPenney' }
};

// Mock MF baseline (in production, this comes from product data)
const getMFBaseline = (brand: string) => {
  const baselines: { [key: string]: any } = {
    'Tempur-Pedic': { price: 2499, financingAPR: 0, financingTerm: 48, warrantyYears: 10, deliveryDays: 7 },
    'Purple': { price: 1599, financingAPR: 0, financingTerm: 48, warrantyYears: 10, deliveryDays: 7 },
    'Nectar': { price: 998, financingAPR: 0, financingTerm: 48, warrantyYears: 10, deliveryDays: 7 },
    'Beautyrest': { price: 1099, financingAPR: 0, financingTerm: 48, warrantyYears: 10, deliveryDays: 7 },
    'Serta': { price: 899, financingAPR: 0, financingTerm: 48, warrantyYears: 10, deliveryDays: 7 },
    'Stearns & Foster': { price: 1999, financingAPR: 0, financingTerm: 48, warrantyYears: 10, deliveryDays: 7 },
    'Sealy': { price: 1199, financingAPR: 0, financingTerm: 48, warrantyYears: 10, deliveryDays: 7 }
  };
  return baselines[brand] || { price: 1299, financingAPR: 0, financingTerm: 48, warrantyYears: 10, deliveryDays: 7 };
};

// Filter out Sleepy's from brands
const filteredBrands = brands.filter(b => b.id !== 'sleepys');

function App() {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
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

  // Mock competitor data for demo (in production, load from competitor-data.json)
  const mockCompetitorData = {
    'ashley': { price: 1599, found: true },
    'macys': { price: 1899, found: true },
    'costco': { notAvailable: true, reason: "doesn't carry this model", found: false },
    'muellers': { price: 1449, found: true },
    'carol-house': { notAvailable: true, reason: "doesn't carry this model", found: false },
    'wayfair': { price: 1299, found: true },
    'bbb': { notAvailable: true, reason: "doesn't carry this model", found: false },
    'jcpenney': { price: 1199, found: true }
  };

  const mfBaseline = selectedBrand ? getMFBaseline(selectedBrand.name) : null;

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
            {renderDropdown('brand', 'Brand', filteredBrands, selectedBrand)}
            {renderDropdown('model', 'Model', availableModels, selectedModel)}
            {renderDropdown('size', 'Size', availableSizes, selectedSize)}
          </div>
        </section>

        {/* Comparison Results */}
        {selectedBrand && selectedModel && selectedSize && mfBaseline && (
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
                  <div className="text-xl font-bold text-purple-400">${mfBaseline.price.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Financing</div>
                  <div className="text-xl font-bold text-green-400">0% APR</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Term</div>
                  <div className="text-xl font-bold text-white">{mfBaseline.financingTerm} mo</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Warranty</div>
                  <div className="text-xl font-bold text-white">{mfBaseline.warrantyYears} years</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Delivery</div>
                  <div className="text-xl font-bold text-white">{mfBaseline.deliveryDays} days</div>
                </div>
              </div>
            </div>

            {/* Competitors */}
            <div className="space-y-4">
              {Object.entries(mockCompetitorData).map(([compId, compData]: [string, any]) => {
                const compName = competitorInfo[compId]?.name || compId;
                const isWin = compData.found && compData.price > mfBaseline.price;
                const isTie = compData.found && compData.price === mfBaseline.price;
                const notAvailable = compData.notAvailable;

                return (
                  <div key={compId} className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                    <div className="bg-white/10 px-4 py-3 flex items-center gap-3">
                      <span className="font-semibold">{compName}</span>
                      {notAvailable && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full flex items-center gap-1">
                          <X size={12} /> {compData.reason || "DOESN'T CARRY THIS MODEL"}
                        </span>
                      )}
                    </div>
                    
                    {compData.found ? (
                      <div className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {/* Price */}
                          <div className={`p-3 rounded-lg ${isWin ? 'bg-green-500/10 border border-green-500/30' : isTie ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-white/5'}`}>
                            <div className="text-gray-400 text-xs mb-1">💰 Price</div>
                            <div className="font-bold">${compData.price?.toLocaleString()}</div>
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
                          </div>

                          {/* Financing APR */}
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-gray-400 text-xs mb-1">💳 Financing APR</div>
                            <div className="font-bold">Varies</div>
                          </div>

                          {/* Financing Term */}
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-gray-400 text-xs mb-1">📅 Term</div>
                            <div className="font-bold">Varies</div>
                          </div>

                          {/* Warranty */}
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-gray-400 text-xs mb-1">🛡️ Warranty</div>
                            <div className="font-bold">Varies</div>
                          </div>

                          {/* Delivery */}
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-gray-400 text-xs mb-1">🚚 Delivery</div>
                            <div className="font-bold">Varies</div>
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
                <li>• 0% APR financing available on most models</li>
                <li>• Price match guarantee — we beat competitor prices</li>
                <li>• Free delivery & setup on most mattresses</li>
                <li>• 10+ year warranties on premium mattresses</li>
                <li>• 120-night sleep trial — risk free</li>
              </ul>
            </div>
          </section>
        )}

        {!(selectedBrand && selectedModel && selectedSize) && (
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

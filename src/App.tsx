import { useState, useMemo, useEffect, useRef } from 'react';
import { Check, X, ChevronDown, Clock, RefreshCw, Bed, Tag, Ruler, Crown, TrendingDown, TrendingUp, Minus } from 'lucide-react';
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

// Competitor info
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

// Animated counter
function AnimatedPrice({ value, prefix = '$' }: { value: number; prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayValue(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, value]);

  return <span ref={ref}>{prefix}{displayValue.toLocaleString()}</span>;
}

function App() {
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [dropdowns, setDropdowns] = useState({
    brand: false,
    model: false,
    size: false
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const availableModels = useMemo(() => {
    return selectedBrand?.models || [];
  }, [selectedBrand]);

  const availableSizes = useMemo(() => {
    return selectedModel?.sizes || [];
  }, [selectedModel]);

  const toggleDropdown = (key: 'brand' | 'model' | 'size') => {
    setDropdowns(prev => ({
      brand: key === 'brand' ? !prev.brand : false,
      model: key === 'model' ? !prev.model : false,
      size: key === 'size' ? !prev.size : false,
    }));
  };

  const closeAllDropdowns = () => {
    setDropdowns({ brand: false, model: false, size: false });
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
    closeAllDropdowns();
  };

  const renderDropdown = (
    key: 'brand' | 'model' | 'size',
    label: string,
    options: any[],
    selected: any,
    icon: React.ReactNode
  ) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <button
        onClick={() => toggleDropdown(key)}
        className={`w-full min-h-[56px] p-4 bg-gradient-to-b from-white/10 to-white/5 border-2 rounded-xl text-left flex items-center justify-between transition-all duration-200 hover:from-white/15 hover:to-white/10 ${
          dropdowns[key] 
            ? 'border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.15)]' 
            : 'border-white/20 hover:border-white/30'
        }`}
      >
        <span className={`text-lg font-medium ${selected ? 'text-white' : 'text-gray-500'}`}>
          {selected?.name || selected || `Select ${label}`}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${dropdowns[key] ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown overlay - fixed for mobile */}
      {dropdowns[key] && options.length > 0 && (
        <>
          {/* Click outside to close */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={closeAllDropdowns}
          />
          {/* Dropdown options */}
          <div className="absolute z-50 w-full mt-2 bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-amber-400/30 rounded-xl shadow-2xl max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((option, idx) => (
              <button
                key={key === 'brand' ? option.id : key === 'model' ? option.id : option}
                onClick={() => selectOption(key, option)}
                className="w-full p-4 text-left text-lg font-medium text-gray-200 hover:bg-amber-500/20 hover:text-white transition-colors border-b border-white/5 last:border-0"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                {key === 'brand' || key === 'model' ? option.name : option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // Get data for selected product
  const productData = selectedBrand && selectedModel && selectedSize 
    ? getProductData(selectedBrand.name, selectedModel.name, selectedSize) 
    : null;

  return (
    <div className="min-h-screen pb-8 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/95 backdrop-blur-xl border-b border-amber-500/20 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent tracking-tight">
                🛏️ Mattress Price Comparator
              </h1>
              <p className="text-gray-400 text-sm mt-1 font-medium">
                Compare prices across 8 retailers instantly
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
              <Clock size={14} className="text-amber-400" />
              <span className="text-gray-400 text-xs font-medium">
                {formatTimestamp(competitorData.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-8">
        {/* Selection Panel */}
        <section className={`mb-10 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="neu-raised rounded-2xl p-6 md:p-8 border border-amber-500/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Crown className="w-6 h-6 text-amber-400" />
              Select Your Mattress
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderDropdown('brand', 'Brand', brands, selectedBrand, <Bed className="w-4 h-4 text-amber-400" />)}
              {renderDropdown('model', 'Model', availableModels, selectedModel, <Tag className="w-4 h-4 text-amber-400" />)}
              {renderDropdown('size', 'Size', availableSizes, selectedSize, <Ruler className="w-4 h-4 text-amber-400" />)}
            </div>
          </div>
        </section>

        {/* Comparison Results */}
        {selectedBrand && selectedModel && selectedSize && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {selectedBrand.name} <span className="text-amber-400">{selectedModel.name}</span>
                <span className="text-gray-500 text-lg font-normal ml-2">— {selectedSize}</span>
              </h2>
            </div>

            {productData ? (
              <>
                {/* Mattress Firm Hero Card */}
                <div className="relative mb-8 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
                  <div className="relative bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/90 border-2 border-amber-400/40 rounded-2xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                          <Crown className="w-6 h-6 text-gray-900" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-white">Mattress Firm</h3>
                          <p className="text-amber-400 text-sm font-medium">Our Price</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl md:text-5xl font-black text-amber-400">
                          <AnimatedPrice value={productData.mfPrice} />
                        </div>
                        <div className="text-green-400 text-sm font-bold flex items-center justify-end gap-1">
                          <Check size={14} /> BEST PRICE GUARANTEE
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                      <div className="text-center">
                        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Financing</div>
                        <div className="text-xl font-bold text-green-400">0% APR</div>
                        <div className="text-gray-500 text-xs">Up to 48 months</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Trial</div>
                        <div className="text-xl font-bold text-white">120 nights</div>
                        <div className="text-gray-500 text-xs">21-night min</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Warranty</div>
                        <div className="text-xl font-bold text-white">10 years</div>
                        <div className="text-gray-500 text-xs">Full coverage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Delivery</div>
                        <div className="text-xl font-bold text-white">FREE</div>
                        <div className="text-gray-500 text-xs">White glove</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Competitors */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-4">Competitor Prices</h3>
                  {Object.entries(competitorInfo).map(([compId, info], idx) => {
                    const compDataItem = productData.competitors[compId];
                    const compName = info.name;
                    
                    if (!compDataItem) {
                      return (
                        <div key={compId} className="neu-inset rounded-xl overflow-hidden border border-white/5 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 50}ms` }}>
                          <div className="bg-white/5 px-6 py-4 flex items-center justify-between">
                            <span className="text-lg font-bold text-white">{compName}</span>
                            <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-sm font-bold rounded-full">
                              No data
                            </span>
                          </div>
                        </div>
                      );
                    }
                    
                    const isWin = compDataItem.found && compDataItem.price && productData.mfPrice && compDataItem.price > productData.mfPrice;
                    const isTie = compDataItem.found && compDataItem.price && productData.mfPrice && compDataItem.price === productData.mfPrice;
                    const isLose = compDataItem.found && compDataItem.price && productData.mfPrice && compDataItem.price < productData.mfPrice;
                    const notAvailable = compDataItem.notAvailable;
                    const priceDiff = compDataItem.price && productData.mfPrice ? compDataItem.price - productData.mfPrice : 0;

                    // Card styling based on result
                    const cardClass = isWin 
                      ? 'bg-gradient-to-r from-green-900/40 to-green-800/20 border-green-500/40' 
                      : isTie 
                        ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/20 border-blue-500/40'
                        : isLose
                          ? 'bg-gradient-to-r from-red-900/30 to-red-800/20 border-red-500/30'
                          : 'bg-white/5 border-white/10';

                    const badgeClass = isWin
                      ? 'bg-green-500/20 text-green-400 border-green-500/40'
                      : isTie
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40';

                    return (
                      <div key={compId} className={`neu-raised rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-[1.01] ${cardClass} animate-in fade-in slide-in-from-bottom-2`} style={{ animationDelay: `${idx * 50}ms` }}>
                        <div className="bg-white/5 px-6 py-4 flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-white">{compName}</span>
                            {notAvailable && (
                              <span className="ml-3 px-3 py-1 bg-red-500/20 text-red-400 text-sm font-bold rounded-full flex items-center gap-1 inline-flex">
                                <X size={12} /> {compDataItem.reason || "Unavailable"}
                              </span>
                            )}
                          </div>
                          {isWin && (
                            <span className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 ${badgeClass} border`}>
                              <TrendingDown size={16} /> WE BEAT THEM
                            </span>
                          )}
                          {isTie && (
                            <span className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 ${badgeClass} border`}>
                              <Minus size={16} /> WE MATCH THEM
                            </span>
                          )}
                          {isLose && (
                            <span className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 ${badgeClass} border`}>
                              <TrendingUp size={16} /> THEY'RE CHEAPER
                            </span>
                          )}
                        </div>
                        
                        {compDataItem.found && compDataItem.price !== undefined ? (
                          <div className="px-6 py-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-gray-400 text-sm mb-1">Their Price</div>
                                <div className="text-3xl font-black text-white">
                                  ${compDataItem.price.toLocaleString()}
                                </div>
                              </div>
                              <div className="text-right">
                                {priceDiff > 0 && (
                                  <div className="text-green-400 font-bold text-lg flex items-center gap-1">
                                    <TrendingDown size={18} /> Save ${priceDiff.toLocaleString()}
                                  </div>
                                )}
                                {priceDiff < 0 && (
                                  <div className="text-red-400 font-bold text-lg flex items-center gap-1">
                                    <TrendingUp size={18} /> +${Math.abs(priceDiff).toLocaleString()}
                                  </div>
                                )}
                                {priceDiff === 0 && (
                                  <div className="text-blue-400 font-bold text-lg flex items-center gap-1">
                                    <Minus size={18} /> Same price
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : notAvailable ? (
                          <div className="px-6 py-4 text-gray-500 text-center">
                            This retailer doesn't carry this model
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* Why Buy From MF */}
                <div className="neu-raised rounded-2xl p-6 md:p-8 border border-amber-500/20">
                  <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                    <Crown className="w-5 h-5" /> Why Buy From Mattress Firm?
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: '💰', text: 'Price match guarantee — we beat any competitor' },
                      { icon: '💳', text: '0% APR financing up to 48 months' },
                      { icon: '🚚', text: policies['Mattress Firm'].deliveryFee },
                      { icon: '😴', text: policies['Mattress Firm'].trialPeriod },
                      { icon: '🛡️', text: '10-year full warranty included' },
                      { icon: '📞', text: 'Local experts — personalized service' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-gray-300">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="neu-raised rounded-2xl p-8 border border-amber-500/20 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <X className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-amber-400 mb-2">Not Available at Mattress Firm</h3>
                <p className="text-gray-400">This product/size combination is not carried by Mattress Firm.</p>
              </div>
            )}
          </section>
        )}

        {!productData && !(selectedBrand && selectedModel && selectedSize) && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center">
              <Bed className="w-10 h-10 text-amber-400" />
            </div>
            <p className="text-xl text-gray-400 font-medium">Select a brand, model, and size above to compare prices</p>
          </div>
        )}

        {/* Policy Comparison */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Tag className="w-6 h-6 text-amber-400" />
            Retailer Policies Comparison
          </h2>
          
          <div className="neu-raised rounded-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800 to-gray-900">
                    <th className="text-left py-4 px-6 text-gray-400 font-bold uppercase tracking-wider">Retailer</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-bold uppercase tracking-wider">Delivery</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-bold uppercase tracking-wider">Delivery Fee</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-bold uppercase tracking-wider">Trial</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-bold uppercase tracking-wider">Warranty</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(policies).map(([retailer, policy], index) => (
                    <tr 
                      key={retailer} 
                      className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                        retailer === 'Mattress Firm' ? 'bg-gradient-to-r from-amber-600/10 to-transparent' : ''
                      }`}
                    >
                      <td className={`py-4 px-6 font-bold ${retailer === 'Mattress Firm' ? 'text-amber-400 text-lg' : 'text-white'}`}>
                        {retailer === 'Mattress Firm' && '👑 '}{retailer}
                      </td>
                      <td className="py-4 px-6 text-gray-300">{policy.deliveryTime}</td>
                      <td className="py-4 px-6 text-gray-300">{policy.deliveryFee}</td>
                      <td className="py-4 px-6 text-gray-300">{policy.trialPeriod}</td>
                      <td className="py-4 px-6 text-gray-300">{policy.warranty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative mt-16 py-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <RefreshCw size={14} />
            <p className="font-medium">Data refreshes daily at 6:00 AM CT</p>
          </div>
          <p className="text-gray-600 text-sm mt-2">© 2026 Mattress Price Comparator • Built for Mattress Firm Sales</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

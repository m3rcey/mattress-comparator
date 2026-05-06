import { useState, useMemo, useEffect } from 'react';
import { Check, X, ChevronDown, Clock, RefreshCw, Bed, Tag, Ruler, DollarSign, TrendingDown } from 'lucide-react';
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
  salePrice?: number;  // NEW - optional sale price
  competitors: ProductCompetitors;
}

interface PolicyData {
  deliveryTime: string;
  deliveryFee: string;
  trialPeriod: string;
  warranty: string;
}

// All competitor IDs including Mattress Firm
const allRetailers = [
  { id: 'mf', name: 'Mattress Firm' },
  { id: 'ashley', name: 'Ashley Furniture' },
  { id: 'macys', name: "Macy's" },
  { id: 'costco', name: 'Costco' },
  { id: 'muellers', name: "Mueller's Furniture" },
  { id: 'carol-house', name: 'Carol House Furniture' },
  { id: 'wayfair', name: 'Wayfair' },
  { id: 'jcpenney', name: 'JCPenney' }
];

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
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Sale price toggle state - default to ON (showing sale prices)
  const [showSalePrice, setShowSalePrice] = useState(false);
  
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
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <button
        onClick={() => toggleDropdown(key)}
        className={`w-full min-h-[56px] p-4 bg-neutral-900 border-2 rounded-xl text-left flex items-center justify-between transition-all duration-200 hover:bg-gray-750 ${
          dropdowns[key] 
            ? 'border-amber-500 ring-2 ring-amber-500/20' 
            : 'border-neutral-700 hover:border-neutral-600'
        }`}
      >
        <span className={`text-lg font-medium ${selected ? 'text-white' : 'text-gray-500'}`}>
          {selected?.name || selected || `Select ${label}`}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${dropdowns[key] ? 'rotate-180' : ''}`} />
      </button>
      
      {dropdowns[key] && options.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto">
          {options.map((option, idx) => (
            <button
              key={key === 'brand' ? option.id : key === 'model' ? option.id : option}
              onClick={() => selectOption(key, option)}
              className="w-full p-4 text-left text-lg font-medium text-white hover:bg-amber-500/20 active:bg-amber-500/30 transition-colors border-b border-neutral-800 last:border-0"
            >
              {key === 'brand' || key === 'model' ? option.name : option}
            </button>
          ))}
        </div>
      )}
    </div>
  );


  const renderDropdownOverlay = () => {
    const openKey = dropdowns.brand ? 'brand' : dropdowns.model ? 'model' : dropdowns.size ? 'size' : null;
    if (!openKey) return null;
    const optionsMap: any = { brand: { options: brands, label: 'Brand' }, model: { options: availableModels, label: 'Model' }, size: { options: availableSizes, label: 'Size' } };
    const { options, label } = optionsMap[openKey];
    if (!options.length) return null;
    return (
      <div className="fixed inset-0 z-[100]" onClick={() => closeAllDropdowns()}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 max-h-[60vh] bg-neutral-900 rounded-t-2xl shadow-2xl overflow-hidden" onClick={(e: any) => e.stopPropagation()}>
          <div className="sticky top-0 bg-neutral-900 border-b border-neutral-700 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Select {label}</h3>
            <button onClick={() => closeAllDropdowns()} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
          </div>
          <div className="overflow-y-auto max-h-[calc(60vh-60px)]">
            {options.map((option: any) => (
              <button key={openKey === 'size' ? option : option.id} onClick={() => selectOption(openKey, option)} className="w-full p-5 text-left text-lg font-medium text-white hover:bg-amber-500/20 active:bg-amber-500/30 transition-colors border-b border-neutral-800 last:border-0">
                {openKey === 'size' ? option : option.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  // Get data for selected product
  const productData = selectedBrand && selectedModel && selectedSize 
    ? getProductData(selectedBrand.name, selectedModel.name, selectedSize) 
    : null;

  // Determine which MF price to use based on toggle
  const mfDisplayPrice = productData && showSalePrice && productData.salePrice 
    ? productData.salePrice 
    : productData?.mfPrice ?? null;
  
  const hasSalePrice = productData && !!productData.salePrice && showSalePrice;
  const savingsAmount = productData?.salePrice && productData.mfPrice 
    ? productData.mfPrice - productData.salePrice 
    : 0;

  // Build retailer list with prices for comparison
  const retailerPrices = useMemo(() => {
    if (!productData) return [];
    
    const prices: { id: string; name: string; price: number | null; retailPrice?: number | null; found: boolean; notAvailable: boolean; reason?: string }[] = [];
    
    // Add Mattress Firm - use display price based on toggle
    prices.push({
      id: 'mf',
      name: 'Mattress Firm',
      price: mfDisplayPrice,
      retailPrice: productData.mfPrice,
      found: true,
      notAvailable: false
    });
    
    // Add other retailers - use sale price when toggle is on
    Object.entries(productData.competitors).forEach(([compId, compData]) => {
      const retailer = allRetailers.find(r => r.id === compId);
      if (retailer) {
        const retailPrice = compData.price ?? null;
        const displayPrice = showSalePrice && productData.salePrice && retailPrice
          ? productData.salePrice
          : retailPrice;
        prices.push({
          id: compId,
          name: retailer.name,
          price: displayPrice,
          retailPrice: retailPrice,
          found: compData.found ?? false,
          notAvailable: compData.notAvailable ?? false,
          reason: compData.reason
        });
      }
    });
    
    // Sort by price (lowest first), unavailable at end
    return prices.sort((a, b) => {
      if (a.notAvailable && !b.notAvailable) return 1;
      if (!a.notAvailable && b.notAvailable) return -1;
      if (a.price === null && b.price !== null) return 1;
      if (a.price !== null && b.price === null) return -1;
      if (a.price === null && b.price === null) return 0;
      return (a.price ?? 0) - (b.price ?? 0);
    });
  }, [productData, mfDisplayPrice, showSalePrice]);

  // Find lowest price
  const lowestPrice = useMemo(() => {
    const available = retailerPrices.filter(r => !r.notAvailable && r.price !== null);
    return available.length > 0 ? Math.min(...available.map(r => r.price as number)) : null;
  }, [retailerPrices]);

  return (
    <div className="min-h-screen pb-8 bg-black">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      {renderDropdownOverlay()}

      {/* Header */}
      <header className="relative bg-black border-b border-neutral-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                RestRadar
              </h1>
              <p className="text-gray-500 text-sm mt-1 font-medium">
                Compare prices across retailers instantly
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800 rounded-lg border border-neutral-700">
              <Clock size={14} className="text-amber-500" />
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
          <div className="bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-800">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-amber-500" />
              Select Your Mattress
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderDropdown('brand', 'Brand', brands, selectedBrand, <Bed className="w-4 h-4 text-amber-500" />)}
              {renderDropdown('model', 'Model', availableModels, selectedModel, <Tag className="w-4 h-4 text-amber-500" />)}
              {renderDropdown('size', 'Size', availableSizes, selectedSize, <Ruler className="w-4 h-4 text-amber-500" />)}
            </div>
          </div>
        </section>

        {/* Comparison Results */}
        {selectedBrand && selectedModel && selectedSize && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {selectedBrand.name} <span className="text-amber-500">{selectedModel.name}</span>
                <span className="text-gray-500 text-lg font-normal ml-2">— {selectedSize}</span>
              </h2>
            </div>

            {productData ? (
              <>
                {/* Sale Price Toggle - appears when viewing a product comparison */}
                <div className="mb-6 flex items-center gap-3 p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                  <div className="flex rounded-lg overflow-hidden border border-neutral-700">
                    <button
                      onClick={() => setShowSalePrice(true)}
                      className={`px-4 py-2 text-sm font-semibold transition-colors ${
                        showSalePrice ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-gray-400'
                      }`}
                    >Sale</button>
                    <button
                      onClick={() => setShowSalePrice(false)}
                      className={`px-4 py-2 text-sm font-semibold transition-colors ${
                        !showSalePrice ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-gray-400'
                      }`}
                    >Retail</button>
                  </div>
                  {hasSalePrice && showSalePrice && (
                    <span className="ml-auto px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-bold rounded-full">
                      Save ${savingsAmount.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Retailer Comparison Cards */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-bold text-gray-600 uppercase tracking-wider mb-4">Price Comparison</h3>
                  {retailerPrices.map((retailer, idx) => {
                    const policy = policies[retailer.name] || policies[retailer.name.replace(' Furniture', '')] || policies[retailer.name.replace(" Furniture", "")];
                    const isLowest = retailer.price !== null && retailer.price === lowestPrice && !retailer.notAvailable;
                    const priceDiff = retailer.price !== null && lowestPrice !== null ? retailer.price - lowestPrice : 0;

                    return (
                      <div 
                        key={retailer.id} 
                        className={`bg-neutral-900 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          isLowest ? 'border-emerald-500 bg-emerald-950/30' : 'border-neutral-700 hover:border-neutral-600'
                        }`}
                      >

                        <div className="bg-neutral-800 px-6 py-4 flex items-center justify-between border-b border-neutral-700">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-white">{retailer.name}</span>
                            {isLowest && (
                              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-full border border-emerald-500/40">
                                Lowest Price
                              </span>
                            )}
                            {hasSalePrice && !retailer.notAvailable && retailer.price !== null && (
                              <span className="px-3 py-1 bg-amber-500/100 text-white text-sm font-bold rounded-full">
                                SALE
                              </span>
                            )}
                          </div>
                          {retailer.notAvailable && (
                            <span className="px-3 py-1 bg-neutral-700 text-neutral-400 text-sm font-bold rounded-full flex items-center gap-1">
                              <X size={12} /> {retailer.reason || "Unavailable"}
                            </span>
                          )}
                        </div>
                        
                        {/* Content */}
                        {!retailer.notAvailable && retailer.price !== undefined ? (
                          <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                              {/* Price */}
                              <div>
                                <div className="text-gray-500 text-sm mb-1">Price</div>
                                <div className="text-3xl font-black text-white">
                                  ${retailer.price.toLocaleString()}
                                </div>
                                {/* Show strikethrough when sale is active */}
                                {hasSalePrice && retailer.retailPrice && (
                                  <div className="text-gray-500 text-sm line-through mt-1">
                                    Was ${retailer.retailPrice.toLocaleString()}
                                  </div>
                                )}
                                {priceDiff > 0 && (
                                  <div className="text-gray-400 text-sm mt-1">
                                    +${priceDiff.toLocaleString()} vs lowest
                                  </div>
                                )}
                                {priceDiff === 0 && isLowest && (
                                  <div className="text-emerald-400 text-sm mt-1">
                                    Best price
                                  </div>
                                )}
                              </div>

                              {/* Delivery Time */}
                              <div>
                                <div className="text-gray-500 text-sm mb-1">Delivery</div>
                                <div className="text-gray-300 font-medium text-sm">{policy?.deliveryTime || 'N/A'}</div>
                              </div>

                              {/* Delivery Fee */}
                              <div>
                                <div className="text-gray-500 text-sm mb-1">Delivery Fee</div>
                                <div className="text-gray-300 font-medium text-sm">{policy?.deliveryFee || 'N/A'}</div>
                              </div>

                              {/* Trial */}
                              <div>
                                <div className="text-gray-500 text-sm mb-1">Trial</div>
                                <div className="text-gray-300 font-medium text-sm">{policy?.trialPeriod || 'N/A'}</div>
                              </div>

                              {/* Warranty */}
                              <div>
                                <div className="text-gray-500 text-sm mb-1">Warranty</div>
                                <div className="text-gray-300 font-medium text-sm">{policy?.warranty || 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                        ) : retailer.notAvailable ? (
                          <div className="px-6 py-4 text-gray-500 text-center">
                            This retailer does not carry this model
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
                  <X className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
                <p className="text-gray-400">This product/size combination data not found.</p>
              </div>
            )}
          </section>
        )}

        {!productData && !(selectedBrand && selectedModel && selectedSize) && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neutral-800 flex items-center justify-center">
              <Bed className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-xl text-gray-500 font-medium">Select a brand, model, and size above to compare prices</p>
          </div>
        )}

        {/* Policy Comparison Table */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-amber-500" />
            Retailer Policies Comparison
          </h2>
          
          <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-neutral-800 border-b border-neutral-700">
                    <th className="text-left py-4 px-6 text-gray-500 text-xs font-bold uppercase tracking-wider">Retailer</th>
                    <th className="text-left py-4 px-6 text-gray-500 text-xs font-bold uppercase tracking-wider">Delivery</th>
                    <th className="text-left py-4 px-6 text-gray-500 text-xs font-bold uppercase tracking-wider">Delivery Fee</th>
                    <th className="text-left py-4 px-6 text-gray-500 text-xs font-bold uppercase tracking-wider">Trial</th>
                    <th className="text-left py-4 px-6 text-gray-500 text-xs font-bold uppercase tracking-wider">Warranty</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(policies).map(([retailer, policy], index) => (
                    <tr 
                      key={retailer} 
                      className={`border-b border-neutral-800 transition-colors hover:bg-neutral-800/50 ${
                        ''
                      }`}
                    >
                      <td className="py-4 px-6 font-bold text-white">
                        {retailer}
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-sm">{policy.deliveryTime}</td>
                      <td className="py-4 px-6 text-gray-400 text-sm">{policy.deliveryFee}</td>
                      <td className="py-4 px-6 text-gray-400 text-sm">{policy.trialPeriod}</td>
                      <td className="py-4 px-6 text-gray-400 text-sm">{policy.warranty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative mt-16 py-8 border-t border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <RefreshCw size={14} />
            <p className="font-medium">Data refreshes daily at 6:00 AM CT</p>
          </div>
          <p className="text-gray-400 text-sm mt-2">© 2026 RestRadar</p>
        </div>
      </footer>
    </div>
  );
}

export default App;// build 1777480386

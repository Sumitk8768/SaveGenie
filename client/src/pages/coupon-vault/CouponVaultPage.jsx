import { useEffect, useState } from 'react';
import { Search, Bell, AlertTriangle, Sparkles, Plus, Copy, Check, Pencil, Trash2, X } from 'lucide-react';
import { createCoupon, deleteCoupon, getCoupons, updateCoupon } from '../../entities/coupon/api/couponApi.js';
import { useCopyCoupon } from '../../features/coupon/copy-coupon/useCopyCoupon.js';

/*
const INITIAL_COUPONS = [
  { id: 1, merchant: 'NIKE', code: 'NIKE25', title: '25% OFF SITEWIDE', description: 'Applied to your next purchase of sportswear and accessories.', expiry: 'Expires in 2d', status: 'VERIFIED', statusType: 'verified', icon: '👟', category: 'Shopping' },
  { id: 2, merchant: 'APPLE', code: 'APPL150', title: '$150 CREDIT', description: 'Trade-in credit available for MacBook Pro upgrades.', expiry: 'Expires in 4h', status: 'EXPIRING SOON', statusType: 'expiring', icon: '🍏', category: 'Tech' },
  { id: 3, merchant: 'AMAZON', code: 'AMZN15PRIME', title: '$150 PRIME CREDIT', description: 'Reward for using Amazon Hub pickup points.', expiry: 'Expires in 15d', status: 'NEW', statusType: 'new', icon: '📦', category: 'Shopping' },
  { id: 4, merchant: 'SEPHORA', code: 'SEPHFREE', title: 'FREE SAMPLE KIT', description: 'Complimentary skin-care set with any $50+ purchase.', expiry: 'Expires in 7d', status: 'VERIFIED', statusType: 'verified', icon: '💄', category: 'Shopping' },
  { id: 5, merchant: 'AIRBNB', code: 'BNBSTAY50', title: '$50 STAY CREDIT', description: 'Valid for long-term stays over 14 nights.', expiry: 'Expires in 30d', status: 'TRAVEL', statusType: 'travel', icon: '🏠', category: 'Recent' },
];
*/

const getCouponStatus = (coupon) => {
  if (!coupon.isActive) return { status: 'INACTIVE', statusType: 'travel' };

  const daysUntilExpiry = (new Date(coupon.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
  if (daysUntilExpiry <= 1) return { status: 'EXPIRING SOON', statusType: 'expiring' };
  return { status: 'ACTIVE', statusType: 'verified' };
};

const formatExpiry = (expiryDate) => {
  const daysUntilExpiry = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (daysUntilExpiry <= 1) return 'Expires within 24h';
  return `Expires in ${daysUntilExpiry}d`;
};

const normalizeCoupon = (coupon) => ({
  ...coupon,
  id: coupon._id,
  merchant: String(coupon.merchant),
  expiry: formatExpiry(coupon.expiryDate),
  category: 'Recent',
  icon: '🎟️',
  ...getCouponStatus(coupon),
});

const EMPTY_FORM = {
  title: '',
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: '',
  merchant: '',
  expiryDate: '',
  isActive: true,
};

const formInputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8083ff]/40';

function CouponVaultPage() {
  const [couponList, setCouponList] = useState([]);
  const [activeTab, setActiveTab] = useState('Recent');
  const [searchQuery, setSearchQuery] = useState('');
  const { copiedId, copyCoupon } = useCopyCoupon(2000);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const data = await getCoupons();
        setCouponList(data.map(normalizeCoupon));
      } catch (requestError) {
        setError(requestError.message || 'Unable to load coupons');
      } finally {
        setIsLoading(false);
      }
    };

    loadCoupons();
  }, []);

  const openCreateForm = () => {
    setEditingCoupon(null);
    setFormData(EMPTY_FORM);
    setError('');
    setIsFormOpen(true);
  };

  const openEditForm = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      title: coupon.title || '',
      code: coupon.code || '',
      description: coupon.description || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue ?? '',
      merchant: coupon.merchant || '',
      expiryDate: coupon.expiryDate ? coupon.expiryDate.slice(0, 16) : '',
      isActive: coupon.isActive ?? true,
    });
    setError('');
    setIsFormOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        expiryDate: new Date(formData.expiryDate).toISOString(),
      };

      const data = editingCoupon
        ? await updateCoupon(editingCoupon.id, payload)
        : await createCoupon(payload);
      const savedCoupon = normalizeCoupon(data);
      setCouponList((current) => editingCoupon
        ? current.map((coupon) => (coupon.id === savedCoupon.id ? savedCoupon : coupon))
        : [savedCoupon, ...current]);
      setIsFormOpen(false);
      setEditingCoupon(null);
    } catch (requestError) {
      setError(requestError.message || 'Unable to save coupon');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Delete this coupon?')) return;

    setError('');
    setDeletingId(couponId);
    try {
      await deleteCoupon(couponId);
      setCouponList((current) => current.filter((coupon) => coupon.id !== couponId));
    } catch (requestError) {
      setError(requestError.message || 'Unable to delete coupon');
    } finally {
      setDeletingId(null);
    }
  };

  // Copy to clipboard core execution block
  const handleCopyCode = (id, codeString) => copyCoupon(id, codeString);

  // Multi-layer logic filtering out code records
  const filteredCoupons = couponList.filter((coupon) => {
    const matchesSearch = coupon.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          coupon.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'Recent') return matchesSearch;
    if (activeTab === 'Expiring') return matchesSearch && coupon.statusType === 'expiring';
    return matchesSearch && coupon.category === activeTab;
  });

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-4 md:py-8 space-y-6">
      
      {/* 1. Header Layout */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Coupon Vault
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-ui hidden sm:block">
            Manage and automate your active reward assets.
          </p>
        </div>
        <button className="relative p-2.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer">
          <Bell className="h-5 w-5 text-zinc-400" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#8083ff]" />
        </button>
      </div>

      {/* 2. Responsive Split Grid Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COMPONENT: Search, Tabs, and Coupons Stack Container */}
        <div className="lg:col-span-7 space-y-5 order-1">
          
          {/* Controls Utility Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-white/[0.01] p-2 rounded-2xl border border-white/[0.03]">
            <div className="relative flex items-center flex-1">
              <Search className="absolute left-3.5 h-4 w-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search brands..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 text-sm rounded-xl bg-[#0a0a0d] border border-white/5 placeholder-zinc-500 focus:outline-none focus:border-[#8083ff]/40 transition-colors font-ui text-white"
              />
            </div>

            {/* Navigation Tabs Filter slider */}
            <div className="flex gap-1 overflow-x-auto overflow-y-hidden text-xs font-medium font-ui custom-scrollbar whitespace-nowrap">
              {['Recent', 'Expiring', 'Shopping', 'Tech'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                    activeTab === tab 
                      ? 'bg-white/10 text-white font-semibold border border-white/10' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {isFormOpen && (
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-4 space-y-3 border border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-white">
                  {editingCoupon ? 'Edit coupon' : 'Add coupon'}
                </h2>
                <button type="button" onClick={() => setIsFormOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input name="title" value={formData.title} onChange={handleFormChange} required placeholder="Title" className={formInputClass} />
                <input name="code" value={formData.code} onChange={handleFormChange} required placeholder="Code" className={formInputClass} />
                <input name="merchant" value={formData.merchant} onChange={handleFormChange} required placeholder="Merchant ObjectId" className={formInputClass} />
                <input name="description" value={formData.description} onChange={handleFormChange} placeholder="Description" className={formInputClass} />
                <select name="discountType" value={formData.discountType} onChange={handleFormChange} className={formInputClass}>
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat</option>
                </select>
                <input name="discountValue" value={formData.discountValue} onChange={handleFormChange} required min="0" type="number" placeholder="Discount value" className={formInputClass} />
                <input name="expiryDate" value={formData.expiryDate} onChange={handleFormChange} required type="datetime-local" className={formInputClass} />
                <label className="flex items-center gap-2 text-sm text-zinc-300 px-2">
                  <input name="isActive" checked={formData.isActive} onChange={handleFormChange} type="checkbox" />
                  Active
                </label>
              </div>
              <button type="submit" disabled={isSaving} className="rounded-xl bg-[#c0c1ff] px-4 py-2 text-sm font-semibold text-[#0a0a0d] disabled:opacity-50">
                {isSaving ? 'Saving...' : editingCoupon ? 'Update coupon' : 'Create coupon'}
              </button>
            </form>
          )}

          {/* Dynamic Feed Component Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {isLoading ? (
              <div className="text-center py-12 glass-card rounded-2xl border border-white/5">
                <p className="text-sm text-zinc-500 font-ui">Loading coupons...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 glass-card rounded-2xl border border-rose-500/20">
                <p className="text-sm text-rose-300 font-ui">{error}</p>
              </div>
            ) : filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <div 
                  key={coupon.id} 
                  className="glass-card rounded-2xl p-4 flex flex-col justify-between transition-all hover:border-white/15 shadow-xl bg-gradient-to-b from-white/[0.01] to-transparent"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-xl shadow-inner shrink-0">
                        {coupon.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.14em] text-zinc-500 uppercase font-ui">
                          {coupon.merchant}
                        </p>
                        <h3 className="font-display text-[15px] font-semibold text-white mt-0.5 tracking-tight">
                          {coupon.title}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1 leading-normal font-ui font-light">
                          {coupon.description}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded uppercase font-ui shrink-0 ${
                      coupon.statusType === 'verified' ? 'bg-emerald-500/10 text-[#6ffbbe]' :
                      coupon.statusType === 'expiring' ? 'bg-rose-500/10 text-rose-300' :
                      coupon.statusType === 'new' ? 'bg-cyan-500/10 text-cyan-300' : 'bg-zinc-500/10 text-zinc-300'
                    }`}>
                      {coupon.status}
                    </span>
                  </div>

                  <div className="border-t border-white/[0.03] my-3.5" />

                  <div className="flex items-center justify-between text-xs font-ui">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <svg className="h-3.5 w-3.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <span className={coupon.statusType === 'expiring' ? 'text-rose-300 font-medium' : ''}>
                        {coupon.expiry}
                      </span>
                    </div>

                    {/* ACTION BUTTON: Clipboard Copy Engine Element */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(coupon.id, coupon.code)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold tracking-wide text-[11px] transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                          copiedId === coupon.id
                            ? 'bg-emerald-500/10 text-[#6ffbbe] border-emerald-500/30'
                            : 'bg-white/[0.03] hover:bg-white/[0.08] text-zinc-200 border-white/5 hover:border-white/10'
                        }`}
                      >
                        {copiedId === coupon.id ? <Check className="h-3 w-3 text-[#6ffbbe]" /> : <Copy className="h-3 w-3 text-zinc-400" />}
                        <span className="font-mono text-zinc-300 tracking-normal">{copiedId === coupon.id ? 'Copied!' : coupon.code}</span>
                      </button>
                      <button type="button" onClick={() => openEditForm(coupon)} className="p-2 text-zinc-400 hover:text-white" aria-label="Edit coupon">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => handleDelete(coupon.id)} disabled={deletingId === coupon.id} className="p-2 text-zinc-400 hover:text-rose-300 disabled:opacity-50" aria-label="Delete coupon">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 glass-card rounded-2xl border border-white/5">
                <p className="text-sm text-zinc-500 font-ui">No matches found for your search query.</p>
              </div>
            )}

            <button onClick={openCreateForm} className="w-full py-5 rounded-2xl border border-dashed border-white/10 hover:border-white/20 hover:bg-white/[0.01] transition-all flex flex-col items-center justify-center gap-1.5 group cursor-pointer sm:col-span-2 lg:col-span-1">
              <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="h-4 w-4 text-zinc-400" />
              </div>
              <span className="text-xs font-medium text-zinc-400 font-ui">Add Coupon Manually</span>
            </button>
          </div>
        </div>

        {/* RIGHT COMPONENT: AI Insights panel Container Layout */}
        <div className="lg:col-span-5 space-y-4 order-2 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold text-white tracking-tight px-1">
            AI Insights
          </h2>

          {/* Hero Showcase Block */}
          <div className="glass-card mint-glow rounded-2xl p-5 sm:p-6 space-y-5 bg-gradient-to-br from-white/[0.01] to-transparent">
            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] text-[#6ffbbe] uppercase font-ui">
                Savings Potential
              </p>
              <p className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
                $248.50
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 leading-relaxed font-ui font-light">
                saveGenie found 3 new matches for your recently viewed items on Amazon and Best Buy.
              </p>
            </div>
            <button className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#c0c1ff] hover:bg-white text-[#0a0a0d] font-semibold text-xs tracking-wide transition-all active:scale-95 font-ui cursor-pointer shadow-lg">
              Apply All
            </button>
          </div>

          {/* Subordinate Insight Alerts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <div className="glass-card rounded-xl p-4 flex items-start gap-3 border-l-2 border-l-rose-500/40 shadow-md">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="font-ui text-xs sm:text-sm">
                <p className="font-semibold text-rose-300">Action Required</p>
                <p className="text-zinc-400 mt-0.5 font-light">2 coupons expire in less than 24h.</p>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 flex items-start gap-3 border-l-2 border-l-[#4edea3]/40 shadow-md">
              <Sparkles className="h-4 w-4 text-[#6ffbbe] shrink-0 mt-0.5" />
              <div className="font-ui text-xs sm:text-sm">
                <p className="font-semibold text-[#6ffbbe]">Optimization</p>
                <p className="text-zinc-400 mt-0.5 font-light">Auto-apply is active for 85% of vault.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CouponVaultPage;

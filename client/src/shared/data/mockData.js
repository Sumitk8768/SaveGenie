export const savingsOverview = {
  monthlySavings: 428,
  cashbackEarned: 182,
  rewardsUnlocked: 14,
  optimizedDeals: 37,
  newSavingsToday: 42,
}

export const coupons = [
  {
    id: 'cp-1',
    merchant: 'Amazon',
    title: '12% off electronics',
    description: 'Valid for select accessories and gadgets over $50.',
    category: 'Tech',
    badge: 'Auto-applied',
    expiry: 'in 3 days',
    status: 'Active',
  },
  {
    id: 'cp-2',
    merchant: 'Starbucks',
    title: 'Buy 1 Get 1 Grande',
    description: 'Weekend-only reward available in app wallet.',
    category: 'Food',
    badge: 'Hot Deal',
    expiry: 'tonight',
    status: 'Expiring',
  },
  {
    id: 'cp-3',
    merchant: 'Nike',
    title: '$30 off running shoes',
    description: 'Requires loyalty tier Silver or higher.',
    category: 'Fashion',
    badge: 'AI Pick',
    expiry: 'in 6 days',
    status: 'Active',
  },
]

export const recommendations = [
  {
    id: 'r1',
    title: 'Shift grocery purchases to Friday 7pm',
    impact: 'Potential +$42 monthly savings',
    confidence: '92%',
  },
  {
    id: 'r2',
    title: 'Stack cashback card with wallet coupon',
    impact: 'Potential +$18 per checkout',
    confidence: '89%',
  },
  {
    id: 'r3',
    title: 'Redeem unused loyalty stars before expiry',
    impact: 'Recover $26 in rewards value',
    confidence: '95%',
  },
]

export const notifications = [
  {
    id: 'n1',
    title: 'Your Nike code expires soon',
    body: 'Use it in the next 48 hours to avoid losing $30 value.',
    time: '2h ago',
    type: 'expiry',
  },
  {
    id: 'n2',
    title: 'Cashback posted',
    body: 'Target + Chase stack returned $12.40.',
    time: '4h ago',
    type: 'cashback',
  },
  {
    id: 'n3',
    title: 'AI optimization completed',
    body: '3 coupons auto-prioritized for your weekend shopping list.',
    time: 'Today',
    type: 'ai',
  },
]

export const analytics = [
  { month: 'Jan', savings: 210, cashback: 76, rewards: 8 },
  { month: 'Feb', savings: 256, cashback: 92, rewards: 9 },
  { month: 'Mar', savings: 305, cashback: 110, rewards: 11 },
  { month: 'Apr', savings: 368, cashback: 132, rewards: 12 },
  { month: 'May', savings: 428, cashback: 182, rewards: 14 },
]

export const sourceBreakdown = [
  { label: 'Coupons', value: 64.25, share: 50, color: 'bg-violet-300' },
  { label: 'Cashback', value: 42.1, share: 33, color: 'bg-emerald-300' },
  { label: 'Discounts', value: 22.15, share: 17, color: 'bg-rose-300' },
]

export const reminderTimeline = [
  {
    id: 'rem-1',
    tag: 'EXPIRES TONIGHT',
    title: 'UberEats credit expires tonight',
    text: '$15.00 Uber Cash will be removed from your wallet at 11:59 PM.',
    tone: 'rose',
    notify: true,
    auto: false,
  },
  {
    id: 'rem-2',
    tag: 'IN 2 DAYS',
    title: 'Amazon Prime Day kickoff',
    text: 'Expected 40% savings on wishlist tech. SaveGenie AI is scanning pre-deal leaks.',
    tone: 'violet',
    notify: true,
    auto: true,
  },
  {
    id: 'rem-3',
    tag: 'IN 5 DAYS',
    title: 'Chase Sapphire hotel credit reset',
    text: 'New $50 cycle starts soon. Plan the stay window to maximize value.',
    tone: 'mint',
    notify: false,
    auto: false,
  },
  {
    id: 'rem-4',
    tag: 'IN 12 DAYS',
    title: 'Netflix subscription renewal',
    text: 'AI found discounted gift cards that can reduce this renewal by 10%.',
    tone: 'muted',
    notify: true,
    auto: true,
  },
]

export const testimonials = [
  {
    id: 't1',
    name: 'Aria M.',
    role: 'Product Manager',
    text: 'SaveGenie quietly saved me $520 in two months. It feels like having a deal analyst in my pocket.',
  },
  {
    id: 't2',
    name: 'Daniel K.',
    role: 'Startup Founder',
    text: 'The AI recommendations are spooky accurate. It catches things I always miss.',
  },
]
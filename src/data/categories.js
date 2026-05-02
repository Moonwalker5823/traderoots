export const categories = [
  {
    id: 'precious-metals',
    name: 'Precious Metals',
    icon: '🥇',
    description: 'Rare, naturally occurring metals valued for investment and industry',
    commodities: [
      { slug: 'gold', name: 'Gold', ticker: 'XAU', unit: 'per troy oz', teaser: 'The world\'s most recognized store of value and safe-haven asset.', related: ['silver', 'platinum', 'copper'] },
      { slug: 'silver', name: 'Silver', ticker: 'XAG', unit: 'per troy oz', teaser: 'Dual role as both monetary metal and critical industrial input.', related: ['gold', 'platinum', 'copper'] },
      { slug: 'platinum', name: 'Platinum', ticker: 'XPT', unit: 'per troy oz', teaser: 'Rarer than gold, prized in auto catalysts and green hydrogen.', related: ['gold', 'palladium', 'silver'] },
      { slug: 'palladium', name: 'Palladium', ticker: 'XPD', unit: 'per troy oz', teaser: 'Dominant in gasoline catalytic converters; tight global supply.', related: ['platinum', 'gold', 'nickel'] },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: '⚡',
    description: 'Fuels that power the global economy from oil fields to pipelines',
    commodities: [
      { slug: 'crude-oil', name: 'Crude Oil', ticker: 'CL', unit: 'per barrel', teaser: 'The world\'s most traded commodity — benchmark for global energy costs.', related: ['natural-gas', 'gasoline', 'heating-oil'] },
      { slug: 'natural-gas', name: 'Natural Gas', ticker: 'NG', unit: 'per MMBtu', teaser: 'Cleaner-burning fossil fuel powering heating and electricity generation.', related: ['crude-oil', 'heating-oil', 'coal'] },
      { slug: 'gasoline', name: 'Gasoline', ticker: 'RB', unit: 'per gallon', teaser: 'Refined petroleum product that fuels most of the world\'s vehicles.', related: ['crude-oil', 'heating-oil', 'natural-gas'] },
      { slug: 'heating-oil', name: 'Heating Oil', ticker: 'HO', unit: 'per gallon', teaser: 'Distillate fuel used to heat homes across the northeastern US and Europe.', related: ['crude-oil', 'natural-gas', 'gasoline'] },
    ],
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: '🌾',
    description: 'Crops and soft commodities traded on exchanges worldwide',
    commodities: [
      { slug: 'wheat', name: 'Wheat', ticker: 'ZW', unit: 'per bushel', teaser: 'Staple grain underpinning global food security and bread supplies.', related: ['corn', 'soybeans', 'sugar'] },
      { slug: 'corn', name: 'Corn', ticker: 'ZC', unit: 'per bushel', teaser: 'Versatile crop used in food, ethanol fuel, and animal feed worldwide.', related: ['wheat', 'soybeans', 'sugar'] },
      { slug: 'coffee', name: 'Coffee', ticker: 'KC', unit: 'per lb', teaser: 'The world\'s second most traded commodity after crude oil.', related: ['sugar', 'cotton', 'wheat'] },
      { slug: 'sugar', name: 'Sugar', ticker: 'SB', unit: 'per lb', teaser: 'Raw sweetener produced from sugarcane and beets on six continents.', related: ['corn', 'coffee', 'wheat'] },
      { slug: 'cotton', name: 'Cotton', ticker: 'CT', unit: 'per lb', teaser: 'Soft fiber that clothes the majority of the world\'s population.', related: ['soybeans', 'corn', 'wheat'] },
      { slug: 'soybeans', name: 'Soybeans', ticker: 'ZS', unit: 'per bushel', teaser: 'Versatile oilseed driving global protein and vegetable oil supply.', related: ['corn', 'wheat', 'cotton'] },
    ],
  },
  {
    id: 'industrial-metals',
    name: 'Industrial Metals',
    icon: '⚙️',
    description: 'Base metals essential to manufacturing, construction, and technology',
    commodities: [
      { slug: 'copper', name: 'Copper', ticker: 'HG', unit: 'per lb', teaser: 'The metal of electrification — essential for wiring, EVs, and renewables.', related: ['aluminum', 'zinc', 'nickel'] },
      { slug: 'aluminum', name: 'Aluminum', ticker: 'ALI', unit: 'per lb', teaser: 'Lightweight metal that transformed aerospace, packaging, and construction.', related: ['copper', 'zinc', 'nickel'] },
      { slug: 'zinc', name: 'Zinc', ticker: 'ZNC', unit: 'per lb', teaser: 'Essential for galvanizing steel and preventing corrosion in infrastructure.', related: ['copper', 'aluminum', 'nickel'] },
      { slug: 'nickel', name: 'Nickel', ticker: 'NI', unit: 'per lb', teaser: 'Key ingredient in stainless steel and lithium-ion battery cathodes.', related: ['copper', 'palladium', 'zinc'] },
    ],
  },
  {
    id: 'livestock',
    name: 'Livestock',
    icon: '🐄',
    description: 'Animal products traded as futures on the CME Group exchanges',
    commodities: [
      { slug: 'live-cattle', name: 'Live Cattle', ticker: 'LE', unit: 'per lb', teaser: 'Futures on beef cattle ready for slaughter, traded on the CME.', related: ['feeder-cattle', 'lean-hogs', 'corn'] },
      { slug: 'lean-hogs', name: 'Lean Hogs', ticker: 'HE', unit: 'per lb', teaser: 'Pork futures reflecting supply of market-weight hogs for processing.', related: ['live-cattle', 'feeder-cattle', 'corn'] },
      { slug: 'feeder-cattle', name: 'Feeder Cattle', ticker: 'GF', unit: 'per lb', teaser: 'Young cattle sold to feedlots for finishing before slaughter.', related: ['live-cattle', 'lean-hogs', 'corn'] },
    ],
  },
]

export function findCategory(id) {
  return categories.find((c) => c.id === id) || null
}

export function findCommodity(slug) {
  for (const cat of categories) {
    const commodity = cat.commodities.find((c) => c.slug === slug)
    if (commodity) return { ...commodity, categoryId: cat.id, categoryName: cat.name }
  }
  return null
}

'use strict'

// API Ninjas commodity name keys — verify at api-ninjas.com/api/commodityprice
const categories = [
  {
    id: 'precious-metals',
    name: 'Precious Metals',
    commodities: [
      {
        slug: 'gold',
        name: 'Gold',
        ticker: 'XAU',
        unit: 'per troy oz',
        apiKey: 'gold',
        fallbackPrice: 1900,
        teaser: "The world's most recognized store of value and safe-haven asset.",
      },
      {
        slug: 'silver',
        name: 'Silver',
        ticker: 'XAG',
        unit: 'per troy oz',
        apiKey: 'silver',
        fallbackPrice: 23,
        teaser: 'Dual role as both monetary metal and critical industrial input.',
      },
      {
        slug: 'platinum',
        name: 'Platinum',
        ticker: 'XPT',
        unit: 'per troy oz',
        apiKey: 'platinum',
        fallbackPrice: 900,
        teaser: 'Rarer than gold, prized in auto catalysts and green hydrogen.',
      },
      {
        slug: 'palladium',
        name: 'Palladium',
        ticker: 'XPD',
        unit: 'per troy oz',
        apiKey: 'palladium',
        fallbackPrice: 1100,
        teaser: 'Dominant in gasoline catalytic converters; tight global supply.',
      },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    commodities: [
      {
        slug: 'crude-oil',
        name: 'Crude Oil',
        ticker: 'CL',
        unit: 'per barrel',
        apiKey: 'crude_oil',
        fallbackPrice: 75,
        teaser: "The world's most traded commodity — benchmark for global energy costs.",
      },
      {
        slug: 'natural-gas',
        name: 'Natural Gas',
        ticker: 'NG',
        unit: 'per MMBtu',
        apiKey: 'natural_gas',
        fallbackPrice: 2.5,
        teaser: 'Cleaner-burning fossil fuel powering heating and electricity generation.',
      },
      {
        slug: 'gasoline',
        name: 'Gasoline',
        ticker: 'RB',
        unit: 'per gallon',
        apiKey: 'gasoline',
        fallbackPrice: 2.5,
        teaser: "Refined petroleum product that fuels most of the world's vehicles.",
      },
      {
        slug: 'heating-oil',
        name: 'Heating Oil',
        ticker: 'HO',
        unit: 'per gallon',
        apiKey: 'heating_oil',
        fallbackPrice: 2.6,
        teaser: 'Distillate fuel used to heat homes across the northeastern US and Europe.',
      },
    ],
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    commodities: [
      {
        slug: 'wheat',
        name: 'Wheat',
        ticker: 'ZW',
        unit: 'per bushel',
        apiKey: 'wheat',
        fallbackPrice: 550,
        teaser: 'Staple grain underpinning global food security and bread supplies.',
      },
      {
        slug: 'corn',
        name: 'Corn',
        ticker: 'ZC',
        unit: 'per bushel',
        apiKey: 'corn',
        fallbackPrice: 450,
        teaser: 'Versatile crop used in food, ethanol fuel, and animal feed worldwide.',
      },
      {
        slug: 'coffee',
        name: 'Coffee',
        ticker: 'KC',
        unit: 'per lb',
        apiKey: 'coffee',
        fallbackPrice: 185,
        teaser: "The world's second most traded commodity after crude oil.",
      },
      {
        slug: 'sugar',
        name: 'Sugar',
        ticker: 'SB',
        unit: 'per lb',
        apiKey: 'sugar',
        fallbackPrice: 18,
        teaser: 'Raw sweetener produced from sugarcane and beets on six continents.',
      },
      {
        slug: 'cotton',
        name: 'Cotton',
        ticker: 'CT',
        unit: 'per lb',
        apiKey: 'cotton',
        fallbackPrice: 80,
        teaser: "Soft fiber that clothes the majority of the world's population.",
      },
      {
        slug: 'soybeans',
        name: 'Soybeans',
        ticker: 'ZS',
        unit: 'per bushel',
        apiKey: 'soybeans',
        fallbackPrice: 1150,
        teaser: 'Versatile oilseed driving global protein and vegetable oil supply.',
      },
    ],
  },
  {
    id: 'industrial-metals',
    name: 'Industrial Metals',
    commodities: [
      {
        slug: 'copper',
        name: 'Copper',
        ticker: 'HG',
        unit: 'per lb',
        apiKey: 'copper',
        fallbackPrice: 4.0,
        teaser: 'The metal of electrification — essential for wiring, EVs, and renewables.',
      },
      {
        slug: 'aluminum',
        name: 'Aluminum',
        ticker: 'ALI',
        unit: 'per lb',
        apiKey: 'aluminum',
        fallbackPrice: 1.1,
        teaser: 'Lightweight metal that transformed aerospace, packaging, and construction.',
      },
      {
        slug: 'zinc',
        name: 'Zinc',
        ticker: 'ZNC',
        unit: 'per lb',
        apiKey: 'zinc',
        fallbackPrice: 1.25,
        teaser: 'Essential for galvanizing steel and preventing corrosion in infrastructure.',
      },
      {
        slug: 'nickel',
        name: 'Nickel',
        ticker: 'NI',
        unit: 'per lb',
        apiKey: 'nickel',
        fallbackPrice: 7.5,
        teaser: 'Key ingredient in stainless steel and lithium-ion battery cathodes.',
      },
    ],
  },
  {
    id: 'livestock',
    name: 'Livestock',
    commodities: [
      {
        slug: 'live-cattle',
        name: 'Live Cattle',
        ticker: 'LE',
        unit: 'per lb',
        apiKey: 'live_cattle',
        fallbackPrice: 185,
        teaser: 'Futures on beef cattle ready for slaughter, traded on the CME.',
      },
      {
        slug: 'lean-hogs',
        name: 'Lean Hogs',
        ticker: 'HE',
        unit: 'per lb',
        apiKey: 'lean_hogs',
        fallbackPrice: 85,
        teaser: 'Pork futures reflecting supply of market-weight hogs for processing.',
      },
      {
        slug: 'feeder-cattle',
        name: 'Feeder Cattle',
        ticker: 'GF',
        unit: 'per lb',
        apiKey: 'feeder_cattle',
        fallbackPrice: 240,
        teaser: 'Young cattle sold to feedlots for finishing before slaughter.',
      },
    ],
  },
]

function findCategory(id) {
  return categories.find((c) => c.id === id) || null
}

function findCommodity(slug) {
  for (const cat of categories) {
    const commodity = cat.commodities.find((c) => c.slug === slug)
    if (commodity) return { ...commodity, categoryId: cat.id, categoryName: cat.name }
  }
  return null
}

module.exports = { categories, findCategory, findCommodity }

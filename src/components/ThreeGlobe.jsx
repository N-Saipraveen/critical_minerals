import React, { useState, useEffect, useRef } from 'react';

const countriesData = {
  china: {
    id: "china",
    iso2: "cn",
    name: "China",
    flag: "🇨🇳",
    resource: "Rare Earths (Nd/Dy/Tb), Graphite, Gallium, Germanium, Indium, Silicon, Cobalt refining",
    share: "85-90% of Rare Earth refining, 70% Graphite mining, 98% Gallium production",
    position: "Refining & Downstream Monopoly",
    desc: "China holds absolute processing control over heavy rare earths and synthetic graphite. It has leveraged three decades of state subsidies and lower environmental compliance to lock in downstream value chains.",
    badge: "Strategic Choke Point",
    color: "#C89312"
  },
  drc: {
    id: "drc",
    iso2: "cd",
    name: "Democratic Republic of Congo",
    flag: "🇨🇩",
    resource: "Cobalt (Co), Copper (Cu)",
    share: "70% of global Cobalt mine output",
    position: "Vulnerable Primary Miner",
    desc: "Congo dominates global cobalt mining. However, its supply chain is highly unstable due to widespread artisanal mining, human rights challenges, and heavy investment/ownership by Chinese firms.",
    badge: "Ethical & Supply Risk",
    color: "#6D518F"
  },
  chile: {
    id: "chile",
    iso2: "chile", // maps to cl
    iso2_real: "cl",
    name: "Chile",
    flag: "🇨🇱",
    resource: "Copper (Cu), Lithium (Li) Brines, Rhenium, Molybdenum",
    share: "28% of global Copper production, 30% Lithium reserves",
    position: "Leading Reserve Node",
    desc: "Chile sits in the Lithium Triangle. Its brine deposits are highly cost-competitive but raise extreme groundwater consumption and environmental issues in the Atacama Desert.",
    badge: "Water Risk / FTA Partner",
    color: "#167B80"
  },
  australia: {
    id: "australia",
    iso2: "au",
    name: "Australia",
    flag: "🇦🇺",
    resource: "Lithium (Spodumene), Cobalt, Nickel, Zirconium, Rare Earths (Mt Weld)",
    share: "47% of global Lithium extraction, 35% Zirconium reserves",
    position: "Leading Raw Supplier",
    desc: "Australia produces the most raw lithium (spodumene ore). While geopolitically secure as a key US/India allied partner, it has historically lacked chemical refining capacity.",
    badge: "MSP Allied Partner",
    color: "#6B0F1A"
  },
  indonesia: {
    id: "indonesia",
    iso2: "id",
    name: "Indonesia",
    flag: "🇮🇩",
    resource: "Nickel (Ni) Ore, Tin (Sn)",
    share: "50% of global Nickel mining output, 25% Tin reserves",
    position: "Dominant Miner & Smelter Hub",
    desc: "Indonesia has banned raw nickel exports, forcing major Chinese-backed smelters to build domestic processing. This has triggered huge shifts in EV battery chemistries.",
    badge: "Resource Nationalism Leader",
    color: "#4D6B3C"
  },
  india: {
    id: "india",
    iso2: "in",
    name: "India",
    flag: "🇮🇳",
    resource: "Titanium, Zirconium, Monazite sands (REE), Manganese, Silicon",
    share: "100% dependent on imports for Lithium, Cobalt, Nickel",
    position: "Emerging Consumer & Local Miner",
    desc: "India has high geological potential (J&K Lithium, Sukinda Nickel, Chavara Beach Sands) but faces immediate processing vulnerabilities and extreme dependency on foreign refiners.",
    badge: "NCMM Focus Hub",
    color: "#6B0F1A"
  },
  usa: {
    id: "usa",
    iso2: "us",
    name: "United States",
    flag: "🇺🇸",
    resource: "Helium, Beryllium, Rare Earths (Mountain Pass), Copper",
    share: "65% of global Beryllium, 35% Helium reserves",
    position: "Allied Security Hub",
    desc: "The US leads the Minerals Security Partnership (MSP) to bypass single-country monopolies. The Inflation Reduction Act (IRA) offers massive incentives for domestic and FTA-partner processing.",
    badge: "MSP Diplomatic Hub",
    color: "#167B80"
  },
  argentina: {
    id: "argentina",
    iso2: "ar",
    name: "Argentina",
    flag: "🇦🇷",
    resource: "Lithium Brines (Catamarca, Salta)",
    share: "21% of global Lithium reserves",
    position: "Strategic KABIL Joint Venture",
    desc: "Argentina hosts low-cost lithium brines in the Lithium Triangle. India's state-owned KABIL has acquired exclusive exploration rights to five blocks in Catamarca to secure dedicated supply lines.",
    badge: "Core Equity Resource",
    color: "#6D518F"
  },
  canada: {
    id: "canada",
    iso2: "ca",
    name: "Canada",
    flag: "🇨🇦",
    resource: "Nickel, Cobalt, Indium, Niobium, Potash, Uranium",
    share: "30% of global Potash production, major Uranium exporter",
    position: "Resilient ESG Supplier",
    desc: "Canada is rich in battery-grade nickel, cobalt, and potash. It possesses robust environmental, social, and governance (ESG) standards, aligning closely with US and EU trade corridors.",
    badge: "MSP Allied Partner",
    color: "#167B80"
  },
  brazil: {
    id: "brazil",
    iso2: "br",
    name: "Brazil",
    flag: "🇧🇷",
    resource: "Niobium (Nb), Graphite, Tantalum, Nickel, Silicon",
    share: "88% of global Niobium mining",
    position: "Niobium Monopoly",
    desc: "Brazil holds a near-monopoly on Niobium (crucial for structural aerospace steel and superconducting magnets) centered around the massive Araxá deposit.",
    badge: "Key Strategic Supplier",
    color: "#4D6B3C"
  },
  russia: {
    id: "russia",
    iso2: "ru",
    name: "Russia",
    flag: "🇷🇺",
    resource: "Palladium (Pd), Platinum (Pt), Nickel, Silicon, Germanium, Vanadium",
    share: "40% of global Palladium production, 20% Potash, 17% Vanadium",
    position: "Strategic Competitor",
    desc: "Russia is a dominant supplier of palladium for auto catalysts, potash for fertilizers, and high-purity class 1 nickel. Geopolitical sanctions make this supply highly volatile.",
    badge: "Supply Disruption Risk",
    color: "#C89312"
  },
  south_africa: {
    id: "south_africa",
    iso2: "za",
    name: "South Africa",
    flag: "🇿🇦",
    resource: "Platinum, Palladium, Rhodium, Iridium, Ruthenium, Manganese, Chromium",
    share: "70% of Platinum, 80% Rhodium, 44% Chromium, 35% Manganese",
    position: "PGM & Manganese Giant",
    desc: "South Africa dominates the Platinum Group Metals (PGMs) necessary for green hydrogen electrolyzers and automotive emission catalysts. Its supply is vulnerable to domestic power grid challenges.",
    badge: "Primary Reserve Holder",
    color: "#4A5568"
  },
  vietnam: {
    id: "vietnam",
    iso2: "vn",
    name: "Vietnam",
    flag: "🇻🇳",
    resource: "Rare Earth Elements (REE), Tungsten, Bismuth",
    share: "22% of global REE reserves, 5% Tungsten production",
    position: "Future REE Competitor",
    desc: "Vietnam holds the second-largest rare earth reserves in the world. Western nations are actively partnering with Vietnam to build alternative mining and refining operations.",
    badge: "Emerging REE Hub",
    color: "#6D518F"
  },
  myanmar: {
    id: "myanmar",
    iso2: "mm",
    name: "Myanmar",
    flag: "🇲🇲",
    resource: "Heavy Rare Earths (Dy/Tb), Tin",
    share: "8-10% of global Heavy REE mining, 12% Tin",
    position: "Vulnerable Supply Node",
    desc: "Myanmar is a leading source of heavy rare earths, mostly shipped to China for refining. Geopolitical instability and illegal mining make this supply highly precarious.",
    badge: "High Geopolitical Risk",
    color: "#C89312"
  },
  madagascar: {
    id: "madagascar",
    iso2: "mg",
    name: "Madagascar",
    flag: "🇲🇬",
    resource: "Graphite (Flake), Nickel, Cobalt",
    share: "8% of global flake Graphite mining",
    position: "Key Battery Anode Supplier",
    desc: "Madagascar mines high-quality natural flake graphite. It represents a vital alternative to Chinese synthetic graphite for EV battery anodes.",
    badge: "Unaligned Exporter",
    color: "#4D6B3C"
  },
  mozambique: {
    id: "mozambique",
    iso2: "mz",
    name: "Mozambique",
    flag: "🇲🇿",
    resource: "Graphite, Tantalum, Beryllium",
    share: "7% of global Graphite mining",
    position: "Key Battery Input Source",
    desc: "Mozambique hosts some of the world's largest graphite mines (like Balama). It is key to non-China diversification plans for battery supply chains.",
    badge: "Key Battery Input Source",
    color: "#4D6B3C"
  },
  bolivia: {
    id: "bolivia",
    iso2: "bo",
    name: "Bolivia",
    flag: "🇧🇴",
    resource: "Lithium Brines (Uyuni), Antimony, Tin, Tungsten",
    share: "Largest estimated Lithium resources (21M tonnes)",
    position: "Unexploited Reserve Giant",
    desc: "Bolivia hosts the massive Salar de Uyuni. However, technical extraction hurdles, environmental regulations, and political factors have kept production minimal.",
    badge: "Lithium Triangle Member",
    color: "#6D518F"
  },
  peru: {
    id: "peru",
    iso2: "pe",
    name: "Peru",
    flag: "🇵🇪",
    resource: "Copper, Zinc, Silver, Indium, Tin, Selenium, Tellurium",
    share: "10% of global Copper mining, 10% Tin mining",
    position: "Major Metal Exporter",
    desc: "Peru is a top global exporter of copper, tin, and byproduct selenium. Mining operations are frequent targets of local social disputes and environmental protests.",
    badge: "Key Copper Supplier",
    color: "#4A5568"
  },
  kazakhstan: {
    id: "kazakhstan",
    iso2: "kz",
    name: "Kazakhstan",
    flag: "🇰🇿",
    resource: "Chromium, Titanium, Beryllium, Uranium, Rhenium, Barite",
    share: "15% of global Chromium mining, major Uranium producer",
    position: "Strategic Energy & Metal Hub",
    desc: "Kazakhstan is a major producer of uranium, titanium sponge for aerospace, and high-grade chromium. It is strategically positioned between Russia, China, and Europe.",
    badge: "Diverse Commodities Hub",
    color: "#4A5568"
  },
  turkey: {
    id: "turkey",
    iso2: "tr",
    name: "Turkey",
    flag: "🇹🇷",
    resource: "Boron, Chromium, Graphite, Antimony",
    share: "60% of global Boron production, 7% Antimony reserves",
    position: "Boron Super-producer",
    desc: "Turkey holds a massive share of the world's boron reserves (vital for wind blades and glass insulation). It is also a key Mediterranean chromium supplier.",
    badge: "Strategic Mediterranean Node",
    color: "#4A5568"
  },
  gabon: {
    id: "gabon",
    iso2: "ga",
    name: "Gabon",
    flag: "🇬🇦",
    resource: "Manganese (Mn)",
    share: "20% of global Manganese production",
    position: "High-grade Manganese Producer",
    desc: "Gabon mines high-grade manganese, essential for steel manufacturing and emerging manganese-rich lithium-ion battery chemistries.",
    badge: "Critical Steel Input Source",
    color: "#4D6B3C"
  },
  spain: {
    id: "spain",
    iso2: "es",
    name: "Spain",
    flag: "🇪🇸",
    resource: "Strontium (Sr)",
    share: "30% of global Strontium production",
    position: "Key EU Strontium Node",
    desc: "Spain is the primary producer of strontium within the European Union, which is utilized in ceramic permanent magnets for micro-motors.",
    badge: "EU Internal Supplier",
    color: "#167B80"
  },
  mexico: {
    id: "mexico",
    iso2: "mx",
    name: "Mexico",
    flag: "🇲🇽",
    resource: "Fluorite (Fluorspar), Strontium, Graphite, Silver",
    share: "15% of global Fluorite production, 20% Strontium",
    position: "North American Supply Partner",
    desc: "Mexico is a major source of fluorite (used for semiconductor acid etching) and strontium, closely linked to the US automotive supply corridor.",
    badge: "US FTA Partner",
    color: "#167B80"
  },
  norway: {
    id: "norway",
    iso2: "no",
    name: "Norway",
    flag: "🇳🇴",
    resource: "Silicon (Polysilicon), Titanium, Vanadium",
    share: "4% of global high-purity Silicon production",
    position: "Green Refining Pioneer",
    desc: "Norway uses low-cost hydro power to refine high-purity silicon. It represents a vital green refinery source for EU solar and semiconductor wafers.",
    badge: "European Green Refiner",
    color: "#167B80"
  },
  finland: {
    id: "finland",
    iso2: "fi",
    name: "Finland",
    flag: "🇫🇮",
    resource: "Cobalt, Nickel, Lithium (Keliber project)",
    share: "Only European refinery for Cobalt (Kokkola)",
    position: "European Battery Hub",
    desc: "Finland is the only European nation with integrated cobalt refining and active lithium mining developments, making it the linchpin of EU battery sovereignty.",
    badge: "EU Battery Sovereignty",
    color: "#167B80"
  },
  france: {
    id: "france",
    iso2: "fr",
    name: "France",
    flag: "🇫🇷",
    resource: "Hafnium (Hf) processing, Nuclear fuel cycle",
    share: "45% of global Hafnium chemical refining",
    position: "High-Tech Refiner",
    desc: "France hosts key high-purity chemical processing facilities for Hafnium (essential for advanced computer chips and nuclear control rods).",
    badge: "EU Tech Center",
    color: "#167B80"
  },
  belgium: {
    id: "belgium",
    iso2: "be",
    name: "Belgium",
    flag: "🇧🇪",
    resource: "Germanium (Ge) and Cobalt (Co) refining",
    share: "Global hub for complex metal recycling & refining",
    position: "Circular Economy Hub",
    desc: "Belgium (via Umicore) is a world leader in refining cobalt and germanium from recycled electronic scrap and industrial byproducts.",
    badge: "Recycling & Tech Leader",
    color: "#167B80"
  },
  germany: {
    id: "germany",
    iso2: "de",
    name: "Germany",
    flag: "🇩🇪",
    resource: "Gallium, Germanium, Silicon refining, Advanced magnets",
    share: "Leading European refiner and consumer",
    position: "Downstream Industrial Hub",
    desc: "Germany handles high-tech processing for semiconductor-grade silicon and gallium, but remains highly dependent on raw imports of rare earths and cobalt.",
    badge: "Allied Tech Consumer",
    color: "#167B80"
  },
  uk: {
    id: "uk",
    iso2: "gb",
    name: "United Kingdom",
    flag: "🇬🇧",
    resource: "Platinum Group Metals (PGM) refining",
    share: "Major global PGM trading & chemical processing hub",
    position: "Financial & Tech Hub",
    desc: "The UK is the global hub for PGM trading (London Platinum Market) and hosts advanced catalyst chemical facilities (Johnson Matthey).",
    badge: "MSP Allied Partner",
    color: "#167B80"
  },
  japan: {
    id: "japan",
    iso2: "jp",
    name: "Japan",
    flag: "🇯🇵",
    resource: "Gallium, Germanium, Indium refining, Titanium sponge",
    share: "Global leader in high-purity electronics chemicals",
    position: "Vulnerable Tech Powerhouse",
    desc: "Japan pioneered critical mineral stockpiling (JOGMEC) after a 2010 Chinese embargo. It excels at downstream magnet and semiconductor refining.",
    badge: "MSP Allied Partner",
    color: "#167B80"
  },
  south_korea: {
    id: "south_korea",
    iso2: "kr",
    name: "South Korea",
    flag: "🇰🇷",
    resource: "Indium, Lithium, and Cobalt chemical refining",
    share: "Major global consumer and battery producer (LG/SK)",
    position: "Advanced Tech Consumer",
    desc: "South Korea is a major manufacturer of lithium batteries and microchips. It is actively seeking to diversify its raw material imports away from China.",
    badge: "MSP Allied Partner",
    color: "#167B80"
  },
  ukraine: {
    id: "ukraine",
    iso2: "ua",
    name: "Ukraine",
    flag: "🇺🇦",
    resource: "Gallium, Titanium, Zirconium, Hafnium",
    share: "Significant reserves of Titanium and Zirconium in Europe",
    position: "Vulnerable Strategic Reserve",
    desc: "Ukraine possesses large reserves of titanium, zirconium, and graphite. The ongoing war has disrupted mining and blocked access to European supply chains.",
    badge: "Strategic Conflict Risk",
    color: "#4A5568"
  },
  morocco: {
    id: "morocco",
    iso2: "ma",
    name: "Morocco",
    flag: "🇲🇦",
    resource: "Phosphate rock, Phosphorus (P), Cobalt (clean)",
    share: "70% of global Phosphate reserves",
    position: "Phosphate Giant & ESG Cobalt Source",
    desc: "Morocco holds the largest phosphate reserves in the world, critical for LFP battery cathodes. It also mines ethical, conflict-free cobalt.",
    badge: "Key Agricultural & LFP Node",
    color: "#4D6B3C"
  },
  jordan: {
    id: "jordan",
    iso2: "jo",
    name: "Jordan",
    flag: "🇯🇴",
    resource: "Phosphate rock, fertilizers",
    share: "Key global Phosphate supplier",
    position: "Phosphate Exporter",
    desc: "Jordan exports large volumes of phosphate rock, playing a crucial role in international fertilizer markets and LFP battery precursors.",
    badge: "Phosphate Node",
    color: "#4D6B3C"
  },
  egypt: {
    id: "egypt",
    iso2: "eg",
    name: "Egypt",
    flag: "🇪🇬",
    resource: "Phosphate rock, Tantalum reserves",
    share: "Key regional Phosphate producer",
    position: "Phosphate & Strategic Mineral Node",
    desc: "Egypt mines significant phosphate deposits and hosts unexploited tantalum reserves in the Eastern Desert.",
    badge: "Regional Supplier",
    color: "#4A5568"
  },
  laos: {
    id: "laos",
    iso2: "la",
    name: "Laos",
    flag: "🇱🇦",
    resource: "Bismuth (Bi), Copper",
    share: "10% of global Bismuth mining output",
    position: "Bismuth Producer",
    desc: "Laos has emerged as a key bismuth miner. Most of its mine projects are heavily backed by Chinese infrastructure development loans.",
    badge: "Chinese Belt & Road Node",
    color: "#4D6B3C"
  },
  belarus: {
    id: "belarus",
    iso2: "by",
    name: "Belarus",
    flag: "🇧🇾",
    resource: "Potash (K)",
    share: "20% of global Potash production",
    position: "Sanctioned Potash Exporter",
    desc: "Belarus is a major producer of potash. Heavy Western sanctions have restricted its shipments, causing severe volatility in global agricultural pricing.",
    badge: "High Geopolitical Risk",
    color: "#C89312"
  },
  israel: {
    id: "israel",
    iso2: "il",
    name: "Israel",
    flag: "🇮🇱",
    resource: "Potash (K), Magnesium (Mg)",
    share: "Key Dead Sea mineral extraction operations",
    position: "Dead Sea Mineral Producer",
    desc: "Israel extracts potash and magnesium from the Dead Sea. It provides secure supply channels for agriculture and structural alloys.",
    badge: "Tech Partner",
    color: "#167B80"
  },
  qatar: {
    id: "qatar",
    iso2: "qa",
    name: "Qatar",
    flag: "🇶🇦",
    resource: "Helium (He)",
    share: "35% of global Helium production",
    position: "Helium Super-producer",
    desc: "Qatar extracts helium as a byproduct of its massive Liquefied Natural Gas (LNG) processing. It is the chief alternative to US strategic helium reserves.",
    badge: "Critical Gas Node",
    color: "#4A5568"
  },
  algeria: {
    id: "algeria",
    iso2: "dz",
    name: "Algeria",
    flag: "🇩🇿",
    resource: "Helium (He), Phosphate rock",
    share: "Significant regional Helium and Phosphate reserves",
    position: "Energy & Gas Exporter",
    desc: "Algeria extracts helium from natural gas and holds substantial phosphate reserves, supplying European agricultural and industrial markets.",
    badge: "EU Energy Corridor",
    color: "#4D6B3C"
  },
  zimbabwe: {
    id: "zimbabwe",
    iso2: "zw",
    name: "Zimbabwe",
    flag: "🇿🇼",
    resource: "Lithium (hard-rock pegmatites), Platinum, Chromium",
    share: "Largest Lithium reserves in Africa",
    position: "Emerging Lithium Hub",
    desc: "Zimbabwe hosts large hard-rock lithium deposits. It has recently banned raw lithium exports to encourage local refinery processing and Chinese-led investments.",
    badge: "African Mineral Hub",
    color: "#6D518F"
  },
  cuba: {
    id: "cuba",
    iso2: "cu",
    name: "Cuba",
    flag: "🇨🇺",
    resource: "Cobalt (Co), Nickel (Ni)",
    share: "Significant Nickel and Cobalt reserves",
    position: "Vulnerable Reserve Node",
    desc: "Cuba holds vast reserves of nickel and cobalt. Production is managed in joint ventures with Canadian and Chinese firms, limited by trade embargoes.",
    badge: "Embargoed Reserve Node",
    color: "#6D518F"
  },
  rwanda: {
    id: "rwanda",
    iso2: "rw",
    name: "Rwanda",
    flag: "🇷🇼",
    resource: "Tantalum (Coltan), Tin, Tungsten (3Ts)",
    share: "15% of global Tantalum supply",
    position: "Key Tantalum Exporter",
    desc: "Rwanda is a top exporter of tantalum. Ensuring traceability of conflict-free coltan from Central Africa remains a primary compliance focus.",
    badge: "3Ts Mineral Hub",
    color: "#6D518F"
  },
  zambia: {
    id: "zambia",
    iso2: "zm",
    name: "Zambia",
    flag: "🇿🇲",
    resource: "Copper (Cu), Cobalt (Co)",
    share: "Key global Copper producer",
    position: "Major Copper Node",
    desc: "Zambia's Copperbelt is one of the most prolific metal deposits. It is partnering with the US and EU via the Lobito Corridor to bypass regional transport choke points.",
    badge: "Lobito Corridor Partner",
    color: "#167B80"
  },
  poland: {
    id: "poland",
    iso2: "pl",
    name: "Poland",
    flag: "🇵🇱",
    resource: "Rhenium (Re), Silver, Copper",
    share: "15% of global Rhenium production (KGHM)",
    position: "Strategic European Refiner",
    desc: "Poland is a top producer of rhenium (byproduct of copper mining), which is critical for aviation jet turbine alloys in the EU and US.",
    badge: "EU Strategic Supplier",
    color: "#167B80"
  },
  tajikistan: {
    id: "tajikistan",
    iso2: "tj",
    name: "Tajikistan",
    flag: "🇹🇯",
    resource: "Antimony (Sb)",
    share: "20% of global Antimony production",
    position: "Key Antimony Node",
    desc: "Tajikistan is a vital global supplier of antimony, used in defense ammunition and flame retardants, with mines heavily tied to Chinese partnerships.",
    badge: "Central Asian Node",
    color: "#C89312"
  },
  sweden: {
    id: "sweden",
    iso2: "se",
    name: "Sweden",
    flag: "🇸🇪",
    resource: "Iron ore, Rare Earths (Kiruna deposit)",
    share: "Largest EU Iron producer, largest EU REE deposit discovered",
    position: "Future EU Mining Giant",
    desc: "Sweden's LKAB discovered the Per Geijer deposit, the largest known rare earth deposit in Europe, which could reduce EU import dependency in the 2030s.",
    badge: "Future EU Mineral Hope",
    color: "#167B80"
  },
  mongolia: {
    id: "mongolia",
    iso2: "mn",
    name: "Mongolia",
    flag: "🇲🇳",
    resource: "Copper, Coal, Fluorite, Rare Earths",
    share: "10% of global Fluorite production",
    position: "Resource-rich Landlocked Node",
    desc: "Mongolia is rich in copper and fluorite. It is strategically sought after by both Russia/China and Western nations looking for supply diversification.",
    badge: "Unaligned Resource Hub",
    color: "#4A5568"
  },
  philippines: {
    id: "philippines",
    iso2: "ph",
    name: "Philippines",
    flag: "🇵🇭",
    resource: "Nickel, Cobalt, Scandium",
    share: "11% of global Nickel mining output",
    position: "Major Nickel Ore Exporter",
    desc: "The Philippines is a primary supplier of unprocessed nickel ore, exporting heavily to Chinese smelters. It is seeking to build domestic chemical refineries.",
    badge: "Key Raw Nickel Source",
    color: "#4D6B3C"
  }
};

const hotspots = [
  { id: "india", iso2: "in", name: "India", cx: 601.86, cy: 472.57, color: '#6B0F1A' },
  { id: "china", iso2: "cn", name: "China", cx: 625.00, cy: 405.00, color: '#C89312' },
  { id: "drc", iso2: "cd", name: "DR Congo", cx: 450.00, cy: 540.00, color: '#6D518F' },
  { id: "chile", iso2: "cl", name: "Chile", cx: 252.00, cy: 640.00, color: '#167B80' },
  { id: "australia", iso2: "au", name: "Australia", cx: 718.51, cy: 623.58, color: '#6B0F1A' },
  { id: "indonesia", iso2: "id", name: "Indonesia", cx: 680.00, cy: 530.00, color: '#4D6B3C' },
  { id: "usa", iso2: "us", name: "USA", cx: 193.32, cy: 419.05, color: '#167B80' },
  { id: "argentina", iso2: "ar", name: "Argentina", cx: 261.60, cy: 642.04, color: '#6D518F' }
];

const ThreeGlobe = ({ activeCountry, onSelectCountry }) => {
  const [worldSvgContent, setWorldSvgContent] = useState('');
  const [hoveredCountryIso2, setHoveredCountryIso2] = useState(null);
  const containerRef = useRef(null);

  // Fetch world SVG map
  useEffect(() => {
    fetch('/world.svg')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load world map');
        return res.text();
      })
      .then(text => {
        const svgStart = text.indexOf('<svg');
        if (svgStart !== -1) {
          setWorldSvgContent(text.substring(svgStart));
        } else {
          setWorldSvgContent(text);
        }
      })
      .catch(err => console.error("Error loading world SVG map", err));
  }, []);

  // Configure SVG map interactivity
  useEffect(() => {
    if (!worldSvgContent || !containerRef.current) return;

    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    // Apply clean vector responsive styling attributes
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.display = 'block';

    const paths = svg.querySelectorAll('path');
    paths.forEach(el => {
      const id = el.id || el.parentElement?.id;
      if (!id) return;

      let iso2 = id.toLowerCase();
      // Remap specific variations in the world.svg
      if (iso2 === 'cl') iso2 = 'cl'; // Chile
      
      // Look up country profile in database
      const countryKey = Object.keys(countriesData).find(key => {
        const c = countriesData[key];
        return c.iso2 === iso2 || (c.iso2_real && c.iso2_real === iso2);
      });
      const country = countryKey ? countriesData[countryKey] : null;

      if (country) {
        const isHovered = hoveredCountryIso2 === iso2;
        const isActive = activeCountry && (activeCountry.iso2 === iso2 || (activeCountry.iso2_real && activeCountry.iso2_real === iso2));

        el.style.cursor = 'pointer';
        el.style.transition = 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        
        // Dynamic coloring matching geopolitics
        if (isActive || isHovered) {
          el.style.fill = (country.color || '#167B80') + (isActive ? '55' : '35');
          el.style.stroke = country.color || '#167B80';
          el.style.strokeWidth = '1.8px';
        } else {
          el.style.fill = (country.color || '#167B80') + '15';
          el.style.stroke = country.color || '#167B80';
          el.style.strokeWidth = '0.8px';
        }

        // Attach event listeners only once
        if (!el._hasEvents) {
          const handleMouseOver = () => {
            setHoveredCountryIso2(iso2);
            onSelectCountry(country);
          };
          const handleMouseOut = () => {
            setHoveredCountryIso2(null);
          };
          const handleClick = () => {
            onSelectCountry(country);
          };

          el.addEventListener('mouseover', handleMouseOver);
          el.addEventListener('mouseout', handleMouseOut);
          el.addEventListener('click', handleClick);

          el._cleanup = () => {
            el.removeEventListener('mouseover', handleMouseOver);
            el.removeEventListener('mouseout', handleMouseOut);
            el.removeEventListener('click', handleClick);
          };
          el._hasEvents = true;
        }
      } else {
        // Standard countries colored in warm sand-beige with white borders
        el.style.fill = '#EAE6DF';
        el.style.stroke = '#FFFFFF';
        el.style.strokeWidth = '0.5px';
        el.style.transition = 'all 0.3s ease';
      }
    });

    return () => {
      // Cleanup is managed per element inside the paths loop if needed.
    };
  }, [worldSvgContent, activeCountry, hoveredCountryIso2]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Map selector widget */}
      <div className="map-selector-widget">
        <label htmlFor="map-country-select">Locate Country Profile:</label>
        <select 
          id="map-country-select"
          className="map-select-input"
          value={activeCountry ? activeCountry.id : ''}
          onChange={(e) => {
            const key = e.target.value;
            if (key && countriesData[key]) {
              onSelectCountry(countriesData[key]);
            }
          }}
        >
          <option value="" disabled>-- Select a Country --</option>
          {Object.keys(countriesData).sort((a,b) => countriesData[a].name.localeCompare(countriesData[b].name)).map(key => (
            <option key={key} value={key}>
              {countriesData[key].flag} {countriesData[key].name}
            </option>
          ))}
        </select>
      </div>

      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '100%', overflow: 'hidden' }}
        dangerouslySetInnerHTML={worldSvgContent ? { __html: worldSvgContent } : undefined}
      />

      {/* Pulsing Hotspot Markers mapped on top */}
      <div className="hotspot-markers-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }}>
        <svg viewBox="30.767 241.591 784.077 458.627" style={{ width: '100%', height: '100%' }}>
          {hotspots.map((h, i) => {
            const isActive = activeCountry && (activeCountry.iso2 === h.iso2 || activeCountry.id === h.id);
            return (
              <g key={i} style={{ pointerEvents: 'auto', cursor: 'pointer' }} onClick={() => {
                const countryKey = Object.keys(countriesData).find(k => countriesData[k].iso2 === h.iso2 || countriesData[k].id === h.id);
                if (countryKey) onSelectCountry(countriesData[countryKey]);
              }}>
                <circle 
                  cx={h.cx} 
                  cy={h.cy} 
                  r={isActive ? 12 : 6} 
                  fill={h.color} 
                  opacity={isActive ? 0.35 : 0.2}
                  className="pulse-effect"
                  style={{ transformOrigin: `${h.cx}px ${h.cy}px`, transition: 'all 0.3s ease' }}
                />
                <circle 
                  cx={h.cx} 
                  cy={h.cy} 
                  r={isActive ? 5 : 3.5} 
                  fill={h.color}
                  style={{ transition: 'all 0.3s ease' }}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default ThreeGlobe;

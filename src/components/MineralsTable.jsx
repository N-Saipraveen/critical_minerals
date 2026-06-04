import React, { useState, useMemo, forwardRef } from 'react';

const mineralsDataset = [
  { 
    name: "Lithium", symbol: "Li", category: "Battery",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "EV Battery Cathodes, Grid Storage", indiaSources: "Chile 🇨🇱, Australia 🇦🇺, Argentina 🇦🇷, China 🇨🇳",
    globalShare: "Australia 🇦🇺 (47%), Chile 🇨🇱 (30%), China 🇨🇳 (15%)", globalReserves: "Chile 🇨🇱, Australia 🇦🇺, Argentina 🇦🇷, China 🇨🇳", globalSectors: "EV Batteries, Power Grid Packs", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 4200, recyclingRate: "< 1%", substitutability: "High Difficulty (0.9)",
    details: "Essential for current high-energy lithium-ion battery configurations (NMC, LFP). Substitution with Sodium-ion is possible for low-range/grid usage but compromises energy density."
  },
  { 
    name: "Cobalt", symbol: "Co", category: "Battery",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Aerospace superalloys, NMC battery cathodes", indiaSources: "DR Congo 🇨🇩, China 🇨🇳, Finland 🇫🇮, Canada 🇨🇦",
    globalShare: "DR Congo 🇨🇩 (70%), Russia 🇷🇺 (4%), Australia 🇦🇺 (4%)", globalReserves: "DR Congo 🇨🇩, Australia 🇦🇺, Cuba 🇨🇺, Canada 🇨🇦", globalSectors: "Jet turbine engines, battery chemistry", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 5800, recyclingRate: "32%", substitutability: "Medium Difficulty (0.7)",
    details: "Provides thermal stability in battery cathodes. High ethical concerns due to artisanal mining in DR Congo. LFP chemistry serves as an active substitute, bypassing cobalt entirely."
  },
  { 
    name: "Nickel", symbol: "Ni", category: "Battery",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Stainless steel, EV battery chemistries", indiaSources: "Indonesia 🇮🇩, Philippines 🇵🇭, Russia 🇷🇺, Australia 🇦🇺",
    globalShare: "Indonesia 🇮🇩 (50%), Philippines 🇵🇭 (11%), Russia 🇷🇺 (9%)", globalReserves: "Indonesia 🇮🇩, Australia 🇦🇺, Brazil 🇧🇷, New Caledonia 🇳🇨", globalSectors: "EV Battery Cathodes, Alloys", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 2800, recyclingRate: "35%", substitutability: "High Difficulty (0.8)",
    details: "Enables high energy density. Indonesia dominates mining and class 1 refining. Substitutes include Manganese-rich chemistries or LFP at the cost of vehicle range."
  },
  { 
    name: "Graphite", symbol: "C", category: "Battery",
    indiaImport: "High Import (60%)", indiaRisk: "medium", indiaSector: "Anode material in batteries, steel refractories", indiaSources: "China 🇨🇳, Madagascar 🇲🇬, Brazil 🇧🇷, Mozambique 🇲🇿",
    globalShare: "China 🇨🇳 (70%), Madagascar 🇲🇬 (8%), Mozambique 🇲🇿 (7%)", globalReserves: "China 🇨🇳, Brazil 🇧🇷, Turkey 🇹🇷, Madagascar 🇲🇬", globalSectors: "Battery Anodes, Metallurgy", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 5100, recyclingRate: "< 5%", substitutability: "Medium Difficulty (0.6)",
    details: "The standard battery anode material. Synthetic graphite serves as a costly, energy-intensive substitute. Silicon anodes are emerging as a partial substitute to increase capacity."
  },
  { 
    name: "Neodymium", symbol: "Nd", category: "REE",
    indiaImport: "High Import (95%)", indiaRisk: "medium", indiaSector: "Permanent magnets for EV motors & Wind turbines", indiaSources: "China 🇨🇳, USA 🇺🇸, Myanmar 🇲🇲, Australia 🇦🇺",
    globalShare: "China 🇨🇳 (70%), USA 🇺🇸 (14%), Myanmar 🇲🇲 (8%)", globalReserves: "China 🇨🇳, Vietnam 🇻🇳, Brazil 🇧🇷, Russia 🇷🇺", globalSectors: "Wind generators, electric powertrains", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 5500, recyclingRate: "< 1%", substitutability: "Extreme Difficulty (0.95)",
    details: "Key Rare Earth Element. Permanent magnets (NdFeB) are critical for compact, high-efficiency traction motors in EVs and gearless offshore wind generators."
  },
  { 
    name: "Dysprosium", symbol: "Dy", category: "REE",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "High-temperature military magnets, sensors", indiaSources: "China 🇨🇳, Myanmar 🇲🇲",
    globalShare: "China 🇨🇳 (90%), Myanmar 🇲🇲 (8%)", globalReserves: "China 🇨🇳, Vietnam 🇻🇳, Russia 🇷🇺", globalSectors: "Defense guidance, heavy magnets", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 8200, recyclingRate: "< 1%", substitutability: "Extreme Difficulty (0.95)",
    details: "Added to NdFeB magnets to prevent demagnetization at high operational temperatures (critical for military jet engines, defense actuators, and high-performance motors)."
  },
  { 
    name: "Gallium", symbol: "Ga", category: "Industrial",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Semiconductors, 5G chips, optoelectronic LEDs", indiaSources: "China 🇨🇳, Japan 🇯🇵, UK 🇬🇧, Germany 🇩🇪",
    globalShare: "China 🇨🇳 (98%), Japan 🇯🇵 (1%)", globalReserves: "China 🇨🇳, Russia 🇷🇺, Ukraine 🇺🇦", globalSectors: "5G systems, military radars, microchips", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 9600, recyclingRate: "0%", substitutability: "High Difficulty (0.85)",
    details: "Extracted as a byproduct of bauxite processing. Silicon and Indium Phosphide serve as partial substitutes in electronics, but degrade performance in high-frequency 5G and radar circuits."
  },
  { 
    name: "Germanium", symbol: "Ge", category: "Industrial",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Fiber optic cables, solar cells, infrared optics", indiaSources: "China 🇨🇳, USA 🇺🇸, Belgium 🇧🇪, Germany 🇩🇪",
    globalShare: "China 🇨🇳 (60%), Russia 🇷🇺 (15%), USA 🇺🇸 (10%)", globalReserves: "China 🇨🇳, Russia 🇷🇺, USA 🇺🇸", globalSectors: "Night-vision optics, space solar cells", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 4500, recyclingRate: "30%", substitutability: "Medium Difficulty (0.7)",
    details: "Indispensable for military infrared/night-vision devices and fiber-optic communication cores. Silicon-based optics can substitute in low-end applications."
  },
  { 
    name: "Indium", symbol: "In", category: "Industrial",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Touchscreen displays (ITO), solar panels", indiaSources: "China 🇨🇳, South Korea 🇰🇷, Canada 🇨🇦, Japan 🇯🇵",
    globalShare: "China 🇨🇳 (60%), South Korea 🇰🇷 (12%), Canada 🇨🇦 (10%)", globalReserves: "China 🇨🇳, Peru 🇵🇪, Canada 🇨🇦", globalSectors: "LCD screens, thin-film solar PVs", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 3900, recyclingRate: "0%", substitutability: "High Difficulty (0.8)",
    details: "Used as Indium Tin Oxide (ITO) for transparent conductive coatings in smartphone touchscreens and flat panels. Graphene is a potential substitute but lacks commercial scaling."
  },
  { 
    name: "Silicon", symbol: "Si", category: "Industrial",
    indiaImport: "Medium Import (40%)", indiaRisk: "medium", indiaSector: "Solar wafers, semiconductor chips, alloys", indiaSources: "China 🇨🇳, Russia 🇷🇺, Norway 🇳🇴, Brazil 🇧🇷",
    globalShare: "China 🇨🇳 (75%), Russia 🇷🇺 (7%), Norway 🇳🇴 (4%)", globalReserves: "China 🇨🇳, Russia 🇷🇺, Norway 🇳🇴, Brazil 🇧🇷", globalSectors: "Solar cells, computer microprocessors", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 5800, recyclingRate: "0%", substitutability: "High Difficulty (0.85)",
    details: "High-purity polysilicon is the substrate for 95% of global solar panels and all computer semiconductor chips. Substitutes are nonexistent for computing."
  },
  { 
    name: "Titanium", symbol: "Ti", category: "Strategic",
    indiaImport: "Low Import / Exporting", indiaRisk: "low", indiaSector: "Aerospace alloy structures, medical implants", indiaSources: "India 🇮🇳 (Chavara sands), Australia 🇦🇺, South Africa 🇿🇦",
    globalShare: "China 🇨🇳 (35%), Russia 🇷🇺 (15%), Japan 🇯🇵 (15%), Kazakhstan 🇰🇿 (10%)", globalReserves: "China 🇨🇳, Australia 🇦🇺, India 🇮🇳, South Africa 🇿🇦", globalSectors: "Jet engines, aerospace hulls", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 2100, recyclingRate: "45%", substitutability: "Medium Difficulty (0.65)",
    details: "Outstanding strength-to-weight ratio and corrosion resistance. Steel and aluminum are alternative structures but add massive weight penalties."
  },
  { 
    name: "Beryllium", symbol: "Be", category: "Strategic",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Nuclear reactors, aerospace electronics, sensors", indiaSources: "USA 🇺🇸, China 🇨🇳, Mozambique 🇲🇿",
    globalShare: "USA 🇺🇸 (65%), China 🇨🇳 (25%), Mozambique 🇲🇿 (8%)", globalReserves: "USA 🇺🇸, China 🇨🇳, Kazakhstan 🇰🇿, Brazil 🇧🇷", globalSectors: "Defense sensors, nuclear control rods", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 5200, recyclingRate: "10%", substitutability: "High Difficulty (0.8)",
    details: "Extremely stiff and lightweight. Ideal for military optical sensors and neutron reflectors in nuclear reactors. Titanium can substitute but reduces structural integrity."
  },
  { 
    name: "Niobium", symbol: "Nb", category: "Strategic",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Superalloys, structural steel, pipelines", indiaSources: "Brazil 🇧🇷, Canada 🇨🇦, China 🇨🇳",
    globalShare: "Brazil 🇧🇷 (88%), Canada 🇨🇦 (8%)", globalReserves: "Brazil 🇧🇷, Canada 🇨🇦", globalSectors: "Jet engines, superconducting magnets", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 7800, recyclingRate: "22%", substitutability: "Medium Difficulty (0.7)",
    details: "Used in High-Strength Low-Alloy (HSLA) steel for pipelines and aerospace structural frames. Vanadium serves as an alternative but offers lower thermal capacity."
  },
  { 
    name: "Tantalum", symbol: "Ta", category: "Strategic",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Capacitors in electronics, surgical implants", indiaSources: "DR Congo 🇨🇩, Rwanda 🇷🇼, Brazil 🇧🇷, Australia 🇦🇺",
    globalShare: "DR Congo 🇨🇩 (40%), Brazil 🇧🇷 (30%), Rwanda 🇷🇼 (15%)", globalReserves: "Brazil 🇧🇷, Australia 🇦🇺, DR Congo 🇨🇩", globalSectors: "Smartphones, turbine superalloys", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 2900, recyclingRate: "25%", substitutability: "High Difficulty (0.85)",
    details: "High-capacitance powder used in compact military and phone capacitors. Ceramic capacitors can substitute in larger spaces but fail in sub-miniature circuits."
  },
  { 
    name: "Tungsten", symbol: "W", category: "Strategic",
    indiaImport: "High Import (95%)", indiaRisk: "medium", indiaSector: "Industrial cutting tools, armor-piercing shells", indiaSources: "China 🇨🇳, Vietnam 🇻🇳, Bolivia 🇧🇴, Russia 🇷🇺",
    globalShare: "China 🇨🇳 (85%), Vietnam 🇻🇳 (5%), Russia 🇷🇺 (3%)", globalReserves: "China 🇨🇳, Vietnam 🇻🇳, Russia 🇷🇺, Australia 🇦🇺", globalSectors: "Armor-piercing munitions, drills", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 7300, recyclingRate: "35%", substitutability: "High Difficulty (0.8)",
    details: "The highest melting point of all metals. Critical for cutting tools, mining drills, and kinetic energy defense penetrators. Molybdenum carbides serve as partial substitutes."
  },
  { 
    name: "Vanadium", symbol: "V", category: "Strategic",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Vanadium flow batteries, high-strength alloys", indiaSources: "China 🇨🇳, Russia 🇷🇺, South Africa 🇿🇦, Brazil 🇧🇷",
    globalShare: "China 🇨🇳 (60%), Russia 🇷🇺 (17%), South Africa 🇿🇦 (8%)", globalReserves: "China 🇨🇳, Russia 🇷🇺, South Africa 🇿🇦, Australia 🇦🇺", globalSectors: "Grid-scale flow batteries, specialty steel", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 4100, recyclingRate: "10%", substitutability: "Medium Difficulty (0.65)",
    details: "Essential for strengthening structural steel and launching long-duration Vanadium Redox Flow Batteries (VRFB) for national electric grid storage solutions."
  },
  { 
    name: "Platinum", symbol: "Pt", category: "Industrial",
    indiaImport: "High Import (99%)", indiaRisk: "medium", indiaSector: "Catalysts, hydrogen fuel cell electrodes", indiaSources: "South Africa 🇿🇦, Russia 🇷🇺, UK 🇬🇧",
    globalShare: "South Africa 🇿🇦 (70%), Russia 🇷🇺 (11%), Zimbabwe 🇿🇼 (8%)", globalReserves: "South Africa 🇿🇦, Russia 🇷🇺, Zimbabwe 🇿🇼", globalSectors: "Hydrogen electrolyzers, auto catalysts", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 5300, recyclingRate: "50%", substitutability: "High Difficulty (0.75)",
    details: "Crucial catalyst for PEM green-hydrogen electrolyzers and automotive emission systems. Palladium is an active substitute, but also shares a concentrated risk profile."
  },
  { 
    name: "Palladium", symbol: "Pd", category: "Industrial",
    indiaImport: "High Import (99%)", indiaRisk: "medium", indiaSector: "Catalytic converters, multilayer capacitors", indiaSources: "South Africa 🇿🇦, Russia 🇷🇺, Canada 🇨🇦, USA 🇺🇸",
    globalShare: "Russia 🇷🇺 (40%), South Africa 🇿🇦 (40%), Canada 🇨🇦 (6%)", globalReserves: "South Africa 🇿🇦, Russia 🇷🇺, Canada 🇨🇦, USA 🇺🇸", globalSectors: "Auto catalysts, electronics", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 3600, recyclingRate: "55%", substitutability: "Medium Difficulty (0.7)",
    details: "Sourced primarily from Russia and South Africa as a platinum byproduct. Used to strip carbon emissions in gas vehicles. Platinum functions as a viable substitute."
  },
  { 
    name: "Antimony", symbol: "Sb", category: "Industrial",
    indiaImport: "High Import (90%)", indiaRisk: "medium", indiaSector: "Flame retardants, military ammunition", indiaSources: "China 🇨🇳, Tajikistan 🇹🇯, Turkey 🇹🇷, Bolivia 🇧🇴",
    globalShare: "China 🇨🇳 (55%), Tajikistan 🇹🇯 (20%), Turkey 🇹🇷 (7%)", globalReserves: "China 🇨🇳, Russia 🇷🇺, Bolivia 🇧🇴, Turkey 🇹🇷", globalSectors: "Military munitions, flame retardants", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 3700, recyclingRate: "< 5%", substitutability: "Medium Difficulty (0.6)",
    details: "Alloyed in lead-acid batteries and heavy munitions, and used as a trioxide compound for flame-retardant industrial plastics. Halogen-free alternatives exist."
  },
  { 
    name: "Bismuth", symbol: "Bi", category: "Industrial",
    indiaImport: "High Import (95%)", indiaRisk: "medium", indiaSector: "Eco-friendly alloys, pharmaceuticals", indiaSources: "China 🇨🇳, Laos 🇱🇦, Japan 🇯🇵",
    globalShare: "China 🇨🇳 (80%), Laos 🇱🇦 (10%), Japan 🇯🇵 (5%)", globalReserves: "China 🇨🇳, Vietnam 🇻🇳, Canada 🇨🇦", globalSectors: "Eco-alloys, medical elements", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 6500, recyclingRate: "0%", substitutability: "Low Difficulty (0.5)",
    details: "Utilized as a non-toxic replacement for lead in plumbing joints and solder. Easily substituted by tin, copper, or lead (where toxicity is permitted)."
  },
  { 
    name: "Selenium", symbol: "Se", category: "Industrial",
    indiaImport: "High Import (85%)", indiaRisk: "medium", indiaSector: "Solar PV cells, glass manufacturing", indiaSources: "China 🇨🇳, Japan 🇯🇵, Germany 🇩🇪, Canada 🇨🇦",
    globalShare: "China 🇨🇳 (50%), Japan 🇯🇵 (15%), Germany 🇩🇪 (10%)", globalReserves: "China 🇨🇳, Russia 🇷🇺, USA 🇺🇸, Canada 🇨🇦", globalSectors: "Solar energy, glass tinting", globalRisk: "low",
    criticality: { in: true, us: true, eu: true },
    hhi: 2900, recyclingRate: "25%", substitutability: "Low Difficulty (0.4)",
    details: "Byproduct of copper refining. Essential for printing drums, thin-film CIGS solar cells, and structural glass. Sulfur compounds function as alternative options."
  },
  { 
    name: "Tellurium", symbol: "Te", category: "Industrial",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Cadmium telluride thin-film solar modules", indiaSources: "China 🇨🇳, USA 🇺🇸, Japan 🇯🇵, Canada 🇨🇦",
    globalShare: "China 🇨🇳 (60%), USA 🇺🇸 (15%), Japan 🇯🇵 (10%)", globalReserves: "China 🇨🇳, USA 🇺🇸, Canada 🇨🇦, Peru 🇵🇪", globalSectors: "Thin-film solar PV arrays", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 4100, recyclingRate: "0%", substitutability: "High Difficulty (0.85)",
    details: "One of the rarest elements. Indispensable for Cadmium-Telluride (CdTe) utility-scale solar panels, which offer higher thermal efficiency than standard silicon."
  },
  { 
    name: "Zirconium", symbol: "Zr", category: "Strategic",
    indiaImport: "Low Import / Exporting", indiaRisk: "low", indiaSector: "Nuclear cladding, high-temp ceramics", indiaSources: "India 🇮🇳, Australia 🇦🇺, South Africa 🇿🇦",
    globalShare: "Australia 🇦🇺 (35%), South Africa 🇿🇦 (25%), China 🇨🇳 (10%)", globalReserves: "Australia 🇦🇺, South Africa 🇿🇦, India 🇮🇳, Brazil 🇧🇷", globalSectors: "Nuclear fuel rods, refractories", globalRisk: "low",
    criticality: { in: true, us: true, eu: true },
    hhi: 2200, recyclingRate: "15%", substitutability: "Medium Difficulty (0.7)",
    details: "Low neutron absorption cross-section makes zirconium alloys the primary cladding material for fuel rods in nuclear reactors. Hafnium-free requirements are strict."
  },
  { 
    name: "Hafnium", symbol: "Hf", category: "Strategic",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Nuclear control rods, microchip dielectric gates", indiaSources: "France 🇫🇷, USA 🇺🇸, Ukraine 🇺🇦",
    globalShare: "France 🇫🇷 (45%), USA 🇺🇸 (40%), Russia 🇷🇺 (5%)", globalReserves: "France 🇫🇷, USA 🇺🇸, Australia 🇦🇺", globalSectors: "Semiconductor gate dielectrics", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 3800, recyclingRate: "0%", substitutability: "High Difficulty (0.9)",
    details: "Obtained as a byproduct of zirconium purification. Used in nuclear control rods and as a High-k metal gate dielectric in sub-7nm microchip transistors."
  },
  { 
    name: "Rhenium", symbol: "Re", category: "Strategic",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Jet engine turbine blades, high-octane fuels", indiaSources: "Chile 🇨🇱, USA 🇺🇸, Poland 🇵🇱, Germany 🇩🇪",
    globalShare: "Chile 🇨🇱 (55%), USA 🇺🇸 (15%), Poland 🇵🇱 (15%)", globalReserves: "Chile 🇨🇱, USA 🇺🇸, Peru 🇵🇪, Poland 🇵🇱", globalSectors: "Aviation jet turbine blades", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 3600, recyclingRate: "20%", substitutability: "High Difficulty (0.85)",
    details: "Byproduct of copper/molybdenum mining. Rhenium-nickel superalloys withstand high centrifugal stress and temperature in commercial jet turbines."
  },
  { 
    name: "Strontium", symbol: "Sr", category: "Industrial",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Ferrite magnets, pyrotechnics, ceramics", indiaSources: "Spain 🇪🇸, China 🇨🇳, Mexico 🇲🇽",
    globalShare: "Spain 🇪🇸 (30%), China 🇨🇳 (25%), Mexico 🇲🇽 (20%)", globalReserves: "Spain 🇪🇸, China 🇨🇳, Turkey 🇹🇷, Mexico 🇲🇽", globalSectors: "Permanent magnets, metallurgy", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 2100, recyclingRate: "0%", substitutability: "Low Difficulty (0.45)",
    details: "Used in ferrite magnets for speakers, micro-motors, and television glass screens. Barium compounds serve as cheap, readily available substitutes."
  },
  { 
    name: "Molybdenum", symbol: "Mo", category: "Strategic",
    indiaImport: "High Import (95%)", indiaRisk: "medium", indiaSector: "High-temperature alloy steels, lubricants", indiaSources: "China 🇨🇳, Chile 🇨🇱, USA 🇺🇸, Peru 🇵🇪",
    globalShare: "China 🇨🇳 (45%), Chile 🇨🇱 (20%), USA 🇺🇸 (15%)", globalReserves: "China 🇨🇳, Peru 🇵🇪, Chile 🇨🇱, USA 🇺🇸", globalSectors: "Military steel armor, turbine blades", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 2600, recyclingRate: "25%", substitutability: "Medium Difficulty (0.65)",
    details: "Alloyed in stainless steel to enhance strength and weldability at extreme operating temperatures. Tungsten can substitute in demanding cutting tools."
  },
  { 
    name: "Cadmium", symbol: "Cd", category: "Industrial",
    indiaImport: "High Import (80%)", indiaRisk: "medium", indiaSector: "Corrosion-resistant plating, Ni-Cd batteries", indiaSources: "China 🇨🇳, South Korea 🇰🇷, Japan 🇯🇵, Canada 🇨🇦",
    globalShare: "China 🇨🇳 (35%), South Korea 🇰🇷 (12%), Japan 🇯🇵 (10%)", globalReserves: "China 🇨🇳, Peru 🇵🇪, India 🇮🇳, Canada 🇨🇦", globalSectors: "Corrosion barriers, Ni-Cd cells", globalRisk: "low",
    criticality: { in: true, us: true, eu: true },
    hhi: 1800, recyclingRate: "40%", substitutability: "Low Difficulty (0.55)",
    details: "Zinc smelting byproduct. Used in specialized corrosion-resistant plating and Ni-Cd battery cathodes. Nickel-Metal Hydride or Lithium-ion serve as substitutes."
  },
  { 
    name: "Chromium", symbol: "Cr", category: "Strategic",
    indiaImport: "Low Import / Exporting", indiaRisk: "low", indiaSector: "Stainless steel corrosion-resistance, plating", indiaSources: "South Africa 🇿🇦, India 🇮🇳, Turkey 🇹🇷, Kazakhstan 🇰🇿",
    globalShare: "South Africa 🇿🇦 (44%), Kazakhstan 🇰🇿 (15%), India 🇮🇳 (12%)", globalReserves: "Kazakhstan 🇰🇿, South Africa 🇿🇦, India 🇮🇳, Turkey 🇹🇷", globalSectors: "Stainless steel, defense armor plating", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 2700, recyclingRate: "35%", substitutability: "Extreme Difficulty (0.9)",
    details: "The defining element of stainless steel. Precludes atmospheric corrosion. Substitutes in alloys are non-existent; nickel alloys are a potential but highly expensive path."
  },
  { 
    name: "Manganese", symbol: "Mn", category: "Battery",
    indiaImport: "Low Import / Exporting", indiaRisk: "low", indiaSector: "Steel alloying, batteries", indiaSources: "South Africa 🇿🇦, India 🇮🇳, Gabon 🇬🇦, Australia 🇦🇺",
    globalShare: "South Africa 🇿🇦 (35%), Gabon 🇬🇦 (20%), Australia 🇦🇺 (12%)", globalReserves: "South Africa 🇿🇦, Brazil 🇧🇷, India 🇮🇳, Australia 🇦🇺", globalSectors: "Steel reinforcing, battery chemistries", globalRisk: "low",
    criticality: { in: true, us: true, eu: true },
    hhi: 1900, recyclingRate: "37%", substitutability: "Extreme Difficulty (0.9)",
    details: "Necessary for steel production (removes oxygen/sulfur). Also represents a key, low-cost component in emerging NMC battery chemistries."
  },

  // Additional World Critical Minerals (US/EU/Global list)
  {
    name: "Helium", symbol: "He", category: "Industrial",
    indiaImport: "Medium Import (50%)", indiaRisk: "medium", indiaSector: "MRI scanners, cryogenics, space applications", indiaSources: "USA 🇺🇸, Qatar 🇶🇦, Algeria 🇩🇿",
    globalShare: "USA 🇺🇸 (35%), Qatar 🇶🇦 (35%), Russia 🇷🇺 (10%)", globalReserves: "USA 🇺🇸, Qatar 🇶🇦, Algeria 🇩🇿, Russia 🇷🇺", globalSectors: "Cryogenics, semiconductors, gas cooling", globalRisk: "medium",
    criticality: { in: false, us: true, eu: true },
    hhi: 2400, recyclingRate: "0%", substitutability: "High Difficulty (0.85)",
    details: "Unreactive gas with the lowest boiling point. Essential for cooling MRI superconducting magnets and cleaning rocket propulsion lines. Substitutes do not exist."
  },
  {
    name: "Magnesium", symbol: "Mg", category: "Strategic",
    indiaImport: "High Import (85%)", indiaRisk: "medium", indiaSector: "Structural aluminum alloys, refractories", indiaSources: "China 🇨🇳, Turkey 🇹🇷, Israel 🇮🇱",
    globalShare: "China 🇨🇳 (90%), Russia 🇷🇺 (3%)", globalReserves: "China 🇨🇳, Russia 🇷🇺, Turkey 🇹🇷, Israel 🇮🇱", globalSectors: "Lightweight aircraft skins, car frames", globalRisk: "high",
    criticality: { in: false, us: true, eu: true },
    hhi: 8100, recyclingRate: "33%", substitutability: "Medium Difficulty (0.7)",
    details: "Third most common structural metal. Highly concentrated processing in China. Crucial alloy for lightweight transport frames. Aluminum and steel are substitutes."
  },
  {
    name: "Scandium", symbol: "Sc", category: "REE",
    indiaImport: "100% Imported", indiaRisk: "high", indiaSector: "Solid oxide fuel cells, specialty alloys", indiaSources: "China 🇨🇳, Japan 🇯🇵, Philippines 🇵🇭",
    globalShare: "China 🇨🇳 (60%), Russia 🇷🇺 (20%), Philippines 🇵🇭 (10%)", globalReserves: "China 🇨🇳, Russia 🇷🇺, Australia 🇦🇺, Philippines 🇵🇭", globalSectors: "SOFC fuel cells, aerospace alloys", globalRisk: "high",
    criticality: { in: false, us: true, eu: true },
    hhi: 4200, recyclingRate: "0%", substitutability: "High Difficulty (0.8)",
    details: "Added to aluminum to create high-strength, weldable aerospace alloys. Also used in Solid Oxide Fuel Cells (SOFC) as an electrolyte. Titanium serves as an alternative."
  },
  {
    name: "Rhodium", symbol: "Rh", category: "Industrial",
    indiaImport: "100% Imported", indiaRisk: "high", indiaSector: "Specialty chemicals, auto catalysts", indiaSources: "South Africa 🇿🇦, Russia 🇷🇺, UK 🇬🇧",
    globalShare: "South Africa 🇿🇦 (80%), Russia 🇷🇺 (10%)", globalReserves: "South Africa 🇿🇦, Russia 🇷🇺", globalSectors: "Automotive emission converters", globalRisk: "high",
    criticality: { in: false, us: true, eu: true },
    hhi: 6400, recyclingRate: "52%", substitutability: "High Difficulty (0.85)",
    details: "Byproduct of platinum mining. Essential for NOx reduction in gasoline catalytic converters. Substitutes (palladium/platinum) are less active catalysts."
  },
  {
    name: "Iridium", symbol: "Ir", category: "Industrial",
    indiaImport: "100% Imported", indiaRisk: "high", indiaSector: "Electronics spark plugs, electrolyzers", indiaSources: "South Africa 🇿🇦, UK 🇬🇧",
    globalShare: "South Africa 🇿🇦 (85%), Russia 🇷🇺 (5%)", globalReserves: "South Africa 🇿🇦, Russia 🇷🇺", globalSectors: "Green hydrogen PEM electrolyzers", globalRisk: "high",
    criticality: { in: false, us: true, eu: true },
    hhi: 7200, recyclingRate: "20%", substitutability: "High Difficulty (0.9)",
    details: "Most corrosion-resistant metal. Critical anode catalyst for Proton Exchange Membrane (PEM) water electrolyzers producing green hydrogen. Highly vulnerable."
  },
  {
    name: "Ruthenium", symbol: "Ru", category: "Industrial",
    indiaImport: "100% Imported", indiaRisk: "high", indiaSector: "Hard disk drive coatings, microchips", indiaSources: "South Africa 🇿🇦, Germany 🇩🇪, USA 🇺🇸",
    globalShare: "South Africa 🇿🇦 (90%), Russia 🇷🇺 (5%)", globalReserves: "South Africa 🇿🇦, Russia 🇷🇺", globalSectors: "Magnetoresistive storage (HDD), chemical cells", globalRisk: "high",
    criticality: { in: false, us: true, eu: true },
    hhi: 8100, recyclingRate: "15%", substitutability: "Medium Difficulty (0.75)",
    details: "Alloyed with platinum to create wear-resistant electrical contacts and thin-film layers on hard disk drives. Osmium serves as an alternative."
  },
  {
    name: "Cerium", symbol: "Ce", category: "REE",
    indiaImport: "High Import (90%)", indiaRisk: "medium", indiaSector: "Catalytic converters, glass polishing", indiaSources: "China 🇨🇳, Japan 🇯🇵, USA 🇺🇸",
    globalShare: "China 🇨🇳 (70%), USA 🇺🇸 (12%)", globalReserves: "China 🇨🇳, Russia 🇷🇺, India 🇮🇳, USA 🇺🇸", globalSectors: "Polishing microchips, catalytic systems", globalRisk: "medium",
    criticality: { in: false, us: true, eu: true },
    hhi: 4900, recyclingRate: "0%", substitutability: "Low Difficulty (0.45)",
    details: "The most abundant rare earth metal. Used as a polishing compound for computer chips and optics. Iron and silica are cheap alternative polishing matrices."
  },
  {
    name: "Lanthanum", symbol: "La", category: "REE",
    indiaImport: "High Import (90%)", indiaRisk: "medium", indiaSector: "Hybrid batteries, catalyst cracking", indiaSources: "China 🇨🇳, Japan 🇯🇵, USA 🇺🇸",
    globalShare: "China 🇨🇳 (70%), USA 🇺🇸 (12%)", globalReserves: "China 🇨🇳, Russia 🇷🇺, India 🇮🇳, USA 🇺🇸", globalSectors: "NiMH battery nodes, petroleum cracking", globalRisk: "medium",
    criticality: { in: false, us: true, eu: true },
    hhi: 4900, recyclingRate: "0%", substitutability: "Medium Difficulty (0.55)",
    details: "Used in hybrid car batteries (NiMH) and oil cracking catalysts. Rare earths have unique chemical attributes, but zeolite catalysts are alternatives."
  },
  {
    name: "Copper", symbol: "Cu", category: "Industrial",
    indiaImport: "Medium Import (50%)", indiaRisk: "medium", indiaSector: "Electrical wire harness, motors, power grid", indiaSources: "Chile 🇨🇱, Peru 🇵🇪, Zambia 🇿🇲, Australia 🇦🇺",
    globalShare: "Chile 🇨🇱 (28%), Peru 🇵🇪 (10%), China 🇨🇳 (9%), DR Congo 🇨🇩 (8%)", globalReserves: "Chile 🇨🇱, Peru 🇵🇪, Australia 🇦🇺, Russia 🇷🇺", globalSectors: "EV copper wiring, green power grids", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 1500, recyclingRate: "45%", substitutability: "Medium Difficulty (0.75)",
    details: "The backbone of electrical systems. Wind, solar, and EVs require 3-10x more copper than fossil fuel systems. Aluminum is an alternative but degrades conductivity."
  },
  {
    name: "Fluorite", symbol: "CaF2", category: "Industrial",
    indiaImport: "High Import (90%)", indiaRisk: "medium", indiaSector: "Steel smelting fluxes, fluorochemicals", indiaSources: "China 🇨🇳, Mexico 🇲🇽, South Africa 🇿🇦, Kenya 🇰🇪",
    globalShare: "China 🇨🇳 (60%), Mexico 🇲🇽 (15%), Mongolia 🇲🇳 (10%)", globalReserves: "China 🇨🇳, Mexico 🇲🇽, South Africa 🇿🇦, Morocco 🇲🇦", globalSectors: "Hydrofluoric acid, steelmaking fluxes", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 3800, recyclingRate: "0%", substitutability: "Medium Difficulty (0.6)",
    details: "Source of fluorine. Critical for manufacturing hydrofluoric acid (semiconductor etching and battery electrolyte processing). Calcium chloride can replace it in smelting."
  },
  {
    name: "Phosphorus", symbol: "P", category: "Battery",
    indiaImport: "Medium Import (60%)", indiaRisk: "medium", indiaSector: "LFP batteries, chemical fertilizers", indiaSources: "Morocco 🇲🇦, China 🇨🇳, Egypt 🇪🇬, Jordan 🇯🇴",
    globalShare: "Morocco 🇲🇦 (70%), China 🇨🇳 (10%)", globalReserves: "Morocco 🇲🇦, China 🇨🇳, Algeria 🇩🇿, Syria 🇸🇾", globalSectors: "LFP battery cathodes, agriculture", globalRisk: "low",
    criticality: { in: true, us: false, eu: true },
    hhi: 5100, recyclingRate: "0%", substitutability: "Extreme Difficulty (0.95)",
    details: "Used in LFP (Lithium Iron Phosphate) EV battery cathodes and agricultural fertilizers. Morocco controls 70% of global reserves. Non-substitutable in biology."
  },
  {
    name: "Tin", symbol: "Sn", category: "Industrial",
    indiaImport: "High Import (80%)", indiaRisk: "medium", indiaSector: "Electronic solder, plating processes", indiaSources: "Indonesia 🇮🇩, China 🇨🇳, Peru 🇵🇪, Malaysia 🇲🇾",
    globalShare: "China 🇨🇳 (30%), Indonesia 🇮🇩 (25%), Myanmar 🇲🇲 (12%), Peru 🇵🇪 (10%)", globalReserves: "China 🇨🇳, Indonesia 🇮🇩, Peru 🇵🇪, Brazil 🇧🇷", globalSectors: "Electronics board soldering", globalRisk: "medium",
    criticality: { in: true, us: true, eu: false },
    hhi: 1800, recyclingRate: "30%", substitutability: "Medium Difficulty (0.65)",
    details: "The glue of modern electronics. Solder joints connect all components on microchips and circuit boards. Lead-free solder relies on pure tin. Lead is a toxic alternative."
  },
  {
    name: "Potash", symbol: "K", category: "Industrial",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Agriculture fertilizers, chemical synthesis", indiaSources: "Canada 🇨🇦, Belarus 🇧🇾, Israel 🇮🇱, Russia 🇷🇺",
    globalShare: "Canada 🇨🇦 (30%), Belarus 🇧🇾 (20%), Russia 🇷🇺 (20%)", globalReserves: "Canada 🇨🇦, Belarus 🇧🇾, Russia 🇷🇺, China 🇨🇳", globalSectors: "Agricultural nutrients, chemicals", globalRisk: "high",
    criticality: { in: true, us: false, eu: false },
    hhi: 2200, recyclingRate: "0%", substitutability: "Extreme Difficulty (0.95)",
    details: "Critical nutrient for agricultural food security. India is completely dependent on imports. Extracted from deep potash salt mines. No chemical substitute exists."
  },
  {
    name: "Praseodymium", symbol: "Pr", category: "REE",
    indiaImport: "High Import (95%)", indiaRisk: "medium", indiaSector: "Permanent magnets, glass goggles, studio lighting", indiaSources: "China 🇨🇳, USA 🇺🇸, Australia 🇦🇺, India 🇮🇳",
    globalShare: "China 🇨🇳 (70%), USA 🇺🇸 (12%), Myanmar 🇲🇲 (8%), Australia 🇦🇺 (6%)", globalReserves: "China 🇨🇳, Vietnam 🇻🇳, Brazil 🇧🇷, India 🇮🇳", globalSectors: "EV traction motors, wind generator rotors", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 5200, recyclingRate: "< 1%", substitutability: "High Difficulty (0.85)",
    details: "Used in combination with Neodymium to create high-strength permanent magnets (Didymium) for electric vehicle drivetrains and wind turbine generators."
  },
  {
    name: "Terbium", symbol: "Tb", category: "REE",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Solid-state sonar transducers, green phosphors", indiaSources: "China 🇨🇳, Myanmar 🇲🇲",
    globalShare: "China 🇨🇳 (85%), Myanmar 🇲🇲 (10%)", globalReserves: "China 🇨🇳, Vietnam 🇻🇳, Brazil 🇧🇷", globalSectors: "High-temp permanent magnets, naval sonar", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 7400, recyclingRate: "< 1%", substitutability: "Extreme Difficulty (0.95)",
    details: "Critical heavy rare earth element added to magnets to preserve integrity under extreme operational stress. Essential for naval military defense actuators."
  },
  {
    name: "Yttrium", symbol: "Y", category: "REE",
    indiaImport: "High Import (90%)", indiaRisk: "medium", indiaSector: "Laser crystals (YAG), superconductors, ceramics", indiaSources: "China 🇨🇳, India 🇮🇳, Japan 🇯🇵",
    globalShare: "China 🇨🇳 (80%), India 🇮🇳 (5%), Malaysia 🇲🇾 (4%)", globalReserves: "China 🇨🇳, Brazil 🇧🇷, India 🇮🇳, Russia 🇷🇺", globalSectors: "Laser weapons, thermal barrier coatings", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 6500, recyclingRate: "0%", substitutability: "High Difficulty (0.8)",
    details: "Crucial for fabricating Yttrium Aluminum Garnet (YAG) crystals for medical and military range-finding lasers, as well as high-temperature thermal barrier coatings."
  },
  {
    name: "Osmium", symbol: "Os", category: "Industrial",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "High-wear electrical contacts, surgical implants", indiaSources: "South Africa 🇿🇦, Russia 🇷🇺, Canada 🇨🇦",
    globalShare: "South Africa 🇿🇦 (75%), Russia 🇷🇺 (15%), Canada 🇨🇦 (5%)", globalReserves: "South Africa 🇿🇦, Russia 🇷🇺, Zimbabwe 🇿🇼", globalSectors: "High-wear alloys, defense instrumentation", globalRisk: "high",
    criticality: { in: true, us: true, eu: true },
    hhi: 6000, recyclingRate: "10%", substitutability: "Medium Difficulty (0.7)",
    details: "The densest naturally occurring element. Sourced as a platinum byproduct. Used in extreme high-wear electrical contacts and specialized aerospace instrumentation."
  },
  {
    name: "Bauxite", symbol: "Al-Ore", category: "Strategic",
    indiaImport: "Low Import / Exporting", indiaRisk: "low", indiaSector: "Primary aluminum production, refractories", indiaSources: "India 🇮🇳, Guinea 🇬🇳, Australia 🇦🇺",
    globalShare: "Australia 🇦🇺 (28%), Guinea 🇬🇳 (25%), China 🇨🇳 (22%), Brazil 🇧🇷 (8%)", globalReserves: "Guinea 🇬🇳, Australia 🇦🇺, Vietnam 🇻🇳, Brazil 🇧🇷, India 🇮🇳", globalSectors: "Aviation airframes, lightweight vehicles", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 1800, recyclingRate: "65%", substitutability: "Medium Difficulty (0.6)",
    details: "The primary ore source for aluminum. Absolutely vital for lightweight military jet skins, commercial transport aircraft, and electric grid transmission wires."
  },
  {
    name: "Boron", symbol: "B", category: "Strategic",
    indiaImport: "High Import (85%)", indiaRisk: "medium", indiaSector: "Borosilicate glass, permanent magnets, shieldings", indiaSources: "Turkey 🇹🇷, USA 🇺🇸, Chile 🇨🇱",
    globalShare: "Turkey 🇹🇷 (60%), USA 🇺🇸 (20%), Chile 🇨🇱 (5%)", globalReserves: "Turkey 🇹🇷, USA 🇺🇸, Russia 🇷🇺, Chile 🇨🇱", globalSectors: "Nuclear control rods, wind turbine blades", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true },
    hhi: 4100, recyclingRate: "0%", substitutability: "Medium Difficulty (0.7)",
    details: "Used to strengthen fiber-glass wind turbine blades and permanent magnets. In nuclear defense, boron acts as an exceptional neutron absorber for shielding."
  },
  {
    name: "Barite", symbol: "BaSO4", category: "Industrial",
    indiaImport: "Low Import / Exporting", indiaRisk: "low", indiaSector: "Oil/gas drilling muds, barium chemicals", indiaSources: "India 🇮🇳, China 🇨🇳, Morocco 🇲🇦",
    globalShare: "China 🇨🇳 (35%), India 🇮🇳 (20%), Morocco 🇲🇦 (15%)", globalReserves: "Kazakhstan 🇰🇿, Turkey 🇹🇷, India 🇮🇳, China 🇨🇳", globalSectors: "Petroleum exploration drills, heavy concrete", globalRisk: "medium",
    criticality: { in: true, us: true, eu: false },
    hhi: 2100, recyclingRate: "0%", substitutability: "High Difficulty (0.85)",
    details: "Used as a weighting agent in deep petroleum drilling fluids to prevent blowouts. India's Mangampet deposit is one of the single largest barite mines in the world."
  }
];

const MineralsTable = forwardRef(({ categoryFilter, setCategoryFilter }, ref) => {
  const [viewMode, setViewMode] = useState('india'); // 'india' or 'global'
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null); // stores index of expanded mineral

  const filteredData = useMemo(() => {
    return mineralsDataset.filter(m => {
      // If India Focus is selected, only show minerals critical to India
      if (viewMode === 'india' && !m.criticality.in) {
        return false;
      }

      const searchMatch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.symbol.toLowerCase().includes(search.toLowerCase());
      
      const categoryMatch = (categoryFilter === 'all') || (m.category === categoryFilter);
      
      // Determine which risk status to filter by based on active view mode
      const activeRisk = viewMode === 'india' ? m.indiaRisk : m.globalRisk;
      const riskMatch = (riskFilter === 'all') || (activeRisk === riskFilter);
      
      return searchMatch && categoryMatch && riskMatch;
    });
  }, [search, categoryFilter, riskFilter, viewMode]);

  const getStatusStyle = (status) => {
    if (status === 'high') {
      return { color: 'var(--risk-high)', background: 'var(--risk-high-light)' };
    } else if (status === 'medium') {
      return { color: 'var(--risk-med)', background: 'var(--risk-med-light)' };
    }
    return { color: 'var(--risk-low)', background: 'var(--risk-low-light)' };
  };

  const handleRowClick = (idx) => {
    setExpandedRow(expandedRow === idx ? null : idx);
  };

  return (
    <section className="section" id="minerals-table" ref={ref}>
      <div className="container">
        <h2>
          {viewMode === 'india' ? "India's 30 Critical Minerals Register" : "Global Critical Minerals Database"}
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
          {viewMode === 'india' 
            ? "Explore the 30 critical minerals identified by the Ministry of Mines, highlighting import dependencies and sectors for India's economy."
            : "Review a comprehensive global catalog of 45+ critical minerals, showing supply monopolies, reserve holders, and criticality across regions."}
        </p>

        {/* View Mode Toggle Switcher */}
        <div className="view-mode-tabs">
          <button 
            className={`view-tab-btn ${viewMode === 'india' ? 'active' : ''}`}
            onClick={() => { setViewMode('india'); setRiskFilter('all'); setExpandedRow(null); }}
          >
            India Focus
          </button>
          <button 
            className={`view-tab-btn ${viewMode === 'global' ? 'active' : ''}`}
            onClick={() => { setViewMode('global'); setRiskFilter('all'); setExpandedRow(null); }}
          >
            Global Focus (USA/EU Comparison)
          </button>
        </div>

        {/* Filter Panel */}
        <div className="table-filter-bar reveal">
          <div className="search-input-wrapper">
            <svg className="search-icon-svg" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search by mineral name or chemical symbol..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select 
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Battery">Battery & Energy</option>
              <option value="REE">Rare Earth (REE)</option>
              <option value="Industrial">High-Tech Industrial</option>
              <option value="Strategic">Strategic & Defence</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Supply Risk</label>
            <select 
              className="filter-select"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="all">All Risks</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk / Self-Sufficient</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper reveal">
          <div style={{ padding: '0.75rem 1.5rem', background: 'var(--gold-light)', borderBottom: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            💡 Tip: Click on any row to expand detailed market metrics, HHI concentration indexes, and recycling potentials.
          </div>
          <table className="minerals-table">
            <thead>
              {viewMode === 'india' ? (
                <tr>
                  <th>Mineral Name</th>
                  <th>Symbol</th>
                  <th>Category</th>
                  <th>Import Dependency</th>
                  <th>Primary Sector Application</th>
                  <th>Key Source Nations</th>
                </tr>
              ) : (
                <tr>
                  <th>Mineral Name</th>
                  <th>Symbol</th>
                  <th>Category</th>
                  <th>Designated Critical</th>
                  <th>Global Production Share</th>
                  <th>Top Reserves Holders</th>
                  <th>Global Supply Risk</th>
                </tr>
              )}
            </thead>
            <tbody>
              {filteredData.map((m, idx) => (
                <React.Fragment key={idx}>
                  <tr 
                    className={`table-row-animate clickable-row ${expandedRow === idx ? 'expanded' : ''}`}
                    onClick={() => handleRowClick(idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td><strong>{m.name}</strong></td>
                    <td><code>{m.symbol}</code></td>
                    <td><span className="min-tag">{m.category}</span></td>
                    
                    {viewMode === 'india' ? (
                      <>
                        <td>
                          <span className="badge-risk" style={getStatusStyle(m.indiaRisk)}>
                            {m.indiaImport}
                          </span>
                        </td>
                        <td>{m.indiaSector}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {m.indiaSources}
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <div className="critical-flags">
                            {m.criticality.in && <span className="flag-badge" title="Critical in India">IN</span>}
                            {m.criticality.us && <span className="flag-badge" title="Critical in USA">US</span>}
                            {m.criticality.eu && <span className="flag-badge" title="Critical in EU">EU</span>}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.88rem' }}>{m.globalShare}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{m.globalReserves}</td>
                        <td>
                          <span className="badge-risk" style={getStatusStyle(m.globalRisk)}>
                            {m.globalRisk.toUpperCase()}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>

                  {/* Expanded Row Detail Drawer */}
                  {expandedRow === idx && (
                    <tr className="detail-drawer-row">
                      <td colSpan={viewMode === 'india' ? 6 : 7} style={{ padding: 0 }}>
                        <div className="detail-drawer-content" style={{ padding: '2rem', background: '#FDFCFB', borderLeft: '4px solid var(--maroon)', animation: 'drawerSlideDown 0.3s ease-out forwards' }}>
                          <h4 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--maroon)' }}>{m.name} ({m.symbol}) — Market Intelligence Details</h4>
                          
                          <div className="drawer-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="drawer-stat-card" style={{ background: '#FFFFFF', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                              <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>HHI Concentration Index</span>
                              <strong style={{ fontSize: '1.4rem', color: m.hhi > 5000 ? 'var(--risk-high)' : m.hhi > 2500 ? 'var(--risk-med)' : 'var(--risk-low)' }}>
                                {m.hhi} {m.hhi > 2500 ? ' (Highly Concentrated)' : ' (Moderately Dilute)'}
                              </strong>
                            </div>
                            <div className="drawer-stat-card" style={{ background: '#FFFFFF', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                              <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>End-Of-Life Recycling Rate</span>
                              <strong style={{ fontSize: '1.4rem', color: 'var(--teal)' }}>{m.recyclingRate}</strong>
                            </div>
                            <div className="drawer-stat-card" style={{ background: '#FFFFFF', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                              <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Substitutability Index</span>
                              <strong style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{m.substitutability}</strong>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>Geological & Industrial Context:</strong> <br />
                            {m.details}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={viewMode === 'india' ? 6 : 7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No minerals found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
});

export default MineralsTable;

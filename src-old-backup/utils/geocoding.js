const LOCATION_MAP = {
  // Universities
  'Cyberport': { lat: 22.2608, lng: 114.1292, name: 'Cyberport' },
  'HKSTP': { lat: 22.4264, lng: 114.2058, name: 'Hong Kong Science & Technology Park' },
  'HKU': { lat: 22.2835, lng: 114.1360, name: 'The University of Hong Kong' },
  'HKUST': { lat: 22.3364, lng: 114.2655, name: 'Hong Kong University of Science & Technology' },
  'CUHK': { lat: 22.4189, lng: 114.2071, name: 'Chinese University of Hong Kong' },
  'CityU': { lat: 22.3353, lng: 114.1744, name: 'City University of Hong Kong' },
  'PolyU': { lat: 22.3037, lng: 114.1798, name: 'Hong Kong Polytechnic University' },
  // Funding & government
  'InvestHK': { lat: 22.2793, lng: 114.1628, name: 'InvestHK' },
  'Zeroth.AI': { lat: 22.2608, lng: 114.1292, name: 'Zeroth (Cyberport)' },
  'Zeroth': { lat: 22.2608, lng: 114.1292, name: 'Zeroth (Cyberport)' },
  'Brinc': { lat: 22.3193, lng: 114.1694, name: 'Brinc Accelerator' },
  'Blueprint': { lat: 22.2840, lng: 114.1584, name: 'Blueprint by HSBC' },
  'Innovation & Technology Fund': { lat: 22.2793, lng: 114.1628, name: 'Innovation & Technology Fund' },
  'Technology Voucher': { lat: 22.2793, lng: 114.1628, name: 'Technology Voucher Programme' },
  'HKSAR Government': { lat: 22.2793, lng: 114.1628, name: 'HKSAR Government' },
  'PhD Fellowship': { lat: 22.3193, lng: 114.1694, name: 'HK PhD Fellowship Scheme' },
  // Nationality communities
  'Spanish Chamber': { lat: 22.2819, lng: 114.1580, name: 'Spanish Chamber of Commerce HK' },
  'French Chamber': { lat: 22.2819, lng: 114.1580, name: 'French Chamber HK' },
  'German Chamber': { lat: 22.2805, lng: 114.1595, name: 'German Chamber of Commerce HK' },
  'German Business': { lat: 22.2805, lng: 114.1595, name: 'German Business Association HK' },
  'Indian Founders': { lat: 22.2819, lng: 114.1580, name: 'Indian Founders HK' },
  'Latin American': { lat: 22.2819, lng: 114.1580, name: 'Latin American Community HK' },
  'EuroExpats': { lat: 22.2819, lng: 114.1580, name: 'EuroExpats HK' },
  'Erasmus Alumni': { lat: 22.2819, lng: 114.1580, name: 'Erasmus Alumni HK Network' },
  // Entrepreneurship communities
  'StartupHK': { lat: 22.2819, lng: 114.1580, name: 'StartupHK' },
  'Women Founders': { lat: 22.2819, lng: 114.1580, name: 'Women Founders HK' },
  'AI Community': { lat: 22.2819, lng: 114.1580, name: 'AI Community HK' },
  'FinTech Association': { lat: 22.2819, lng: 114.1580, name: 'FinTech Association HK' },
  'RISE Conference': { lat: 22.3008, lng: 114.1722, name: 'RISE Conference (HKCEC)' },
  'InnoHK': { lat: 22.4264, lng: 114.2058, name: 'InnoHK Research Clusters (HKSTP)' },
  'WHub': { lat: 22.2819, lng: 114.1580, name: 'WHub Hong Kong' },
  'Garage Society': { lat: 22.2830, lng: 114.1560, name: 'Garage Society HK' },
  'PropTech': { lat: 22.2819, lng: 114.1580, name: 'PropTech Association HK' },
  // Social integration
  'Foodlink': { lat: 22.3193, lng: 114.1747, name: 'Foodlink Foundation' },
  'HKTE': { lat: 22.2793, lng: 114.1628, name: 'Hong Kong Talent Engage' },
  'Cantonese': { lat: 22.2819, lng: 114.1580, name: 'Cantonese Classes Central' },
  'Trail Runners': { lat: 22.2620, lng: 114.1962, name: 'Hong Kong Trail' },
  'Language Exchange': { lat: 22.2819, lng: 114.1580, name: "M'goi Language Exchange" },
  'HandsOn': { lat: 22.2819, lng: 114.1580, name: 'HandsOn Hong Kong' },
  'Outward Bound': { lat: 22.3748, lng: 114.1111, name: 'Outward Bound HK' },
  'Social Hub': { lat: 22.2819, lng: 114.1580, name: 'HK Social Hub' },
  'Dragon Boat': { lat: 22.2855, lng: 114.1722, name: 'HK Dragon Boat Association' },
  // Student communities
  'AIESEC': { lat: 22.3193, lng: 114.1694, name: 'AIESEC Hong Kong' },
};

const DEFAULT_LOCATION = {
  lat: 22.2819,
  lng: 114.1580,
  name: 'Central, Hong Kong'
};

export function getCoordinates(name) {
  if (!name) return DEFAULT_LOCATION;

  const nameLower = name.toLowerCase();
  const key = Object.keys(LOCATION_MAP).find(k =>
    nameLower.includes(k.toLowerCase())
  );

  if (key) {
    return LOCATION_MAP[key];
  }

  console.log(`[Geocoding] Unknown location: "${name}" - using default (Central HK)`);
  return { ...DEFAULT_LOCATION, name };
}

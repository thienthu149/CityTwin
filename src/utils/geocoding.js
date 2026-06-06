const LOCATION_MAP = {
  'Cyberport': { lat: 22.2608, lng: 114.1292, name: 'Cyberport' },
  'HKSTP': { lat: 22.4264, lng: 114.2058, name: 'Hong Kong Science & Technology Park' },
  'HKU': { lat: 22.2835, lng: 114.1360, name: 'The University of Hong Kong' },
  'HKUST': { lat: 22.3364, lng: 114.2655, name: 'Hong Kong University of Science & Technology' },
  'CUHK': { lat: 22.4189, lng: 114.2071, name: 'Chinese University of Hong Kong' },
  'InvestHK': { lat: 22.2793, lng: 114.1628, name: 'InvestHK' },
  'Zeroth.AI': { lat: 22.2608, lng: 114.1292, name: 'Zeroth.AI (Cyberport)' },
  'Zeroth': { lat: 22.2608, lng: 114.1292, name: 'Zeroth.AI (Cyberport)' },
  'Brinc': { lat: 22.3193, lng: 114.1694, name: 'Brinc Accelerator' },
  'Spanish Chamber': { lat: 22.2819, lng: 114.1580, name: 'Spanish Chamber of Commerce HK' },
  'German Chamber': { lat: 22.2805, lng: 114.1595, name: 'German Chamber of Commerce HK' },
  'AI Community': { lat: 22.2819, lng: 114.1580, name: 'AI Community HK' },
  'StartupHK': { lat: 22.2819, lng: 114.1580, name: 'StartupHK Community' },
  'Indian Founders': { lat: 22.2819, lng: 114.1580, name: 'Indian Founders HK' },
  'Women Founders': { lat: 22.2819, lng: 114.1580, name: 'Women Founders HK' },
  'Foodlink': { lat: 22.3193, lng: 114.1747, name: 'Foodlink Foundation' },
  'HKTE': { lat: 22.2793, lng: 114.1628, name: 'Hong Kong Trade & Enterprise' },
  'Erasmus Alumni': { lat: 22.2819, lng: 114.1580, name: 'Erasmus Alumni HK' },
  'EuroExpats': { lat: 22.2819, lng: 114.1580, name: 'EuroExpats HK' },
  'InnoHK': { lat: 22.4264, lng: 114.2058, name: 'InnoHK Cluster (HKSTP)' },
  'Cantonese': { lat: 22.2819, lng: 114.1580, name: 'Cantonese Classes Central' },
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

/** Country definitions used across the TradeForge platform. */
export interface ICountryDefinition {
  code: string;
  name: string;
  dialCode: string;
  continent: string;
}

export const COUNTRIES: Record<string, ICountryDefinition> = {
  US: { code: 'US', name: 'United States', dialCode: '+1', continent: 'North America' },
  GB: { code: 'GB', name: 'United Kingdom', dialCode: '+44', continent: 'Europe' },
  DE: { code: 'DE', name: 'Germany', dialCode: '+49', continent: 'Europe' },
  FR: { code: 'FR', name: 'France', dialCode: '+33', continent: 'Europe' },
  IT: { code: 'IT', name: 'Italy', dialCode: '+39', continent: 'Europe' },
  ES: { code: 'ES', name: 'Spain', dialCode: '+34', continent: 'Europe' },
  NL: { code: 'NL', name: 'Netherlands', dialCode: '+31', continent: 'Europe' },
  PL: { code: 'PL', name: 'Poland', dialCode: '+48', continent: 'Europe' },
  SE: { code: 'SE', name: 'Sweden', dialCode: '+46', continent: 'Europe' },
  NO: { code: 'NO', name: 'Norway', dialCode: '+47', continent: 'Europe' },
  CH: { code: 'CH', name: 'Switzerland', dialCode: '+41', continent: 'Europe' },
  CN: { code: 'CN', name: 'China', dialCode: '+86', continent: 'Asia' },
  JP: { code: 'JP', name: 'Japan', dialCode: '+81', continent: 'Asia' },
  IN: { code: 'IN', name: 'India', dialCode: '+91', continent: 'Asia' },
  KR: { code: 'KR', name: 'South Korea', dialCode: '+82', continent: 'Asia' },
  SG: { code: 'SG', name: 'Singapore', dialCode: '+65', continent: 'Asia' },
  HK: { code: 'HK', name: 'Hong Kong', dialCode: '+852', continent: 'Asia' },
  MY: { code: 'MY', name: 'Malaysia', dialCode: '+60', continent: 'Asia' },
  TH: { code: 'TH', name: 'Thailand', dialCode: '+66', continent: 'Asia' },
  ID: { code: 'ID', name: 'Indonesia', dialCode: '+62', continent: 'Asia' },
  VN: { code: 'VN', name: 'Vietnam', dialCode: '+84', continent: 'Asia' },
  AE: { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', continent: 'Asia' },
  SA: { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', continent: 'Asia' },
  TR: { code: 'TR', name: 'Turkey', dialCode: '+90', continent: 'Asia' },
  AU: { code: 'AU', name: 'Australia', dialCode: '+61', continent: 'Oceania' },
  NZ: { code: 'NZ', name: 'New Zealand', dialCode: '+64', continent: 'Oceania' },
  CA: { code: 'CA', name: 'Canada', dialCode: '+1', continent: 'North America' },
  MX: { code: 'MX', name: 'Mexico', dialCode: '+52', continent: 'North America' },
  BR: { code: 'BR', name: 'Brazil', dialCode: '+55', continent: 'South America' },
  AR: { code: 'AR', name: 'Argentina', dialCode: '+54', continent: 'South America' },
  CL: { code: 'CL', name: 'Chile', dialCode: '+56', continent: 'South America' },
  CO: { code: 'CO', name: 'Colombia', dialCode: '+57', continent: 'South America' },
  ZA: { code: 'ZA', name: 'South Africa', dialCode: '+27', continent: 'Africa' },
  NG: { code: 'NG', name: 'Nigeria', dialCode: '+234', continent: 'Africa' },
  EG: { code: 'EG', name: 'Egypt', dialCode: '+20', continent: 'Africa' },
  KE: { code: 'KE', name: 'Kenya', dialCode: '+254', continent: 'Africa' },
};

export const COUNTRY_CODES: string[] = Object.keys(COUNTRIES);

/** Returns true if the given ISO 3166-1 alpha-2 code is recognised by TradeForge. */
export function isValidCountryCode(code: string): boolean {
  return Object.prototype.hasOwnProperty.call(COUNTRIES, code.toUpperCase());
}

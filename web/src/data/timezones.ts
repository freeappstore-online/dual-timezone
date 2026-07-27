import type { TimezoneOption } from '../types';

const predefinedAliases: Record<string, { label: string, terms: string[] }> = {
  'Asia/Jakarta': { label: 'Jakarta, Indonesia', terms: ['wib', 'bekasi', 'depok', 'indonesia'] },
  'Europe/London': { label: 'London, United Kingdom', terms: ['gmt', 'bst', 'uk', 'great britain', 'england'] },
  'America/New_York': { label: 'New York, United States', terms: ['est', 'edt', 'usa', 'nyc', 'us'] },
  'Pacific/Auckland': { label: 'Auckland, New Zealand', terms: ['nzst', 'nzdt', 'nz', 'new zealand'] },
  'Australia/Sydney': { label: 'Sydney, Australia', terms: ['aest', 'aedt', 'australia'] },
  'Asia/Singapore': { label: 'Singapore', terms: ['sgt', 'singapore'] },
  'Europe/Berlin': { label: 'Berlin, Germany', terms: ['cet', 'cest', 'germany'] },
  'Europe/Vienna': { label: 'Vienna, Austria', terms: ['cet', 'cest', 'austria', 'wina'] },
  'Asia/Dubai': { label: 'Dubai, United Arab Emirates', terms: ['gst', 'uae', 'united arab emirates'] },
  'Asia/Ho_Chi_Minh': { label: 'Ho Chi Minh City, Vietnam', terms: ['ict', 'vietnam', 'saigon'] },
  'Europe/Sarajevo': { label: 'Sarajevo, Bosnia', terms: ['cet', 'cest', 'bosnia'] },
  'America/Toronto': { label: 'Toronto, Canada', terms: ['est', 'edt', 'canada'] }
};

let cachedTimezones: TimezoneOption[] | null = null;

export function getTimezones(): TimezoneOption[] {
  if (cachedTimezones) return cachedTimezones;
  
  try {
    const supported = Intl.supportedValuesOf('timeZone');
    cachedTimezones = supported.map(id => {
      const predefined = predefinedAliases[id];
      const cityFriendly = id.split('/').pop()?.replace(/_/g, ' ') || id;
      
      let abbr = '';
      try {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: id, timeZoneName: 'short' }).formatToParts(new Date());
        const tzPart = parts.find(p => p.type === 'timeZoneName');
        if (tzPart) abbr = tzPart.value.toLowerCase();
      } catch (e) {}

      return {
        id,
        label: predefined ? predefined.label : `${cityFriendly} (${id.split('/')[0]})`,
        searchTerms: [
          id.toLowerCase(),
          cityFriendly.toLowerCase(),
          abbr,
          ...(predefined?.terms || [])
        ].filter(Boolean)
      };
    });
  } catch (e) {
    cachedTimezones = [];
  }
  
  return cachedTimezones;
}

export function getCityName(tzId: string): string {
  const option = getTimezones().find(t => t.id === tzId);
  if (option) {
    return option.label.split(',')[0];
  }
  return tzId.split('/').pop()?.replace(/_/g, ' ') || tzId;
}

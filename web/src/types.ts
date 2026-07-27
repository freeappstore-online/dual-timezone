// Add your shared types here.
export type TimezoneOption = {
  id: string;
  label: string;
  searchTerms: string[];
};

export type Meeting = {
  id: string;
  title: string;
  timeStr: string;
  targetCityId: string;
  note?: string;
  completed: boolean;
};


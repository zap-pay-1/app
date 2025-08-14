/* eslint-disable @typescript-eslint/ban-ts-comment */
// hooks/useCountriesWithPhoneCodes.ts
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export interface CountryData {
  name: {
    common: string;
    official?: string;
  };
  cca2: string; // ISO 3166-1 alpha-2
  idd: {
    root?: string;
    suffixes?: string[];
  };
  flags?: {
    svg?: string;
    png?: string;
  };
}

export type CountryWithPhoneCode = {
  name: string;
  code: string; // ISO country code
  phoneCode: string; // Eg "+1"
  flagUrl?: string | undefined;
};

export const useCountriesWithPhoneCodes = () => {
  return useQuery<CountryWithPhoneCode[], Error>({
    queryKey: ['countriesWithPhoneCodes'],
    queryFn: async (): Promise<CountryWithPhoneCode[]> => {
      const res = await axios.get<CountryData[]>('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
      //@ts-ignore
      return res.data
        .map((c) => {
          const root = c.idd.root;
          const suffix = c.idd.suffixes?.[0];
          if (!root || !suffix) return null;
          return {
            name: c.name.common,
            code: c.cca2,
            phoneCode: `${root}${suffix}`,
            flagUrl: c.flags?.png,
          };
        })
        //@ts-ignore
        .filter((c): c is CountryWithPhoneCode => c !== null)
        //@ts-ignore
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    //@ts-ignore
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export type SupportedCurrency = 'NGN' | 'USD' | 'GBP' | 'EUR';

export interface CurrencyRates {
  NGN: number; // base: 1
  USD: number; // 1 USD = ~1550 NGN
  GBP: number; // 1 GBP = ~1980 NGN
  EUR: number; // 1 EUR = ~1680 NGN
}

export const DEFAULT_RATES: CurrencyRates = {
  NGN: 1,
  USD: 1550,
  GBP: 1980,
  EUR: 1680,
};

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
  EUR: '€',
};

export function convertFromNGN(amountNgn: number, targetCurrency: SupportedCurrency, rates = DEFAULT_RATES): number {
  if (targetCurrency === 'NGN') return amountNgn;
  const rate = rates[targetCurrency] || 1;
  const converted = amountNgn / rate;
  return Math.round(converted * 100) / 100;
}

export function formatPrice(amountNgn: number, targetCurrency: SupportedCurrency, rates = DEFAULT_RATES): string {
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || '₦';
  if (targetCurrency === 'NGN') {
    return `${symbol}${amountNgn.toLocaleString()}`;
  }
  const converted = convertFromNGN(amountNgn, targetCurrency, rates);
  return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

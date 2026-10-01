// Simulated rates for demo. Real rates would come from an API.
export const CURRENCIES = [
  { code: 'ZAR', label: 'South African Rand',  symbol: 'R'   },
  { code: 'USD', label: 'US Dollar',           symbol: '$'   },
  { code: 'GBP', label: 'British Pound',       symbol: '£'   },
  { code: 'EUR', label: 'Euro',                symbol: '€'   },
  { code: 'ZWL', label: 'Zimbabwe Dollar',     symbol: 'Z$'  },
  { code: 'MWK', label: 'Malawian Kwacha',     symbol: 'MK'  },
  { code: 'ZMW', label: 'Zambian Kwacha',      symbol: 'ZK'  },
  { code: 'MZN', label: 'Mozambican Metical',  symbol: 'MT'  }
];

// send → receive rates (1 unit of send = X of receive)
export const FX = {
  ZAR: { ZAR: 1,     USD: 0.054, GBP: 0.043, EUR: 0.050, ZWL: 19.5, MWK: 92,  ZMW: 1.4,  MZN: 3.4  },
  USD: { ZAR: 18.5,  USD: 1,     GBP: 0.79,  EUR: 0.92,  ZWL: 361,  MWK: 1700, ZMW: 26,  MZN: 63   },
  GBP: { ZAR: 23.4,  USD: 1.27,  GBP: 1,     EUR: 1.17,  ZWL: 456,  MWK: 2150, ZMW: 33,  MZN: 80   },
  EUR: { ZAR: 20,    USD: 1.09,  GBP: 0.86,  EUR: 1,     ZWL: 390,  MWK: 1840, ZMW: 28,  MZN: 68   },
  ZWL: { ZAR: 0.051, USD: 0.0028, GBP: 0.0022, EUR: 0.0026, ZWL: 1, MWK: 4.7, ZMW: 0.072, MZN: 0.17 },
  MWK: { ZAR: 0.011, USD: 0.00059, GBP: 0.00047, EUR: 0.00054, ZWL: 0.21, MWK: 1, ZMW: 0.015, MZN: 0.037 },
  ZMW: { ZAR: 0.72,  USD: 0.038, GBP: 0.030, EUR: 0.035, ZWL: 13.9, MWK: 65, ZMW: 1,     MZN: 2.4  },
  MZN: { ZAR: 0.29,  USD: 0.016, GBP: 0.0125, EUR: 0.0147, ZWL: 5.8, MWK: 27, ZMW: 0.42, MZN: 1    }
};

export function getRate(from, to) {
  return FX[from]?.[to] ?? 1;
}

export function getCurrency(code) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function formatMoney(amount, code) {
  const c = getCurrency(code);
  const rounded = code === 'ZWL' || code === 'MWK' || code === 'ZMW'
    ? Math.round(amount)
    : amount.toFixed(2);
  return `${c.symbol}${rounded}`;
}
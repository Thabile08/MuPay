// Simulated rates for demo. Real rates would come from an API.
export const CURRENCIES = [
  { code: 'ZAR', label: 'South African Rand',  symbol: 'R'   },
  { code: 'USD', label: 'US Dollar',           symbol: '$'   },
  { code: 'GBP', label: 'British Pound',       symbol: '£'   },
  { code: 'EUR', label: 'Euro',                symbol: '€'   },
  { code: 'ZWG', label: 'Zimbabwe Gold (ZiG)', symbol: 'ZiG ' },
  { code: 'MWK', label: 'Malawian Kwacha',     symbol: 'MK'  },
  { code: 'ZMW', label: 'Zambian Kwacha',      symbol: 'ZK'  },
  { code: 'MZN', label: 'Mozambican Metical',  symbol: 'MT'  }
];

// send → receive rates (1 unit of send = X of receive). Simulated.
export const FX = {
  ZAR: { ZAR: 1,     USD: 0.054, GBP: 0.043, EUR: 0.050, ZWG: 1.4,   MWK: 92,  ZMW: 1.4,  MZN: 3.4  },
  USD: { ZAR: 18.5,  USD: 1,     GBP: 0.79,  EUR: 0.92,  ZWG: 25.7,  MWK: 1700, ZMW: 26,  MZN: 63   },
  GBP: { ZAR: 23.4,  USD: 1.27,  GBP: 1,     EUR: 1.17,  ZWG: 32.6,  MWK: 2150, ZMW: 33,  MZN: 80   },
  EUR: { ZAR: 20,    USD: 1.09,  GBP: 0.86,  EUR: 1,     ZWG: 28,    MWK: 1840, ZMW: 28,  MZN: 68   },
  ZWG: { ZAR: 0.71,  USD: 0.039, GBP: 0.031, EUR: 0.036, ZWG: 1,     MWK: 66,   ZMW: 1.0,  MZN: 2.45 },
  MWK: { ZAR: 0.011, USD: 0.00059, GBP: 0.00047, EUR: 0.00054, ZWG: 0.015, MWK: 1, ZMW: 0.015, MZN: 0.037 },
  ZMW: { ZAR: 0.72,  USD: 0.038, GBP: 0.030, EUR: 0.035, ZWG: 0.98,  MWK: 65,   ZMW: 1,     MZN: 2.4  },
  MZN: { ZAR: 0.29,  USD: 0.016, GBP: 0.0125, EUR: 0.0147, ZWG: 0.41, MWK: 27,   ZMW: 0.42, MZN: 1    }
};

export function getRate(from, to) {
  return FX[from]?.[to] ?? 1;
}

export function getCurrency(code) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function formatMoney(amount, code) {
  const c = getCurrency(code);
  const rounded = code === 'MWK' || code === 'ZMW'
    ? Math.round(amount)
    : amount.toFixed(2);
  return `${c.symbol}${rounded}`;
}

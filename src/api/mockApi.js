export const mockApi = {
  getRate: (country) => {
    const rates = { ZW: 1, MW: 1, ZM: 1, MZ: 1, KE: 1 };
    return rates[country] ?? 1;
  },
  getFee: (amount) => {
    if (amount <= 100) return 2;
    if (amount <= 500) return 5;
    return 8;
  },
  generateRef: () => 'MK' + Math.floor(Math.random() * 900000 + 100000),
  getTransactions: () => [
    { id: 't1', status: 'COLLECTED', amount: 200, currency: 'ZAR' }
  ],
  getNotifications: () => [
    { id: 'n1', message: 'readyToCollect' }
  ]
};
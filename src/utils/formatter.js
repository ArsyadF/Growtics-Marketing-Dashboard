// File: src/utils/formatter.js
export const formatRp = (num) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(num || 0);
};
import { LoanScheduleRow } from '../types';

export function formatVND(value: number): string {
  if (isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function parseNumberFromInput(raw: string): number {
  const cleaned = raw.replace(/[^\d]/g, '');
  if (!cleaned) return 0;
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

export function formatDateVN(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function generateVoucherCode(): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `VB-${digits}`;
}

export interface LoanCalcParams {
  principal: number;
  termMonths: number;
  annualRatePct: number;
  disbursementDate: string; // YYYY-MM-DD
  cycleDivisor: number; // 12 for monthly, 4 for quarterly, 2 for 6-month, 1 for yearly
  paymentDay: number; // 1 to 31
  roundingFactor: number; // 1 or 1000
}

export function calculateLoanSchedule(params: LoanCalcParams): {
  rows: LoanScheduleRow[];
  totalPrincipal: number;
  totalInterest: number;
  grandTotal: number;
  firstMonthPayment: number;
  lastMonthPayment: number;
} {
  const {
    principal,
    termMonths,
    annualRatePct,
    disbursementDate,
    cycleDivisor,
    paymentDay,
    roundingFactor,
  } = params;

  if (principal <= 0 || termMonths <= 0 || annualRatePct < 0) {
    return {
      rows: [],
      totalPrincipal: 0,
      totalInterest: 0,
      grandTotal: 0,
      firstMonthPayment: 0,
      lastMonthPayment: 0,
    };
  }

  // Number of periods
  const monthsPerPeriod = 12 / cycleDivisor;
  const totalPeriods = Math.ceil(termMonths / monthsPerPeriod);
  if (totalPeriods <= 0) {
    return {
      rows: [],
      totalPrincipal: 0,
      totalInterest: 0,
      grandTotal: 0,
      firstMonthPayment: 0,
      lastMonthPayment: 0,
    };
  }

  const periodRate = (annualRatePct / 100) / cycleDivisor;
  const rawPrincipalPerPeriod = principal / totalPeriods;

  const roundValue = (val: number) => {
    if (roundingFactor === 1000) {
      return Math.round(val / 1000) * 1000;
    }
    return Math.round(val);
  };

  const rows: LoanScheduleRow[] = [];
  let currentBalance = principal;
  let cumPrincipal = 0;
  let totalInterest = 0;

  const startDate = disbursementDate ? new Date(disbursementDate) : new Date();

  // Initial row 0 (Giải ngân)
  rows.push({
    period: 0,
    dateStr: formatDateVN(startDate),
    beginningBalance: currentBalance,
    principal: 0,
    interest: 0,
    totalPayment: 0,
    endingBalance: currentBalance,
  });

  for (let p = 1; p <= totalPeriods; p++) {
    // Generate scheduled payment date
    // Starting from next period month
    const payDate = new Date(startDate);
    payDate.setMonth(startDate.getMonth() + p * monthsPerPeriod);
    
    // Attempt to set paymentDay
    const maxDaysInMonth = new Date(payDate.getFullYear(), payDate.getMonth() + 1, 0).getDate();
    payDate.setDate(Math.min(paymentDay || 25, maxDaysInMonth));

    const beginningBalance = currentBalance;
    const interestRaw = beginningBalance * periodRate;
    const interest = roundValue(interestRaw);

    let periodPrincipal: number;
    if (p === totalPeriods) {
      // Last period: absorb any remaining principal from previous roundings
      periodPrincipal = beginningBalance;
    } else {
      periodPrincipal = roundValue(rawPrincipalPerPeriod);
      // Safeguard not to exceed
      if (periodPrincipal > beginningBalance) {
        periodPrincipal = beginningBalance;
      }
    }

    const endingBalance = Math.max(0, beginningBalance - periodPrincipal);
    const totalPayment = periodPrincipal + interest;

    cumPrincipal += periodPrincipal;
    totalInterest += interest;
    currentBalance = endingBalance;

    rows.push({
      period: p,
      dateStr: formatDateVN(payDate),
      beginningBalance,
      principal: periodPrincipal,
      interest,
      totalPayment,
      endingBalance,
    });
  }

  const totalPrincipal = principal;
  const grandTotal = totalPrincipal + totalInterest;
  const firstMonthPayment = rows.length > 1 ? rows[1].totalPayment : 0;
  const lastMonthPayment = rows.length > 1 ? rows[rows.length - 1].totalPayment : 0;

  return {
    rows,
    totalPrincipal,
    totalInterest,
    grandTotal,
    firstMonthPayment,
    lastMonthPayment,
  };
}

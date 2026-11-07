import React, { useState, useId } from 'react';
import contentData from '../data/contentData.json';
import {
  formatVND,
  formatNumber,
  parseNumberFromInput,
  calculateLoanSchedule,
} from '../utils/formatters';
import {
  Calculator,
  Calendar,
  Percent,
  FileSpreadsheet,
  ChevronLeft,
  X,
  Coins,
  ChevronRight,
  TrendingDown,
  Printer,
  Download,
} from 'lucide-react';

interface LoanScheduleSectionProps {
  onBackToMenu: () => void;
}

export const LoanScheduleSection: React.FC<LoanScheduleSectionProps> = ({
  onBackToMenu,
}) => {
  const loanPrincipalId = useId();
  const loanTermId = useId();
  const loanRateId = useId();
  const disburseDateId = useId();
  const payDayId = useId();
  const loanCycleId = useId();
  const loanRoundingId = useId();
  const { loanScheduleData } = contentData;

  // Form states
  const [principalStr, setPrincipalStr] = useState<string>('500,000,000');
  const [termMonths, setTermMonths] = useState<number>(24);
  const [annualRate, setAnnualRate] = useState<number>(8.5);
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-01-10');
  const [selectedCycleId, setSelectedCycleId] = useState<string>('monthly');
  const [paymentDay, setPaymentDay] = useState<number>(25);
  const [roundingFactor, setRoundingFactor] = useState<number>(1000); // 1 or 1000
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Quick preset loan amounts
  const loanPresets = [
    { label: '100 Triệu', value: 100000000 },
    { label: '300 Triệu', value: 300000000 },
    { label: '500 Triệu', value: 500000000 },
    { label: '1 Tỷ', value: 1000000000 },
    { label: '2 Tỷ', value: 2000000000 },
  ];

  const principal = parseNumberFromInput(principalStr);

  // Get Cycle divisor
  const currentCycle =
    loanScheduleData.cycles.find((c) => c.id === selectedCycleId) ||
    loanScheduleData.cycles[0];

  // Calculate schedule
  const scheduleResult = calculateLoanSchedule({
    principal,
    termMonths,
    annualRatePct: annualRate,
    disbursementDate,
    cycleDivisor: currentCycle.divisor,
    paymentDay,
    roundingFactor,
  });

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    if (!rawValue) {
      setPrincipalStr('');
      return;
    }
    const num = parseInt(rawValue, 10);
    setPrincipalStr(formatNumber(num));
  };

  const exportCSV = () => {
    if (!scheduleResult.rows.length) return;
    const headers = [
      'Kỳ',
      'Ngày trả nợ',
      'Số gốc còn lại (VNĐ)',
      'Gốc (VNĐ)',
      'Lãi (VNĐ)',
      'Tổng gốc + Lãi (VNĐ)',
    ];
    const csvContent = [
      headers.join(','),
      ...scheduleResult.rows.map((r) =>
        [
          r.period,
          r.dateStr,
          r.beginningBalance,
          r.principal,
          r.interest,
          r.totalPayment,
        ].join(',')
      ),
      `TỔNG CỘNG,,${principal},${scheduleResult.totalPrincipal},${scheduleResult.totalInterest},${scheduleResult.grandTotal}`,
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Lich_tra_no_VietinBank_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Menu chính
        </button>

        <span className="text-xs font-medium text-slate-500">
          Công cụ tính toán tài chính VietinBank
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003966] via-[#005596] to-[#0270c2] text-white p-6 sm:p-8 rounded-2xl shadow-xs border border-sky-800">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-sky-200 border border-white/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>Phương thức Dư Nợ Giảm Dần</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {loanScheduleData.title}
          </h2>
          <p className="text-xs sm:text-sm text-sky-100">
            Gốc trả đều mỗi kỳ, tiền lãi tính trên dư nợ thực tế. Số tiền trả giảm dần theo thời gian, giúp tiết kiệm chi phí lãi vay tối đa.
          </p>
        </div>
      </div>

      {/* Main Container: Step 1 (Inputs) & Result Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step 1 Inputs (Exact PDF: Số tiền vay dạng nhập, không kéo thả) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#005596] text-white text-[10px] flex items-center justify-center font-bold">
                1
              </span>
              <span>Bước 1: Nhập thông tin khoản vay</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              Không dùng thanh kéo thả
            </span>
          </div>

          {/* 1. Số tiền vay (dạng nhập) */}
          <div className="space-y-2">
            <label htmlFor={loanPrincipalId} className="block text-xs font-bold text-slate-700">
              Số tiền vay (VND) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id={loanPrincipalId}
                type="text"
                inputMode="numeric"
                value={principalStr}
                onChange={handlePrincipalChange}
                placeholder="Nhập số tiền vay..."
                className="w-full px-4 py-3 text-base sm:text-lg font-bold font-mono rounded-xl border border-slate-300 focus:border-[#005596] focus:ring-2 focus:ring-[#005596]/10 pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Gợi ý nhanh:</span>
              {loanPresets.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPrincipalStr(formatNumber(p.value))}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Thời gian vay (tháng) & Lãi suất (%/năm) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor={loanTermId} className="block text-xs font-bold text-slate-700">
                Thời gian vay (Tháng) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={loanTermId}
                  type="number"
                  min="1"
                  max="420"
                  value={termMonths}
                  onChange={(e) => setTermMonths(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-4 py-2.5 text-sm font-bold font-mono rounded-xl border border-slate-300 focus:border-[#005596] focus:ring-2 focus:ring-[#005596]/10 pr-16"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Tháng
                </span>
              </div>
              <div className="flex gap-1 pt-1">
                {[12, 24, 36, 60, 120].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTermMonths(m)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                  >
                    {m}T
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor={loanRateId} className="block text-xs font-bold text-slate-700">
                Lãi suất theo năm (%/năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={loanRateId}
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm font-bold font-mono rounded-xl border border-slate-300 focus:border-[#005596] focus:ring-2 focus:ring-[#005596]/10 pr-16"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  %/năm
                </span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                Lãi suất kỳ: {(annualRate / currentCycle.divisor).toFixed(2)}% / {currentCycle.label.toLowerCase()}
              </p>
            </div>
          </div>

          {/* 3. Ngày giải ngân & Ngày trả nợ định kỳ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor={disburseDateId} className="block text-xs font-bold text-slate-700">
                Ngày giải ngân <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={disburseDateId}
                  type="date"
                  value={disbursementDate}
                  onChange={(e) => setDisbursementDate(e.target.value)}
                  className="w-full px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:border-[#005596]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor={payDayId} className="block text-xs font-bold text-slate-700">
                Ngày trả nợ định kỳ hằng tháng <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id={payDayId}
                  value={paymentDay}
                  onChange={(e) => setPaymentDay(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:border-[#005596]"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      Ngày {d} hằng tháng
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4. Chu kỳ trả nợ & Tùy chọn làm tròn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label htmlFor={loanCycleId} className="block text-xs font-bold text-slate-700">
                Chu kỳ trả nợ
              </label>
              <select
                id={loanCycleId}
                value={selectedCycleId}
                onChange={(e) => setSelectedCycleId(e.target.value)}
                className="w-full px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:border-[#005596]"
              >
                {loanScheduleData.cycles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} (Chia {c.divisor})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor={loanRoundingId} className="block text-xs font-bold text-slate-700">
                Quy tắc làm tròn
              </label>
              <select
                id={loanRoundingId}
                value={roundingFactor}
                onChange={(e) => setRoundingFactor(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:border-[#005596]"
              >
                <option value={1000}>Làm tròn đến 1.000 đồng</option>
                <option value={1}>Làm tròn đến 1 đồng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Summary Card & "Xem chi tiết" CTA (Step 2 in PDF) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
                <span>Ước tính số tiền thanh toán</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Dư nợ giảm dần
              </span>
            </div>

            {/* Số tiền trả kỳ đầu (cao nhất) */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Số tiền trả tháng đầu</span>
                <div className="text-[11px] text-slate-400">Kỳ cao nhất</div>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-bold font-mono text-[#005596]">
                  {formatVND(scheduleResult.firstMonthPayment)}
                </span>
              </div>
            </div>

            {/* Số tiền trả tháng cuối (thấp nhất) */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Số tiền trả tháng cuối</span>
                <div className="text-[11px] text-slate-400">Kỳ thấp nhất</div>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-700">
                  {formatVND(scheduleResult.lastMonthPayment)}
                </span>
              </div>
            </div>

            {/* Tổng lãi phải trả */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-900 font-bold">Tổng tiền lãi phải trả</span>
                <div className="text-[11px] text-amber-700">{termMonths} tháng vay</div>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-bold font-mono text-amber-800">
                  {formatVND(scheduleResult.totalInterest)}
                </span>
              </div>
            </div>

            {/* Tổng gốc + lãi phải trả */}
            <div className="p-4 bg-gradient-to-br from-[#003966] to-[#005596] text-white rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-sky-200 font-semibold uppercase tracking-wider">
                  Tổng gốc + Lãi phải trả
                </span>
                <div className="text-[11px] text-sky-100">Toàn bộ thời gian vay</div>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-300">
                  {formatVND(scheduleResult.grandTotal)}
                </span>
              </div>
            </div>

            {/* Exact Step 2 Requirement: Nút "Xem chi tiết" để mở bảng tính lịch trả nợ */}
            <button
              onClick={() => setIsDetailModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xem chi tiết bảng tính lịch trả nợ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-2xl text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-[#005596] flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              <span>Đặc điểm phương thức trả nợ</span>
            </div>
            <p className="leading-relaxed">
              • Tiền gốc chia đều cho {termMonths / (12 / currentCycle.divisor)} kỳ: ~{formatVND(principal / (termMonths / (12 / currentCycle.divisor)))} / kỳ.
            </p>
            <p className="leading-relaxed">
              • Lãi kỳ tính trên dư nợ thực tế đầu kỳ. Sai lệch do làm tròn được bù vào kỳ cuối cùng.
            </p>
          </div>
        </div>
      </div>

      {/* FULL-SCREEN DETAILED MODAL: BẢNG TÍNH LỊCH TRẢ NỢ VỚI DƯ NỢ GIẢM DẦN (PDF Screenshot Page 1) */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#005596] text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <FileSpreadsheet className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">
                    Bảng tính lịch trả nợ với dư nợ giảm dần
                  </h3>
                  <p className="text-xs text-sky-100">
                    Gốc vay: <strong>{formatVND(principal)}</strong> · Thời hạn: <strong>{termMonths} tháng</strong> · Lãi suất: <strong>{annualRate}%/năm</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportCSV}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 text-white rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Xuất file CSV
                </button>
                <button
                  onClick={() => window.print()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 text-white rounded-lg transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  In bảng
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Table Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-xs">
                      <th className="py-3 px-3 sm:px-4 text-center">Stt</th>
                      <th className="py-3 px-3 sm:px-4">Kỳ trả nợ</th>
                      <th className="py-3 px-3 sm:px-4 text-right">Số gốc còn lại</th>
                      <th className="py-3 px-3 sm:px-4 text-right">Gốc</th>
                      <th className="py-3 px-3 sm:px-4 text-right">Lãi</th>
                      <th className="py-3 px-3 sm:px-4 text-right font-black text-[#005596]">
                        Tổng Gốc + Lãi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {scheduleResult.rows.map((row) => (
                      <tr
                        key={row.period}
                        className={`hover:bg-sky-50/50 transition-colors ${
                          row.period === 0 ? 'bg-amber-50/60 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 sm:px-4 text-center font-sans text-slate-500">
                          {row.period}
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 text-slate-800">
                          {row.dateStr}
                          {row.period === 0 && (
                            <span className="ml-2 text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-sans font-bold">
                              Giải ngân
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 text-right text-slate-700">
                          {formatNumber(row.beginningBalance)}
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 text-right text-slate-800 font-medium">
                          {row.period === 0 ? '-' : formatNumber(row.principal)}
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 text-right text-amber-800">
                          {row.period === 0 ? '-' : formatNumber(row.interest)}
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 text-right font-bold text-[#005596]">
                          {row.period === 0 ? '-' : formatNumber(row.totalPayment)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Total Summary Footer Row (Exact PDF Page 1) */}
                  <tfoot>
                    <tr className="bg-slate-800 text-white font-bold font-mono text-xs sm:text-sm">
                      <td colSpan={2} className="py-3.5 px-4 font-sans uppercase tracking-wider">
                        TỔNG CỘNG
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {formatNumber(principal)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-sky-200">
                        {formatNumber(scheduleResult.totalPrincipal)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-amber-300">
                        {formatNumber(scheduleResult.totalInterest)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-emerald-400 font-black">
                        {formatNumber(scheduleResult.grandTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Lịch trả nợ tính theo ngày {paymentDay} định kỳ. Đơn vị: Đồng Việt Nam (VND).
              </span>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors ml-auto"
              >
                Đóng bảng tính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

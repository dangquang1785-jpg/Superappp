import React, { useState, useId } from 'react';
import contentData from '../data/contentData.json';
import { formatVND, formatNumber, parseNumberFromInput } from '../utils/formatters';
import {
  PiggyBank,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  Calendar,
  Percent,
  Coins,
  Video,
} from 'lucide-react';

interface DepositCalculatorSectionProps {
  onBackToMenu: () => void;
}

export const DepositCalculatorSection: React.FC<DepositCalculatorSectionProps> = ({
  onBackToMenu,
}) => {
  const amountInputId = useId();
  const termSelectId = useId();
  const rateInputId = useId();
  const { depositInterestData } = contentData;
  const termsList = depositInterestData.terms;

  // Form states
  const [amountStr, setAmountStr] = useState<string>('50,000,000');
  const [selectedTermMonths, setSelectedTermMonths] = useState<number | ''>(6);
  const [interestRate, setInterestRate] = useState<number | ''>(3.5);

  // Quick preset amounts in VND
  const presetAmounts = [
    { label: '20 Triệu', value: 20000000 },
    { label: '50 Triệu', value: 50000000 },
    { label: '100 Triệu', value: 100000000 },
    { label: '500 Triệu', value: 500000000 },
    { label: '1 Tỷ', value: 1000000000 },
  ];

  // Raw numerical amount
  const depositAmount = parseNumberFromInput(amountStr);

  // Validations per PDF specifications
  const isAmountValid = depositAmount > 0;
  const isTermValid = typeof selectedTermMonths === 'number' && selectedTermMonths > 0;
  const isRateValid = typeof interestRate === 'number' && !isNaN(interestRate) && interestRate >= 0 && interestRate <= 20;

  // Handle term selection change: auto-update recommended interest rate
  const handleTermChange = (termMonths: number | '') => {
    setSelectedTermMonths(termMonths);
    if (typeof termMonths === 'number') {
      const matched = termsList.find((t) => t.months === termMonths);
      if (matched) {
        setInterestRate(matched.rate);
      }
    }
  };

  // Handle amount text typing: only digits allowed, format with commas
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    if (!rawValue) {
      setAmountStr('');
      return;
    }
    const num = parseInt(rawValue, 10);
    setAmountStr(formatNumber(num));
  };

  // Calculate Interest: Lãi = Số tiền gửi * (Lãi suất % / 100) * (Số tháng / 12)
  let calculatedInterest = 0;
  let totalMaturity = 0;

  if (isAmountValid && isTermValid && isRateValid) {
    calculatedInterest = Math.round(depositAmount * (Number(interestRate) / 100) * (Number(selectedTermMonths) / 12));
    totalMaturity = depositAmount + calculatedInterest;
  }

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
          Tiết kiệm sinh lời VietinBank
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003966] via-[#005596] to-[#0270c2] text-white p-6 sm:p-8 rounded-2xl shadow-xs border border-sky-800">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-sky-200 border border-white/20">
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Sản phẩm Tiết kiệm có kỳ hạn</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {depositInterestData.title}
          </h2>
          <p className="text-xs sm:text-sm text-sky-100">
            Phương thức trả lãi sau khi đến hạn. Tính toán chính xác số tiền lãi thực nhận và số dư tích lũy an toàn tại VietinBank.
          </p>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#005596]" />
            <span>Thông tin khoản tiền gửi</span>
          </h3>

          {/* 1. Số tiền gửi */}
          <div className="space-y-2">
            <label htmlFor={amountInputId} className="block text-xs font-bold text-slate-700">
              Số tiền gửi (VND) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id={amountInputId}
                type="text"
                inputMode="numeric"
                value={amountStr}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền gửi..."
                className={`w-full px-4 py-3 text-base sm:text-lg font-bold font-mono rounded-xl border transition-all pr-14 ${
                  !isAmountValid && amountStr !== ''
                    ? 'border-red-500 bg-red-50/30 text-red-900'
                    : 'border-slate-300 focus:border-[#005596] focus:ring-2 focus:ring-[#005596]/10'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {/* Validation Message */}
            {!isAmountValid && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{depositInterestData.errorMessages.invalidAmount}</span>
              </p>
            )}

            {/* Quick preset chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Gợi ý nhanh:</span>
              {presetAmounts.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setAmountStr(formatNumber(p.value))}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Kỳ hạn gửi */}
          <div className="space-y-2">
            <label htmlFor={termSelectId} className="block text-xs font-bold text-slate-700">
              Kỳ hạn gửi <span className="text-red-500">*</span>
            </label>
            
            {/* Term Dropdown Selector */}
            <div className="relative">
              <select
                id={termSelectId}
                value={selectedTermMonths}
                onChange={(e) => handleTermChange(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 bg-white focus:border-[#005596] focus:ring-2 focus:ring-[#005596]/10 appearance-none"
              >
                <option value="">-- Chọn kỳ hạn gửi --</option>
                {termsList.map((t) => (
                  <option key={t.months} value={t.months}>
                    {t.label} (Lãi suất tham khảo: {t.rate}%/năm)
                  </option>
                ))}
              </select>
              <Calendar className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick Term Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1">
              {termsList.map((t) => {
                const isSelected = selectedTermMonths === t.months;
                return (
                  <button
                    key={t.months}
                    type="button"
                    onClick={() => handleTermChange(t.months)}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'bg-[#005596] text-white border-[#005596] shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div>{t.label}</div>
                    <div className={`text-[10px] font-normal ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                      {t.rate}%
                    </div>
                  </button>
                );
              })}
            </div>

            {!isTermValid && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{depositInterestData.errorMessages.invalidTerm}</span>
              </p>
            )}
          </div>

          {/* 3. Lãi suất (%/năm) */}
          <div className="space-y-2">
            <label htmlFor={rateInputId} className="block text-xs font-bold text-slate-700">
              Lãi suất áp dụng (%/năm) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id={rateInputId}
                type="number"
                step="0.05"
                min="0"
                max="20"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="Nhập lãi suất..."
                className="w-full px-4 py-2.5 text-base font-bold font-mono rounded-xl border border-slate-300 focus:border-[#005596] focus:ring-2 focus:ring-[#005596]/10 pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                %/năm
              </span>
            </div>

            {!isRateValid && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{depositInterestData.errorMessages.invalidRate}</span>
              </p>
            )}
            <p className="text-[11px] text-slate-400">
              Lãi suất tự động gợi ý theo biểu niêm yết hiện hành của VietinBank hoặc điều chỉnh theo gói ưu đãi.
            </p>
          </div>
        </div>

        {/* Right Card: Calculation Results */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-600" />
                <span>Kết quả tính toán dự kiến</span>
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Trả lãi cuối kỳ
              </span>
            </h3>

            {/* Tiền gửi dự tính */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Tiền gửi dự tính</span>
                <div className="text-xs text-slate-400">Gốc ban đầu</div>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-bold font-mono text-slate-900">
                  {formatVND(depositAmount)}
                </span>
              </div>
            </div>

            {/* Tiền lãi dự tính */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-bold">Tiền lãi dự tính</span>
                <div className="text-[11px] text-emerald-600 font-medium">
                  {selectedTermMonths ? `${selectedTermMonths} tháng` : ''} · {interestRate}%/năm
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg sm:text-xl font-extrabold font-mono text-emerald-700">
                  +{formatVND(calculatedInterest)}
                </span>
              </div>
            </div>

            {/* Tổng tiền khi đáo hạn */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#003966] to-[#005596] text-white flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs text-sky-200 font-medium uppercase tracking-wider">
                  Tổng tiền khi đáo hạn
                </span>
                <div className="text-[11px] text-sky-100">Gốc + Toàn bộ tiền lãi</div>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-300">
                  {formatVND(totalMaturity)}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              * Bảng tính mang tính chất tham khảo. Tiền lãi thực tế có thể thay đổi tùy thuộc vào ngày thực tế của từng tháng và chính sách lãi suất tại thời điểm mở sổ.
            </div>
          </div>

          {/* Video hướng dẫn gửi tiết kiệm trên iPay (Exact PDF 2 Link) */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm border border-slate-700 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Video hướng dẫn gửi tiết kiệm online
                </h4>
                <p className="text-[11px] text-slate-300">
                  Xem clip ngắn thao tác gửi tiết kiệm nhận lãi suất cao trên ứng dụng
                </p>
              </div>
            </div>

            <a
              href={depositInterestData.videoGuide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-colors shrink-0 shadow-xs"
            >
              <span>Xem video</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ActiveTab, FaqCategory } from '../types';
import contentData from '../data/contentData.json';
import {
  KeyRound,
  CreditCard,
  ScanLine,
  Fingerprint,
  ChevronLeft,
  ChevronRight,
  Youtube,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Home,
  LogOut,
  ExternalLink,
  ZoomIn,
  X,
} from 'lucide-react';

interface FaqSectionProps {
  onBackToMenu: () => void;
  onEndChat: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onBackToMenu,
  onEndChat,
}) => {
  const { faqData } = contentData;
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'ok' | 'needSupport'>('idle');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'forgot-password':
        return <KeyRound className="w-6 h-6 text-amber-600" />;
      case 'close-card':
        return <CreditCard className="w-6 h-6 text-rose-600" />;
      case 'chip-cccd':
        return <ScanLine className="w-6 h-6 text-sky-600" />;
      case 'biometric':
        return <Fingerprint className="w-6 h-6 text-emerald-600" />;
      default:
        return <KeyRound className="w-6 h-6 text-[#005596]" />;
    }
  };

  const handleSelectCategory = (category: FaqCategory) => {
    setSelectedCategory(category);
    setCurrentStepIndex(0);
    setFeedbackState('idle');
  };

  const handleResetFaq = () => {
    setSelectedCategory(null);
    setCurrentStepIndex(0);
    setFeedbackState('idle');
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          {selectedCategory ? (
            <button
              onClick={handleResetFaq}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Chọn câu hỏi khác
            </button>
          ) : (
            <button
              onClick={onBackToMenu}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Menu chính
            </button>
          )}

          <span className="text-xs text-slate-400">/</span>
          <span className="text-xs font-bold text-slate-800">
            {selectedCategory ? selectedCategory.shortTitle : 'Hỏi đáp hỗ trợ iPay'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToMenu}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>Quay lại menu chính</span>
          </button>

          <button
            onClick={onEndChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kết thúc cuộc trò chuyện</span>
          </button>
        </div>
      </div>

      {/* Main View: If no category selected, show Question & 4 Cards */}
      {!selectedCategory ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50/40 p-6 rounded-2xl border border-sky-100 text-center space-y-2">
            <span className="inline-block px-3 py-1 bg-[#005596] text-white text-xs font-bold rounded-full">
              Hỗ Trợ Khách Hàng Tại Quầy
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {faqData.promptQuestion}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Chạm chọn một trong 4 chủ đề thường gặp bên dưới để xem hình ảnh hướng dẫn từng bước chi tiết và video minh họa trực quan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqData.categories.map((cat, idx) => (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat as FaqCategory)}
                className="group relative p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#005596] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getCategoryIcon(cat.id)}
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#005596] transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {cat.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#005596]">
                  <span>Xem hướng dẫn ({cat.steps.length} bước)</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Detailed Step-by-Step Viewer */
        <div className="space-y-6">
          {/* Category Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                {getCategoryIcon(selectedCategory.id)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedCategory.title}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedCategory.summary}
                </p>
              </div>
            </div>

            {/* YouTube video direct link */}
            {selectedCategory.videoUrl && (
              <a
                href={selectedCategory.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
              >
                <Youtube className="w-4 h-4 fill-white" />
                <span>Xem video trên YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/80" />
              </a>
            )}
          </div>

          {/* Steps Timeline Navigation */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {selectedCategory.steps.map((s, index) => {
                const isCurrent = index === currentStepIndex;
                const isDone = index < currentStepIndex;
                return (
                  <button
                    key={s.step}
                    onClick={() => setCurrentStepIndex(index)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-[#005596] text-white shadow-xs'
                        : isDone
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{s.title}</span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Content with Image & Text */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Step Description */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#005596] uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                    Bước {currentStepIndex + 1} / {selectedCategory.steps.length}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedCategory.steps[currentStepIndex].title}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {selectedCategory.steps[currentStepIndex].title}
                </h3>

                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">
                  {selectedCategory.steps[currentStepIndex].text}
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                    currentStepIndex === 0
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Bước trước</span>
                </button>

                {currentStepIndex < selectedCategory.steps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                    className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl text-white bg-[#005596] hover:bg-blue-700 transition-all shadow-xs"
                  >
                    <span>Bước tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setFeedbackState('idle')}
                    className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã xem hết</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Step Illustration Image */}
            <div className="lg:col-span-7 bg-slate-100/70 p-6 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-200 relative group">
              <div className="relative max-h-[460px] w-full flex items-center justify-center">
                <img
                  src={selectedCategory.steps[currentStepIndex].image}
                  alt={`Minh họa ${selectedCategory.steps[currentStepIndex].title}`}
                  className="max-h-[440px] w-auto max-w-full rounded-xl shadow-md object-contain border border-slate-200/60 bg-white"
                  onError={(e) => {
                    // Fallback visual container if image load errors
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.img-fallback');
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'flex';
                    }
                  }}
                />

                {/* Fallback container if network blocks external image */}
                <div className="img-fallback hidden flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-slate-200 max-w-md">
                  <div className="w-12 h-12 rounded-full bg-sky-50 text-[#005596] flex items-center justify-center mb-3">
                    <ScanLine className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {selectedCategory.steps[currentStepIndex].title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedCategory.steps[currentStepIndex].text}
                  </p>
                </div>

                {/* Click to zoom button */}
                <button
                  onClick={() => setEnlargedImage(selectedCategory.steps[currentStepIndex].image)}
                  className="absolute bottom-3 right-3 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-lg backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs font-medium"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Phóng to ảnh</span>
                </button>
              </div>
            </div>
          </div>

          {/* YouTube Video Banner at the End of the Section */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-2xl border border-red-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Youtube className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Xem video clip hướng dẫn thao tác thực tế
                </h4>
                <p className="text-xs text-slate-600">
                  Video quay màn hình chi tiết giúp Quý khách dễ dàng thao tác theo từng giây
                </p>
              </div>
            </div>

            <a
              href={selectedCategory.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <Youtube className="w-4 h-4 fill-white" />
              <span>Mở Video YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Customer Satisfaction Feedback Module (Exact Prompt Requirement) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#005596] flex items-center justify-center font-bold text-sm">
                ?
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {faqData.feedbackFlow.question}
              </h3>
            </div>

            {feedbackState === 'idle' && (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => setFeedbackState('ok')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{faqData.feedbackFlow.options.ok}</span>
                </button>

                <button
                  onClick={() => setFeedbackState('needSupport')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{faqData.feedbackFlow.options.notOk}</span>
                </button>
              </div>
            )}

            {/* When customer says OK: return to main menu or continue */}
            {feedbackState === 'ok' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Tuyệt vời! Cảm ơn Quý khách đã hoàn tất hướng dẫn.</span>
                </div>
                <p className="text-xs text-emerald-700">
                  Quý khách có thể quay lại danh mục chính để sử dụng các tiện ích khác hoặc kết thúc phiên giao dịch.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={onBackToMenu}
                    className="px-4 py-2 bg-[#005596] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Quay lại menu chính
                  </button>
                  <button
                    onClick={onEndChat}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Kết thúc cuộc trò chuyện
                  </button>
                </div>
              </div>
            )}

            {/* When customer says NOT OK: show specified exact advisor support message */}
            {feedbackState === 'needSupport' && (
              <div className="p-5 bg-amber-50 border border-amber-300 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <PhoneCall className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-amber-950 leading-relaxed">
                      “{faqData.feedbackFlow.needSupportResponse}”
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${contentData.appInfo.advisor.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Gọi Chuyên viên {contentData.appInfo.advisor.name} ({contentData.appInfo.advisor.phone})</span>
                  </a>

                  <button
                    onClick={onBackToMenu}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Quay lại menu chính
                  </button>

                  <button
                    onClick={onEndChat}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Kết thúc cuộc trò chuyện
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Image Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-2xl">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-3 -right-3 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={enlargedImage}
              alt="Ảnh phóng to"
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

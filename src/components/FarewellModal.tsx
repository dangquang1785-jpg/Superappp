import React from 'react';
import contentData from '../data/contentData.json';
import { Heart, Home, RotateCcw, Sparkles } from 'lucide-react';

interface FarewellModalProps {
  isOpen: boolean;
  onCloseAndHome: () => void;
}

export const FarewellModal: React.FC<FarewellModalProps> = ({
  isOpen,
  onCloseAndHome,
}) => {
  if (!isOpen) return null;
  const { endChatFarewell } = contentData.faqData.feedbackFlow;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#005596] to-sky-500 text-white flex items-center justify-center mx-auto shadow-md">
          <Heart className="w-8 h-8 fill-white" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Phiên Tương Tác Đã Hoàn Tất</span>
          </span>

          <h3 className="text-xl font-black text-slate-900 leading-snug">
            {endChatFarewell}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            Rất hân hạnh được phục vụ Quý khách tại quầy giao dịch VietinBank. Chúc Quý khách nhiều niềm vui và thành công!
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onCloseAndHome}
            className="w-full py-3.5 px-4 bg-[#005596] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Về màn hình chính (Trang chủ)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

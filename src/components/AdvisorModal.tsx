import React from 'react';
import contentData from '../data/contentData.json';
import { Phone, User, Clock, ShieldCheck, X, PhoneCall } from 'lucide-react';

interface AdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvisorModal: React.FC<AdvisorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { advisor, workingHours } = contentData.appInfo;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-xs">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
              Nhân viên hỗ trợ trực tiếp
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {advisor.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{advisor.role}</p>
          </div>
        </div>

        {/* Contact info card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Số điện thoại di động:</span>
            <a
              href={`tel:${advisor.phone}`}
              className="font-mono font-bold text-base text-red-600 hover:underline"
            >
              {advisor.phone}
            </a>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-slate-200 pt-2.5">
            <span className="text-slate-500">Tổng đài CSKH 24/7:</span>
            <span className="font-mono font-bold text-slate-800">{advisor.hotline}</span>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-slate-200 pt-2.5">
            <span className="text-slate-500">Email công vụ:</span>
            <span className="font-mono text-slate-700">{advisor.email}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 space-y-1 bg-sky-50/70 p-3 rounded-xl border border-sky-100">
          <div className="flex items-center gap-1.5 font-bold text-[#005596]">
            <Clock className="w-3.5 h-3.5" />
            <span>Giờ phục vụ tại quầy</span>
          </div>
          <p>{workingHours.weekday}</p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <a
            href={`tel:${advisor.phone}`}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Gọi trực tiếp ngay</span>
          </a>

          <button
            onClick={onClose}
            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

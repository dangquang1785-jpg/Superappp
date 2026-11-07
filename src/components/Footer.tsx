import React from 'react';
import contentData from '../data/contentData.json';
import { ActiveTab } from '../types';
import { Phone, Shield, Building, Clock } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAdvisorModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAdvisorModal }) => {
  const { appInfo } = contentData;

  return (
    <footer className="mt-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-[#005596]">VietinBank</span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-500">Quầy Giao Dịch Số</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ngân hàng TMCP Công Thương Việt Nam - Nâng giá trị cuộc sống. Tiên phong cung cấp giải pháp tài chính toàn diện và an toàn.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Tiện ích tại quầy
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => setActiveTab('faq')}
                  className="hover:text-[#005596] transition-colors"
                >
                  Giải đáp thắc mắc iPay
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('download-ipay')}
                  className="hover:text-[#005596] transition-colors"
                >
                  Tải ứng dụng VietinBank iPay
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('game')}
                  className="hover:text-[#005596] transition-colors"
                >
                  Thử thách Game nhận Voucher xăng
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('featured-products')}
                  className="hover:text-[#005596] transition-colors"
                >
                  Sản phẩm dịch vụ nổi bật
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Financial Calculators */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Công cụ tài chính
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => setActiveTab('deposit-interest')}
                  className="hover:text-[#005596] transition-colors"
                >
                  Tính lãi tiền gửi tiết kiệm
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('loan-schedule')}
                  className="hover:text-[#005596] transition-colors"
                >
                  Lịch trả nợ dư nợ giảm dần
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('branches')}
                  className="hover:text-[#005596] transition-colors"
                >
                  Tra cứu 155 Chi nhánh VietinBank
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Counter Advisor Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Hỗ trợ giao dịch
            </h4>
            <div className="text-xs text-slate-600 space-y-1">
              <p>
                CVTV: <strong>{appInfo.advisor.name}</strong>
              </p>
              <p>
                Hotline: <strong className="text-red-600">{appInfo.advisor.phone}</strong>
              </p>
              <p>Tổng đài: <strong>{appInfo.advisor.hotline}</strong></p>
            </div>
            <button
              onClick={onOpenAdvisorModal}
              className="mt-2 text-xs font-semibold text-[#005596] hover:underline flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Xem thông tin tư vấn</span>
            </button>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Ngân hàng TMCP Công Thương Việt Nam (VietinBank). Bản quyền thuộc về VietinBank.</p>
          <div className="flex items-center gap-4">
            <span>Chi nhánh Nam Định</span>
            <span>·</span>
            <span>Kiosk Tự Phục Vụ Tại Quầy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

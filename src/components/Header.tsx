import React from 'react';
import { ActiveTab } from '../types';
import contentData from '../data/contentData.json';
import { Phone, Menu, X, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAdvisorModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdvisorModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { appInfo } = contentData;

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'faq', label: 'Giải đáp iPay' },
    { id: 'download-ipay', label: 'Tải iPay' },
    { id: 'game', label: 'Thử thách Game' },
    { id: 'deposit-interest', label: 'Tính lãi gửi' },
    { id: 'loan-schedule', label: 'Lịch trả nợ' },
    { id: 'featured-products', label: 'Sản phẩm nổi bật' },
    { id: 'branches', label: 'Điểm giao dịch' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Bar for Branch & Hotline */}
      <div className="bg-[#005596] text-white text-xs px-4 py-1.5 hidden sm:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-medium">Ngân hàng TMCP Công Thương Việt Nam</span>
          <span className="text-white/60">·</span>
          <span className="text-sky-100">Cổng Tương Tác Khách Hàng Tại Quầy Giao Dịch</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span>Tổng đài 24/7: <strong className="text-amber-300">{appInfo.advisor.hotline}</strong></span>
          <span className="text-white/60">·</span>
          <span>CVTV: <strong>{appInfo.advisor.name} ({appInfo.advisor.phone})</strong></span>
        </div>
      </div>

      {/* Main Header Bar adhering to Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark & Logo */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('home')}>
          <img
            src={appInfo.logoUrl}
            alt="VietinBank Logo"
            className="h-9 w-auto object-contain"
            onError={(e) => {
              // Graceful fallback if external image fails
              const target = e.currentTarget;
              target.style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-[#005596]">
              VietinBank
            </span>
            <span className="text-[10px] tracking-wider uppercase text-slate-500 font-semibold -mt-1">
              Quầy Giao Dịch Số
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#005596] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#005596] hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          {activeTab !== 'home' && (
            <button
              onClick={() => setActiveTab('home')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Menu chính
            </button>
          )}

          <button
            onClick={onOpenAdvisorModal}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Hỗ trợ tại quầy</span>
          </button>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-lg animate-in fade-in duration-200">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-[#005596] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Đang xem</span>}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 mt-2 flex flex-col gap-2">
            <a
              href={`tel:${appInfo.advisor.phone}`}
              className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              <Phone className="w-3.5 h-3.5 text-red-600" />
              CVTV: {appInfo.advisor.name} ({appInfo.advisor.phone})
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

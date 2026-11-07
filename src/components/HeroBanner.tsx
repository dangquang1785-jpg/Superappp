import React from 'react';
import { ActiveTab } from '../types';
import contentData from '../data/contentData.json';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  ChevronRight,
  Gift,
  Clock,
  PhoneCall,
} from 'lucide-react';

interface HeroBannerProps {
  onSelectFeature: (tab: ActiveTab) => void;
  onOpenAdvisorModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectFeature,
  onOpenAdvisorModal,
}) => {
  const { menuFeatures, appInfo } = contentData;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HelpCircle':
        return <HelpCircle className="w-6 h-6" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6" />;
      case 'PiggyBank':
        return <PiggyBank className="w-6 h-6" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6" />;
      default:
        return <ChevronRight className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Kiosk Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#003966] via-[#005596] to-[#0270c2] text-white p-6 sm:p-10 shadow-lg border border-sky-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold text-sky-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Hệ thống Kiosk Tự Phục Vụ Thông Minh Tại Quầy</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Kính chào Quý khách đến với <br className="hidden sm:inline" />
            <span className="text-amber-300">VietinBank - Chi nhánh Nam Định</span>
          </h1>

          <p className="text-sm sm:text-base text-sky-100 font-normal leading-relaxed max-w-2xl">
            Vui lòng chạm chọn dịch vụ Quý khách cần tra cứu hoặc thao tác. Đội ngũ nhân viên và chuyên viên tư vấn luôn sẵn sàng đồng hành và phục vụ.
          </p>

          {/* Quick Counter Info */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-sky-100">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>{appInfo.workingHours.weekday}</span>
            </div>
            <button
              onClick={onOpenAdvisorModal}
              className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-600 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors shadow-xs"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>CVTV: {appInfo.advisor.name} - {appInfo.advisor.phone}</span>
            </button>
          </div>
        </div>

        {/* Floating Game Promo Corner */}
        <div className="mt-6 sm:mt-0 sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2 z-10">
          <div
            onClick={() => onSelectFeature('game')}
            className="group cursor-pointer bg-gradient-to-br from-amber-500 to-orange-600 p-5 rounded-2xl shadow-xl border-2 border-amber-300/40 hover:scale-105 transition-transform duration-300 max-w-xs text-center"
          >
            <div className="inline-flex p-3 bg-white/20 rounded-full text-white mb-2 group-hover:rotate-12 transition-transform">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-100">
              Trong lúc chờ phục vụ
            </div>
            <div className="text-lg font-bold text-white mt-1">
              Chơi Game Nhận Voucher
            </div>
            <div className="text-xs text-amber-100 mt-1">
              Đạt 20 điểm nhận ngay <strong className="text-white underline">Voucher 2 lít xăng</strong>
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg shadow-sm">
              <span>Chơi ngay</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Decorative background curves */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
        <div className="absolute right-40 -top-10 w-60 h-60 rounded-full bg-sky-400/10 pointer-events-none blur-xl"></div>
      </div>

      {/* 7 Feature Grid Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Danh Mục Tiện Ích Tương Tác
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chạm vào bất kỳ mục nào bên dưới để khám phá chi tiết
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {menuFeatures.map((item) => {
            const isSpecialHighlight = item.id === 'featured-products';
            const isGame = item.id === 'game';

            return (
              <div
                key={item.id}
                onClick={() => onSelectFeature(item.id as ActiveTab)}
                className={`group relative flex flex-col justify-between p-5 rounded-xl cursor-pointer transition-all duration-200 border ${
                  isSpecialHighlight
                    ? 'bg-gradient-to-br from-rose-50/80 via-white to-sky-50/50 border-red-300 shadow-sm hover:shadow-md hover:border-red-500'
                    : isGame
                    ? 'bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 border-amber-300 shadow-sm hover:shadow-md hover:border-amber-500'
                    : 'bg-white border-slate-200 shadow-xs hover:shadow-md hover:border-[#005596]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-tr ${item.color} shadow-xs group-hover:scale-110 transition-transform`}
                    >
                      {getIcon(item.icon)}
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          item.badge === 'Nổi bật'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : item.badge === 'Nhận quà'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005596] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#005596]">
                  <span>Mở tiện ích</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

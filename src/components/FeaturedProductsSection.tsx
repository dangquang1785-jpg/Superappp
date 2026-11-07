import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { ProductItem } from '../types';
import {
  Sparkles,
  Star,
  Gift,
  Heart,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  CheckCircle,
  X,
  ExternalLink,
} from 'lucide-react';

interface FeaturedProductsSectionProps {
  onBackToMenu: () => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onBackToMenu,
}) => {
  const { featuredProductsData } = contentData;
  const [selectedFilter, setSelectedFilter] = useState<string>('Tất cả');
  const [activeItemForModal, setActiveItemForModal] = useState<ProductItem | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  // Filter items
  const filteredItems = (featuredProductsData.items as ProductItem[]).filter((item) => {
    if (selectedFilter === 'Tất cả') return true;
    return item.category === selectedFilter;
  });

  const handleInterestClick = (item: ProductItem) => {
    setActiveItemForModal(item);
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
          Danh mục sản phẩm & Tiện ích ưu đãi
        </span>
      </div>

      {/* Hero Banner with Distinctive VietinBank Red/Blue Styling & "Nổi bật" Badge */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#003966] via-[#005596] to-[#0270c2] text-white p-6 sm:p-8 rounded-2xl shadow-sm border-2 border-red-500/80">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-extrabold shadow-sm border border-red-400">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Nổi bật tại Chi nhánh</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {featuredProductsData.title}
          </h2>

          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
            {featuredProductsData.description}
          </p>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute right-6 -bottom-6 text-white/10 pointer-events-none">
          <Gift className="w-48 h-48" />
        </div>
      </div>

      {/* Filter Chips Bar (Exact PDF: Tất cả | Cá nhân | Hộ kinh doanh | Doanh nghiệp | Ưu đãi | Thông tin bán đấu giá) */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {featuredProductsData.categories.map((cat) => {
            const isActive = selectedFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedFilter(cat);
                  setCarouselIndex(0);
                }}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#005596] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid / Carousel List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-slate-200 hover:border-red-400 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Poster Image Container */}
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain p-2 group-hover:scale-102 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.prod-fallback');
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }}
                />

                {/* Fallback frame */}
                <div className="prod-fallback hidden flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-sky-50 to-blue-100 w-full h-full">
                  <Sparkles className="w-8 h-8 text-[#005596] mb-2" />
                  <span className="text-xs font-bold text-slate-800">{item.title}</span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-[#005596]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs shadow-xs">
                  {item.badge}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005596] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.summary}
                </p>

                {/* Key highlights bullets */}
                <ul className="space-y-1.5 pt-1">
                  {item.highlights.map((h, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card Action: "Tôi quan tâm" Button */}
            <div className="p-5 pt-0">
              <button
                onClick={() => handleInterestClick(item)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Tôi quan tâm</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* "Tôi quan tâm" Confirmation Modal (Exact PDF 5 Requirement) */}
      {activeItemForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative">
            <button
              onClick={() => setActiveItemForModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
              <Heart className="w-7 h-7 fill-red-600" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                Ghi nhận mối quan tâm
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {activeItemForModal.title}
              </h3>
            </div>

            {/* Notification message from PDF 5 */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {featuredProductsData.interestResponse.message}
              </p>
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs font-bold text-[#005596]">
                  {featuredProductsData.interestResponse.contactPerson}
                </p>
              </div>
            </div>

            {/* Direct Call & Close Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href={`tel:${featuredProductsData.interestResponse.phone}`}
                className="w-full sm:flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi Chuyên viên tư vấn ngay</span>
              </a>

              <button
                onClick={() => setActiveItemForModal(null)}
                className="w-full sm:w-auto py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

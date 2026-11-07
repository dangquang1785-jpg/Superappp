import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { BranchItem } from '../types';
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Search,
  Building2,
  ChevronLeft,
  Navigation,
} from 'lucide-react';

interface BranchLocatorSectionProps {
  onBackToMenu: () => void;
}

export const BranchLocatorSection: React.FC<BranchLocatorSectionProps> = ({
  onBackToMenu,
}) => {
  const { branchesData } = contentData;
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('nam-dinh');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter branches based on province & search query
  const branches = (branchesData.branches as BranchItem[]).filter((b) => {
    const matchesProvince = b.provinceId === selectedProvinceId;
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery);
    return matchesProvince && matchesSearch;
  });

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
          Mạng lưới 155 Chi nhánh & PGD VietinBank
        </span>
      </div>

      {/* Header Banner & Working Hours Display */}
      <div className="bg-gradient-to-r from-[#003966] via-[#005596] to-[#0270c2] text-white p-6 sm:p-8 rounded-2xl shadow-xs border border-sky-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-sky-200 border border-white/20">
              <MapPin className="w-3.5 h-3.5" />
              <span>Tra Cứu Điểm Giao Dịch VietinBank</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Hệ Thống Chi Nhánh & Phòng Giao Dịch
            </h2>
            <p className="text-xs sm:text-sm text-sky-100">
              Tìm kiếm địa chỉ quầy giao dịch gần nhất, chỉ đường Google Maps và gọi hotline tư vấn ngay tức thì.
            </p>
          </div>

          {/* Working Hours Card (Exact PDF 4 Requirement) */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-xs text-sky-100 space-y-1.5 shrink-0 max-w-md">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Clock className="w-4 h-4" />
              <span>Thời gian làm việc tại quầy giao dịch:</span>
            </div>
            <p className="text-white font-medium">
              • {branchesData.workingHours.weekday}
            </p>
            <p className="text-sky-200">
              • {branchesData.workingHours.weekend}
            </p>
          </div>
        </div>
      </div>

      {/* Province Selector & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Province Buttons (Exact PDF List: Bắc Đà Nẵng, Hội An, TP.HCM, Bình Dương, Bắc Ninh, Nam Định) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {branchesData.availableProvinces.map((prov) => {
              const isSelected = selectedProvinceId === prov.id;
              return (
                <button
                  key={prov.id}
                  onClick={() => setSelectedProvinceId(prov.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#005596] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{prov.name}</span>
                  {isSelected && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                      {branches.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên, đường, số điện thoại..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#005596] focus:ring-1 focus:ring-[#005596]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* 9 Branch Cards Grid (Nam Định List from PDF 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <div
            key={branch.stt}
            className="group bg-white rounded-2xl border border-slate-200 hover:border-[#005596] hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Branch Photo */}
              <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.branch-fallback');
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }}
                />

                {/* Fallback container */}
                <div className="branch-fallback hidden flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-100 to-sky-50 w-full h-full">
                  <Building2 className="w-8 h-8 text-[#005596] mb-1" />
                  <span className="text-xs font-bold text-slate-800">{branch.name}</span>
                </div>

                <div className="absolute top-3 left-3 bg-[#005596]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                  {branch.type}
                </div>

                <div className="absolute top-3 right-3 bg-white/90 text-slate-800 font-mono text-xs font-bold px-2 py-0.5 rounded shadow-xs">
                  #{branch.stt}
                </div>
              </div>

              {/* Branch Info */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005596] transition-colors leading-snug">
                  {branch.name}
                </h3>

                <div className="space-y-2 text-xs text-slate-600">
                  {/* Address */}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{branch.address}</span>
                  </div>

                  {/* Hotline: Clickable tel link per PDF */}
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-400">Hotline:</span>
                    <a
                      href={`tel:${branch.phone}`}
                      className="font-mono font-bold text-slate-900 hover:text-red-600 underline transition-colors"
                    >
                      {branch.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Call Hotline & Google Maps Directions Link */}
            <div className="p-5 pt-0 grid grid-cols-2 gap-2">
              <a
                href={`tel:${branch.phone}`}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>Gọi điện</span>
              </a>

              <a
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#005596] hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-white" />
                <span>Chỉ đường</span>
                <ExternalLink className="w-3 h-3 text-sky-200" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {branches.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 space-y-2">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold">Không tìm thấy phòng giao dịch phù hợp</p>
          <p className="text-xs text-slate-400">Vui lòng thử từ khóa tìm kiếm khác hoặc chuyển tỉnh/thành</p>
        </div>
      )}
    </div>
  );
};

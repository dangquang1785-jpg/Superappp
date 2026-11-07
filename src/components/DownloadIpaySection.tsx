import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import {
  Smartphone,
  Apple,
  ExternalLink,
  ShieldCheck,
  Zap,
  Gift,
  QrCode,
  Check,
  Copy,
  ChevronLeft,
} from 'lucide-react';

interface DownloadIpaySectionProps {
  onBackToMenu: () => void;
}

export const DownloadIpaySection: React.FC<DownloadIpaySectionProps> = ({
  onBackToMenu,
}) => {
  const { downloadIpayData } = contentData;
  const [copiedLink, setCopiedLink] = useState<'ios' | 'android' | null>(null);

  const handleCopy = (type: 'ios' | 'android', url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Generate QR code URLs using reliable QR service for counter scanning
  const iosQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    downloadIpayData.iosUrl
  )}`;
  const androidQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    downloadIpayData.androidUrl
  )}`;

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại menu chính
        </button>

        <span className="text-xs font-medium text-slate-500">
          Tiện ích số VietinBank iPay Mobile
        </span>
      </div>

      {/* Hero Intro */}
      <div className="bg-gradient-to-r from-[#003966] via-[#005596] to-[#0270c2] text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-sky-800">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-sky-200 border border-white/20">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Ngân Hàng Số VietinBank iPay Mobile</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {downloadIpayData.title}
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
            {downloadIpayData.subtitle}. Mở camera điện thoại quét mã QR bên dưới để tải và cài đặt ngay trong tích tắc tại quầy giao dịch!
          </p>
        </div>
      </div>

      {/* 2 Big Platform QR & Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* iOS App Store Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6 hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Apple className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    VietinBank iPay cho iPhone
                  </h3>
                  <p className="text-xs text-slate-500">Dành cho hệ điều hành iOS (App Store)</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md">
                iOS
              </span>
            </div>

            {/* QR Code Presentation */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs shrink-0">
                <img
                  src={iosQrUrl}
                  alt="QR Code Tải iPay iOS"
                  className="w-36 h-36 object-contain"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005596]">
                  <QrCode className="w-4 h-4" />
                  <span>Quét bằng Camera iPhone</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bật ứng dụng Máy ảnh trên iPhone và hướng về mã QR để mở trang cài đặt chính thức trên App Store.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <a
              href={downloadIpayData.iosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Apple className="w-4 h-4" />
              <span>Tải trên Apple App Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
            </a>

            <button
              onClick={() => handleCopy('ios', downloadIpayData.iosUrl)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {copiedLink === 'ios' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Đã sao chép link tải</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép link tải App Store</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Android Google Play Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6 hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    VietinBank iPay cho Android
                  </h3>
                  <p className="text-xs text-slate-500">Samsung, Xiaomi, OPPO, Vivo (Google Play)</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md">
                Android
              </span>
            </div>

            {/* QR Code Presentation */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs shrink-0">
                <img
                  src={androidQrUrl}
                  alt="QR Code Tải iPay Android"
                  className="w-36 h-36 object-contain"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <QrCode className="w-4 h-4" />
                  <span>Quét bằng Máy ảnh / Zalo</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bật Máy ảnh hoặc máy quét mã QR trong Zalo hướng về mã QR để mở trực tiếp ứng dụng trên Google Play Store.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <a
              href={downloadIpayData.androidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>Tải trên Google Play Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
            </a>

            <button
              onClick={() => handleCopy('android', downloadIpayData.androidUrl)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {copiedLink === 'android' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Đã sao chép link tải</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép link tải Google Play</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* iPay Highlights Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#005596]" />
          <span>Lợi ích vượt trội khi sử dụng VietinBank iPay</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {downloadIpayData.features.map((feat, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#005596] flex items-center justify-center text-xs font-bold">
                0{index + 1}
              </div>
              <p className="text-xs font-medium text-slate-800 leading-snug">
                {feat}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

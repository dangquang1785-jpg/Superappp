import React, { useState } from 'react';
import { ActiveTab } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FaqSection } from './components/FaqSection';
import { DownloadIpaySection } from './components/DownloadIpaySection';
import { FlappyGameSection } from './components/FlappyGameSection';
import { DepositCalculatorSection } from './components/DepositCalculatorSection';
import { LoanScheduleSection } from './components/LoanScheduleSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { BranchLocatorSection } from './components/BranchLocatorSection';
import { AdvisorModal } from './components/AdvisorModal';
import { FarewellModal } from './components/FarewellModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [isFarewellModalOpen, setIsFarewellModalOpen] = useState(false);

  const handleEndChat = () => {
    setIsFarewellModalOpen(true);
  };

  const handleCloseFarewellAndHome = () => {
    setIsFarewellModalOpen(false);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      <div>
        {/* Top Navigation Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAdvisorModal={() => setIsAdvisorModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 w-full">
          {activeTab === 'home' && (
            <HeroBanner
              onSelectFeature={(tab) => setActiveTab(tab)}
              onOpenAdvisorModal={() => setIsAdvisorModalOpen(true)}
            />
          )}

          {activeTab === 'faq' && (
            <FaqSection
              onBackToMenu={() => setActiveTab('home')}
              onEndChat={handleEndChat}
            />
          )}

          {activeTab === 'download-ipay' && (
            <DownloadIpaySection
              onBackToMenu={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'game' && (
            <FlappyGameSection
              onBackToMenu={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'deposit-interest' && (
            <DepositCalculatorSection
              onBackToMenu={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'loan-schedule' && (
            <LoanScheduleSection
              onBackToMenu={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'featured-products' && (
            <FeaturedProductsSection
              onBackToMenu={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'branches' && (
            <BranchLocatorSection
              onBackToMenu={() => setActiveTab('home')}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AdvisorModal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
      />

      <FarewellModal
        isOpen={isFarewellModalOpen}
        onCloseAndHome={handleCloseFarewellAndHome}
      />

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenAdvisorModal={() => setIsAdvisorModalOpen(true)}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Download, Sparkles, FileCheck2, ArrowRight } from 'lucide-react';
import { WhatsAppShareToUnlockModal } from '@/components/WhatsAppShareToUnlockModal';

export interface ClientShareGateTriggerProps {
  toolTitle: string;
  toolSlug: string;
  pdfDownloadUrl: string;
  reportReferenceCode: string;
  summaryHighlights: string[];
}

export const ClientShareGateTrigger: React.FC<ClientShareGateTriggerProps> = ({
  toolTitle,
  toolSlug,
  pdfDownloadUrl,
  reportReferenceCode,
  summaryHighlights,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Official Stamped 2026 PDF Certificate Available</span>
          </div>
          <p className="text-xs text-slate-400">
            Download the official bankable calculation sheet stamped by Bethelmind Digital Solutions (CAC Reg: 9912717).
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-amber-500 hover:from-[#e5c158] hover:to-amber-400 active:scale-95 text-[#070b14] font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-[0_0_25px_rgba(212,175,55,0.35)] cursor-pointer"
        >
          <FileCheck2 className="w-4 h-4 text-[#070b14]" />
          <span>Unlock Official PDF Certificate</span>
          <ArrowRight className="w-4 h-4 text-[#070b14]" />
        </button>
      </div>

      <WhatsAppShareToUnlockModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        toolTitle={toolTitle}
        toolSlug={toolSlug}
        pdfDownloadUrl={pdfDownloadUrl}
        reportReferenceCode={reportReferenceCode}
        summaryHighlights={summaryHighlights}
      />
    </>
  );
};

export default ClientShareGateTrigger;

'use client';

import React from 'react';

export default function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
    >
      <span>🖨️</span> Print / Save as PDF
    </button>
  );
}


'use client';

import { Printer } from 'lucide-react';
import { useEffect } from 'react';

export default function PrintButton() {
  useEffect(() => {
    // Timeout to ensure styles are loaded before popping up print dialog
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 bg-[#1F3864] hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-colors"
    >
      <Printer className="w-5 h-5" />
      Imprimir Ficha
    </button>
  );
}


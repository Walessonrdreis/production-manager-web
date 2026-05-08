import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
}

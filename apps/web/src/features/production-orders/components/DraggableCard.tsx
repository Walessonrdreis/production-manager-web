import React from 'react';

interface DraggableCardProps {
  children: React.ReactNode;
}

export function DraggableCard({ children }: DraggableCardProps) {
  return (
    <div className="transition-transform duration-200 transform hover:scale-105 cursor-grab active:cursor-grabbing">
      {children}
    </div>
  );
}

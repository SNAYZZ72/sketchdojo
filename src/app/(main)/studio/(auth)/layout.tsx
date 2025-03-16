import React from 'react';

export default function AuthFullscreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-sketchdojo-bg">
      {children}
    </div>
  );
}
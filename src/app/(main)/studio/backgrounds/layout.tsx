// src/app/(main)/studio/backgrounds/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Background Generator | Studio',
  description: 'Create custom backgrounds for your manga and comics',
};

export default function BackgroundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
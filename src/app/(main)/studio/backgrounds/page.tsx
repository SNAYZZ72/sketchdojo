"use client";

import React from 'react';
import { BackgroundGenerator } from '@/components/generators';

/**
 * The backgrounds page component that renders the background generator.
 * This uses our new modular component structure for better maintainability.
 */
export default function BackgroundsPage() {
  return (
    <main className="min-h-screen">
      <BackgroundGenerator />
    </main>
  );
}
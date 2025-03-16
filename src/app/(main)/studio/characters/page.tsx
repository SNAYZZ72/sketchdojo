"use client";

import React from 'react';
import { CharacterGenerator } from '@/components/generators';

/**
 * The characters page component that renders the character generator.
 * This uses our new modular component structure for better maintainability.
 */
export default function CharactersPage() {
  return (
    <main className="min-h-screen">
      <CharacterGenerator />
    </main>
  );
}
import LoadingPage from '@/components/global/loading-page';
import React from 'react';

/**
 * Loading page component for the Studio section
 * Uses the enhanced LoadingPage with a themed appearance
 */
const StudioLoadingPage = () => {
  return (
    <LoadingPage 
      message="Loading Studio"
      subMessage="Preparing your workspace..."
      spinnerSize="lg"
      theme="primary"
      delayMs={300} // Prevents flashing for fast loads
    />
  );
};

export default StudioLoadingPage;
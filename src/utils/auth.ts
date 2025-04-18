import { createClient } from './supabase/client';

/**
 * Check if the user is authenticated
 * @returns Promise with the authentication status
 */
export const checkAuth = async () => {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return false;
  }
};

/**
 * Redirect to sign in page if not authenticated
 * @param redirectPath Optional path to redirect to after signin
 * @returns Promise with the authentication status
 */
export const requireAuth = async (redirectPath?: string) => {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    const redirectParams = redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : '';
    window.location.href = `/studio/sign-in${redirectParams}`;
    return false;
  }
  
  return true;
};

/**
 * Redirect to the app if already authenticated
 * @param redirectPath Path to redirect to if authenticated (defaults to /studio)
 * @returns Promise with the authentication status (inverted for convenience)
 */
export const requireNoAuth = async (redirectPath: string = '/studio') => {
  const isAuthenticated = await checkAuth();
  
  if (isAuthenticated) {
    window.location.href = redirectPath;
    return false;
  }
  
  return true;
}; 
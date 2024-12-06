// src/hooks/useFirebaseAuth.ts
import { useEffect, useState, useCallback } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-expo';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const RETRY_DELAY = 500;
const MAX_RETRIES = 3;

export const useFirebaseAuth = () => {
  const { getToken } = useClerkAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const signInToFirebase = useCallback(async (retryCount = 0) => {
    try {
      const token = await getToken({ template: 'firebase-auth' });
      if (!token) {
        throw new Error('No token received from Clerk');
      }
      await signInWithCustomToken(auth, token);
      setError(null);
      return true;
    } catch (err) {
      console.error('Firebase auth error:', err);
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return signInToFirebase(retryCount + 1);
      }
      setError(err instanceof Error ? err : new Error('Failed to authenticate'));
      return false;
    }
  }, [getToken]);

  useEffect(() => {
    let isMounted = true;
    let refreshTimeout: NodeJS.Timeout;

    const setupFirebaseAuth = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      const success = await signInToFirebase();
      
      if (success && isMounted) {
        // Refresh token every 45 minutes
        refreshTimeout = setTimeout(setupFirebaseAuth, 45 * 60 * 1000);
      }
      
      if (isMounted) {
        setIsLoading(false);
      }
    };

    setupFirebaseAuth();

    return () => {
      isMounted = false;
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, [signInToFirebase]);

  return { isLoading, error };
};
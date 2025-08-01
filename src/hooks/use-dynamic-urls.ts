import { useState, useEffect } from 'react';
import { getBaseUrl } from '@/lib/utils';

export function useDynamicUrls() {
  const [baseUrl, setBaseUrl] = useState<string>('');

  useEffect(() => {
    // Set the base URL after component mounts
    setBaseUrl(getBaseUrl());
  }, []);

  const generateUrl = (path: string) => {
    return baseUrl ? `${baseUrl}${path}` : '';
  };

  return { baseUrl, generateUrl };
} 
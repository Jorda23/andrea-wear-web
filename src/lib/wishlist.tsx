import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { addToWishlist, fetchWishlistProductIds, removeFromWishlist } from './api';

interface WishlistContextValue {
  productIds: string[];
  toggle: (productId: string) => Promise<void>;
  has: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);

  useEffect(() => {
    fetchWishlistProductIds()
      .then(setProductIds)
      .catch(() => setProductIds([]));
  }, []);

  const toggle = useCallback(async (productId: string) => {
    const exists = productIds.includes(productId);
    if (exists) {
      setProductIds((prev) => prev.filter((id) => id !== productId));
      try {
        await removeFromWishlist(productId);
      } catch {
        setProductIds((prev) => [...prev, productId]);
      }
    } else {
      setProductIds((prev) => [...prev, productId]);
      try {
        await addToWishlist(productId);
      } catch {
        setProductIds((prev) => prev.filter((id) => id !== productId));
      }
    }
  }, [productIds]);

  const has = useCallback((productId: string) => productIds.includes(productId), [productIds]);

  return <WishlistContext.Provider value={{ productIds, toggle, has }}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

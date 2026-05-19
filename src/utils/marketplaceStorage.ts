import { useEffect, useState } from 'react';
import { shopAPI } from '../services/api';

export const AUTH_USER_KEY = 'appsolutionUser';
export const AUTH_TOKEN_KEY = 'adminToken';
export const CART_KEY = 'appsolutionCart';
export const MARKETPLACE_CHANGE_EVENT = 'appsolution-storage-changed';

export type AuthUser = {
  name: string;
  email: string;
  role?: string;
};

export type CartItem = {
  id: string | number;
  quantity: number;
};

const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
};

const writeJson = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(MARKETPLACE_CHANGE_EVENT));
};

const normalizeId = (id: string | number) => String(id);

const emit = () => {
  if (typeof window !== 'undefined')
    window.dispatchEvent(new Event(MARKETPLACE_CHANGE_EVENT));
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export const getStoredUser = () => readJson<AuthUser | null>(AUTH_USER_KEY, null);

export const saveStoredUser = (user: AuthUser | null) => {
  if (!user) {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_USER_KEY);
      emit();
    }
    return;
  }
  writeJson(AUTH_USER_KEY, user);
};

export const clearAuthStorage = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  emit();
};

// ─── Cart (localStorage) ─────────────────────────────────────────────────────

export const getCartItems = () => readJson<CartItem[]>(CART_KEY, []);

export const getCartCount = () =>
  getCartItems().reduce((count, item) => count + Math.max(1, item.quantity || 1), 0);

export const addToCart = (id: string | number) => {
  const current = getCartItems();
  const key = normalizeId(id);
  const existing = current.find((item) => normalizeId(item.id) === key);
  const next = existing
    ? current.map((item) =>
        normalizeId(item.id) === key
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + 1) }
          : item
      )
    : [...current, { id, quantity: 1 }];
  writeJson(CART_KEY, next);
  return next;
};

export const removeFromCart = (id: string | number) => {
  const key = normalizeId(id);
  const next = getCartItems().filter((item) => normalizeId(item.id) !== key);
  writeJson(CART_KEY, next);
  return next;
};

export const hasCartItem = (id: string | number) =>
  getCartItems().some((item) => normalizeId(item.id) === normalizeId(id));

// ─── Favorites (relational DB via API) ───────────────────────────────────────

// In-memory mirror of the server favorites list
let _favorites: string[] = [];

const setFavorites = (ids: string[]) => {
  _favorites = ids;
  emit();
};

export const getFavorites = () => _favorites;

export const hasFavorite = (id: string | number) =>
  _favorites.includes(normalizeId(id));

export const getFavoriteCount = () => _favorites.length;

/**
 * Toggle a favorite:
 * - Optimistically updates local state
 * - Calls POST /api/shop/favorites/:productId  (add)
 *   or  DELETE /api/shop/favorites/:productId  (remove)
 * - Rolls back on error
 */
export const toggleFavorite = async (id: string | number): Promise<string[]> => {
  const productId = normalizeId(id);
  const isRemoving = _favorites.includes(productId);

  // Optimistic update
  const next = isRemoving
    ? _favorites.filter((f) => f !== productId)
    : [..._favorites, productId];
  setFavorites(next);

  try {
    if (isRemoving) {
      await shopAPI.removeFavorite(productId);
    } else {
      await shopAPI.addFavorite(productId);
    }
    return _favorites;
  } catch (error) {
    // Roll back
    setFavorites(isRemoving ? [...next, productId] : next.filter((f) => f !== productId));
    throw error;
  }
};

// ─── Sync ─────────────────────────────────────────────────────────────────────

export const syncShopState = async () => {
  const response = await shopAPI.getState();
  const { cartItems = [], favoriteItems = [] } = response.data;
  writeJson(CART_KEY, cartItems);
  setFavorites((favoriteItems as Array<string | number>).map(normalizeId));
};

export const clearShopState = () => {
  setFavorites([]);
};

// ─── React hook ──────────────────────────────────────────────────────────────

export const useFavorites = () => {
  const [favorites, setFavoritesState] = useState<string[]>(() => _favorites);

  useEffect(() => {
    const sync = () => setFavoritesState([..._favorites]);
    sync();
    window.addEventListener(MARKETPLACE_CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(MARKETPLACE_CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return favorites;
};

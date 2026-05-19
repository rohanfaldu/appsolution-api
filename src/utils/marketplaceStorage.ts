import { useEffect, useState } from 'react';
import { shopAPI } from '../services/api';

export const AUTH_USER_KEY = 'appsolutionUser';
export const AUTH_TOKEN_KEY = 'adminToken';
export const CART_KEY = 'appsolutionCart';
export const FAVORITES_KEY = 'appsolutionFavorites';
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

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(MARKETPLACE_CHANGE_EVENT));
};

const normalizeId = (id: string | number) => String(id);

type FavoriteInput = string | number | { id?: string | number; productId?: string | number };

let favoriteItems: Array<string | number> = [];

const emitMarketplaceChange = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(MARKETPLACE_CHANGE_EVENT));
};

const getFavoriteId = (item: FavoriteInput) => {
  if (typeof item === 'string' || typeof item === 'number') return item;
  return item.productId ?? item.id;
};

const uniqueIds = (items: FavoriteInput[]) => {
  const seen = new Set<string>();
  const favorites: Array<string | number> = [];

  items.forEach((item) => {
    const id = getFavoriteId(item);
    if (typeof id !== 'string' && typeof id !== 'number') return;

    const key = normalizeId(id).trim();
    if (!key || seen.has(key)) return;

    seen.add(key);
    favorites.push(id);
  });

  return favorites;
};

const setFavoriteItems = (items: FavoriteInput[]) => {
  favoriteItems = uniqueIds(items);
  emitMarketplaceChange();
};

export const getStoredUser = () => readJson<AuthUser | null>(AUTH_USER_KEY, null);

export const saveStoredUser = (user: AuthUser | null) => {
  if (!user) {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_USER_KEY);
      window.dispatchEvent(new Event(MARKETPLACE_CHANGE_EVENT));
    }
    return;
  }

  writeJson(AUTH_USER_KEY, user);
};

export const clearAuthStorage = () => {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.localStorage.removeItem(FAVORITES_KEY);
  favoriteItems = [];
  window.dispatchEvent(new Event(MARKETPLACE_CHANGE_EVENT));
};

export const getCartItems = () => readJson<CartItem[]>(CART_KEY, []);

export const getCartCount = () =>
  getCartItems().reduce((count, item) => count + Math.max(1, item.quantity || 1), 0);

export const addToCart = (id: string | number) => {
  const current = getCartItems();
  const key = normalizeId(id);
  const existing = current.find((item) => normalizeId(item.id) === key);

  const next = existing
    ? current.map((item) =>
        normalizeId(item.id) === key ? { ...item, quantity: Math.max(1, (item.quantity || 1) + 1) } : item
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

export const getFavorites = () => favoriteItems;

export const hasFavorite = (id: string | number) =>
  getFavorites().some((item) => normalizeId(item) === normalizeId(id));

export const toggleFavorite = async (id: string | number) => {
  const key = normalizeId(id);
  const previous = getFavorites();
  const isRemoving = previous.some((item) => normalizeId(item) === key);
  const next = isRemoving
    ? previous.filter((item) => normalizeId(item) !== key)
    : [...previous, id];

  setFavoriteItems(next);

  try {
    const stateResponse = await shopAPI.getState();
    const serverFavorites = uniqueIds(stateResponse.data.favoriteItems ?? []);
    const serverNext = isRemoving
      ? serverFavorites.filter((item) => normalizeId(item) !== key)
      : uniqueIds([...serverFavorites, id]);
    const response = await shopAPI.saveFavorites(serverNext);

    setFavoriteItems(response.data.favoriteItems ?? serverNext);
    return getFavorites();
  } catch (error) {
    setFavoriteItems(previous);
    throw error;
  }
};

export const getFavoriteCount = () => getFavorites().length;

export const hasCartItem = (id: string | number) =>
  getCartItems().some((item) => normalizeId(item.id) === normalizeId(id));

export const syncShopState = async () => {
  const response = await shopAPI.getState();
  const { cartItems = [], favoriteItems = [] } = response.data;

  writeJson(CART_KEY, cartItems);
  setFavoriteItems(favoriteItems);
};

export const clearShopState = () => {
  setFavoriteItems([]);
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(getFavorites);

  useEffect(() => {
    const syncFavorites = () => setFavorites(getFavorites());

    syncFavorites();
    window.addEventListener('storage', syncFavorites);
    window.addEventListener(MARKETPLACE_CHANGE_EVENT, syncFavorites);

    return () => {
      window.removeEventListener('storage', syncFavorites);
      window.removeEventListener(MARKETPLACE_CHANGE_EVENT, syncFavorites);
    };
  }, []);

  return favorites;
};


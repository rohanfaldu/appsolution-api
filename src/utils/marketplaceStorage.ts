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

export const getFavorites = () => readJson<Array<string | number>>(FAVORITES_KEY, []);

export const hasFavorite = (id: string | number) =>
  getFavorites().some((item) => normalizeId(item) === normalizeId(id));

export const toggleFavorite = (id: string | number) => {
  const key = normalizeId(id);
  const current = getFavorites();
  const next = current.some((item) => normalizeId(item) === key)
    ? current.filter((item) => normalizeId(item) !== key)
    : [...current, id];

  writeJson(FAVORITES_KEY, next);
  return next;
};

export const getFavoriteCount = () => getFavorites().length;

export const hasCartItem = (id: string | number) =>
  getCartItems().some((item) => normalizeId(item.id) === normalizeId(id));


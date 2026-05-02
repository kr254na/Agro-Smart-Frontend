export const setStorage = (key: string, value: string) => {
  sessionStorage.setItem(key, value);
};

export const getStorage = (key: string): string | null => {
  return sessionStorage.getItem(key);
};

export const removeStorage = (key: string) => {
  sessionStorage.removeItem(key);
};

export const clearAllStorage = () => {
  sessionStorage.clear();
};

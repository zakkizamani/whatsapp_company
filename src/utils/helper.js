export const generateNonce = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const encodeCredentials = (username, password) => {
  return btoa(`${username}:${password}`);
};
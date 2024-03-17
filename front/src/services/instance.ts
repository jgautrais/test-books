import ky from 'ky';

export const instance = ky.extend({
  prefixUrl: import.meta.env.VITE_BACK_URL,
  headers: {
    Accept: 'application/json',
  },
});

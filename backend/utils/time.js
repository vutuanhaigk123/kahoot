/* eslint-disable import/prefer-default-export */

export const getCurTimestampUTC = () => {
  const d = new Date();
  const diff = d.getTimezoneOffset();

  return Date.now() + (diff / 60) * 3600 * 1000;
};

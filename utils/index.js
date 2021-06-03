export const formatNumber = (number, pos) => {
  return Number.parseFloat(number).toFixed(pos);
};

export const truncate = (str, n) => {
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
};

export const capitalize = (s) => {
  if (typeof s !== "string") return "";

  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const convertToGregorian = (dateObject) => {
  if (!dateObject) return null;
  return dateObject.toDate().toISOString().split("T")[0];
};

export const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const n = Number(value);
  return isNaN(n) ? undefined : n;
};

export const toArray = (str) => {
  if (!str) return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
};
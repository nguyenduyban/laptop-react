export const formatPrice = (val) => {
  if (!val) return "Liên hệ";

  const num = parseFloat(val);

  return isNaN(num) || num <= 0 ? "Liên hệ" : num.toLocaleString("vi-VN") + "đ";
};
  export const parsePrice = (val) => {
    if (!val) return 0;
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

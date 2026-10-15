const BASE =
  "w-full ps-11 pe-9 py-3.5 bg-white border-2 border-slate-200 rounded-xl " +
  "text-[13.5px] font-medium text-slate-900 placeholder:font-normal placeholder:text-slate-400 " +
  "transition-all duration-200 " +
  "hover:border-gold-300 " +
  "focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 " +
  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70";

export const INPUT_CLASS = BASE;

export const SELECT_CLASS = `${BASE} appearance-none cursor-pointer bg-[length:16px] bg-[position:left_14px_center] bg-no-repeat`;

/* فلش select به شکل SVG درون‌خطی — سازگار با RTL */
export const SELECT_BG_IMAGE = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/></svg>\")",
};
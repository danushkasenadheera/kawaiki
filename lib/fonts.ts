import { Cabin } from "next/font/google";

export const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
});

// Japanese pages use the system Japanese fonts (Hiragino, Yu Gothic, Noto Sans CJK) instead of a
// web font: CJK web fonts are several MB and made Japanese pages much slower. See globals.css.

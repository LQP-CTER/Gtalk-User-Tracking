import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DAU (Daily Active User) · Dashboard",
  description: "Báo cáo tỷ lệ nhắn tin trên Gtalk theo chuẩn IBCS – GHN Express",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

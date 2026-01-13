import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "五险一金计算器",
  description: "根据员工工资和城市社保标准，计算公司应缴纳的社保公积金费用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

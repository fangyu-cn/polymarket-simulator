import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Wallet, TrendingUp, LogIn, User } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Polymarket 模拟器",
  description: "体验预测市场的核心机制",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <nav className="border-b border-gray-200/50 dark:border-gray-800/50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Polymarket 模拟器
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  href="/markets"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all font-medium"
                >
                  市场
                </Link>
                <Link
                  href="/create-market"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all font-medium"
                >
                  创建市场
                </Link>
                <Link
                  href="/portfolio"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all font-medium"
                >
                  <Wallet className="w-4 h-4" />
                  我的持仓
                </Link>
                <AuthButton />
              </div>
            </div>
          </div>
        </nav>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}

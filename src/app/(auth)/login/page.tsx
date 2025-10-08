import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { DiagramAILogo } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <DiagramAILogo size={80} className="drop-shadow-md" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">欢迎回来</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">登录您的 DiagramAI 账户</p>
        </div>

        {/* 登录表单卡片 */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-shadow hover:shadow-xl">
          <LoginForm />

          {/* 注册链接 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              还没有账户?{" "}
              <Link
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                立即注册
              </Link>
            </p>
          </div>
        </div>

        {/* 底部说明 */}
        <p className="mt-8 text-center text-xs sm:text-sm text-slate-500">
          登录即表示您同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  );
}

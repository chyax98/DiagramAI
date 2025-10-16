import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Logo } from "@/components/icons";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size={80} className="drop-shadow-md" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">创建账户</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            开始使用 DiagramAI 生成精美图表
          </p>
        </div>

        {/* 注册表单卡片 */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-shadow hover:shadow-xl">
          <RegisterForm />

          {/* 登录链接 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              已有账户?{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                立即登录
              </Link>
            </p>
          </div>
        </div>

        {/* 底部说明 */}
        <p className="mt-8 text-center text-xs sm:text-sm text-slate-500">
          注册即表示您同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  );
}

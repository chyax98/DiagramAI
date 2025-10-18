"use client";

import { useState } from "react";
import { apiClient } from "@/lib/utils/api-client";

interface TestConnectionButtonProps {
  modelId: number;
  modelName: string;
}

interface TestResult {
  success: boolean;
  message?: string;
  response?: string;
  error?: string;
}

export function TestConnectionButton({
  modelId,
  modelName: _modelName,
}: TestConnectionButtonProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await apiClient.post<TestResult>(`/api/models/${modelId}/test`);

      setTestResult({
        success: true,
        message: result.message || "连接测试成功",
        response: result.response,
      });
    } catch (error) {
      let errorMessage = "网络错误,请重试";

      if (error instanceof Error) {
        if (error.message.includes("timeout") || error.message.includes("timed out")) {
          errorMessage = "API 请求超时 - 可能是 API 密钥无效或网络连接问题";
        } else if (error.message.includes("401") || error.message.includes("Unauthorized")) {
          errorMessage = "API 密钥无效或已过期,请检查并更新";
        } else if (error.message.includes("403") || error.message.includes("Forbidden")) {
          errorMessage = "API 密钥无权限访问该模型,请检查配置";
        } else if (error.message.includes("429")) {
          errorMessage = "API 请求频率超限,请稍后重试";
        } else if (
          error.message.includes("500") ||
          error.message.includes("502") ||
          error.message.includes("503")
        ) {
          errorMessage = "AI 服务暂时不可用,请稍后重试";
        } else {
          errorMessage = error.message;
        }
      }

      setTestResult({
        success: false,
        error: errorMessage,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleTest}
        disabled={isTesting}
        className={`w-full px-3 py-2 text-sm rounded-md
                   transition-all duration-200 flex items-center justify-center gap-2
                   ${
                     isTesting
                       ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                       : "bg-green-100 text-green-700 hover:bg-green-200"
                   }`}
      >
        {isTesting ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>测试中...</span>
          </>
        ) : (
          <span>测试连接</span>
        )}
      </button>

      {testResult && (
        <div
          className={`p-3 rounded-lg border text-sm ${
            testResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}
        >
          {testResult.success ? (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="flex-1">
                  <p className="font-medium text-green-800">{testResult.message}</p>
                  {testResult.response && (
                    <p className="mt-1 text-green-700 text-xs">AI 响应: {testResult.response}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <div className="flex-1">
                  <p className="font-medium text-red-800">连接测试失败</p>
                  <p className="mt-1 text-red-700 text-xs">{testResult.error}</p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-red-200">
                <p className="text-xs text-red-600">请检查:</p>
                <ul className="mt-1 text-xs text-red-700 list-disc list-inside space-y-0.5">
                  <li>API 端点是否正确</li>
                  <li>API 密钥是否有效</li>
                  <li>模型 ID 是否正确</li>
                  <li>网络连接是否正常</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

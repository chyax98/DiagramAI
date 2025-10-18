/**
 * 渲染失败报告 Hook
 *
 * 用途: 用户点击"报告问题"按钮时记录渲染失败日志
 * 设计: 低侵入性,不影响主流程
 */

import { useState, useCallback } from "react";
import { toast } from "@/components/ui/toast";
import { logger } from "@/lib/utils/logger";

interface ReportFailureOptions {
  userInput: string;
  renderLanguage: string;
  diagramType: string;
  generatedCode: string;
  errorMessage: string;
  aiProvider: string;
  aiModel: string;
}

export function useReportFailure() {
  const [isReporting, setIsReporting] = useState(false);

  const reportFailure = useCallback(
    async (options: ReportFailureOptions) => {
      if (isReporting) {
        logger.warn("⚠️ [ReportFailure] 正在提交，请勿重复操作");
        return;
      }

      setIsReporting(true);

      try {
        const response = await fetch("/api/admin/render-failures", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(options),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        toast.success("感谢反馈！失败记录已保存，将用于优化 Prompt");
        logger.info("✅ [ReportFailure] 失败记录已提交:", data.id);

        return data.id;
      } catch (error) {
        logger.error("❌ [ReportFailure] 提交失败:", error);
        toast.error("提交失败，请稍后重试");
        throw error;
      } finally {
        setIsReporting(false);
      }
    },
    [isReporting]
  );

  return {
    reportFailure,
    isReporting,
  };
}

/**
 * 三级提示词分工说明组件
 * 在用户未选择任何层级时展示，指导用户理解和编辑提示词
 */

"use client";

import { AlertCircle, Layers, Globe, FileText, ArrowRight, Check } from "lucide-react";

export function PromptGuide() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background p-8 overflow-y-auto">
      <div className="max-w-5xl w-full space-y-8">
        {/* 标题 */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-foreground">三级提示词系统</h1>
          <p className="text-lg text-muted-foreground">
            模块化、精确控制、易于维护的 AI 提示词管理方案
          </p>
        </div>

        {/* 核心概念 */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <AlertCircle className="h-5 w-5" />
            <h2 className="text-xl font-semibold">核心概念</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            DiagramAI 采用<strong className="text-foreground">三层金字塔式提示词架构</strong>，
            将提示词按照抽象层级分为三层（L1/L2/L3），每层负责不同范围的规则和指导。
            通过这种分层设计，实现了提示词的复用、精确控制和灵活组合。
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>L1: 通用层</span>
            </div>
            <ArrowRight className="h-4 w-4" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>L2: 语言层</span>
            </div>
            <ArrowRight className="h-4 w-4" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>L3: 类型层</span>
            </div>
          </div>
        </div>

        {/* 三层分工 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* L1 通用层 */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Layers className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">L1: 通用规范层</h3>
                <p className="text-xs text-muted-foreground">所有图表共享</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium text-foreground mb-2">✅ 应该包含</div>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>任务识别指令（GENERATE/ADJUST/FIX）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>输出格式要求（纯代码、无 Markdown）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>AI 行为准则（如何理解用户意图）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>通用质量标准（清晰性、完整性）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>错误处理原则</span>
                  </li>
                </ul>
              </div>

              <div>
                <div className="font-medium text-foreground mb-2">❌ 不应包含</div>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 shrink-0">×</span>
                    <span>特定语言的语法规则</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 shrink-0">×</span>
                    <span>特定图表类型的细节</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 shrink-0">×</span>
                    <span>语言特有的保留关键字</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-border text-xs text-muted-foreground">
              <strong>复用率:</strong> 2,300+ 次（23 种语言 × 100+ 种类型）
            </div>
          </div>

          {/* L2 语言层 */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">L2: 语言规范层</h3>
                <p className="text-xs text-muted-foreground">特定渲染语言（可选）</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium text-foreground mb-2">✅ 应该包含</div>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>语言保留关键字列表</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>特殊字符转义规则</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>注释语法规范</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>该语言所有图表类型的共同规则</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>命名约定和最佳实践</span>
                  </li>
                </ul>
              </div>

              <div>
                <div className="font-medium text-foreground mb-2">❌ 不应包含</div>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 shrink-0">×</span>
                    <span>特定图表类型的独有语法</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 shrink-0">×</span>
                    <span>重复 L1 已有的通用规则</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 shrink-0">×</span>
                    <span>过于具体的布局建议</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-border text-xs text-muted-foreground">
              <strong>复用率:</strong> 平均 5 次/语言（如 Mermaid 14 种类型）
            </div>
          </div>

          {/* L3 类型层 */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">L3: 类型规范层</h3>
                <p className="text-xs text-muted-foreground">特定图表类型（必需）</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium text-foreground mb-2">✅ 应该包含</div>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>专家视角定义（流程专家、设计专家）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>该类型的核心语法和节点类型</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>布局方向和结构建议</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>高级特性（子图、样式定制）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>该类型的最佳实践和常见模式</span>
                  </li>
                </ul>
              </div>

              <div>
                <div className="font-medium text-foreground mb-2">❌ 不应包含</div>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 shrink-0">×</span>
                    <span>重复 L1/L2 已有的内容</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 shrink-0">×</span>
                    <span>其他图表类型的语法</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 shrink-0">×</span>
                    <span>过于宽泛的通用建议</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-border text-xs text-muted-foreground">
              <strong>复用率:</strong> 1 次（每个图表类型独有）
            </div>
          </div>
        </div>

        {/* 合成公式 */}
        <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            提示词合成公式
          </h3>
          <div className="bg-background/50 rounded-lg p-4 font-mono text-sm">
            <div className="text-center space-y-2">
              <div className="text-foreground">最终 Prompt = L1（通用，必需）</div>
              <div className="text-muted-foreground">+ "---"</div>
              <div className="text-foreground">+ L2（语言，可选）</div>
              <div className="text-muted-foreground">+ "---"</div>
              <div className="text-foreground">+ L3（类型，必需）</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            三层提示词使用 <code className="bg-background/80 px-1.5 py-0.5 rounded">---</code> 分隔符连接，
            最终发送给 AI 模型。L2 层是可选的，不影响系统运行。
          </p>
        </div>

        {/* 编辑建议 */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            编辑提示词的最佳实践
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-medium text-foreground">📝 内容组织</div>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• 使用清晰的章节标题（## 标题）</li>
                <li>• 规则要具体、可执行、有示例</li>
                <li>• 用代码块展示正确/错误对比</li>
                <li>• 重要规则用 ⚠️ 或 ❌ 标记</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-foreground">🎯 质量控制</div>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• 避免冗余，每条规则只在合适的层级出现一次</li>
                <li>• 保持层级之间的独立性</li>
                <li>• 测试修改后的效果再保存</li>
                <li>• 用有意义的版本名称（如"修正箭头语法"）</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-foreground">🔄 版本管理</div>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• 系统自动生成版本号（v1, v2, v3...）</li>
                <li>• 所有版本永久保留，可随时回退</li>
                <li>• 激活历史版本后立即生效</li>
                <li>• 建议在低峰时段修改 L1 通用层</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-foreground">⚡ 性能优化</div>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• L1 提示词影响所有图表，谨慎修改</li>
                <li>• 控制总长度在 2 万字符以内</li>
                <li>• 删除过时的规则和示例</li>
                <li>• 优先修改 L3，影响范围最小</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 快速开始 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">🚀 快速开始</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-bold">
                1
              </div>
              <div>
                <div className="font-medium text-foreground">选择层级</div>
                <div className="text-xs text-muted-foreground mt-1">
                  从左侧选择 L1/L2/L3
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-bold">
                2
              </div>
              <div>
                <div className="font-medium text-foreground">选择范围</div>
                <div className="text-xs text-muted-foreground mt-1">
                  选择语言和类型（如需）
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-bold">
                3
              </div>
              <div>
                <div className="font-medium text-foreground">编辑内容</div>
                <div className="text-xs text-muted-foreground mt-1">
                  在编辑器中修改提示词
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-bold">
                4
              </div>
              <div>
                <div className="font-medium text-foreground">保存版本</div>
                <div className="text-xs text-muted-foreground mt-1">
                  输入版本名称并保存
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="text-center text-sm text-muted-foreground">
          <p>💡 提示：选择左侧的层级开始编辑提示词</p>
        </div>
      </div>
    </div>
  );
}


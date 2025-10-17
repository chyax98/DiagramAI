import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 全局忽略配置
  {
    ignores: [
      "node_modules/**",       // 忽略依赖包
      ".next/**",              // 忽略 Next.js 构建产物
      "out/**",                // 忽略静态导出
      "build/**",              // 忽略构建产物
      "dist/**",               // 忽略打包产物
      "next-env.d.ts",         // 忽略 Next.js 类型定义
      "coverage/**",           // 忽略测试覆盖率报告
      "src/**/__tests__/**",   // 忽略测试目录
      "src/**/*.test.ts",      // 忽略测试文件
      "src/**/*.test.tsx",     // 忽略测试文件
      "src/**/*.spec.ts",      // 忽略测试文件
      "src/**/*.spec.tsx",     // 忽略测试文件
    ],
  },

  // Next.js 官方推荐配置 (核心 Web Vitals + TypeScript)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 自定义规则
  {
    rules: {
      /* TypeScript 规则 - 平衡类型安全与开发效率 */
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",      // 以 _ 开头的参数允许未使用
          varsIgnorePattern: "^_",      // 以 _ 开头的变量允许未使用
          caughtErrorsIgnorePattern: "^_", // 以 _ 开头的错误允许未使用
          destructuredArrayIgnorePattern: "^_", // 数组解构时以 _ 开头允许未使用
        },
      ],
      "@typescript-eslint/no-explicit-any": "off", // 开发时允许 any，上线前可改为 warn
      "@typescript-eslint/explicit-module-boundary-types": "off", // 允许不声明导出函数返回类型
      "@typescript-eslint/no-non-null-assertion": "off", // 允许使用非空断言
      "@typescript-eslint/no-inferrable-types": "off", // 允许显式类型注解

      /* React 规则 - 现代 React 最佳实践 */
      "react/react-in-jsx-scope": "off", // React 17+ 不需要导入 React
      "react/prop-types": "off",         // TypeScript 已提供类型检查
      "react/display-name": "off",       // 允许匿名组件
      "react-hooks/rules-of-hooks": "error", // Hooks 规则必须遵守
      "react-hooks/exhaustive-deps": "warn", // Hooks 依赖数组警告
      "react/jsx-key": "error", // 列表渲染必须有 key
      "react/jsx-boolean-value": ["warn", "never"], // 布尔值属性简写
      "react/jsx-curly-brace-presence": ["warn", { "props": "never", "children": "never" }], // 避免不必要的花括号
      "react/jsx-fragments": ["warn", "syntax"], // 推荐使用 <> 语法
      "react/jsx-no-useless-fragment": "warn", // 避免无用的 Fragment
      "react/jsx-pascal-case": "error", // 组件名必须使用 PascalCase
      "react/self-closing-comp": "warn", // 自闭合标签
      "react/jsx-uses-vars": "error", // 必须使用引入的变量

      /* 代码质量规则 - 核心质量保证 */
      "no-console": ["warn", { allow: ["warn", "error", "info"] }], // 允许部分 console
      "no-debugger": "warn",           // 警告使用 debugger
      "no-var": "error",               // 禁止使用 var
      "prefer-const": "warn",          // 优先使用 const
      "no-duplicate-imports": "error", // 禁止重复导入
      // 注意：以下格式化规则已移除，应使用 Prettier 处理：
      // - quotes（引号风格）、semi（分号）、comma-dangle（拖尾逗号）
      // - arrow-spacing（箭头函数间距）、template-curly-spacing（模板字符串间距）

      /* Next.js 特定规则 - 保持核心最佳实践 */
      "@next/next/no-html-link-for-pages": "error", // 页面间导航必须用 Link 组件
      "@next/next/no-img-element": "warn", // 建议使用 next/image，但某些场景需要 img
      "@next/next/no-head-element": "warn", // 避免在客户端组件中使用 Head
      "@next/next/no-script-component-in-head": "error", // 避免在 Head 中使用 script 组件,

      /* 可访问性规则 (a11y) - 开发阶段建议关闭或降级 */
      "jsx-a11y/alt-text": "warn",              // 图片必须有 alt 属性
      "jsx-a11y/anchor-is-valid": "warn",       // a 标签必须有效
      // 以下规则在快速开发时建议关闭，上线前启用
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/mouse-events-have-key-events": "off",
      "jsx-a11y/role-has-required-aria-props": "off",
      "jsx-a11y/role-supports-aria-props": "off",

      /* 性能规则 - 关注真正重要的性能问题 */
      "react/no-array-index-key": "off", // 静态列表用索引是合理的
      "react/jsx-no-bind": "off", // 现代 React 中内联函数性能影响不大
      "react/jsx-no-constructed-context-values": "warn", // 避免构造 Context 值
      "react/no-unstable-nested-components": "warn", // 避免在组件内部定义组件,

      /* 安全性规则 - 防止安全漏洞 */
      "no-eval": "error", // 禁止使用 eval
      "no-implied-eval": "error", // 禁止隐式 eval
      "no-new-func": "error", // 禁止使用 Function 构造器
      "no-script-url": "error", // 禁止 javascript: URL
      "no-prototype-builtins": "warn", // 避免直接调用原型方法,

      /* 代码复杂度控制 - 适度放宽限制 */
      "complexity": ["warn", 25], // 圈复杂度放宽到 25
      "max-depth": "off", // 关闭嵌套深度限制
      "max-lines-per-function": ["warn", { 
        "max": 300,  // 放宽到 300 行
        "skipBlankLines": true, 
        "skipComments": true 
      }],
      "max-nested-callbacks": "off", // 关闭回调嵌套限制

      /* 错误处理 - 保证错误处理质量 */
      "no-throw-literal": "error", // 必须抛出 Error 对象
      "prefer-promise-reject-errors": "warn", // Promise.reject 建议使用 Error

      /* Import 规则 */
      "import/no-duplicates": "error", // 禁止重复导入
      "import/order": [
        "warn",
        {
          groups: [
            "builtin", // Node.js 内置模块
            "external", // npm 包
            "internal", // 内部模块
            "parent", // 父级目录
            "sibling", // 同级目录
            "index", // index 文件
            "object", // 命名空间导入
            "type", // 类型导入
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "ignore",
        },
      ], // 导入顺序规则
    },
  },
];

export default eslintConfig;

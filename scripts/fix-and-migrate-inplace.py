#!/usr/bin/env python3
"""
Prompt 就地迁移和修复脚本

功能:
1. 直接在原位置创建 .txt 文件（不使用 data/ 目录）
2. 修复转义字符处理（特别是代码块标记 ```）
3. 删除原 .ts 文件（可选）
"""

import os
import re
import sys
from pathlib import Path
from typing import Optional

class InPlaceMigrator:
    """就地迁移器"""

    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.source_dir = self.project_root / "src/lib/constants/prompts"
        self.success_count = 0
        self.error_count = 0

    def unescape_template_string(self, content: str) -> str:
        """
        正确处理 TypeScript 模板字符串的转义字符

        在 TypeScript 模板字符串中，反引号需要转义：
        - 原始：```  → 模板字符串中：\`\`\`
        - Python读取后：\\`\\`\\` (每个 \ 显示为 \\)
        """
        # 1. 先处理三个反引号: \`\`\` → ```
        #    注意：Python中 '\`' 是两个字符（反斜杠 + 反引号）
        content = content.replace('\\`\\`\\`', '```')

        # 2. 再处理双反引号: \`\` → ``
        content = content.replace('\\`\\`', '``')

        # 3. 最后处理单个反引号: \` → `
        content = content.replace('\\`', '`')

        # 4. 处理双反斜杠: \\ → \
        content = content.replace('\\\\', '\\')

        # 5. 处理双引号转义: \" → "
        content = content.replace('\\"', '"')

        return content

    def extract_and_convert(self, ts_file: Path) -> bool:
        """提取内容并创建 .txt 文件"""
        try:
            # 读取 .ts 文件
            content = ts_file.read_text(encoding="utf-8")

            # 提取 prompt 内容
            # 修复：使用负向后顾断言，只匹配未转义的反引号
            # (?<!\\)` 表示匹配不在反斜杠后面的反引号
            pattern = r'export\s+const\s+(\w+)\s*=\s*`((?:[^`\\]|\\.)*)(?<!\\)`\s*;?\s*$'
            match = re.search(pattern, content, re.DOTALL | re.MULTILINE)

            if not match:
                print(f"⚠️  跳过: {ts_file.relative_to(self.source_dir)} (无匹配模式)")
                return False

            prompt_content = match.group(2)

            # 正确处理转义字符
            prompt_content = self.unescape_template_string(prompt_content)

            # 生成 .txt 文件路径（同目录）
            txt_file = ts_file.with_suffix('.txt')

            # 写入 .txt 文件
            txt_file.write_text(prompt_content, encoding="utf-8")

            print(f"✅ {ts_file.relative_to(self.source_dir)} → {txt_file.name}")
            self.success_count += 1
            return True

        except Exception as e:
            print(f"❌ {ts_file.relative_to(self.source_dir)}: {e}")
            self.error_count += 1
            return False

    def scan_and_migrate(self, delete_ts: bool = False):
        """扫描并迁移所有 .ts 文件"""
        print("🔍 扫描 prompt 文件...\n")

        # 排除这些文件
        exclude_files = {"index.ts", "types.ts", "auto-select.ts", "index.ts.backup"}

        ts_files = []
        for ts_file in self.source_dir.rglob("*.ts"):
            if ts_file.name in exclude_files:
                continue
            if "node_modules" in ts_file.parts:
                continue
            if "loaders" in ts_file.parts:
                continue
            ts_files.append(ts_file)

        print(f"找到 {len(ts_files)} 个 .ts 文件\n")
        print("🚀 开始迁移...\n")

        for ts_file in sorted(ts_files):
            success = self.extract_and_convert(ts_file)

            # 如果成功且需要删除原文件
            if success and delete_ts:
                try:
                    ts_file.unlink()
                    print(f"   🗑️  删除: {ts_file.name}")
                except Exception as e:
                    print(f"   ⚠️  删除失败: {e}")

        print("\n" + "=" * 60)
        print("📊 迁移结果")
        print("=" * 60)
        print(f"成功: {self.success_count}")
        print(f"失败: {self.error_count}")

        if self.error_count == 0:
            print("\n✅ 所有文件迁移成功!")
        else:
            print(f"\n⚠️  有 {self.error_count} 个文件失败")

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Prompt 就地迁移和修复工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    parser.add_argument(
        "--delete-ts",
        action="store_true",
        help="迁移成功后删除原 .ts 文件"
    )

    parser.add_argument(
        "--project-root",
        default=".",
        help="项目根目录"
    )

    args = parser.parse_args()

    migrator = InPlaceMigrator(project_root=args.project_root)
    migrator.scan_and_migrate(delete_ts=args.delete_ts)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ 用户中断")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ 发生错误: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

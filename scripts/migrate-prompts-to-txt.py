#!/usr/bin/env python3
"""
Prompt 迁移脚本: .ts → .txt

功能:
1. 扫描 src/lib/constants/prompts/ 下的所有 .ts 文件
2. 提取 export const XXX_PROMPT = `...` 中的内容
3. 保存为 src/lib/constants/prompts/data/ 下的 .txt 文件
4. 生成迁移报告

使用方法:
    python3 scripts/migrate-prompts-to-txt.py           # 预览模式
    python3 scripts/migrate-prompts-to-txt.py --execute # 执行迁移
    python3 scripts/migrate-prompts-to-txt.py --verify  # 验证迁移结果
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import dataclass


@dataclass
class PromptFile:
    """Prompt 文件信息"""
    source_path: str      # 源文件路径
    target_path: str      # 目标文件路径
    language: str         # 语言类型 (mermaid, plantuml, etc.)
    type: str             # 图表类型 (flowchart, sequence, etc.)
    content: str          # prompt 内容
    const_name: str       # 常量名称


class PromptMigrator:
    """Prompt 迁移器"""

    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.source_dir = self.project_root / "src/lib/constants/prompts"
        self.target_dir = self.project_root / "src/lib/constants/prompts/data"
        self.files: List[PromptFile] = []

    def unescape_template_string(self, content: str) -> str:
        """
        处理 TypeScript 模板字符串的转义字符

        在模板字符串中：
        - \\` → `
        - \\\\ → \\
        - \\" → "
        """
        # 处理反引号转义
        content = content.replace(r'\`', '`')

        # 处理反斜杠转义（必须放在最后，避免误处理）
        content = content.replace(r'\\', '\\')

        # 处理双引号转义
        content = content.replace(r'\"', '"')

        return content

    def scan_source_files(self) -> List[Path]:
        """扫描所有源 .ts 文件"""
        print("📂 扫描源文件...")

        # 排除这些文件
        exclude_files = {
            "index.ts",
            "types.ts",
            "auto-select.ts",
        }

        # 排除这些目录
        exclude_dirs = {"node_modules", ".git", "dist", "build"}

        ts_files = []
        for ts_file in self.source_dir.rglob("*.ts"):
            # 检查是否在排除目录中
            if any(excluded in ts_file.parts for excluded in exclude_dirs):
                continue

            # 检查是否是排除文件
            if ts_file.name in exclude_files:
                continue

            ts_files.append(ts_file)

        print(f"   找到 {len(ts_files)} 个 .ts 文件")
        return sorted(ts_files)

    def extract_prompt_content(self, file_path: Path) -> Optional[PromptFile]:
        """从 .ts 文件中提取 prompt 内容"""
        try:
            content = file_path.read_text(encoding="utf-8")

            # 匹配模式: export const XXX_PROMPT = `...`;
            # 使用非贪婪匹配和 DOTALL 模式
            pattern = r'export\s+const\s+(\w+)\s*=\s*`(.*?)`\s*;?\s*$'
            match = re.search(pattern, content, re.DOTALL | re.MULTILINE)

            if not match:
                return None

            const_name = match.group(1)
            prompt_content = match.group(2)

            # 处理 TypeScript 模板字符串的转义字符
            prompt_content = self.unescape_template_string(prompt_content)

            # 解析文件路径以确定 language 和 type
            rel_path = file_path.relative_to(self.source_dir)
            parts = rel_path.parts

            # 确定语言和类型
            if len(parts) == 2:
                # 如 mermaid/flowchart.ts
                language = parts[0]
                type_name = parts[1].replace(".ts", "")
            elif len(parts) == 3 and parts[1] == "c4":
                # 如 plantuml/c4/context.ts
                language = f"{parts[0]}/c4"
                type_name = parts[2].replace(".ts", "")
            elif len(parts) >= 3:
                # 其他嵌套目录
                language = "/".join(parts[:-1])
                type_name = parts[-1].replace(".ts", "")
            else:
                return None

            # 特殊处理: common.ts 文件
            if type_name == "common":
                type_name = "common"

            # 构建目标路径
            target_path = self.target_dir / language / f"{type_name}.txt"

            return PromptFile(
                source_path=str(file_path),
                target_path=str(target_path),
                language=language,
                type=type_name,
                content=prompt_content,
                const_name=const_name,
            )

        except Exception as e:
            print(f"⚠️  解析失败: {file_path}")
            print(f"   错误: {e}")
            return None

    def analyze(self) -> Dict[str, any]:
        """分析所有文件"""
        print("\n🔍 分析 prompt 文件...")

        source_files = self.scan_source_files()

        for file_path in source_files:
            prompt_file = self.extract_prompt_content(file_path)
            if prompt_file:
                self.files.append(prompt_file)

        # 统计信息
        languages = set(f.language for f in self.files)
        types_by_language = {}
        for f in self.files:
            if f.language not in types_by_language:
                types_by_language[f.language] = set()
            types_by_language[f.language].add(f.type)

        return {
            "total_files": len(self.files),
            "languages": sorted(languages),
            "types_by_language": {
                lang: sorted(types)
                for lang, types in types_by_language.items()
            },
        }

    def preview(self):
        """预览迁移计划"""
        stats = self.analyze()

        print("\n" + "=" * 60)
        print("📋 迁移预览")
        print("=" * 60)
        print(f"\n总文件数: {stats['total_files']}")
        print(f"语言类型: {len(stats['languages'])} 种")
        print(f"  {', '.join(stats['languages'])}")

        print("\n详细统计:")
        for language, types in sorted(stats['types_by_language'].items()):
            print(f"\n  📁 {language}/")
            for type_name in types:
                matching_files = [
                    f for f in self.files
                    if f.language == language and f.type == type_name
                ]
                if matching_files:
                    file = matching_files[0]
                    content_lines = len(file.content.strip().split('\n'))
                    print(f"     • {type_name}.txt ({content_lines} 行)")

        print("\n" + "=" * 60)
        print(f"目标目录: {self.target_dir}")
        print("=" * 60)

        print("\n⚠️  这是预览模式，未执行实际迁移")
        print("   执行迁移请运行: python3 scripts/migrate-prompts-to-txt.py --execute")

    def execute(self):
        """执行迁移"""
        if not self.files:
            self.analyze()

        print("\n🚀 开始执行迁移...")

        success_count = 0
        failed_count = 0

        for prompt_file in self.files:
            try:
                # 创建目标目录
                target_path = Path(prompt_file.target_path)
                target_path.parent.mkdir(parents=True, exist_ok=True)

                # 写入内容
                target_path.write_text(prompt_file.content, encoding="utf-8")

                print(f"✅ {prompt_file.language}/{prompt_file.type}.txt")
                success_count += 1

            except Exception as e:
                print(f"❌ {prompt_file.language}/{prompt_file.type}.txt")
                print(f"   错误: {e}")
                failed_count += 1

        print("\n" + "=" * 60)
        print("✨ 迁移完成!")
        print("=" * 60)
        print(f"成功: {success_count} 个文件")
        print(f"失败: {failed_count} 个文件")
        print(f"目标目录: {self.target_dir}")

        if failed_count == 0:
            print("\n✅ 所有文件迁移成功!")
            print("\n下一步:")
            print("  1. 验证迁移结果: python3 scripts/migrate-prompts-to-txt.py --verify")
            print("  2. 更新加载器代码")
            print("  3. 运行测试验证")
        else:
            print(f"\n⚠️  有 {failed_count} 个文件迁移失败，请检查错误信息")

    def verify(self):
        """验证迁移结果"""
        if not self.files:
            self.analyze()

        print("\n🔍 验证迁移结果...")

        success_count = 0
        missing_count = 0
        mismatch_count = 0

        for prompt_file in self.files:
            target_path = Path(prompt_file.target_path)

            # 检查文件是否存在
            if not target_path.exists():
                print(f"❌ 缺失: {prompt_file.language}/{prompt_file.type}.txt")
                missing_count += 1
                continue

            # 检查内容是否一致
            target_content = target_path.read_text(encoding="utf-8")
            if target_content.strip() != prompt_file.content.strip():
                print(f"⚠️  内容不匹配: {prompt_file.language}/{prompt_file.type}.txt")
                print(f"   源文件: {len(prompt_file.content)} 字符")
                print(f"   目标文件: {len(target_content)} 字符")
                mismatch_count += 1
                continue

            success_count += 1

        print("\n" + "=" * 60)
        print("验证结果")
        print("=" * 60)
        print(f"验证通过: {success_count} 个文件")
        print(f"文件缺失: {missing_count} 个文件")
        print(f"内容不匹配: {mismatch_count} 个文件")

        if missing_count == 0 and mismatch_count == 0:
            print("\n✅ 验证通过! 所有文件迁移正确")
        else:
            print("\n❌ 验证失败，请检查上述错误")

    def generate_migration_report(self, output_file: str = "claudedocs/migration-report.md"):
        """生成迁移报告"""
        if not self.files:
            self.analyze()

        report_path = self.project_root / output_file
        report_path.parent.mkdir(parents=True, exist_ok=True)

        with open(report_path, "w", encoding="utf-8") as f:
            f.write("# Prompt 迁移报告\n\n")
            f.write(f"生成时间: {self._get_timestamp()}\n\n")

            f.write("## 迁移概览\n\n")
            f.write(f"- **总文件数**: {len(self.files)}\n")
            f.write(f"- **源目录**: `{self.source_dir}`\n")
            f.write(f"- **目标目录**: `{self.target_dir}`\n\n")

            f.write("## 文件列表\n\n")

            # 按语言分组
            languages = sorted(set(f.language for f in self.files))
            for language in languages:
                f.write(f"### {language}\n\n")

                language_files = [
                    pf for pf in self.files if pf.language == language
                ]
                language_files.sort(key=lambda x: x.type)

                for prompt_file in language_files:
                    source_rel = Path(prompt_file.source_path).relative_to(self.project_root)
                    target_rel = Path(prompt_file.target_path).relative_to(self.project_root)
                    content_lines = len(prompt_file.content.strip().split('\n'))

                    f.write(f"- **{prompt_file.type}**\n")
                    f.write(f"  - 源文件: `{source_rel}`\n")
                    f.write(f"  - 目标文件: `{target_rel}`\n")
                    f.write(f"  - 内容: {content_lines} 行\n")
                    f.write(f"  - 常量名: `{prompt_file.const_name}`\n\n")

        print(f"\n📄 迁移报告已生成: {report_path}")

    def _get_timestamp(self) -> str:
        """获取当前时间戳"""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def main():
    """主函数"""
    import argparse

    parser = argparse.ArgumentParser(
        description="Prompt 迁移工具: .ts → .txt",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  python3 scripts/migrate-prompts-to-txt.py           # 预览模式
  python3 scripts/migrate-prompts-to-txt.py --execute # 执行迁移
  python3 scripts/migrate-prompts-to-txt.py --verify  # 验证迁移
  python3 scripts/migrate-prompts-to-txt.py --report  # 生成报告
        """
    )

    parser.add_argument(
        "--execute",
        action="store_true",
        help="执行迁移（默认为预览模式）"
    )

    parser.add_argument(
        "--verify",
        action="store_true",
        help="验证迁移结果"
    )

    parser.add_argument(
        "--report",
        action="store_true",
        help="生成迁移报告"
    )

    parser.add_argument(
        "--project-root",
        default=".",
        help="项目根目录（默认为当前目录）"
    )

    args = parser.parse_args()

    # 创建迁移器
    migrator = PromptMigrator(project_root=args.project_root)

    # 根据参数执行不同操作
    if args.verify:
        migrator.verify()
    elif args.report:
        migrator.generate_migration_report()
    elif args.execute:
        migrator.execute()
        migrator.generate_migration_report()
    else:
        # 默认预览模式
        migrator.preview()


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

#!/usr/bin/env python3
"""
L3 提示词审查工具

功能:
1. 自动提取提示词文件中的所有范例代码
2. 使用 Kroki API 测试每个范例的渲染能力
3. 生成详细的测试报告
4. 支持批量测试多个提示词文件

使用方法:
    # 测试单个文件
    python scripts/review_prompt_tool.py src/lib/constants/prompts/mermaid/flowchart.txt

    # 测试整个目录
    python scripts/review_prompt_tool.py src/lib/constants/prompts/mermaid/

    # 测试所有提示词
    python scripts/review_prompt_tool.py src/lib/constants/prompts/

作者: DiagramAI Team
日期: 2025-01-08
"""

import os
import sys
import re
import base64
import zlib
import json
from pathlib import Path
from typing import List, Tuple, Dict
from datetime import datetime
from dataclasses import dataclass
import requests


@dataclass
class CodeSample:
    """代码示例数据类"""
    source: str  # 来源（如：核心语法、示例1、错误1-正确写法）
    description: str  # 描述
    code: str  # 代码内容
    language: str  # 图表语言（mermaid, plantuml 等）


@dataclass
class TestResult:
    """测试结果数据类"""
    sample: CodeSample
    success: bool
    error_message: str = None
    response_time: float = None


class KrokiTester:
    """Kroki 渲染测试器"""

    BASE_URL = "https://kroki.io"

    def __init__(self, timeout: int = 10):
        self.timeout = timeout

    def encode_diagram(self, code: str) -> str:
        """
        编码图表代码为 Kroki URL 格式

        Args:
            code: 图表代码字符串

        Returns:
            编码后的字符串
        """
        compressed = zlib.compress(code.encode('utf-8'), 9)
        return base64.urlsafe_b64encode(compressed).decode('ascii')

    def test_diagram(
        self,
        code: str,
        diagram_type: str,
        output_format: str = 'svg'
    ) -> Tuple[bool, str, float]:
        """
        测试图表代码是否能被 Kroki 渲染

        Args:
            code: 图表代码字符串
            diagram_type: 图表类型（mermaid, plantuml 等）
            output_format: 输出格式（svg, png 等）

        Returns:
            (是否成功, 错误信息, 响应时间)
        """
        try:
            # 编码
            encoded = self.encode_diagram(code)

            # 构建 URL
            url = f"{self.BASE_URL}/{diagram_type}/{output_format}/{encoded}"

            # 发送请求
            start_time = datetime.now()
            response = requests.get(url, timeout=self.timeout)
            response_time = (datetime.now() - start_time).total_seconds()

            if response.status_code == 200:
                return True, None, response_time
            else:
                error_msg = f"HTTP {response.status_code}"
                if response.text:
                    error_msg += f": {response.text[:200]}"
                return False, error_msg, response_time

        except requests.Timeout:
            return False, "请求超时", None
        except Exception as e:
            return False, str(e), None


class PromptFileParser:
    """提示词文件解析器"""

    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.content = self._read_file()
        self.language = self._detect_language()

    def _read_file(self) -> str:
        """读取文件内容"""
        with open(self.file_path, 'r', encoding='utf-8') as f:
            return f.read()

    def _detect_language(self) -> str:
        """
        从文件路径检测图表语言

        Returns:
            图表语言（mermaid, plantuml, graphviz 等）
        """
        path_parts = self.file_path.parts
        for part in path_parts:
            if part in ['mermaid', 'plantuml', 'graphviz', 'd2', 'dbml',
                        'nomnoml', 'vegalite', 'wavedrom', 'excalidraw']:
                return part
        return 'unknown'

    def extract_code_samples(self) -> List[CodeSample]:
        """
        提取提示词文件中的所有代码示例

        Returns:
            代码示例列表
        """
        samples = []

        # 正则表达式匹配代码块
        # 匹配 ```language 和 ``` 之间的内容
        pattern = r'```(\w+)\n(.*?)```'
        matches = re.finditer(pattern, self.content, re.DOTALL)

        for match in matches:
            code_language = match.group(1)
            code_content = match.group(2).strip()

            # 只提取与检测到的图表语言匹配的代码
            if code_language.lower() in [self.language, '@startuml']:
                # 确定代码来源
                source = self._determine_source(match.start())
                description = self._extract_description(match.start())

                samples.append(CodeSample(
                    source=source,
                    description=description,
                    code=code_content,
                    language=self.language
                ))

        return samples

    def _determine_source(self, position: int) -> str:
        """
        根据代码块位置判断其来源章节

        Args:
            position: 代码块在文件中的位置

        Returns:
            来源描述（如：核心语法、示例1、错误1）
        """
        # 获取代码块之前的内容
        before_content = self.content[:position]

        # 查找最近的章节标题
        section_pattern = r'##\s+(.*?)$'
        sections = list(re.finditer(section_pattern, before_content, re.MULTILINE))

        if sections:
            last_section = sections[-1].group(1).strip()

            # 查找子标题（###）
            subsection_pattern = r'###\s+(.*?)$'
            subsections = list(re.finditer(subsection_pattern, before_content, re.MULTILINE))

            if subsections:
                last_subsection = subsections[-1].group(1).strip()
                return f"{last_section} - {last_subsection}"

            return last_section

        return "未知来源"

    def _extract_description(self, position: int) -> str:
        """
        提取代码示例的描述

        Args:
            position: 代码块在文件中的位置

        Returns:
            描述文字
        """
        # 获取代码块前 500 个字符
        start = max(0, position - 500)
        before_content = self.content[start:position]

        # 查找用户需求或描述
        desc_patterns = [
            r'\*\*用户需求\*\*[：:]\s*(.*?)$',
            r'\*\*生成代码\*\*',
            r'示例\s*\d+[：:]\s*(.*?)$'
        ]

        for pattern in desc_patterns:
            match = re.search(pattern, before_content, re.MULTILINE)
            if match:
                return match.group(1).strip() if match.lastindex else "示例代码"

        return "代码示例"


class ReportGenerator:
    """测试报告生成器"""

    def __init__(self, file_path: str, results: List[TestResult]):
        self.file_path = Path(file_path)
        self.results = results
        self.timestamp = datetime.now()

    def generate_markdown(self) -> str:
        """生成 Markdown 格式的测试报告"""
        total = len(self.results)
        success_count = sum(1 for r in self.results if r.success)
        fail_count = total - success_count
        success_rate = (success_count / total * 100) if total > 0 else 0

        # 判断评级
        if success_rate == 100:
            rating = "✅ 通过"
        elif success_rate >= 90:
            rating = "⚠️ 警告"
        else:
            rating = "❌ 不通过"

        report = f"""# L3 提示词渲染测试报告

**提示词文件**: `{self.file_path}`
**测试时间**: {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}
**测试工具**: review_prompt_tool.py

---

## 测试结果总览

- **总体评级**: {rating}
- **总计**: {total} 个范例
- **成功**: {success_count} 个 ({success_rate:.1f}%)
- **失败**: {fail_count} 个 ({100-success_rate:.1f}%)

---

## 详细测试结果

| # | 来源 | 描述 | 结果 | 响应时间 | 错误信息 |
|---|------|------|------|----------|----------|
"""

        for i, result in enumerate(self.results, 1):
            status = "✅" if result.success else "❌"
            response_time = f"{result.response_time:.2f}s" if result.response_time else "N/A"
            error = result.error_message if result.error_message else "-"

            report += f"| {i} | {result.sample.source} | {result.sample.description} | {status} | {response_time} | {error} |\n"

        # 失败范例详情
        failed_results = [r for r in self.results if not r.success]
        if failed_results:
            report += "\n---\n\n## 失败范例详情\n\n"
            for i, result in enumerate(failed_results, 1):
                report += f"### {i}. {result.sample.source} - {result.sample.description}\n\n"
                report += f"**错误信息**: {result.error_message}\n\n"
                report += "**代码**:\n```" + result.sample.language + "\n"
                report += result.sample.code + "\n```\n\n"

        # 结论
        report += "---\n\n## 结论\n\n"
        if success_rate == 100:
            report += "✅ **通过** - 所有范例代码均可正常渲染\n"
        elif success_rate >= 90:
            report += "⚠️ **警告** - 大部分范例可以渲染，但存在失败的范例需要修复\n"
        else:
            report += "❌ **不通过** - 渲染成功率低于 90%，需要全面检查和修复\n"

        report += f"\n**生成时间**: {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}\n"

        return report

    def save_to_file(self, output_path: str):
        """保存报告到文件"""
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(self.generate_markdown())


def test_prompt_file(file_path: str, output_dir: str = None):
    """
    测试单个提示词文件

    Args:
        file_path: 提示词文件路径
        output_dir: 报告输出目录（可选）
    """
    print(f"\n{'='*60}")
    print(f"测试文件: {file_path}")
    print(f"{'='*60}\n")

    # 解析提示词文件
    parser = PromptFileParser(file_path)
    samples = parser.extract_code_samples()

    print(f"✓ 提取到 {len(samples)} 个代码示例")
    print(f"✓ 图表语言: {parser.language}\n")

    if not samples:
        print("⚠️ 未找到代码示例，跳过测试\n")
        return

    # 测试每个示例
    tester = KrokiTester()
    results = []

    for i, sample in enumerate(samples, 1):
        print(f"[{i}/{len(samples)}] 测试: {sample.source} - {sample.description}")

        success, error, response_time = tester.test_diagram(
            sample.code,
            parser.language
        )

        result = TestResult(
            sample=sample,
            success=success,
            error_message=error,
            response_time=response_time
        )
        results.append(result)

        status = "✅ 成功" if success else f"❌ 失败: {error}"
        print(f"   {status}\n")

    # 生成报告
    print(f"\n{'='*60}")
    print("测试完成，生成报告...")
    print(f"{'='*60}\n")

    generator = ReportGenerator(file_path, results)
    report = generator.generate_markdown()

    # 输出到控制台
    print(report)

    # 保存到文件（如果指定了输出目录）
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        file_name = Path(file_path).stem
        output_path = os.path.join(output_dir, f"{file_name}_test_report.md")
        generator.save_to_file(output_path)
        print(f"\n📄 报告已保存到: {output_path}")


def test_directory(dir_path: str, output_dir: str = None):
    """
    测试目录下的所有提示词文件

    Args:
        dir_path: 目录路径
        output_dir: 报告输出目录（可选）
    """
    dir_path = Path(dir_path)

    # 查找所有 .txt 文件
    prompt_files = list(dir_path.rglob("*.txt"))

    if not prompt_files:
        print(f"⚠️ 在 {dir_path} 中未找到提示词文件 (.txt)")
        return

    print(f"\n找到 {len(prompt_files)} 个提示词文件\n")

    for file_path in prompt_files:
        test_prompt_file(str(file_path), output_dir)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("使用方法:")
        print("  python scripts/review_prompt_tool.py <文件或目录路径> [输出目录]")
        print("\n示例:")
        print("  python scripts/review_prompt_tool.py src/lib/constants/prompts/mermaid/flowchart.txt")
        print("  python scripts/review_prompt_tool.py src/lib/constants/prompts/mermaid/")
        print("  python scripts/review_prompt_tool.py src/lib/constants/prompts/ claudedocs/test_reports/")
        sys.exit(1)

    path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else None

    if not os.path.exists(path):
        print(f"❌ 错误: 路径不存在: {path}")
        sys.exit(1)

    if os.path.isfile(path):
        test_prompt_file(path, output_dir)
    elif os.path.isdir(path):
        test_directory(path, output_dir)
    else:
        print(f"❌ 错误: 无效的路径类型: {path}")
        sys.exit(1)


if __name__ == "__main__":
    main()

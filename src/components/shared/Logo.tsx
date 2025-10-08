/** Logo组件 - 显示应用Logo和名称 */

"use client";

import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 text-lg font-semibold text-white hover:opacity-80 transition-opacity"
    >
      <Image
        src="/icons/app/logo.svg"
        alt="DiagramAI"
        width={32}
        height={32}
        className="rounded-lg"
      />
      <span>DiagramAI</span>
    </Link>
  );
}

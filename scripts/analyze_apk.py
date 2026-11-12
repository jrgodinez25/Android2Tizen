#!/usr/bin/env python3
"""Safely inventory an APK as a ZIP archive; does not execute or decompile it.

Usage:
    python scripts/analyze_apk.py /path/to/application.apk
    python scripts/analyze_apk.py /path/to/application.apk --output apk-report.json

The resulting report contains filenames and package-structure metadata only.
Review it before sharing; filenames themselves can disclose sensitive information.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
import zipfile
from collections import Counter
from pathlib import Path
from typing import Any

MAX_ENTRIES = 100_000
MAX_TOTAL_UNCOMPRESSED = 2 * 1024 * 1024 * 1024  # 2 GiB guardrail


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def inspect_apk(apk_path: Path) -> dict[str, Any]:
    if not apk_path.is_file():
        raise FileNotFoundError(f"APK not found: {apk_path}")
    if not zipfile.is_zipfile(apk_path):
        raise ValueError("Input is not a readable ZIP/APK archive")

    entries: list[str] = []
    total_uncompressed = 0
    manifest_present = False
    dex_files: list[str] = []
    native_libraries: list[str] = []
    resource_files: list[str] = []
    top_level_counts: Counter[str] = Counter()

    with zipfile.ZipFile(apk_path) as archive:
        infos = archive.infolist()
        if len(infos) > MAX_ENTRIES:
            raise ValueError(f"Archive contains too many entries ({len(infos)})")

        for info in infos:
            # Ignore directory records and normalize paths for reporting.
            if info.is_dir():
                continue
            name = info.filename
            if name.startswith("/") or ".." in Path(name).parts:
                raise ValueError(f"Unsafe archive path encountered: {name!r}")
            total_uncompressed += info.file_size
            if total_uncompressed > MAX_TOTAL_UNCOMPRESSED:
                raise ValueError("Archive exceeds the 2 GiB uncompressed-size guardrail")

            entries.append(name)
            top_level_counts[name.split("/", 1)[0]] += 1
            if name == "AndroidManifest.xml":
                manifest_present = True
            if name.startswith("classes") and name.endswith(".dex"):
                dex_files.append(name)
            if name.startswith("lib/") and name.endswith(".so"):
                native_libraries.append(name)
            if name.startswith("res/") or name.startswith("assets/"):
                resource_files.append(name)

    return {
        "schema_version": 1,
        "input": {
            "filename": apk_path.name,
            "size_bytes": apk_path.stat().st_size,
            "sha256": sha256_file(apk_path),
        },
        "archive": {
            "entry_count": len(entries),
            "uncompressed_size_bytes": total_uncompressed,
            "top_level_entry_counts": dict(sorted(top_level_counts.items())),
            "android_manifest_present": manifest_present,
            "dex_files": sorted(dex_files),
            "native_libraries": sorted(native_libraries),
            "resource_entry_count": len(resource_files),
            "entries": sorted(entries),
        },
        "limitations": [
            "This is structural ZIP/APK inventory only.",
            "AndroidManifest.xml is not decoded; binary Android XML needs a dedicated decoder.",
            "DEX bytecode is not decompiled or executed.",
            "No network traffic, credentials, or runtime behavior is inspected.",
            "The report must be reviewed and redacted before being shared.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("apk", type=Path, help="Path to an APK file")
    parser.add_argument("--output", type=Path, help="Write JSON report to this path")
    args = parser.parse_args()

    try:
        report = inspect_apk(args.apk)
        rendered = json.dumps(report, indent=2, ensure_ascii=False)
        if args.output:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(rendered + "\n", encoding="utf-8")
            print(f"Report written to {args.output}")
        else:
            print(rendered)
    except (OSError, zipfile.BadZipFile, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

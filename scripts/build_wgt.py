#!/usr/bin/env python3
"""Create a reproducible, unsigned Tizen Web Widget archive for TizenBrew re-signing."""
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile
import hashlib
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "tizen-app"
DIST = ROOT / "dist"
OUTPUT = DIST / "KaraokeTV.wgt"

def main() -> int:
    config = APP / "config.xml"
    if not config.is_file():
        raise SystemExit("Missing tizen-app/config.xml")
    try:
        ET.parse(config)
    except ET.ParseError as exc:
        raise SystemExit(f"Invalid config.xml: {exc}") from exc

    content = ET.parse(config).getroot()
    ns = {"w": "http://www.w3.org/ns/widgets"}
    entry = content.find("w:content", ns)
    if entry is None:
        raise SystemExit("config.xml has no widget content entry")
    entry_file = APP / entry.attrib.get("src", "")
    if not entry_file.is_file():
        raise SystemExit(f"Widget entry point does not exist: {entry_file}")

    if DIST.exists():
        for old in DIST.iterdir():
            if old.is_file():
                old.unlink()
    else:
        DIST.mkdir(parents=True)

    files = sorted(
        p for p in APP.rglob("*")
        if p.is_file() and ".buildResult" not in p.parts
    )
    if not files:
        raise SystemExit("No application files found")

    with ZipFile(OUTPUT, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for path in files:
            archive.write(path, path.relative_to(APP).as_posix())

    with ZipFile(OUTPUT, "r") as archive:
        bad = archive.testzip()
        if bad:
            raise SystemExit(f"Corrupt WGT archive member: {bad}")
        names = set(archive.namelist())
        required = {"config.xml", entry.attrib["src"]}
        missing = required - names
        if missing:
            raise SystemExit(f"WGT is missing required entries: {sorted(missing)}")

    digest = hashlib.sha256(OUTPUT.read_bytes()).hexdigest()
    checksum = DIST / "KaraokeTV.wgt.sha256"
    checksum.write_text(f"{digest}  KaraokeTV.wgt\n", encoding="ascii")
    print(f"Created unsigned WGT: {OUTPUT}")
    print(f"Files packaged: {len(files)}")
    print(f"SHA-256: {digest}")
    print("This package is unsigned; TizenBrew Installer must re-sign it for this TV.")
    return 0

if __name__ == "__main__":
    sys.exit(main())

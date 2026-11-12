#!/usr/bin/env python3
"""Static validation for the Android2Tizen Tizen web-app scaffold."""
from pathlib import Path
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "tizen-app"
errors = []

config = APP / "config.xml"
try:
    root = ET.parse(config).getroot()
    ns = {"w": "http://www.w3.org/ns/widgets", "t": "http://tizen.org/ns/widgets"}
    content = root.find("w:content", ns)
    app = root.find("t:application", ns)
    profile = root.find("t:profile", ns)
    if content is None or not (APP / content.attrib.get("src", "")).is_file():
        errors.append("config.xml content entry does not resolve to a file")
    if app is None:
        errors.append("config.xml is missing tizen:application")
    if profile is None or profile.attrib.get("name") != "tv":
        errors.append("config.xml must declare the TV profile")
except (ET.ParseError, OSError) as exc:
    errors.append(f"config.xml parse failed: {exc}")

html = APP / "index.html"
if not html.is_file():
    errors.append("index.html is missing")
else:
    source = html.read_text(encoding="utf-8")
    for asset in ("css/app.css", "js/catalog.js", "js/app.js"):
        if asset not in source or not (APP / asset).is_file():
            errors.append(f"HTML asset missing or not referenced: {asset}")

for path in (APP / "js/catalog.js", APP / "js/app.js"):
    if not path.is_file() or path.stat().st_size == 0:
        errors.append(f"JavaScript file missing or empty: {path.relative_to(ROOT)}")

if errors:
    print("\n".join("ERROR: " + item for item in errors), file=sys.stderr)
    raise SystemExit(1)
print("Project structure validation passed.")

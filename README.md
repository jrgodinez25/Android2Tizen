# Android2Tizen

A structured toolkit and project workspace for analyzing an Android APK and rebuilding its permitted functionality as a Samsung Tizen Smart TV application.

> **Status:** Initial scaffold. No target APK has been supplied yet. No APK has been analyzed and no application compatibility claims have been established.

## Project goals

1. Inspect an APK's metadata, manifest, resources, bytecode inventory, and native libraries.
2. Produce a reviewable technical report and feature inventory.
3. Map Android-specific capabilities to feasible Tizen TV implementations.
4. Rebuild selected functionality using Tizen-supported web technologies and APIs.
5. Package, deploy, and test a signed `.wgt` application on the target TV.

This is a **reconstruction/porting project**, not an APK-to-WGT binary converter. Android bytecode, Android framework APIs, Google Play Services, and Android native libraries do not become Tizen-compatible by changing the package extension.

## Repository layout

```text
.
├── apk-analysis/             # Generated analysis output; APKs are not committed
│   ├── manifest/
│   ├── decompiled/
│   ├── resources/
│   ├── native-libraries/
│   └── reports/
├── documentation/
│   ├── application-analysis.md
│   ├── feature-inventory.md
│   ├── android-tizen-mapping.md
│   ├── development-plan.md
│   └── test-plan.md
├── tizen-app/                # Tizen TV application source (created after APK review)
├── tests/
│   ├── functional/
│   ├── navigation/
│   └── compatibility/
├── scripts/
│   └── analyze_apk.py
└── .gitignore
```

## Initial workflow

1. Upload the target APK to the project conversation (do not commit it to this public repository).
2. Run the static inspection script in an isolated, trusted local environment.
3. Review the report and manually validate findings; decompiler output is not ground truth.
4. Build the feature inventory and Android-to-Tizen compatibility matrix.
5. Implement a vertical slice in the Tizen app (launch, one principal workflow, remote navigation).
6. Add features incrementally, with tests and TV-device validation.

## APK analysis

The initial analyzer uses Python's standard library to inspect ZIP/APK structure, extract AndroidManifest.xml as raw bytes, list DEX files, resources, and native libraries, and emit a JSON report. It does **not** execute the APK, decompile DEX, decode binary XML, defeat protections, or extract secrets.

Optional analysis tools, to be installed and run locally as appropriate:

- [JADX](https://github.com/skylot/jadx) — DEX decompilation for authorized review.
- [Apktool](https://apktool.org/) — APK resource and manifest decoding.
- [Ghidra](https://ghidra-sre.org/) — native library analysis when needed.
- [Samsung Tizen TV Developer](https://developer.samsung.com/smarttv/develop) — official TV development documentation and SDK.

## Target-device information needed

Before implementation, record:

- Exact Samsung TV model code
- TV model year / product generation
- Tizen version and firmware version
- Whether the TV is a physical device or emulator
- Required application features and any account/server dependencies

Tizen APIs and media/DRM support vary by TV model and platform version. The compatibility decision must be based on the actual target, not only the marketing year.

## Legal and security boundaries

Only analyze applications you own or are authorized to inspect. Do not use this project to extract credentials, tokens, private keys, or personal data; bypass DRM, subscription controls, or access restrictions; or redistribute proprietary source/assets. Keep APKs, certificates, device identifiers, and secrets out of Git history. Use test accounts and redact sensitive values from reports.

## Current status

- [x] Repository scaffold and project documentation
- [x] Safe, non-executing APK structure inspector
- [ ] Target APK supplied
- [ ] APK analysis and feature inventory
- [ ] Target TV compatibility confirmed
- [ ] Tizen application implementation
- [ ] Build, signing, deployment, and QA

## License

No license has been selected yet. Until a license is added, assume this repository's original contents are all rights reserved. Third-party tools and any application assets remain subject to their own licenses.

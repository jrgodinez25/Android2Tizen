# Application Analysis

**Status:** Pending target APK. Physical test device identified; see [Target Device Profile](device-profile.md).

## Input record

| Field | Value |
|---|---|
| APK filename | Pending |
| APK SHA-256 | Pending |
| Android package ID | Pending |
| Version name / code | Pending |
| Minimum / target SDK | Pending |
| APK type (universal / split) | Pending |
| Signing certificate fingerprint | Pending; record only if authorized and needed |

## Static inspection checklist

- [ ] Confirm the APK is a valid archive and record its hash.
- [ ] Determine whether the input is a base APK, split package, or bundle-derived APK set.
- [ ] Decode the manifest and list permissions, components, SDK declarations, and intent filters.
- [ ] Inventory DEX files and identify Java/Kotlin packages.
- [ ] Inventory native libraries by ABI.
- [ ] Inventory resources and assets.
- [ ] Identify third-party SDKs and platform dependencies.
- [ ] Identify network/API dependencies from authorized evidence.
- [ ] Review privacy, licensing, DRM, and account constraints.

## Findings

No APK has been supplied or analyzed yet. Do not populate technical findings by guessing from the application name.

# Android2Tizen

A clean-room Android-to-Tizen reconstruction workspace, currently implementing an original karaoke player for Samsung Smart TVs.

## Current project

The first Tizen karaoke MVP is under review in [PR #1](https://github.com/jrgodinez25/Android2Tizen/pull/1). See the [MVP status](documentation/mvp-status.md), [device profile](documentation/device-profile.md), [technical assessment](documentation/kara-okay-1.8.0-assessment.md), and [full roadmap](documentation/roadmap.md).

The target device is Samsung UA50CU8100GXXP. The app is a standalone Tizen TV Web App; it is not an Android APK wrapper and is not currently a TizenBrew module.

## TizenBrew Installer deployment

We are integrating the **TizenBrew Installer** as the preferred delivery path for signed WGT releases. The Installer can install other Tizen applications from a GitHub repository or a WGT/TPK package; TizenBrew itself is a separate modular homebrew runtime.

See [TizenBrew deployment guide](documentation/tizenbrew-deployment.md) for the exact workflow, package signing requirements, and limitations.

## Repository layout

- `tizen-app/` — standalone Tizen TV application source.
- `documentation/` — device profile, APK assessment, implementation roadmap, deployment and QA notes.
- `scripts/` — local analysis and packaging helpers.
- `.github/workflows/` — automated static validation.

## Important constraints

- APKs, private signing certificates, private keys, song packs, credentials, and device identifiers must not be committed.
- The WGT must be signed with an identity accepted by the target TV. TizenBrew Installer supports re-signing for Tizen 7+ TVs, but signing must use the user's own Samsung certificate/account as required by the Installer.
- A successful CI syntax check is not proof of a signed WGT or successful installation on the physical TV.
- The bundled catalog and lyric cues are original demo content only.

## Validation

GitHub Actions validates XML/project structure and JavaScript syntax. Physical-device tests and a signed WGT installation remain release gates.

# TizenBrew Installer Deployment Guide

**Target TV:** Samsung UA50CU8100GXXP (CU8100, 2023 family)
**Application:** Karaoke TV — standalone Tizen Web App
**Package type:** Signed `.wgt`
**Preferred installer:** TizenBrew Installer

## 1. Important distinction: Installer vs TizenBrew modules

This project is a normal, standalone Tizen TV Web Application. We will distribute it as a signed `.wgt`.

- **TizenBrew Installer** is the delivery/installation utility. Its documentation describes installing other Tizen applications from a GitHub repository or a `.wgt`/`.tpk` package. The TV-side installer supports package-file installation; the desktop installer also documents GitHub-repository installation.
- **TizenBrew** is a separate modular runtime for TizenBrew apps/modules. A module runs inside TizenBrew and has a different packaging/metadata model.
- We are **not** converting Karaoke TV into a TizenBrew module. That would add a dependency on the TizenBrew runtime and is unnecessary for a standalone TV application.

References:
- [TizenBrew installation and app distribution guide](https://github.com/reisxd/TizenBrew/blob/main/docs/README.md)
- [TizenBrew Installer repository](https://github.com/reisxd/TizenBrewInstaller)
- [TizenBrew Installer releases](https://github.com/reisxd/TizenBrewInstaller/releases)

## 2. Deployment pipeline

1. Source changes are committed to this repository.
2. Static CI checks XML structure, project files and JavaScript syntax.
3. A developer builds the Web App with the Samsung TV SDK/Tizen CLI.
4. The package is signed with the user's own Samsung certificate profile.
5. The signed `.wgt` is attached to a GitHub Release.
6. Install using TizenBrew Installer:
   - **Desktop Installer:** use its GitHub repository install option with `jrgodinez25/Android2Tizen` when a compatible WGT release asset is available.
   - **TV Installer:** use its package-file installation option with the signed WGT available to the TV (for example, on accessible USB storage), if offered by the installed Installer version.
7. Launch Karaoke TV from the Samsung Apps launcher and perform device acceptance tests.

The installer UI and available import sources can vary by Installer version. If the GitHub-repository option is not present on the TV-side app, use the desktop Installer or the direct WGT-file option.

## 3. Build the signed WGT on Windows

Install Samsung TV SDK / Tizen Studio and create a Samsung certificate profile using your own Samsung account. Keep the certificate files and passwords private.

Open PowerShell at the repository root and run:

```powershell
.\scripts\build-wgt.ps1 -CertificateProfile "YOUR_CERTIFICATE_PROFILE"
```

The script runs `tizen build-web`, then `tizen package -t wgt` and writes the package under `dist\`.

Requirements:
- `tizen` CLI is available on PATH, or pass its full path with `-TizenCliPath`.
- A valid certificate profile exists in Tizen Certificate Manager.
- The profile is authorized for the target Samsung TV. TizenBrew Installer's re-signing feature may help on Tizen 7+; use the Installer's own documented workflow and your own Samsung account/certificate.

Example with an explicit CLI path:

```powershell
.\scripts\build-wgt.ps1 -CertificateProfile "MySamsungProfile" -TizenCliPath "C:\tizen-studio\tools\ide\bin\tizen.bat"
```

The script does not create or export certificates, store passwords, connect to the TV, or install the app.

## 4. Publish a GitHub Release

After a successful local signed build:

1. Confirm `dist\KaraokeTV.wgt` exists.
2. Open [Android2Tizen Releases](https://github.com/jrgodinez25/Android2Tizen/releases).
3. Create a release tag, for example `karaoke-v0.1.0`.
4. Attach `KaraokeTV.wgt` as a release asset.
5. Include the TV model, app version, known limitations, and test status in the release notes.
6. Keep the WGT's signing identity private; do not upload certificate or key files.

Once a release has a compatible WGT asset, try the Desktop Installer's GitHub repository input with `jrgodinez25/Android2Tizen`. If it does not resolve the asset automatically, download the WGT and use the direct package-file option.

## 5. Install using the TV-side Installer

Use this path only if the installed TV-side TizenBrew Installer exposes a package-file picker:

1. Put the signed `KaraokeTV.wgt` on a USB drive or another storage location exposed by its file picker.
2. Open TizenBrew Installer on the TV.
3. Select its WGT/TPK or custom package installation option.
4. Choose `KaraokeTV.wgt` and follow the signing/install prompts.
5. Wait for the success result; then return to the Samsung Apps launcher.
6. Launch Karaoke TV.

If the TV-side Installer cannot browse your storage or install a local WGT, use the Desktop Installer's GitHub repository or direct WGT workflow instead. Do not assume TizenBrew's own module manager can install a standalone WGT as a module.

## 6. Tizen 7+ signing and certificates

The target is a 2023 TV, whose original platform baseline is Tizen 7.0. Samsung/Tizen package installation uses signing and device authorization. TizenBrew Installer documents re-signing support for Tizen 7+ TVs and may prompt for Samsung account sign-in/certificate creation.

- Use your own Samsung account and certificate.
- Never commit `.p12`, `.pfx`, `.keystore`, author/distributor certificates, passwords, or private keys.
- Do not ask another person to share their Samsung certificate.
- Do not disable security checks or bypass package signature verification.
- A successful CI source validation does not prove the WGT is correctly signed or installable.

## 7. Acceptance checklist on UA50CU8100GXXP

- [ ] Installer accepts the signed WGT.
- [ ] Package installation reports success.
- [ ] Karaoke TV appears in Apps.
- [ ] App launches without a blank screen or immediate exit.
- [ ] Footer reports runtime platform/model/firmware (where API calls are available).
- [ ] Directional keys move focus correctly.
- [ ] OK selects a song; number keys select the five-digit demo number.
- [ ] Back key behaves correctly.
- [ ] Queue reserve/remove/clear works.
- [ ] Local audio and LRC work with supported files.
- [ ] App survives exit/relaunch without corrupting state.
- [ ] Record any error code and app/TV software version, but redact serial number, MAC, Smart Hub IDs, EMDUID and other unique identifiers.

## 8. Troubleshooting

- **No GitHub repository option:** use a direct signed WGT file; the TV-side and desktop Installer UIs have different capabilities.
- **No WGT file picker on TV:** use Desktop Installer's repository or file flow.
- **Signature/certificate error:** verify the certificate profile and follow TizenBrew Installer's Samsung-account re-signing flow. Do not share private certificates.
- **App installs but does not launch:** check the app ID/package ID in `tizen-app/config.xml`, required privileges, runtime compatibility, and TV app logs using the supported diagnostic route.
- **Blank screen:** test the web app locally, inspect JavaScript errors, confirm all asset paths are relative and included in the package.
- **No audio:** verify codec/container support and file access separately; the current MVP has no bundled backing tracks.

## 9. What this repository automates today

Automated:
- XML parse and manifest structure validation.
- Project asset existence checks.
- JavaScript syntax checks.

Manual (requires user's SDK/certificate or physical TV):
- Samsung certificate creation and signing.
- WGT package generation.
- TizenBrew Installer interaction.
- Installation and runtime verification on the television.

We will not claim a WGT is built, signed, installed, or tested until those steps have actually completed.


## 10. Automated GitHub WGT build and release

The repository workflow `.github/workflows/build-tizen-wgt.yml` now builds an **unsigned** `KaraokeTV.wgt` ZIP widget package on pushes, pull requests, and manual dispatch. It uploads the package as a 14-day Actions artifact.

When a version tag matching `v*` is pushed, the same workflow publishes a GitHub Release containing exactly one `.wgt` asset (`KaraokeTV.wgt`) and its SHA-256 checksum. TizenBrew Installer's GitHub install flow looks up the latest published release and installs its WGT asset; keep only the intended installable WGT in each release.

The build intentionally does not use a Samsung signing certificate or GitHub secrets. The WGT is unsigned so the TizenBrew TV-side re-signing flow can sign it for the target TV. This must be confirmed with the installed Installer version during the first device installation.

### Trigger a test build

Use GitHub Actions → **Build Tizen WGT and publish release** → **Run workflow** on the development branch. Download the `KaraokeTV-WGT` artifact and inspect the package.

### Publish a release

After the test artifact and device-compatible package are confirmed, create and push a version tag, for example `v0.1.0`. A published release is required before entering `jrgodinez25/Android2Tizen` in TizenBrew's **Install from GitHub** screen.

Do not publish a tag until the PR has been reviewed and the release candidate is approved. A draft release is not discoverable through the latest-release endpoint.

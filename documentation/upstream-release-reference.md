# Upstream KARA-OKAY Release Reference

**Reviewed:** 2026-11-13  
**Reference repository:** https://github.com/PrinceSanguan/KARA-OKAY  
**Supplied Android baseline:** KARA-OKAY 1.8.0  
**Goal:** Use public release notes and public screenshots as behavioral and visual references for an independent Tizen implementation.

## 1. Critical source-availability finding

The upstream repository's README is public, but its .gitignore explicitly describes the repository as containing only the README and documentation images; it says the application source stays on the author's PC and is not pushed. The public Git tree confirms the visible tracked files are README.md, .gitignore and docs screenshots.

The upstream README explicitly lists Samsung Smart TV (Tizen) among unsupported platforms. The public releases provide Android APKs and a Windows installer, not Tizen source or WGT packages.

Therefore:
- This release page is a valuable product specification, not an Android source-code repository.
- Do not claim source-code conversion or direct source reuse.
- Do not copy private source, decompile/reuse proprietary implementation code, or redistribute APK assets/catalog/media without explicit authorization and applicable rights.
- Build an independent Tizen implementation from observable behavior, user-provided screenshots, and public feature descriptions. Public screenshots may be used as references during development; before bundling or redistributing them, review their copyright/license or obtain permission.
- Exact pixel-perfect identity cannot be guaranteed from release notes alone. Screen-by-screen reference captures and physical-TV comparisons are needed.

## 2. Release references inspected

| Release | Published (UTC) | Asset | Relevance |
|---|---|---|---|
| v1.8.0 | 2026-10-31 | Kara-okay-1.8.0.apk (20,514,586 bytes) | Matches supplied APK hash; canonical feature baseline |
| v1.9.0 | 2026-11-04 | Kara-okay-1.9.0.apk (24,400,323 bytes) | Later Android behavior reference; do not attribute new features to v1.8 |
| pc-v1.3.0 | 2026-11-08 | Kara-okay-PC-Setup-1.3.0.exe (125,126,186 bytes) | Supplemental PC-specific workflows only; not an Android 1.8/1.9 specification |

### v1.8.0 release notes: behavior to reproduce

The release notes identify:
- New audio engine and "Classic" sound.
- Word timing and two simultaneous lyric lines, plus 4-3-2-1 count-in.
- Lyric clearing before score and complete score fanfare.
- Transparent title/score overlays over the stage video.
- Background playback continuing between songs and switching to the next background video.
- History clearing.
- Adding user-owned songs from USB/SD folders.
- Stop ends only the current song while preserving reservations; clearing reservations is a separate action.
- Playlists with Play all, repeat-one, repeat-all and shuffle.
- BGV/background-video switching.
- Updated song numbers and migration of favourites/history/playlists.
- Landscape search results.

### v1.9.0 release notes: later Android-only reference

Additional behavior described in v1.9:
- Keypad-first "Select a Song" landing screen with quick picks.
- One search box for song number/title/artist and lyric-line search.
- Sorting by title, singer, number and newest, an A–Z bar and New Songs.
- Simplified phone/browser remote, admin and guest roles, guest ownership of controls.
- Screen messages and one-time transfer/playback of MIDI, KAR, MP3 or video from a phone.
- Music player between songs, longer backgrounds, automatic photo changes and reserved strip.
- Sound-quality choices and melody guide default-off persistence.
- New settings and storage-management behavior.

These are a separate parity workstream and must be labelled v1.9 reference, not proven v1.8 APK behavior.

### PC 1.3.0 supplemental reference

PC 1.3 describes:
- Individual instrument mixer controls (PC-specific).
- Two microphones and mic effects (PC-specific implementation).
- DJ mode/crossfader/headphone preview (PC-specific).
- Music between songs, YouTube links, applause and stage text sizing.
- Background slideshow, hide categories, .zip MIDI import, favorites while singing, QR position, next-song suggestions and guest-role fixes.
- Some features said to have originated in Android 1.9.

Only adopt features that make sense on a Samsung TV and can be implemented with TV-compatible APIs. Do not imply the PC installer is a source-code reference.

## 3. Visual specification extracted from public README/screenshots

The upstream README publishes these reference images:
- docs/keypad.png — song-number/keypad search concept.
- docs/search.png — searchable library concept.
- docs/stage.jpg — two-line colour-wiping lyrics over a moving background.
- docs/song-menu.jpg — in-song menu with key/tempo and reservation controls.
- docs/songbook.jpg — printable songbook.
- docs/banner.png and docs/logo.png — product identity references.

Use these images to inform a visual specification and comparison checklist. Do not package the artwork into the Tizen app without permission. Recreate the layout and use original artwork/fonts for the implementation unless the author grants suitable reuse permission.

### Screen reconstruction requirements

1. **Select a Song:** five-digit number, keypad, quick picks, compact access to song list and search. The keypad is the primary TV interaction.
2. **Song list/search:** number, title and artist; categories/favourites/history; sort and filter; visible five-digit codes; results must be operable with TV remote focus.
3. **Karaoke stage:** video/photo background; transparent title and score; two lyric lines; current line word-wipe; reserved strip; count-in; interlude, pause, skip and next-song states.
4. **In-song menu:** key, tempo, melody guide, reservation list, song lookup and stage settings without blocking the lyric stage.
5. **Queue:** preserve reservations across Stop; explicit Clear Reserved; reserve, sing now, skip and automatic queue progression.
6. **Settings/library:** own files and folders, sound bank selection, lyric font/size/colour/outline, backgrounds and storage status.
7. **Remote:** pair and authorize admin/guest roles; search/reserve; guest may control only their own queue item; upload user-owned media only with authenticated, explicit transfer.

## 4. Evidence levels and feature-version discipline

Each feature in feature-inventory.md is classified as:
- **APK observed:** structural evidence from supplied 1.8.0 APK.
- **v1.8 release notes:** expressly described by the 1.8.0 release.
- **v1.9 release notes:** later Android version.
- **PC 1.3 release notes:** Windows-specific or PC-reported feature.
- **Unverified:** needs user capture, controlled test, or additional evidence.

Do not silently merge later versions into the 1.8.0 baseline.

## 5. Visual and functional acceptance

The Tizen parity UI is accepted only after:
- User approves reference-vs-Tizen images for each core screen.
- Screen layout, relative sizing, typography hierarchy, colours, overlays and transitions are compared at a consistent aspect ratio.
- All primary actions can be reached with the Samsung remote; focus order and Back behavior are tested.
- Actual sound output, key/tempo and MIDI/KAR playback work—not just UI controls.
- Lyrics track real MIDI/LRC timing; word-level wipe is not simulated with arbitrary fixed line timers.
- Queue persistence, skip/stop/clear semantics and playback transitions match the documented behavior.
- Physical tests are recorded on the UA50CU8100GXXP.

## 6. Licensing and permission

The public releases do not grant permission to copy private source code or redistribute bundled songs, lyrics, soundfonts, videos, APK resources, artwork, or binaries. The public repository reports no GitHub license file. Obtain written permission from the upstream author for any requested source reuse, screen-artwork reuse, assets or data redistribution. Third-party components retain their own license obligations.

**Implementation decision:** clean-room Tizen web application, modular UI and library, and a separately validated MIDI/SF2 audio engine. Existing v0.1.0 remains the working install baseline; parity development stays on feature/kara-okay-tizen-parity.

# KARA-OKAY 1.8.0 — Initial Porting Assessment

**Status:** Static APK ZIP inspection completed; deeper manifest/DEX analysis and implementation pending.

## Sources

- User-supplied APK: `Kara-okay-1.8.0.apk` (not committed to this public repository)
- Upstream project: https://github.com/PrinceSanguan/KARA-OKAY
- Target physical TV: Samsung UA50CU8100G; exact installed Tizen version and firmware remain unconfirmed.

## APK integrity and inventory

| Attribute | Result |
|---|---|
| Approximate APK size | 20 MB |
| SHA-256 | `4ee5b5b9d42467bda4dc528c235a66641515cc51c80d76f2182c21fd4a5526cf` |
| ZIP entries | 260 |
| Android manifest | Present; binary manifest not decoded yet |
| DEX files | `classes.dex`, `classes2.dex`, `classes3.dex` |
| Native libraries | 18 files across arm64-v8a, armeabi-v7a and x86_64 |
| Embedded remote pages | `assets/remote/index.html`, `assets/remote/add.html` |
| Embedded keypad audio | `assets/keypad/num_0.mp3` through `num_9.mp3` |
| Other resources | Background images, countdown audio, font/license metadata |

### Significant native dependencies

- `libbass.so` — BASS audio engine
- `libbass_fx.so` — BASS FX
- `libbassmidi.so` — BASS MIDI
- `libandroidx.graphics.path.so`
- `libimage_processing_util_jni.so`
- `libsurface_util_jni.so`

These Android ABI libraries are **not** directly usable inside a Tizen web app. Licensing for any third-party audio technology must be reviewed independently.

## Upstream project observations

The upstream README advertises karaoke song-number entry, song reservation, color-wiping lyrics, MIDI/KAR and SF2 support, backgrounds, remote control, downloads, and offline playback. The README currently advertises Android version 1.9.0, newer than the supplied 1.8.0 APK. Do not assume all 1.9.0 features exist in the supplied binary.

The public upstream repository exposes documentation and release links, not a complete, verified source tree for the Android implementation. No claim is made that the full source is available for reuse. Obtain the author's permission or independently reimplement the desired behavior.

## Feasibility and architectural plan

| Feature | Proposed Tizen approach | Risk |
|---|---|---|
| Song keypad, search, queues | HTML/CSS/JS with remote focus navigation | Low |
| Color-wiping lyrics | Timed DOM/CSS lyric rendering | Medium; timing verification |
| Background images/videos | Web media or Samsung AVPlay as appropriate | Medium; codec compatibility |
| MIDI/KAR playback | Evaluate licensed, Tizen-compatible WebAssembly MIDI synthesizer | High; CPU, audio latency, licensing |
| SF2 soundfonts | Synthesizer supporting SF2; validate memory limits | High |
| Key/tempo adjustment | Synthesizer or audio processing pipeline | High |
| Offline library | IndexedDB / approved Tizen filesystem APIs, with quota checks | High; large download size |
| Remote web UI | New local-network service design; test Tizen network/listener support | High |
| Microphone scoring | Evaluate supported input devices and TV APIs; optional | High |

## Recommended MVP

1. Launchable Tizen TV web app with a 10-foot interface.
2. Remote-control keypad and visible focus handling.
3. Local demo catalog with permitted sample data.
4. Song search, selection, and reservation queue.
5. Synchronized lyrics using original test content.
6. Basic audio playback using licensed or original test media.
7. Evaluate MIDI + SF2 synthesis on the physical TV before promising catalog parity.

## Next technical work

- Decode manifest to determine application ID, SDK levels, permissions and entry points.
- Inspect DEX package names and dependencies using JADX (authorized use only).
- Inventory remote HTML interface and protocol without publishing proprietary assets.
- Verify audio engine licensing and select a legal Tizen replacement.
- Confirm the installed Tizen platform and firmware on Samsung UA50CU8100G.
- Obtain permission for any reuse of upstream content, libraries or song catalog.
- Build a minimal Tizen WGT prototype and validate on the physical TV.

## Security and licensing

Never commit the APK, extracted proprietary resources, downloaded song packs, credentials, certificates or user data. This report contains only structural observations and public feature descriptions. Reverse engineering must respect applicable licenses and authorization.


## Upstream licensing and version clarification (reviewed 2026-11-12)

The upstream README explicitly states that KARA-OKAY's source code is not public. It identifies BASS, BASSMIDI and BASS_FX as the audio engine in version 1.8, and says the phone/TV app changed to FluidSynth in version 1.9. The supplied APK contains the BASS-family native libraries, consistent with the 1.8 version being analyzed.

The upstream README also identifies separate licenses/terms for FluidSynth, GeneralUser GS, and other sound banks. Do not copy or redistribute these assets or source components without confirming the applicable rights. This repository will use original UI, original demo lyrics/catalog, and independently selected components with compatible licenses. A future FluidSynth/WebAssembly port must comply with the LGPL and any soundfont license terms.

The upstream README advertises later 1.9 capabilities, but these must not be attributed to the supplied 1.8 APK without binary-level verification.

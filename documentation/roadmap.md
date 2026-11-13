# Full Karaoke Port Roadmap

The goal is a visually faithful and functionally complete, independently implemented Tizen karaoke application, subject to platform limits, physical-TV performance and content licensing. The supplied KARA-OKAY 1.8.0 APK is a Kotlin/Android multi-DEX app with BASS/BASS_FX/BASSMIDI native libraries. Those Android binaries cannot be loaded by a Tizen Web App.

The upstream public README states that the Android source code is not public. This project is a clean-room reimplementation of permitted behavior, not a source-code fork or automatic APK conversion.

## Baseline

- Existing v0.1.0 WGT is an installation/runtime scaffold with demo content only.
- New parity work is isolated on feature/kara-okay-tizen-parity.
- APK structural findings are recorded in documentation/apk-1.8.0-deep-inspection.md.
- Architecture and technical risks are recorded in documentation/tizen-parity-architecture.md.
- Screen/feature mapping is tracked in documentation/feature-inventory.md.

## Phase 0 — Evidence and requirements

- [x] Record APK hash, DEX count, native libraries, assets and app-owned component names.
- [x] Identify embedded remote UI areas without copying proprietary implementation.
- [x] Separate 1.8.0 APK evidence from later public README feature claims.
- [ ] Decode AndroidManifest.xml to confirm package ID, min/target SDK, activities, services and permissions.
- [ ] Complete screen-by-screen 1.8.0 UI inventory from actual screenshots/observed use.
- [ ] Verify 1.8.0 release notes and distinguish features introduced later.

Exit: every feature has evidence level, priority and acceptance criteria.

## Phase 1 — Visual reconstruction

- [ ] Replace MVP dashboard visual language with an approved screen-by-screen recreation.
- [ ] Build home/library, search/keypad, categories, queue, stage, controls, settings, pairing and songbook shells.
- [ ] Implement deterministic directional focus graph and Samsung Back/Return handling.
- [ ] Add original test content and visual regression screenshots.
- [ ] Validate 1080p logical layout and 4K output on CU8100.

Exit: user approves actual screenshots from each core screen on the TV.

## Phase 2 — Library and workflow core

- [ ] Define importable catalog schema and stable five-digit song IDs.
- [ ] Search by number/title/artist with normalized text.
- [ ] Categories, favorites, playlists, history, queue and queue transitions.
- [ ] Persist settings and catalog metadata using IndexedDB/device storage.
- [ ] Support user-owned media import where Tizen file APIs allow it.

Exit: all library/queue tests pass with synthetic fixtures; storage quota behavior measured.

## Phase 3 — Audio engine proof of concept

- [ ] Build a minimal MIDI/SF2 synthesizer spike using FluidSynth and Samsung's Emscripten SDK.
- [ ] Connect generated PCM to Web Audio API output.
- [ ] Test representative MIDI with multiple tracks/instruments on the physical TV.
- [ ] Measure CPU, memory, startup time, latency and dropouts.
- [ ] Verify key transpose, tempo change and instrument channel control.
- [ ] Complete LGPL and SF2 sound bank licensing review.

Exit: reliable target-TV playback with documented performance and license compliance. Do not build advanced controls on an unproven engine.

## Phase 4 — Lyrics and stage

- [ ] Parse LRC and MIDI lyric meta-events.
- [ ] Build lyric timeline and word/syllable wipe renderer.
- [ ] Count-in, intro/interlude handling, pause/resume, skip and automatic next.
- [ ] Backdrop photo/video support with tested codecs and fallback.
- [ ] Validate sync drift against actual audio playback clock.

Exit: repeatable sync tests pass with representative MIDI/KAR/LRC fixtures.

## Phase 5 — Advanced sound and offline library

- [ ] Key, tempo, melody guide, mixer and effects.
- [ ] Resumable downloads and integrity checks.
- [ ] Offline library metadata/media with storage management.
- [ ] Favorites/playlists/history and songbook PDF.
- [ ] User-provided fonts/backgrounds/soundfonts with license metadata.

Exit: each feature has a working test, error handling and device performance evidence.

## Phase 6 — Remote and guest workflows

- [ ] Decide transport topology after testing Tizen inbound-network restrictions.
- [ ] Implement short-lived PIN/QR pairing and guest/admin roles.
- [ ] Phone remote search, reserve, skip, lyrics and controls.
- [ ] Secure user-owned file upload.
- [ ] Test multiple clients, disconnect/reconnect and abuse/rate limiting.

Potential transports: Samsung Smart View SDK or a companion relay/service. Do not assume a Tizen web app can listen on a TCP/WebSocket port.

Exit: documented protocol, security review and physical-TV multi-client test.

## Phase 7 — Optional advanced features

- [ ] USB/phone microphone input and scoring feasibility.
- [ ] Audio recording and mixdown feasibility.
- [ ] Camera behind lyrics only if supported by actual TV hardware/runtime.
- [ ] Voice search is not a TV requirement; Samsung's Tizen 7 Web Engine matrix lists Web Speech API as unsupported. Phone-side voice search may be evaluated separately.

Exit: prove device/API support before implementation commitment.

## Release gates

- No Android DEX or Android ABI native libraries are shipped in the WGT.
- No private upstream source, remote HTML, catalog, lyrics, soundfonts, recordings, score audio or artwork is copied without permission and license clearance.
- Use original demo/test content during development.
- Record version and license for every third-party dependency.
- Static CI, desktop browser tests and emulator tests do not substitute for physical TV validation.
- Each milestone is tested on Samsung UA50CU8100GXXP, recording the actual Tizen version, app build and test result.
- Preserve v0.1.0 as a rollback baseline.

## Immediate next implementation

Start with Phase 1 visual reconstruction and a parallel isolated Phase 3 audio spike. Do not couple the UI redesign to an unproven audio engine. The existing MVP remains available while the parity branch evolves.

# KARA-OKAY-to-Tizen — Recommended Architecture

**Target:** Samsung UA50CU8100GXXP, Tizen TV profile, 1920×1080 application canvas with 4K-safe scaling  
**Package:** Standalone Tizen Web App (.wgt)  
**Development branch:** feature/kara-okay-tizen-parity

## 1. Architecture decision

Use a clean-room, modular web application:

- Presentation: HTML/CSS/JavaScript with TV remote focus management.
- Application state: explicit screen/state controller and persistent settings/library metadata.
- Media: HTMLMediaElement for supported compressed audio/video files; Web Audio API for processing/mixing where verified.
- MIDI engine: evaluate FluidSynth compiled to WebAssembly with Samsung's supported Emscripten toolchain.
- MIDI/KAR metadata: a separate parser for tempo maps, note events, track names and lyric meta-events; do not rely on visual lyric text being embedded in every file.
- Storage: IndexedDB for metadata/settings and a device-supported file workflow for large media; verify actual quota and file-picker behavior on the target TV.
- Remote: new authenticated local-network protocol. A browser-based WGT cannot be assumed to open a listening TCP/WebSocket server. Evaluate Smart View SDK or a small companion relay/service before selecting the final topology.
- Build: WGT package with CI static validation; Samsung certificate signing/re-signing and physical-TV validation remain release gates.

Samsung documents WebAssembly support on Smart TVs from Tizen 5.5 onward and describes C/C++ modules loaded by a normal HTML/JavaScript TV application. Samsung also provides a separate Emscripten SDK fork for TV WebAssembly development. The target's Tizen 7 baseline therefore makes a WASM proof of concept technically viable, but not yet proven at the required audio quality or performance.

## 2. Proposed module boundaries

    tizen-app/
      index.html
      config.xml
      css/
        tokens.css
        shell.css
        screens/
          home.css
          library.css
          stage.css
          settings.css
      js/
        app.js
        core/
          state.js
          events.js
          storage.js
          focus-manager.js
          remote-keys.js
        screens/
          home-screen.js
          library-screen.js
          search-screen.js
          stage-screen.js
          queue-screen.js
          settings-screen.js
          songbook-screen.js
        library/
          catalog-repository.js
          catalog-import.js
          favorites.js
          playlists.js
          downloads.js
        lyrics/
          lrc-parser.js
          midi-lyrics.js
          lyric-timeline.js
          lyric-renderer.js
        audio/
          audio-engine.js
          html-audio-engine.js
          midi-engine.js
          mixer.js
          effects.js
          wasm/
            README.md
            fluidsynth-adapter.js
        remote/
          pairing.js
          protocol.js
          transport-adapter.js
        platform/
          tizen-adapter.js
          media-capabilities.js
          diagnostics.js
      assets/
        fonts/
        demo/
      wasm/
        README.md

The exact folder names may be refined during implementation. Do not put proprietary APK assets in this tree.

## 3. Audio-engine decision

### Preferred proof of concept: FluidSynth + WebAssembly

The upstream project's current public README identifies FluidSynth as its newer audio engine and states that FluidSynth is LGPL-licensed. The supplied 1.8.0 APK itself contains BASS/BASS_FX/BASSMIDI native libraries, not a Tizen-ready engine.

A FluidSynth/WASM spike should answer these questions before it becomes the production engine:

1. Can Samsung's Emscripten toolchain compile the chosen FluidSynth version and required dependencies?
2. Can the target TV instantiate the WASM module and load a small, lawfully licensed SF2 bank?
3. Can MIDI note events be rendered continuously without audible dropouts?
4. Can the generated PCM be delivered to Web Audio with stable timing?
5. Can the engine load and play a representative MIDI file with multiple tracks and instruments?
6. Can key transpose and tempo changes be applied without corrupting event timing?
7. What are peak WASM memory, CPU use, startup latency and audio latency on the physical CU8100?
8. Does the build comply with FluidSynth's LGPL obligations, including notices and relinking/replacement requirements as applicable?

### Audio architecture options

| Candidate | Role | Assessment |
|---|---|---|
| FluidSynth compiled to WASM | MIDI/SF2 synthesis | Preferred feasibility spike; not yet validated on target |
| Web Audio API | Audio graph, gain, pan, filters and mixing | Candidate only; feature-detect and verify behavior on the target Tizen 7 TV before committing to this PCM output path |
| HTML audio/video | MP3/AAC/WAV and background media | Use for supported codecs; test actual TV codec/container matrix |
| Tizen WASM Player | Encoded elementary-stream playback | Not a MIDI synthesizer; not the first choice for generated PCM |
| BASS Android JNI libraries | Original APK engine | Not reusable as-is; Android ABI/JNI dependency and licensing make this unsuitable |

Do not treat Tizen WASM Player as a drop-in audio output device for FluidSynth. It is a low-level encoded elementary-stream media API. The first experiment should use Web Audio API for PCM output unless Samsung's TV-specific limitations prove otherwise.

## 4. Functional parity workstreams

### A. TV experience and visual parity
- Reconstruct each 1.8.0 screen from actual screenshots and observed flows.
- Match screen hierarchy, typography, colors, spacing, song cards, keypad and stage layout.
- Use 10-foot UI sizing and a deterministic directional focus graph.
- Implement Home, Select Song, Search, Categories, Reserved Queue, Stage, Controls, Settings and Songbook.
- Test at 1080p logical resolution and 4K physical output; avoid assuming CSS pixels equal panel pixels.

### B. Song library
- Define a documented catalog schema: song ID, five-digit code, title, artist, category, format, duration, media URI, lyric URI, checksum and license/source metadata.
- Support import of user-owned MIDI/KAR/MP3/LRC/video/SF2 assets where platform file access permits.
- Search by code/title/artist; categories, favorites, playlists, history and reserved queue.
- No scraping, redistribution or bundling of the upstream commercial/third-party song pack.

### C. Karaoke stage and lyrics
- Parse LRC and MIDI lyric events.
- Model lyric cues independently of the rendering layer.
- Render two or three lines with word/syllable wipe when timing data exists.
- Fall back to line-level timing where only LRC timestamps are available.
- Count-in, intro/interlude states, skip interlude, pause/resume and automatic next-song transitions.
- Background photos/videos with safe fallback and a setting to disable them.

### D. Controls and audio processing
- Key transpose, tempo, melody guide mute/level, master volume and supported instrument-group levels.
- Bass/treble/echo effects only after DSP feasibility and performance tests.
- Preserve pitch when changing tempo only if a lawful, compatible time-stretch implementation is available and performs adequately.
- Do not claim feature parity based on controls that merely change UI labels.

### E. Phone remote and guest workflows
- Pair by short-lived PIN/QR code.
- Separate host/admin and guest permissions.
- Search/reserve/skip and view synchronized lyrics.
- Upload user-owned files using authenticated, size-limited transfers.
- Use TLS where feasible, short-lived pairing tokens, origin validation, rate limits and explicit local-network consent.
- Architecture spike required: determine whether TV app can accept inbound connections, or whether a phone/PC companion relay is needed.

### F. Scoring, microphone and recording
- Treat as a later optional workstream.
- Verify USB microphone input support and access through the TV web runtime; the presence of WebRTC getUserMedia in a specification is not proof that a particular USB microphone works on this model.
- Do not promise vocal scoring or recording until input capture, latency, permissions, storage and device support are demonstrated.

## 5. Proposed implementation sequence

| Phase | Deliverable | Exit criteria |
|---|---|---|
| 0 — Evidence baseline | APK report, screen inventory, dependency map | Every feature marked APK-observed, public-README-only, or unknown |
| 1 — Visual reconstruction | Screen shell, navigation, focus graph, responsive 10-foot UI | User approves screen-by-screen TV screenshots |
| 2 — Library core | Importable catalog, search, categories, favorites, queue, persistence | Import/search/queue tests pass with test fixtures |
| 3 — Audio spike | WASM FluidSynth prototype and Web Audio output | Representative MIDI + SF2 plays on physical TV without dropouts |
| 4 — Lyrics and stage | MIDI/LRC lyric timeline, wipe rendering, count-in, transitions | Sync drift measured and within agreed tolerance |
| 5 — Advanced controls | Key/tempo/mixer/backdrops/offline downloads | Each control has functional tests and TV performance results |
| 6 — Remote | Pairing, guest queue, uploads, remote lyric view | Security and multi-client tests pass |
| 7 — Optional advanced | Score, mic, recording, songbook | Feasibility demonstrated independently before integration |

## 6. Non-negotiable release gates

- No Android DEX or Android ABI native library is shipped in the WGT.
- No private upstream source, remote HTML, catalog, lyrics, songs, soundfonts, artwork or media is copied into this repository without permission and applicable license clearance.
- Use original demonstration assets during development.
- All third-party components have a recorded version and license.
- Static CI, desktop browser tests and emulator tests are not substitutes for physical TV testing.
- Every milestone is tested on the Samsung UA50CU8100GXXP, recording actual Tizen version, app build, test case and result.
- Preserve the last known working v0.1.0 release as a rollback baseline.

## 7. First implementation target

Build a visual-only parity shell with screen routing, remote focus, song library/search/queue and settings using original placeholder data. In parallel, create a separate minimal WASM audio spike. Do not merge the audio spike into the main UI until it has passed the target-TV test.

This isolates the two highest risks: visual reconstruction and real-time MIDI synthesis.

# Full Karaoke Port Roadmap

The goal is a feature-complete, independently implemented Tizen karaoke app, subject to platform, licensing, and device constraints. The public KARA-OKAY README states that its source code is not public; therefore this project is a clean-room implementation of permitted functionality, not a source-code fork or binary translation.

## Stage 1 — MVP (current branch)
Song selection, five-digit keypad, search, queue, stage, local audio + LRC cue playback, TV remote focus behavior.

## Stage 2 — Device integration
Verify target Tizen version, SDK profile, WGT signing, installation, media codecs, file access, lifecycle, and persistent storage on UA50CU8100G.

## Stage 3 — Library and remote
Define an importable, documented catalog format; build local search, categories, favorites, playlists, and a phone/tablet remote using an authenticated local-network protocol. Song metadata and media must be user-owned, licensed, or otherwise authorized.

## Stage 4 — MIDI/KAR synthesis
Evaluate MIDI/KAR parser options and FluidSynth/WebAssembly feasibility. Review LGPL obligations, soundfont licenses, WASM memory/CPU requirements, audio output latency, key/tempo support, and TV browser compatibility. Do not reuse BASS libraries from the 1.8 APK in the Tizen app.

## Stage 5 — Karaoke stage and sound controls
Color-wipe lyrics, count-in, stage backgrounds, audio controls, key/tempo, melody guide, and playback queue transitions.

## Stage 6 — Advanced features
Download/resume manager, offline catalog, remote guest/admin roles, scoring, microphone input, recordings, songbook export, and settings. Each feature requires a feasibility spike and device-level acceptance test.

## Release gates

No stage is complete based solely on static code or desktop-browser testing. Each release must pass Samsung TV installation, remote-control, audio/media, lifecycle, storage, and regression checks on the target device.

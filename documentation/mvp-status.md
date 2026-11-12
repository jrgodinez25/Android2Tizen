# Karaoke TV MVP — Implementation Status

**Branch:** `feature/kara-okay-tizen-mvp`

## Implemented in source

- [x] Tizen TV web-app package manifest (`config.xml`)
- [x] 1080p/16:9 dark karaoke interface
- [x] Demo catalog with original sample titles and lyrics
- [x] Five-digit keypad
- [x] Search by song number/title/artist
- [x] Song selection and reservation queue
- [x] Queue removal and clear
- [x] Lyric cue timeline
- [x] Local audio-file selection using the browser File API
- [x] LRC import and timestamp parsing
- [x] Basic directional focus navigation and Samsung Back key handling
- [x] Documentation of scope and known limitations

## Not yet implemented

- [ ] Verify Tizen SDK manifest/profile and WGT packaging
- [ ] Install and test on physical Samsung UA50CU8100G
- [ ] Verify USB/file picker and audio codec behavior
- [ ] Persistent catalog and queue storage
- [ ] Remote-phone controller and local network protocol
- [ ] Song catalog ingestion (only licensed/authorized metadata and content)
- [ ] MIDI/KAR parsing and playback
- [ ] FluidSynth/WebAssembly or another licensed Tizen-compatible synthesizer
- [ ] SF2 sound bank support
- [ ] Key and tempo processing
- [ ] Audio mixer and melody guide
- [ ] Background video/photo slideshow
- [ ] Scoring and microphone support (if supported by TV/peripherals)
- [ ] Download manager, resume, integrity checking and storage management
- [ ] Playlists, favorites, history, settings and songbook
- [ ] Accessibility, performance, security and regression test suites

## Acceptance criteria for MVP

1. App loads in a compatible Samsung TV Web App runtime.
2. User can navigate the song list using directional keys.
3. User can select a demo song by list or five-digit number.
4. User can reserve and remove songs.
5. User can load a locally accessible audio file and matching LRC file where supported.
6. Lyrics advance based on audio playback time.
7. No copyrighted song content is bundled in the demo.
8. WGT signing, installation and physical-device validation are documented with actual results.

## Version compatibility

The target is Samsung UA50CU8100G (2023 CU8100 family). Do not infer the currently installed Tizen platform from model year. Confirm TV software version and validate every required API on the device.

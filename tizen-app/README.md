# Karaoke TV — Tizen MVP

This is an original, standalone Tizen TV Web App. It is not the original KARA-OKAY app and does not include proprietary code, song catalogs, soundfonts, artwork, or media.

## MVP features

- 16:9 TV-oriented song selection interface.
- Five-digit demo song numbers and search by title, artist, or number.
- Song selection and reservation queue.
- Queue removal and clear.
- Directional-key focus movement, Enter/OK selection, numeric remote input, and Samsung Back-key handling.
- Karaoke stage with timestamped lyric cue rendering.
- Local audio file selection where the TV browser exposes a supported file picker.
- LRC import and synchronization against the loaded audio file.
- Original demo lyric cue preview when no audio file is loaded.
- Runtime diagnostics for Tizen platform version, model and firmware where the corresponding TV APIs are available.

## Limitations

- Six original demo entries only; no commercial song catalog or media pack.
- Demo mode advances lyric cues but does not synthesize backing music.
- Audio file selection and codecs must be verified on the TV.
- MIDI/KAR playback, FluidSynth/WebAssembly, SF2 soundfonts, key/tempo processing, mixer, scoring, microphone input, phone remote, downloads, and persistent library are not implemented yet.

## Run in a desktop browser

```bash
python -m http.server 8080 --directory tizen-app
```

Open `http://localhost:8080`. Desktop testing does not validate Samsung TV APIs, signing, media support, or remote behavior.

## Build and install

See [TizenBrew Installer deployment](../documentation/tizenbrew-deployment.md). The app is distributed as a standalone signed `.wgt`; it is not installed as a TizenBrew module.

Do not commit signing certificates or private keys. Use your own Samsung certificate profile or the supported TizenBrew Installer re-signing flow.

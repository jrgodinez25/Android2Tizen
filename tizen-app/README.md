# Karaoke TV — Tizen MVP

This is an original Tizen TV web application prototype. It is not the original KARA-OKAY app, and it does not include its proprietary code, song catalog, soundfonts, artwork, or media.

## MVP features implemented

- 16:9 TV-oriented song selection interface.
- Five-digit demo song numbers and search by title, artist, or number.
- Song selection and reservation queue.
- Queue removal and clear.
- Directional-key focus movement, Enter/OK selection, numeric remote input, and Samsung Back-key handling.
- Karaoke stage with timestamped lyric cue rendering.
- Local audio file selection (where the TV browser exposes a supported file picker).
- LRC subtitle import and synchronization against the loaded audio file.
- Browser/local demo cue preview when no audio file is loaded.

## Important limitations

- The included six-song catalog and lyrics are original demonstration content only.
- No KARA-OKAY song pack, 47,000-song database, MP3/KAR/MIDI tracks, or SF2 soundfonts are included.
- The built-in demo mode advances lyric cues but does not synthesize backing music.
- Audio file selection and supported codecs must be verified on the actual Samsung TV. The TV file picker may not expose every USB/storage location.
- LocalStorage is not yet used for persistent queue/catalog storage; app lifecycle and storage behavior still need device testing.
- MIDI/KAR playback, FluidSynth/WebAssembly synthesis, key/tempo shifting, mixer, scoring, microphone input, remote-phone service, and downloads are not implemented in this MVP.

## Run in a desktop browser

Open `index.html` from a local static web server. For example:

```bash
python -m http.server 8080 --directory tizen-app
```

Then browse to `http://localhost:8080`.

Desktop browser testing validates the basic HTML/JS interaction only. It does not validate Samsung TV APIs, media support, signing, or remote behavior.

## Package for Samsung TV

1. Install the Samsung TV SDK / Tizen Studio and create a valid author + distributor certificate profile for the target TV.
2. Import this directory as a Tizen TV Web Application project (or create a TV Web project and copy these files into it).
3. Verify `config.xml` against the installed SDK and selected TV profile.
4. Build a signed WGT using the SDK's IDE or CLI.
5. Enable Developer Mode on the TV, connect the TV and development PC to the same network, and use SDB/Tizen CLI to install.
6. Test on the actual UA50CU8100GXXP and record the runtime diagnostics shown in the footer.\n7. The manifest baseline is Tizen 7.0; Samsung allows OS upgrades on 2023 models, so confirm the detected runtime on-device.

Do not commit signing certificates or private keys to this repository. Samsung requires signed applications; keep author credentials backed up securely.

Official starting points:
- https://developer.samsung.com/smarttv/develop/getting-started/quick-start-guide.html
- https://developer.samsung.com/smarttv/develop/api-references/web-api-references.html
- https://developer.samsung.com/smarttv/develop/api-references/samsung-product-api-references/avplay-api.html

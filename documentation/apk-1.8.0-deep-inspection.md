# KARA-OKAY 1.8.0 — APK Structural Inspection

**Inspection date:** 2026-11-13  
**Input:** User-supplied Kara-okay-1.8.0.apk  
**Handling:** Read-only ZIP/DEX/native-library/asset inventory. The APK and extracted proprietary assets are not committed.

## Integrity and package structure

| Check | Result |
|---|---|
| File size | 20,514,586 bytes |
| SHA-256 | 4ee5b5b9d42467bda4dc528c235a66641515cc51c80d76f2182c21fd4a5526cf |
| ZIP entries | 260 |
| DEX files | classes.dex, classes2.dex, classes3.dex |
| Android binary manifest | Present; not fully decoded in this inspection |
| Native ABI directories | arm64-v8a, armeabi-v7a, x86_64 |
| Embedded remote pages | assets/remote/index.html, assets/remote/add.html |

The APK is a multi-DEX Android application. A WGT cannot execute its DEX bytecode or Android framework components.

## Native audio dependencies observed

The APK includes ABI-specific native libraries: libbass.so, libbass_fx.so and libbassmidi.so. The MIDI library exports BASSMIDI functions for MIDI stream creation, event access, SoundFont loading, preset enumeration and per-font volume. This confirms the supplied 1.8 binary's audio engine is not a browser-native player.

The APK also contains Android/Jetpack native libraries for graphics and image processing. These are not Tizen Web runtime modules and must not be copied into the WGT.

**Decision:** Do not copy Android .so files into the WGT. Select a separately licensed Tizen-compatible synthesizer and compile compatible C/C++ code to WebAssembly where practical.

## Application namespaces and domain components observed in DEX strings

The DEX string table includes application classes under the okay.kara.* namespace, including:

| Area | Observed class names / indicators |
|---|---|
| Audio | AudioSongEngine, BassKaraokeEngine, MidiScan, SongHubTempo, OutputTap, Resampler |
| Library | BundledLibrary, FolderLibrary, MyLibrary, OwnStore, SongIndex, SoundFontOption, SoundHealth, SongbookPdf |
| Lyrics | SongHubLyrics, SongHubFrame, Id3Lyrics, lyric-fix and timing components |
| Remote | RemoteService, RemoteClient, Pairing, BluetoothStage, UploadDesk, SongAnchor |
| Downloads | AssetDownloads, AssetStore, DownloadState, Renumber |
| Scoring | ScoreKeeper, SingScore, MicHub, PhoneMic, RemoteMicLink |
| Recording | SongRecorder, RecordingsIndex, Mixdown, VoiceChain |
| Settings | lyric, count-in, backdrop, camera, folder, palette, font, sound and library settings |

These names are structural evidence only. They do not reveal complete algorithms, internal APIs, or exact user-visible behavior. Method-level behavior still requires controlled runtime observation and authorized deeper analysis.

## Assets observed

The APK contains ten keypad-number MP3 files, count-in WAV files, score/fanfare MP3 files, three background JPEGs under a private-background asset path, two embedded remote HTML pages, font and third-party license notices, and a GCash QR image.

Do not copy or redistribute these resources in Android2Tizen without permission and a license review. The repository must use original UI artwork, original test audio, original demo lyrics and separately licensed fonts/sound banks.

## Remote UI inspection

The embedded remote pages expose UI areas for pairing/PIN entry, song number, search, categories, reserved queue, songbook, synchronized lyrics, pause/next/stop, key, tempo, melody guide, lyric size and file uploads. This establishes a meaningful remote workflow in the 1.8 APK, but does not establish that its private protocol can be reused.

The Tizen implementation should define a new documented protocol and authentication model rather than transplanting the private HTML or protocol implementation.

## Version discipline

The inspected APK is version 1.8.0. The upstream public README has since advanced to 1.9.x and describes later changes, including a FluidSynth-based engine. Do not attribute 1.9.x features or internals to the 1.8.0 binary unless separately verified.

## Remaining APK analysis

- Decode AndroidManifest.xml to confirm package ID, min/target SDK, activities, services and permissions.
- Use JADX/APKTool in a local, authorized environment to map app-owned classes and screen/navigation flows.
- Record exact 1.8.0 screen states through user-provided screenshots or controlled observation.
- Compare binary findings with the upstream release notes for 1.8.0.
- Keep all APK-derived proprietary code, media, catalog data and secrets out of the public repository.

## Conclusion

The APK is a Kotlin/Android multi-DEX application with a substantial Android-specific audio stack, library/download pipeline, remote controller, scoring and recording subsystems. It cannot be mechanically converted into a WGT. The correct path is a clean-room Tizen Web App with a separate WebAssembly audio engine and feature-by-feature acceptance tests.

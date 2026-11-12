# Feature Inventory — KARA-OKAY 1.8.0 to Tizen

**Evidence labels**
- **APK observed:** structurally evidenced in the user-supplied 1.8.0 APK (DEX classes, native exports, embedded assets or remote UI).
- **Public README:** described by the upstream public README; version may be later than the supplied 1.8.0 APK.
- **Unverified:** requires user observation, deeper authorized APK analysis or target-TV testing.

Do not treat later upstream 1.9.x features as confirmed 1.8.0 behavior.

| ID | Feature / workflow | Evidence | Android dependency / evidence | Tizen implementation | Priority | Status |
|---|---|---|---|---|---|---|
| F-001 | TV song selection and five-digit codes | Public README; confirm 1.8 UI | Song model/index classes | Remote-friendly keypad + catalog index | P0 | MVP partial |
| F-002 | Search by title/artist/code | Public README | Song index | Local indexed search | P0 | MVP basic |
| F-003 | Song categories | Public README | Library/catalog classes | Category browser | P0 | Not started |
| F-004 | Reserve queue / next / skip | Public README and remote UI | Reserved state and remote controls | Persistent queue/state machine | P0 | MVP partial |
| F-005 | Karaoke stage and color-wiping lyrics | Public README and lyric classes | Lyrics/timing renderer | DOM/canvas lyric renderer | P0 | MVP line cue only |
| F-006 | MIDI/KAR parsing and playback | APK observed | BASSMIDI JNI + MIDI scan/engine classes | MIDI parser + FluidSynth/WASM spike | P0 | Not started |
| F-007 | SF2 SoundFont loading | APK observed | BASSMIDI SoundFont APIs | WASM synthesizer with licensed SF2 | P0 | Not started |
| F-008 | Key transpose | APK observed / public README | MIDI/audio engine | MIDI event transpose | P1 | Not started |
| F-009 | Tempo adjustment | APK observed / public README | SongHubTempo/audio engine | MIDI tempo-map transform or validated engine control | P1 | Not started |
| F-010 | Melody guide volume/mute | Public README; audio engine evidence | MIDI channel/mixer | Instrument/channel mixer | P1 | Not started |
| F-011 | Count-in and click | APK assets include click WAV; public README | CountInPlayer and count assets | Web Audio scheduled count-in | P1 | Not started |
| F-012 | Stage backgrounds | APK observed | Background image assets; backdrop classes | User-owned photos/video and CSS/video stage | P1 | Not started |
| F-013 | Phone remote pairing | APK observed | Pairing, RemoteService/Client, PIN UI | New secure protocol; transport feasibility spike | P1 | Not started |
| F-014 | Remote lyric view and controls | APK observed | Embedded remote UI includes lyrics, pause, next, key, tempo, melody | Responsive phone web remote | P1 | Not started |
| F-015 | Send/import user media | APK observed | UploadDesk and add.html UI | Authenticated upload/import flow, subject to TV storage API | P1 | Not started |
| F-016 | Downloadable library / offline | APK observed | AssetDownloads/AssetStore | Resumable downloads + storage quota management | P1 | Not started |
| F-017 | Favorites, playlists, history | Public README | Library and state classes | IndexedDB metadata | P1 | Not started |
| F-018 | Songbook PDF | APK observed | SongbookPdf and layout classes | Client-side PDF generation or companion generation | P2 | Not started |
| F-019 | Singing score | APK observed | ScoreKeeper/SingScore | Evaluate TV microphone/input and scoring | P2 | Not started |
| F-020 | Microphone / phone mic | APK observed | MicHub, PhoneMic, RemoteMicLink | Device-input feasibility spike | P2 | Not started |
| F-021 | Recording / mixdown | APK observed | SongRecorder, AacEncoder, Mixdown | Evaluate Web Audio capture and supported media APIs | P2 | Not started |
| F-022 | Camera behind lyrics | Public README (later release details) | CameraX-related native dependency exists; exact 1.8 UI unverified | Only if target TV camera API/device is supported | P3 | Unverified |
| F-023 | Voice search | Public README | Android speech recognition dependency not fully assessed | Samsung's Tizen 7 Web Engine matrix lists Web Speech API as unsupported; consider phone-side search | P3 | Not planned on TV |
| F-024 | MP3 vocal removal / lyric lookup | Public README (later release) | Not confirmed in supplied APK | External processing/licensing/compute review | P3 | Unverified |

## Screen inventory

| Screen ID | Screen | Evidence | Tizen route |
|---|---|---|---|
| S-001 | Home / song library | Public README | Home |
| S-002 | Search / keypad | Public README and remote UI | Search |
| S-003 | Categories / songbook | Public README | Browse |
| S-004 | Reserved queue | Public README and remote UI | Queue |
| S-005 | Karaoke stage | Public README and lyric classes | Stage |
| S-006 | Stage controls (key/tempo/melody) | Public README and remote UI | Stage overlay/panel |
| S-007 | Settings | DEX settings classes; exact 1.8 screen map pending | Settings |
| S-008 | Phone remote pairing | APK remote page | Pairing |
| S-009 | Upload own songs/media | APK remote add page | Import |
| S-010 | Downloads / library setup | Download classes | Library setup |
| S-011 | Score / result | Score classes and score audio assets | Score overlay |
| S-012 | Songbook PDF | SongbookPdf class | Songbook |

## Current Android2Tizen MVP gap

The existing MVP has a custom three-column layout, six original demo songs, a five-digit demo keypad, a basic reservation queue, line-level lyric cue preview, local audio/LRC selection and simple remote-key handling. It is a technical installation/runtime scaffold, not visual or functional parity.

## Acceptance criteria convention

Every row must have a user-observable normal flow, error and empty states, remote focus order and Back behavior, persistence/offline behavior where relevant, audio/video timing or performance metrics where relevant, and a physical-TV test result before being marked complete.

## Content and licensing boundary

The original KARA-OKAY public README states its source code is not public. This project must independently implement functionality and use original or licensed media, fonts and sound banks. Do not bundle the original song catalog, lyrics, proprietary audio, remote HTML, artwork or APK code without explicit permission and license clearance.

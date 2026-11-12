# Android-to-Tizen Compatibility Mapping

This is a planning matrix, not a claim that every Android API has a drop-in Tizen equivalent. Validate all proposed replacements against the target TV model, Tizen version, and official Samsung documentation.

| Android capability | Candidate Tizen implementation | Key constraints / validation |
|---|---|---|
| Activities and fragments | Web app views and route/state management | Lifecycle and memory behavior differ |
| Android layouts / Views | HTML and CSS | Rebuild TV layout and focus states |
| Java / Kotlin logic | JavaScript modules or a permitted backend | Rewrite logic; no direct DEX execution |
| SharedPreferences | LocalStorage or IndexedDB | Storage quotas, persistence and security |
| SQLite | IndexedDB or a supported service | Validate required query/transaction behavior |
| HTTP clients | Fetch / XMLHttpRequest | CORS, TLS, authentication and server compatibility |
| MediaPlayer / ExoPlayer | HTML5 media or Samsung AVPlay APIs | Codec, container, DRM, subtitle and TV-version support |
| Android key events | Tizen TV key events / DOM keyboard events | Key registration, focus and remote model differences |
| Android intents | In-app routing / supported Tizen app APIs | Cross-app invocation may differ |
| Background services | Lifecycle-aware web logic or backend service | TV app suspension and background restrictions |
| Google Play Services | No general direct equivalent | Replace service or declare feature unsupported |
| Android native libraries | Reimplement, use compatible web APIs, or backend | Android ABI binaries cannot be reused as Tizen binaries |

## Compatibility decision

Classify each feature as:

- **Direct candidate:** standard web capability appears sufficient; still requires device validation.
- **Adaptation required:** different API or architecture needed.
- **Backend required:** capability is better provided by an authorized server.
- **Unsupported / blocked:** no legitimate or technically viable Tizen route identified.

Do not promise DRM playback, protected content access, background execution, or Google-service parity before testing.

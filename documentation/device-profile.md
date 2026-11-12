# Target Device Profile

**Status:** Hardware and firmware details confirmed from the TV's About This TV screen on 2026-11-12. Actual installed Tizen API version is still to be queried from the app runtime.

## Confirmed device

| Field | Value |
|---|---|
| Manufacturer | Samsung |
| Product family | Crystal UHD CU8100 |
| Model code | UA50CU8100GXXP |
| Screen | 50-inch, 4K UHD |
| Model year | 2023 |
| Firmware family | T-X22UDCUABC |
| Software version shown | 0090 / 2220.4 (as displayed) |
| TPK runtime version | 80.24.16020 |
| Remote control | TM2360E |
| Wi-Fi | Wi-Fi 5 |
| Bluetooth | 5.2 |

Do not store or publish serial numbers, Smart Hub unique IDs, Netflix ESN, TVKey IDs, EMDUIDs, or MAC addresses. These identifiers are intentionally omitted from this repository documentation.

## Platform target and OS upgrade caveat

Samsung's official TV platform matrix maps the 2023 TV model year to **Tizen 7.0** and Chromium M94. The CU8100 is a 2023 model. Samsung also documents that 2023-and-later TVs can receive operating-system upgrades, so the model year is the original platform baseline, not proof of the currently installed OS.

The TPK string shown in About This TV is recorded as runtime/build information. It is not, by itself, a reliable Tizen platform-version identifier.

The app manifest now targets Tizen 7.0 as its minimum API baseline. The application will query the actual platform version, model, and firmware at startup on the physical TV. If the detected platform is newer than 7.0, keep the 7.0 baseline unless a feature specifically requires a later API.

## Runtime diagnostics implemented

At startup, the app calls:

- `tizen.systeminfo.getCapability("http://tizen.org/feature/platform.version")`
- `webapis.productinfo.getModel()`
- `webapis.productinfo.getFirmware()`

The detected values are shown in the application footer and written to the console. The required `systeminfo` and `productinfo` privileges and Samsung Web API script are declared in `config.xml` / `index.html`.

## Official references

- [Samsung Philippines: UA50CU8100G product specifications](https://www.samsung.com/ph/tvs/uhd-4k-tv/cu8100-50-inch-crystal-uhd-4k-ua50cu8100gxxp/)
- [Samsung Philippines: UA50CU8100G support and firmware downloads](https://www.samsung.com/ph/support/model/UA50CU8100GXXP/)
- [Samsung Developer: General specifications](https://developer.samsung.com/smarttv/develop/specifications/general-specifications.html)
- [Samsung Developer: Web engine specifications](https://developer.samsung.com/smarttv/develop/specifications/web-engine-specifications.html)
- [Samsung Developer: Retrieving platform information](https://developer.samsung.com/smarttv/develop/guides/fundamentals/retrieving-platform-information.html)
- [Samsung Developer: ProductInfo API](https://developer.samsung.com/smarttv/develop/api-references/samsung-product-api-references/productinfo-api.html)

## Device test plan

1. Build and sign the Tizen TV WGT with a valid certificate profile.
2. Enable Developer Mode on the TV and connect it to the development PC on the same LAN.
3. Install and launch the app.
4. Read the footer's runtime diagnostic string and capture a photo that excludes unique device identifiers.
5. Test directional navigation, OK/Enter, Back, and numeric keypad input with the TM2360E remote.
6. Test local media access and supported MP3/AAC/WAV codecs, plus LRC timing.
7. Record actual results separately from emulator/static CI results.

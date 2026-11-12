# Target Device Profile

**Status:** Physical test device identified from the rear product label. Firmware and installed Tizen platform version still need on-device confirmation.

## Device identity

| Field | Value | Evidence |
|---|---|---|
| Manufacturer | Samsung | Product label |
| Product family | Crystal UHD CU8100 | Samsung Philippines product/support listing |
| Model number | UA50CU8100G | Product label and Samsung support listing |
| Model code / regional SKU | UA50CU8100GXP on label; Samsung Philippines lists UA50CU8100GXXP | Product label / regional product listing; verify full suffix in TV settings |
| Type number | UA50CU8100 | Product label |
| Screen size | 50 inch | Model designation / Samsung product listing |
| Product generation | 2023 | Samsung Philippines product listing |
| OS family | Tizen Smart TV | Samsung official specifications |
| Tizen platform version | **Not yet confirmed** | Must be read from the actual TV |
| Installed firmware | **Not yet confirmed** | Must be read from the actual TV |
| Hardware version | XB01 | Product label |

## Official references

- [Samsung Philippines: UA50CU8100G product specifications](https://www.samsung.com/ph/tvs/uhd-4k-tv/cu8100-50-inch-crystal-uhd-4k-ua50cu8100gxxp/)
- [Samsung Philippines: UA50CU8100G support and downloads](https://www.samsung.com/ph/support/model/UA50CU8100G/)
- [Samsung Developer: Retrieving platform information](https://developer.samsung.com/smarttv/develop/guides/fundamentals/retrieving-platform-information.html)

Samsung identifies this model as a Tizen Smart TV and a 2023 CU8100 series product. Samsung's developer documentation notes that 2023 TVs may receive OS upgrades, so the model year alone does **not** establish the currently installed Tizen version.

## Confirm the installed platform version

Preferred: inspect the TV itself and record the exact software/firmware version shown under:

**Settings → Support → About This TV** (menu wording may vary by firmware/region).

For an application-side diagnostic build, Samsung documents these APIs:

```javascript
// Tizen platform version
const platformVersion = tizen.systeminfo.getCapability(
  "http://tizen.org/feature/platform.version"
);

// Samsung TV firmware and model
const firmware = webapis.productinfo.getFirmware();
const model = webapis.productinfo.getModel();

console.log({ platformVersion, firmware, model });
```

Use the API only in an appropriately configured Samsung TV application with the required supported APIs/privileges. Do not infer the installed version from the 2023 model year.

## Development implications

- Use this physical TV as the primary integration and acceptance-test target.
- Select the Tizen SDK/profile and API level after confirming the installed platform version.
- Validate remote-control key handling, focus navigation, media playback, codecs, storage, networking, and app lifecycle on the actual device.
- Keep emulator results separate from physical-device test evidence.

# Browser Compatibility for Sync Features

## Quick Answer: Does Chrome on iOS support Web Bluetooth?

**NO** - Chrome on iOS does NOT support Web Bluetooth.

## Why?

Apple's App Store rules require that **all iOS browsers use the WebKit engine** (the same engine that powers Safari). This means:

- Chrome on iOS = Safari with Chrome UI
- Firefox on iOS = Safari with Firefox UI  
- Edge on iOS = Safari with Edge UI
- Any browser on iOS = Safari's WebKit engine

Since WebKit does not support the Web Bluetooth API, **no browser on iOS can support Web Bluetooth**, regardless of the browser name or vendor.

## What Does This Mean for Users?

### iOS Users (iPhone, iPad, iPod Touch)
- ✅ **QR Code Sync**: Fully supported - works perfectly
- ❌ **Bluetooth Sync**: Not available on any browser
- 💡 **Recommendation**: Use QR Code sync

### Android Users
- ✅ **QR Code Sync**: Fully supported
- ✅ **Bluetooth Sync**: Available in Chrome and Edge
- 💡 **Recommendation**: Use Bluetooth for convenience, QR codes work too

### Desktop Users (Windows, Mac, Linux)
- ✅ **QR Code Sync**: Fully supported
- ✅ **Bluetooth Sync**: Available in Chrome and Edge
- ❌ **Safari (macOS)**: No Bluetooth support, use QR codes
- 💡 **Recommendation**: Use Bluetooth in Chrome/Edge, QR codes in Safari

## Complete Browser Support Matrix

| Platform | Browser | QR Code Sync | Bluetooth Sync | Notes |
|----------|---------|--------------|----------------|-------|
| **iOS** | Chrome | ✅ Yes | ❌ No | Uses WebKit engine |
| **iOS** | Safari | ✅ Yes | ❌ No | Native WebKit |
| **iOS** | Firefox | ✅ Yes | ❌ No | Uses WebKit engine |
| **iOS** | Edge | ✅ Yes | ❌ No | Uses WebKit engine |
| **iOS** | Any Browser | ✅ Yes | ❌ No | All use WebKit |
| **Android** | Chrome | ✅ Yes | ✅ Yes | Full support |
| **Android** | Firefox | ✅ Yes | ❌ No | Firefox limitation |
| **Android** | Edge | ✅ Yes | ✅ Yes | Full support |
| **Android** | Samsung Internet | ✅ Yes | ✅ Maybe | Chromium-based |
| **Windows** | Chrome | ✅ Yes | ✅ Yes | Full support |
| **Windows** | Edge | ✅ Yes | ✅ Yes | Full support |
| **Windows** | Firefox | ✅ Yes | ❌ No | Firefox limitation |
| **macOS** | Chrome | ✅ Yes | ✅ Yes | Full support |
| **macOS** | Safari | ✅ Yes | ❌ No | Safari limitation |
| **macOS** | Firefox | ✅ Yes | ❌ No | Firefox limitation |
| **Linux** | Chrome | ✅ Yes | ✅ Yes | Full support |
| **Linux** | Firefox | ✅ Yes | ❌ No | Firefox limitation |

## Technical Background

### Web Bluetooth API Support
The Web Bluetooth API is a web standard that allows browsers to communicate with Bluetooth Low Energy (BLE) devices. However, it has limited browser support:

**Supported:**
- Chrome/Chromium (Desktop: Windows, macOS, Linux; Mobile: Android)
- Edge (Chromium-based, Desktop only)
- Opera (Chromium-based)
- Samsung Internet (Chromium-based)

**Not Supported:**
- Safari (all platforms)
- Firefox (limited/experimental support)
- All iOS browsers (due to WebKit requirement)

### Why QR Codes Work Everywhere
QR Code sync uses:
1. **Camera API** - Universally supported across all modern browsers
2. **Canvas API** - For generating QR codes, also universally supported
3. **No special permissions** - Just camera access

This makes QR codes the most reliable cross-platform solution.

### iOS WebKit Restriction
From Apple's [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/):

> **2.5.6** - Apps that browse the web must use the appropriate WebKit framework and WebKit Javascript.

This means:
- Third-party browser engines (like Chromium/Blink) are not allowed
- All browsers must use WebKit
- No browser can offer features not in WebKit
- Web Bluetooth is not in WebKit

## How Our App Handles This

### Automatic Detection
The app automatically detects:
1. Whether you're on iOS (checks user agent for iPhone/iPad/iPod)
2. What browser you're using (Chrome, Safari, Firefox, etc.)
3. Whether Web Bluetooth is actually available

### User-Friendly Messaging
When iOS is detected:
- Shows browser name (e.g., "Chrome (iOS)")
- Clearly states "Web Bluetooth is not supported on iOS"
- Explains why (Apple platform restriction)
- Emphasizes QR Code sync as the solution

### Graceful Degradation
- iOS users never see confusing "Connect to Device" buttons
- The app prioritizes QR Code sync in the UI
- Clear guidance directs users to the working solution

## Frequently Asked Questions

### Q: Will this change in the future?
**A:** Only if Apple changes their App Store guidelines to allow alternative browser engines on iOS, or if Apple adds Web Bluetooth support to WebKit. As of 2026, neither seems imminent.

### Q: Why does the Chrome team list iOS support?
**A:** Chrome's documentation may list "Chrome for iOS" in their release notes, but the Web Bluetooth feature specifically is marked as unavailable on iOS.

### Q: Can I use a different browser on iOS?
**A:** You can install different browsers, but they all use the same WebKit engine underneath, so none will support Web Bluetooth.

### Q: Is QR Code sync as good as Bluetooth?
**A:** For this use case (syncing game data), yes! QR codes are:
- More reliable (no pairing issues)
- More secure (visible transfer)
- More universal (works everywhere)
- Just as fast for small data transfers

The only downside is you need visual line of sight between devices.

### Q: What about Progressive Web Apps (PWAs)?
**A:** PWAs on iOS also use WebKit and have the same limitations.

## References

- [Web Bluetooth API Browser Compatibility](https://caniuse.com/web-bluetooth)
- [Chrome Platform Status: Web Bluetooth](https://chromestatus.com/feature/5264933985976320)
- [WebKit Feature Status](https://webkit.org/status/)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)

## Summary

| Question | Answer |
|----------|--------|
| Does Chrome on iOS support Web Bluetooth? | ❌ No |
| Does any browser on iOS support Web Bluetooth? | ❌ No |
| Can I sync my game data on iOS? | ✅ Yes, using QR codes |
| Is this a limitation of Chrome? | ❌ No, it's an Apple iOS limitation |
| Will this work on my iPad? | ✅ Yes, QR codes work perfectly |
| What's the best sync method for iOS? | QR Code sync |

---

**Last Updated:** January 2026  
**Status:** All information current as of this date

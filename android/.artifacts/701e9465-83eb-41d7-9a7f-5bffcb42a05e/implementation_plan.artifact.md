# Project Native Migration and URL Update Plan

This plan outlines the steps to configure the Capacitor app to point to the new production URL, add necessary Android permissions, and improve offline capability.

## User Review Required

> [!IMPORTANT]
> The request for "all permissions" usually refers to common mobile capabilities (Camera, Location, Storage). I will include these, but note that the app stores (Google Play) may require justification for each permission during review.

> [!NOTE]
> Setting a remote `server.url` in Capacitor essentially turns the app into a "Web Wrapper". For true offline support, the website at `https://sportsview-app.onrender.com` should be a Progressive Web App (PWA) with a Service Worker, or the web assets should be built and bundled locally within the app.

## Proposed Changes

### Configuration Update
Update `capacitor.config.ts` to point to the new URL and allow navigation to it.

#### [MODIFY] [capacitor.config.ts](file:///C:/Users/NETHUNTER/PycharmProjects/sportsviewtz/capacitor.config.ts)
- Update `server.url` to `https://sportsview-app.onrender.com`.
- Add `allowNavigation` for the host to ensure all links open inside the app.

### Android Manifest Update
Add common permissions to `AndroidManifest.xml` to support "all permissions required".

#### [MODIFY] [AndroidManifest.xml](file:///C:/Users/NETHUNTER/PycharmProjects/sportsviewtz/android/app/src/main/AndroidManifest.xml)
- Add Camera permission.
- Add Location permissions (Fine and Coarse).
- Add Storage permissions (Read/Write).
- Add Network State permission (for offline checks).

### Dependency Additions (Optional but Recommended)
Install `@capacitor/network` to allow the app to detect and handle offline states.

## Verification Plan

### Automated Tests
- Run `npx cap sync android` to ensure configurations are applied.
- Build the app and verify `server.url` is correctly set in the built assets.

### Manual Verification
- Deploy the app to a device/emulator.
- Verify the app loads `https://sportsview-app.onrender.com`.
- Check if permission dialogs appear when native features are accessed (if any).
- Test offline behavior by disabling internet and observing the app's response.

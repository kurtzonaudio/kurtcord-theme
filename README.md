# Kurtcord Theme

Kurtcord Theme is the branded wallpaper theme for Kurtcord. It puts the Kurtcord background image behind a transparent Discord UI, with a dark overlay you control, so the app still reads clearly. The plugin is on by default, and it can be turned off from its settings or from the on-screen hint.

## What it does

- Sets the app background to the bundled Kurtcord wallpaper, centered, covering the window, and fixed in place.
- Makes Discord's main surfaces transparent so the wallpaper shows through, while floating surfaces such as menus, modals, and cards stay dark and readable.
- Adds an adjustable dark overlay so text and controls stay easy to see on bright parts of the image.
- Shows a small hint in the bottom-right corner the first time, with a Turn off button and a dismiss button.

## How it works

- The plugin injects a style element with two parts. First, it overrides Discord's background variables to `transparent` and removes the background gradients, so the app frame and main surfaces let the wallpaper through. Second, it sets the page background to the wallpaper image with a black overlay at your chosen opacity, over a near-black fallback color.
- Floating surfaces (`--background-floating` and `--bg-surface-raised`) are set to a dark translucent color instead of transparent, so menus and modals keep their contrast and stay readable over the image.
- The wallpaper ships with the plugin as `background.jpg` and is embedded into the style as a base64 data URL, so nothing is fetched from the network.
- The hint is a small DOM element with a Turn off button that disables the plugin and a dismiss button that records the choice in Discord's DataStore, so it does not come back.

## Settings

- **Dim.** How dark the overlay over the wallpaper is, from 0 (full brightness) to 0.9 (nearly black). Default 0.45.
- **Show hint.** Show the bottom-right hint explaining how to turn the theme off. Default on.

## Installation

Kurtcord Theme is a user plugin for Vencord or Equicord, and it is built into Kurtcord, where it is on by default.

For Vencord or Equicord:

1. Clone the plugin into the userplugins folder:
   ```
   git clone https://github.com/kurtzonaudio/kurtcord-theme src/userplugins/KurtcordTheme
   ```
2. Build the client:
   ```
   pnpm build
   ```
3. Restart Discord. The theme applies immediately. Turn it off any time in Settings, Plugins, KurtcordTheme, or with the hint's Turn off button.

## Notes and limits

- The theme follows Discord's current variable names. A future Discord UI update could leave some surface with its own background. The plugin keeps the important floating surfaces dark, so the UI stays usable either way.
- The wallpaper is bundled, so there is no download and no external request.
- The Turn off button disables the plugin, which removes the style and the hint. Turning it back on restores the theme with your dim setting.

## Kurtzon's Discord plugins

This plugin is part of the Kurtzon's Discord plugins set, which ships with [Kurtcord](https://github.com/kurtzonaudio/kurtcord) and also works in Vencord and Equicord:

- [Stereo Guard](https://github.com/kurtzonaudio/stereo-guard): locally mutes anyone whose audio is not fully mono.
- [Mic Spam Guard](https://github.com/kurtzonaudio/mic-spam-guard): locally mutes anyone who gets too loud or spams their mic.
- [Voice State Fix](https://github.com/kurtzonaudio/voice-state-fix): corrects stuck mute and deafen states on Discord's side.
- [Voice VU Meters](https://github.com/kurtzonaudio/voice-vu-meters): live volume meters next to everyone in a call.
- [Kurtcord Voice Panel](https://github.com/kurtzonaudio/kurtcord-voice-panel): a live Voice & Video panel in the user area.
- [Kurtcord Theme](https://github.com/kurtzonaudio/kurtcord-theme): the Kurtcord wallpaper theme.
- [Camera Unlock](https://github.com/kurtzonaudio/camera-unlock): unlocks the camera and Go Live buttons without the Stream permission.
- [Click To Unmute](https://github.com/kurtzonaudio/click-to-unmute): click a locally muted user's mute icon to unmute them.
- [Auto Cam Off](https://github.com/kurtzonaudio/auto-cam-off): turns your camera off when a staff member joins.

## License

MIT. Copyright (c) 2026 Kurtzon (Kurtzon Audio). See [LICENSE](LICENSE).

Built and maintained by Kurtzon.

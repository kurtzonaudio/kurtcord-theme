/*
 * KurtcordTheme, a Vencord/Equicord user plugin
 * Copyright (c) 2026 Kurtzon (Kurtzon Audio)
 * SPDX-License-Identifier: MIT
 */

import { DataStore } from "@api/index";
import { stopPlugin } from "@api/PluginManager";
import { definePluginSettings, Settings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { showToast, Toasts } from "@webpack/common";

import background from "file://./background.jpg?base64";

const STYLE_ID = "kurtcord-theme-style";
const HINT_ID = "kurtcord-theme-hint";
const DISMISSED_KEY = "KurtcordTheme_hintDismissed";

const settings = definePluginSettings({
    dim: {
        type: OptionType.SLIDER,
        description: "How dark the overlay over the wallpaper is. 0 shows the image at full brightness.",
        markers: [0, 0.2, 0.4, 0.6, 0.8],
        default: 0.45,
        stickToMarkers: false,
        onChange: () => applyTheme()
    },
    showHint: {
        type: OptionType.BOOLEAN,
        description: "Show the bottom-right hint explaining how to turn this theme off.",
        default: true
    }
});

function buildCss() {
    const dim = Math.min(0.9, Math.max(0, Number(settings.store.dim) || 0));
    return `
/* Kurtcord wallpaper theme: image behind, Discord surfaces transparent */
:root, .theme-dark, .theme-light {
    --background-base-lowest: transparent !important;
    --background-base-lower: transparent !important;
    --background-base-low: transparent !important;
    --background-surface-high: transparent !important;
    --background-surface-higher: transparent !important;
    --background-surface-highest: transparent !important;
    --background-secondary-alt: transparent !important;
    --bg-surface-raised: rgba(10, 11, 14, 0.82) !important;
    --background-floating: rgba(10, 11, 14, 0.82) !important;
    --background-gradient: none !important;
    --background-gradient-app-frame: none !important;
    --background-gradient-chat: none !important;
    --background-gradient-chat-preview: none !important;
    --background-gradient-lowest: none !important;
    --background-gradient-lower: none !important;
    --background-gradient-low: none !important;
    --background-gradient-high: none !important;
    --background-gradient-higher: none !important;
    --background-gradient-highest: none !important;
}
body {
    background: linear-gradient(rgba(0, 0, 0, ${dim}), rgba(0, 0, 0, ${dim})), url("data:image/jpeg;base64,${background}") center / cover no-repeat fixed, #060608 !important;
}
#app-mount {
    background: transparent !important;
}
#${HINT_ID} {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 9000;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 400px;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(10, 11, 14, 0.92);
    border: 1px solid rgba(255, 140, 26, 0.45);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
    color: #f2f3f5;
    font-family: var(--font-primary, "gg sans", sans-serif);
    font-size: 13px;
    line-height: 1.35;
}
#${HINT_ID} .kc-dot {
    flex: 0 0 auto;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #ff8c1a;
    box-shadow: 0 0 10px rgba(255, 140, 26, 0.9);
}
#${HINT_ID} .kc-title {
    font-weight: 700;
}
#${HINT_ID} .kc-sub {
    margin-top: 2px;
    color: #b9bdc5;
    font-size: 11px;
}
#${HINT_ID} button {
    cursor: pointer;
    border: none;
    font-family: inherit;
}
#${HINT_ID} .kc-off {
    flex: 0 0 auto;
    padding: 6px 10px;
    border-radius: 8px;
    background: #ff8c1a;
    color: #1b1206;
    font-size: 12px;
    font-weight: 700;
}
#${HINT_ID} .kc-off:hover {
    background: #ffa544;
}
#${HINT_ID} .kc-x {
    flex: 0 0 auto;
    padding: 2px 4px;
    background: transparent;
    color: #8a8f98;
    font-size: 13px;
}
#${HINT_ID} .kc-x:hover {
    color: #f2f3f5;
}
`;
}

function applyTheme() {
    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!el) {
        el = document.createElement("style");
        el.id = STYLE_ID;
        (document.head ?? document.documentElement).appendChild(el);
    }
    el.textContent = buildCss();
}

function removeTheme() {
    document.getElementById(STYLE_ID)?.remove();
}

function removeHint() {
    document.getElementById(HINT_ID)?.remove();
}

function turnOff() {
    try {
        (Settings.plugins as any)[plugin.name].enabled = false;
    } catch { }
    stopPlugin(plugin);
    removeHint();
    showToast("Kurtcord theme off. Turn it back on any time in User Settings > Plugins.", Toasts.Type.SUCCESS, {
        position: Toasts.Position.BOTTOM
    });
}

function showHint() {
    if (document.getElementById(HINT_ID) || !settings.store.showHint || !document.body) return;

    const el = document.createElement("div");
    el.id = HINT_ID;
    el.innerHTML = `
        <span class="kc-dot"></span>
        <div>
            <div class="kc-title">Kurtcord theme is on</div>
            <div class="kc-sub">Turn it off any time in User Settings &rsaquo; Plugins &rsaquo; KurtcordTheme, or press the button.</div>
        </div>
        <button class="kc-off" type="button">Turn off</button>
        <button class="kc-x" type="button" title="Dismiss">&#10005;</button>
    `;
    el.querySelector(".kc-off")!.addEventListener("click", () => turnOff());
    el.querySelector(".kc-x")!.addEventListener("click", () => {
        DataStore.set(DISMISSED_KEY, true).catch(() => { });
        removeHint();
    });
    document.body.appendChild(el);
}

let hintTimer: ReturnType<typeof setTimeout> | undefined;

const plugin = definePlugin({
    name: "KurtcordTheme",
    description: "Kurtcord's branded wallpaper: the Kurtcord background image behind a transparent Discord UI. On by default; turn it off here if you don't want it.",
    authors: [{ name: "Kurtzon", id: 0n }],
    enabledByDefault: true,
    settings,
    start() {
        applyTheme();

        DataStore.get(DISMISSED_KEY).then(dismissed => {
            if (dismissed || !settings.store.showHint) return;
            hintTimer = setTimeout(() => {
                try {
                    showHint();
                } catch (e) {
                    console.error("[KurtcordTheme] hint failed:", e);
                }
            }, 6000);
        }).catch(() => { });
    },
    stop() {
        clearTimeout(hintTimer);
        removeHint();
        removeTheme();
    }
});

export default plugin;

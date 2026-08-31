(async function() {
        while (!Spicetify.React || !Spicetify.ReactDOM) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        var ceyectify = (() => {
  // src/app.js
  async function main() {
    while (!(Spicetify == null ? void 0 : Spicetify.showNotification)) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    Spicetify.showNotification("ceyectify loaded!");
  }
  var app_default = main;
  var observer = new MutationObserver(() => {
    const viewport = document.querySelector(
      "#main-view .main-view-container__scroll-node [data-overlayscrollbars-viewport]"
    );
    const target = document.querySelector(
      "#main-view .before-scroll-node > :nth-child(1) > :nth-child(1)"
    );
    if (!viewport || !target || target.dataset.scrollEffect)
      return;
    target.dataset.scrollEffect = "true";
    const update = () => {
      const progress = Math.min(Math.max(viewport.scrollTop / 500, 0), 0.8);
      target.style.opacity = 1 - progress;
      target.style.filter = `blur(${progress * 15}px)`;
      target.style.transform = `scale(${1 + progress * 0.2})`;
    };
    viewport.addEventListener("scroll", update, { passive: true });
    update();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  var clampToPalette = false;
  var ambiencePalette = [
    "#472d3c",
    "#5e3643",
    "#7a444a",
    "#a05b53",
    "#bf7958",
    "#eea160",
    "#f4cca1",
    "#b6d53c",
    "#71aa34",
    "#397b44",
    "#3c5956",
    "#302c2e",
    "#5a5353",
    "#7d7071",
    "#a0938e",
    "#cfc6b8",
    "#dff6f5",
    "#3978a8",
    "#394778",
    "#39314b",
    "#564064",
    "#8e478c",
    "#cd6093",
    "#ffaeb6",
    "#f4b41b",
    "#f47e1b",
    "#e6482e",
    "#a93b3b",
    "#827094",
    "#4f546b"
  ];
  function hexToRgb(hex) {
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16)
    };
  }
  function getClosestPaletteColor(rgb) {
    let closestColor = ambiencePalette[0];
    let smallestDistance = Infinity;
    for (const color of ambiencePalette) {
      const paletteRgb = hexToRgb(color);
      const distance = Math.pow(rgb.r - paletteRgb.r, 2) + Math.pow(rgb.g - paletteRgb.g, 2) + Math.pow(rgb.b - paletteRgb.b, 2);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestColor = color;
      }
    }
    return closestColor;
  }
  async function updateAmbienceColor() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    console.log("[Ambience] Updating...");
    const track = (_a = Spicetify.Player.data) == null ? void 0 : _a.item;
    if (!track) {
      console.log("[Ambience] No current track");
      return;
    }
    console.log("[Ambience] Track:", track.name);
    console.log("[Ambience] Artist:", (_b = track.artists) == null ? void 0 : _b.map((artist) => artist.name).join(", "));
    console.log("[Ambience] URI:", track.uri);
    const imageUrl = ((_c = track.metadata) == null ? void 0 : _c.image_small_url) || ((_e = (_d = track.images) == null ? void 0 : _d[0]) == null ? void 0 : _e.url) || ((_h = (_g = (_f = track.album) == null ? void 0 : _f.images) == null ? void 0 : _g[0]) == null ? void 0 : _h.url);
    console.log("[Ambience] Image URL:", imageUrl);
    if (!imageUrl) {
      console.log("[Ambience] No image found");
      return;
    }
    try {
      console.log("[Ambience] Extracting color...");
      const [result] = await Spicetify.extractColorPreset(imageUrl);
      const originalColor = result.colorRaw;
      const originalHsl = originalColor.hsl;
      console.log("[Ambience] Original RGB:", originalColor.rgb);
      console.log("[Ambience] Original HSL:", originalHsl);
      console.log("[Ambience] Is fallback:", result.isFallback);
      const limitedHsl = {
        h: originalHsl.h,
        s: Math.min(originalHsl.s, 0.8),
        l: Math.min(originalHsl.l, 0.6)
      };
      const limitedColor = Spicetify.Color.fromHSL(limitedHsl);
      let currentColor;
      if (clampToPalette) {
        currentColor = getClosestPaletteColor(limitedColor.rgb);
        console.log("[Ambience] Palette clamp:", true);
        console.log("[Ambience] Closest palette color:", currentColor);
      } else {
        const { r, g, b } = limitedColor.rgb;
        currentColor = "#" + [r, g, b].map((value) => Math.round(value).toString(16).padStart(2, "0")).join("");
        console.log("[Ambience] Palette clamp:", false);
      }
      console.log("[Ambience] Current color:", currentColor);
      const darkColor = `color-mix(in srgb, ${currentColor} 70%, black)`;
      const transparentColor = `color-mix(in srgb, ${currentColor} 30%, transparent)`;
      const root = document.documentElement;
      root.style.setProperty("--current-ambience-color", currentColor);
      root.style.setProperty("--current-ambience-color-dark", darkColor);
      root.style.setProperty("--current-ambience-color-transparent", transparentColor);
      console.log("[Ambience] CSS variables updated");
      console.log("[Ambience] --current-ambience-color:", currentColor);
      console.log("[Ambience] --current-ambience-color-dark:", darkColor);
      console.log("[Ambience] --current-ambience-color-transparent:", transparentColor);
      const darkCBG = `color-mix(in srgb, ${currentColor} 10%, black)`;
      const lightBG = `color-mix(in srgb, ${currentColor} 10%, transparent)`;
      root.style.setProperty("--background-color-dark", mixColors(currentColor, "#000000", 0.3));
      root.style.setProperty("--background-color-default", currentColor);
      root.style.setProperty("--background-color-highlight", mixColors(currentColor, "#ffffff", 0.3));
      refreshDynamicBackground();
    } catch (error) {
      console.error("[Ambience] Color extraction failed:", error);
    }
  }
  setTimeout(() => {
    updateAmbienceColor();
  }, 1e3);
  Spicetify.Player.addEventListener("songchange", updateAmbienceColor);
  function mixColors(color1, color2, amount = 0.5) {
    const hexToRGB = (hex) => {
      hex = hex.replace("#", "");
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      };
    };
    const rgbToHex = ({ r, g, b: b2 }) => `#${[r, g, b2].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
    const a = hexToRGB(color1);
    const b = hexToRGB(color2);
    return rgbToHex({
      r: a.r + (b.r - a.r) * amount,
      g: a.g + (b.g - a.g) * amount,
      b: a.b + (b.b - a.b) * amount
    });
  }
  var PARENT_SELECTOR = ".Root__top-container";
  var CONFIG = {
    resolution: 10,
    animationSpeed: 0.02,
    noiseScale: 0.01,
    warpScale: 0,
    warpStrength: 0,
    warpSpeedX: 0,
    warpSpeedY: 0,
    noiseOctaves: 5,
    octaveLacunarity: 4,
    octaveSpeedX: 0,
    octaveSpeedY: -0.14,
    octavePersistence: 0.5,
    noiseContrast: 1.5,
    colorTransitionSpeed: 0.05,
    blur: 25,
    overscan: 2,
    canvasScale: 1.02
  };
  var container = document.querySelector(PARENT_SELECTOR);
  if (container) {
    let getCssColor = function(variable) {
      return getComputedStyle(container).getPropertyValue(variable).trim();
    }, parseHexColor = function(color) {
      const value = color.replace("#", "").trim();
      if (!/^[0-9a-fA-F]{6}$/.test(value)) {
        console.log("[Dynamic Background] Ung\xFCltige Farbe:", color);
        return [0, 0, 0];
      }
      return [
        parseInt(value.slice(0, 2), 16),
        parseInt(value.slice(2, 4), 16),
        parseInt(value.slice(4, 6), 16)
      ];
    }, readPalette = function() {
      return {
        base: parseHexColor(
          getCssColor("--background-color-default")
        ),
        dark: parseHexColor(
          getCssColor("--background-color-dark")
        ),
        light: parseHexColor(
          getCssColor("--background-color-highlight")
        )
      };
    }, clonePalette = function(palette) {
      return {
        base: [...palette.base],
        dark: [...palette.dark],
        light: [...palette.light]
      };
    }, lerp = function(a, b, t) {
      return a + (b - a) * t;
    }, lerpColor = function(current, target, amount) {
      current[0] += (target[0] - current[0]) * amount;
      current[1] += (target[1] - current[1]) * amount;
      current[2] += (target[2] - current[2]) * amount;
    }, smooth = function(t) {
      return t * t * (3 - 2 * t);
    }, hash = function(x, y) {
      const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return n - Math.floor(n);
    }, noise = function(x, y) {
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const fx = x - x0;
      const fy = y - y0;
      const sx = smooth(fx);
      const sy = smooth(fy);
      const a = hash(x0, y0);
      const b = hash(x0 + 1, y0);
      const c = hash(x0, y0 + 1);
      const d = hash(x0 + 1, y0 + 1);
      return lerp(
        lerp(a, b, sx),
        lerp(c, d, sx),
        sy
      );
    }, fbm = function(x, y, t) {
      let value = 0;
      let amplitude = CONFIG.octavePersistence;
      for (let i = 0; i < CONFIG.noiseOctaves; i++) {
        value += noise(x, y) * amplitude;
        x = x * CONFIG.octaveLacunarity + t * CONFIG.octaveSpeedX;
        y = y * CONFIG.octaveLacunarity - t * CONFIG.octaveSpeedY;
        amplitude *= CONFIG.octavePersistence;
      }
      return value;
    }, resize = function() {
      const rect = container.getBoundingClientRect();
      const newWidth = Math.max(1, Math.ceil(rect.width));
      const newHeight = Math.max(1, Math.ceil(rect.height));
      if (newWidth === width && newHeight === height) {
        return;
      }
      const oldNoiseCanvas = document.createElement("canvas");
      oldNoiseCanvas.width = noiseCanvas.width;
      oldNoiseCanvas.height = noiseCanvas.height;
      if (noiseCanvas.width > 0 && noiseCanvas.height > 0) {
        oldNoiseCanvas.getContext("2d").drawImage(noiseCanvas, 0, 0);
      }
      width = newWidth;
      height = newHeight;
      canvas.width = width;
      canvas.height = height;
      const newNoiseWidth = Math.max(
        1,
        Math.ceil(width / CONFIG.resolution)
      );
      const newNoiseHeight = Math.max(
        1,
        Math.ceil(height / CONFIG.resolution)
      );
      noiseCanvas.width = newNoiseWidth;
      noiseCanvas.height = newNoiseHeight;
      noiseCtx.imageSmoothingEnabled = true;
      ctx.imageSmoothingEnabled = true;
      if (oldNoiseCanvas.width > 0 && oldNoiseCanvas.height > 0) {
        noiseCtx.drawImage(
          oldNoiseCanvas,
          0,
          0,
          oldNoiseCanvas.width,
          oldNoiseCanvas.height,
          0,
          0,
          newNoiseWidth,
          newNoiseHeight
        );
        ctx.drawImage(
          noiseCanvas,
          0,
          0,
          width,
          height
        );
      }
    }, updateColors = function() {
      if (!currentPalette || !targetPalette) {
        return;
      }
      lerpColor(
        currentPalette.base,
        targetPalette.base,
        CONFIG.colorTransitionSpeed
      );
      lerpColor(
        currentPalette.dark,
        targetPalette.dark,
        CONFIG.colorTransitionSpeed
      );
      lerpColor(
        currentPalette.light,
        targetPalette.light,
        CONFIG.colorTransitionSpeed
      );
    }, draw = function() {
      time += CONFIG.animationSpeed;
      updateColors();
      const w = noiseCanvas.width;
      const h = noiseCanvas.height;
      const image = noiseCtx.createImageData(w, h);
      const data = image.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const nx = x * CONFIG.noiseScale;
          const ny = y * CONFIG.noiseScale;
          const warpX = noise(
            nx * CONFIG.warpScale + time * CONFIG.warpSpeedX,
            ny * CONFIG.warpScale
          ) * CONFIG.warpStrength;
          const warpY = noise(
            nx * CONFIG.warpScale,
            ny * CONFIG.warpScale - time * CONFIG.warpSpeedY
          ) * CONFIG.warpStrength;
          let n = fbm(
            nx + warpX,
            ny + warpY,
            time
          );
          n = Math.pow(n, CONFIG.noiseContrast);
          n = Math.max(0, Math.min(1, n));
          let from;
          let to;
          let t;
          if (n < 0.5) {
            from = currentPalette.dark;
            to = currentPalette.base;
            t = n * 2;
          } else {
            from = currentPalette.base;
            to = currentPalette.light;
            t = (n - 0.5) * 2;
          }
          const i = (y * w + x) * 4;
          data[i] = from[0] + (to[0] - from[0]) * t;
          data[i + 1] = from[1] + (to[1] - from[1]) * t;
          data[i + 2] = from[2] + (to[2] - from[2]) * t;
          data[i + 3] = 255;
        }
      }
      noiseCtx.putImageData(image, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(
        noiseCanvas,
        0,
        0,
        width,
        height
      );
      requestAnimationFrame(draw);
    };
    getCssColor2 = getCssColor, parseHexColor2 = parseHexColor, readPalette2 = readPalette, clonePalette2 = clonePalette, lerp2 = lerp, lerpColor2 = lerpColor, smooth2 = smooth, hash2 = hash, noise2 = noise, fbm2 = fbm, resize2 = resize, updateColors2 = updateColors, draw2 = draw;
    const style = document.createElement("style");
    style.textContent = `
        ${PARENT_SELECTOR} {
            position: relative;
            overflow: hidden;
        }

        ${PARENT_SELECTOR} > .ambience-noise {
            position: absolute;
            inset: -${CONFIG.overscan}%;
            width: ${100 + CONFIG.overscan * 2}%;
            height: ${100 + CONFIG.overscan * 2}%;
            filter: blur(${CONFIG.blur}px);
            transform: scale(${CONFIG.canvasScale});
            pointer-events: none;
            z-index: 0;
        }

        ${PARENT_SELECTOR} > *:not(.ambience-noise) {
            position: relative;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const noiseCanvas = document.createElement("canvas");
    const noiseCtx = noiseCanvas.getContext("2d");
    canvas.className = "ambience-noise";
    container.prepend(canvas);
    let width = 0;
    let height = 0;
    let time = 0;
    let currentPalette = null;
    let targetPalette = null;
    window.refreshDynamicBackground = function() {
      const newPalette = readPalette();
      if (!currentPalette) {
        currentPalette = clonePalette(newPalette);
      }
      targetPalette = clonePalette(newPalette);
      console.log(
        "[Dynamic Background] Farben aktualisiert:",
        {
          base: getCssColor("--background-color-default"),
          dark: getCssColor("--background-color-dark"),
          light: getCssColor("--background-color-highlight")
        }
      );
    };
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(resize);
    });
    resizeObserver.observe(container);
    resize();
    window.refreshDynamicBackground();
    draw();
  }
  var getCssColor2;
  var parseHexColor2;
  var readPalette2;
  var clonePalette2;
  var lerp2;
  var lerpColor2;
  var smooth2;
  var hash2;
  var noise2;
  var fbm2;
  var resize2;
  var updateColors2;
  var draw2;

  // ../../../../../private/var/folders/sw/v8f4vn6s70j30y4lprsdg7cw0000gn/T/spicetify-creator/index.jsx
  (async () => {
    await app_default();
  })();
})();
(async () => {
    if (!document.getElementById(`ceyectify`)) {
      var el = document.createElement('style');
      el.id = `ceyectify`;
      el.textContent = (String.raw`
  /* ../../../../../private/var/folders/sw/v8f4vn6s70j30y4lprsdg7cw0000gn/T/tmp-33041-3H24KAvheRy9/1a0588d0fbb0/style.css */
:root {
  --empty: #00000000;
  --almost-empty: #00000040;
  --background-color-default: #3c5956;
  --background-color-dark: #3c5956;
  --background-color-highlight: #3c5956;
  --current-ambience-color: #3c5956;
  --current-ambience-color-dark: #4e7a80;
  --current-ambience-color-transparent: #4e7a8050;
  --big-card-radius: 20px;
  --playlist-album-radius: 15px;
  --panel-radius: 8px;
}
.main-nowPlayingBar-volumeBar {
  display: none !important;
}
.main-nowPlayingBar-lyricsButton {
  display: none !important;
}
[data-testid=fullscreen-mode-button] {
  display: none !important;
}
.main-nowPlayingView-mainContainer {
  display: default !important;
}
.main-actionButtons-spacer.main-actionButtons {
  display: none !important;
}
.main-globalNav-historyButtons > :nth-child(2) {
  display: none !important;
}
.main-topBar-searchBar {
  background-color: var(--almost-empty) !important;
  border: solid 3px rgba(255, 255, 255, 0.5);
}
.main-globalNav-searchInputTextWrapper > :nth-child(2) {
  display: none;
}
#Desktop_LeftSidebar_Id .os-scrollbar {
  display: none !important;
}
.main-yourLibraryX-rootListHeader {
  display: none !important;
}
.main-yourLibraryX-libraryContainer > :nth-child(1) {
  display: none !important;
}
.main-yourLibraryX-libraryRootlist svg {
  display: none !important;
}
.LayoutResizer__resize-bar.LayoutResizer__inline-end {
  display: none !important;
}
.main-yourLibraryX-listItem .main-playButton-PlayButton {
  display: none !important;
}
.main-yourLibraryX-libraryRootlist {
  padding: 5px !important;
}
#Desktop_LeftSidebar_Id {
  width: 72px !important;
  --left-sidebar-width: 72 !important;
}
#Desktop_LeftSidebar_Id .x-entityImage-imageContainer {
  box-shadow: none !important;
}
.main-yourLibraryX-listItem [data-encore-id=listRow] {
  background-color: var(--empty) !important;
  aspect-ratio: 1;
  padding: 7px;
}
.main-yourLibraryX-listItem [data-encore-id=listRow]::after {
  background-color: var(--empty) !important;
  transform: scale(0.5);
  transition: all 0.3s ease;
  border-radius: 100px;
}
.main-yourLibraryX-listItem [data-encore-id=listRow]:hover::after {
  background-color: var(--current-ambience-color-dark) !important;
  transform: scale(0.9);
  border-radius: 8px;
}
.main-yourLibraryX-listItem [data-encore-id=listRow]:active::after {
  background-color: var(--empty) !important;
  transform: scale(1);
  border-radius: 12px;
}
.main-yourLibraryX-listItem {
  transform: scale(1.05);
  transition: all 0.3s ease;
}
.main-yourLibraryX-listItem:has([data-encore-id="listRow"]:hover) {
  transform: scale(1.2);
}
.main-yourLibraryX-listItem:has([data-encore-id="listRow"]:active) {
  transform: scale(1.15);
}
.main-yourLibraryX-listItem .x-entityImage-imageContainer {
  background-color: var(--empty);
  transition: all 0.2s ease;
  border: solid 2px;
  border-color: var(--empty);
}
.main-yourLibraryX-listItem:has([data-encore-id="listRow"]:hover) .x-entityImage-imageContainer {
  border: solid 2px white;
}
.playlist-playlist-playlistContent .main-actionBar-ActionBarRow > :nth-child(3) {
  display: none !important;
}
.playlist-playlist-playlistContent .main-actionBar-ActionBarRow > :nth-child(4) {
  display: none !important;
}
.playlist-playlist-playlistContent .main-actionBar-ActionBarRow > :nth-child(5) {
  display: none !important;
}
[data-testid=playlist-page] .profile-editImage-editImageButtonContainer {
  display: none !important;
}
[data-testid=playlist-page] .main-entityHeader-image .main-image-image {
  border-radius: var(--playlist-album-radius);
}
.main-trackList-trackListRowGrid svg g > :nth-child(1) {
  fill: #0c2e44;
}
.main-trackList-trackListRowGrid svg g > :nth-child(2) {
  fill: #134c4c;
}
.main-trackList-trackListRowGrid svg g > :nth-child(3) {
  fill: #134c4c;
}
.main-trackList-trackListRowGrid svg g > :nth-child(4) {
  fill: #1e6f50;
}
.main-trackList-trackListRowGrid svg g > :nth-child(5) {
  fill: #33984b;
}
.main-trackList-trackListRowGrid svg g > :nth-child(6) {
  fill: #33984b;
}
.main-trackList-trackListRowGrid svg g > :nth-child(7) {
  fill: #5ac54f;
}
.main-cardImage-imageWrapper {
  border-radius: var(--big-card-radius);
  transition: all 0.2s ease;
  background-color: var(--current-ambience-color-dark) !important;
}
.main-cardImage-imageWrapper .main-image-image {
  border-radius: var(--big-card-radius);
  transition: all 0.2s ease;
  transform: scale(0.95);
}
.main-card-cardContainer [data-encore-id=cardTitle] {
  width: 100% !important;
}
.main-card-cardContainer [data-encore-id=cardTitle] span {
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  text-align: center;
}
.main-card-cardContainer .main-card-cardTitleLink {
  width: 100% !important;
}
.main-card-cardContainer [data-encore-id=cardSubtitle] {
  width: 100% !important;
  height: 20px;
}
.main-card-cardContainer .main-card-cardMetadata,
.main-card-cardContainer [data-encore-id=listRowSubtitle] {
  white-space: nowrap !important;
  text-align: center;
}
.main-card-cardContainer .e-10810-card__column,
.main-card-cardContainer {
  width: 100% !important;
  min-width: 0 !important;
}
.main-card-cardContainer::after {
  background-color: var(--empty);
  transition: all 0.2s ease;
  border-radius: calc(var(--big-card-radius) + 20px);
}
.main-card-cardContainer:hover::after {
  background-color: var(--current-ambience-color-dark);
  border-radius: calc(var(--big-card-radius) + 10px);
}
.main-card-cardContainer:active::after {
  transform: scale(0.95);
}
.main-card-cardContainer:hover .main-cardImage-imageWrapper {
  border-radius: calc(var(--big-card-radius) + 10px);
}
.main-card-cardContainer:hover .main-image-image {
  border-radius: calc(var(--big-card-radius) + 10px);
  transform: scale(1);
}
.main-card-cardContainer:active .main-cardImage-imageWrapper {
  border-radius: calc(var(--big-card-radius));
  transform: scale(1.05);
}
.main-card-cardContainer:active .main-image-image {
  border-radius: calc(var(--big-card-radius));
}
[data-testid=album-page] .main-entityHeader-image .main-image-image {
  border-radius: var(--playlist-album-radius);
}
[data-testid=album-page] .main-actionBar-ActionBarRow > :nth-child(3) {
  display: none !important;
}
[data-testid=album-page] .main-actionBar-ActionBarRow > :nth-child(4) {
  display: none !important;
}
[data-testid=album-page] .main-actionBar-ActionBarRow > :nth-child(5) {
  display: none !important;
}
[aria-label="Verified by Spotify"] {
  display: none !important;
}
.main-actionBar-ActionBarContainer .main-shelf-shelf.Shelf .e-10810-legacy-list-row__header div:has(.encore-text-body-small-bold) {
  display: none !important;
}
.B9ji6YIpLSUHiyxx {
  display: none !important;
}
.aotfMYhXr8Ag8I7a .contentSpacing div:has(.jqeC8Fv3eQXI3cmc) {
  display: none !important;
}
.ACvNigTgdo1hsCnz {
  display: none !important;
}
.main-actionBar-ActionBarContainer .main-shelf-shelf.Shelf {
  padding-bottom: 10px !important;
}
.main-actionBar-ActionBarContainer .main-shelf-shelf.Shelf .e-10810-legacy-list-row__header {
  justify-content: center;
}
.artist-artistDiscography-topBar {
  background-color: var(--empty) !important;
  box-shadow: none !important;
  position: relative;
}
.artist-artistDiscography-topBar {
  display: grid !important;
  grid-template-columns: 1fr auto auto;
}
.artist-artistDiscography-topBar > :nth-child(1) {
  grid-column: 1 / -1;
  grid-row: 1;
  justify-self: center;
}
.artist-artistDiscography-topBar > :nth-child(2) {
  grid-column: 2;
  grid-row: 1;
}
.artist-artistDiscography-topBar > :nth-child(3) {
  grid-column: 3;
  grid-row: 1;
}
[data-encore-id=verifiedBadge] {
  display: none !important;
}
#search-dropdown p.encore-text-body-medium-bold {
  display: none !important;
}
#search-dropdown .os-scrollbar {
  display: none !important;
}
#search-dropdown [data-encore-id=listRowSubtitle] {
  display: none !important;
}
#search-dropdown [data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYScroll"] > :nth-child(1) {
  display: none !important;
}
.HOf9H18Ya0DkJ4_K {
  background-color: transparent !important;
  position: relative;
}
.HOf9H18Ya0DkJ4_K .search-searchCategory-contentArea {
  margin: auto !important;
}
.main-trackList-trackListHeader {
  top: 0 !important;
  border-radius: 8px;
  background-color: transparent !important;
  transition: all 0.3s ease;
}
.main-trackList-trackListHeader.Ltz8hFoxXpck1XAk {
  background-color: var(--current-ambience-color-dark) !important;
}
.main-trackList-trackListRow.main-trackList-trackListRowGrid {
  background-color: var(--empty) !important;
  transform: scale(0.975);
  transition: all 0.1s ease;
  border: solid 1px;
  border-color: var(--empty);
}
.main-trackList-trackListRow.main-trackList-trackListRowGrid:hover {
  background-color: var(--current-ambience-color) !important;
  transform: scale(1);
  border-color: white;
}
.Root__top-container {
  background-color: var(--empty);
  transition: all 500ms ease;
}
#Desktop_LeftSidebar_Id {
  background-image: linear-gradient(var(--empty) 0%, var(--almost-empty) 25%, var(--almost-empty) 75%, var(--empty) 100%);
  background-color: var(--empty);
}
.YourLibraryX,
.main-yourLibraryX-library {
  background-color: var(--empty);
}
#global-nav-bar {
  background-color: var(--empty);
}
#main-view,
.Root__right-sidebar,
#Desktop_LeftSidebar_Id,
.Root__now-playing-bar {
  border: solid 1px rgba(255, 255, 255, 0.6);
  border-radius: var(--panel-radius) !important;
}
.contentSpacing {
  max-width: 100vw;
  padding-left: 50px;
  padding-right: 50px;
}
.main-view-container:not(:has(.playlist-playlist-page)) .os-scrollbar {
  display: none !important;
}
.main-home-homeHeader {
  display: none;
}
.main-home-filterChipsContainer {
  position: relative !important;
}
.main-home-filterChipsSection,
.main-home-filterChipsSection::after {
  background-color: var(--empty) !important;
}
.main-home-filterChipsContainer .search-searchCategory-contentArea {
  margin: auto !important;
}
section.ovJXBDQa8ZsE4nc_.main-shelf-shelf.Shelf.Llk1ve1sjOIOuoPP {
  display: none;
}
.main-home-content .main-shelf-titleWrapper .e-10810-legacy-list-row__header div:has(.encore-text-body-small-bold) {
  display: none !important;
}
.main-home-content .main-shelf-titleWrapper .e-10810-legacy-list-row__header {
  justify-content: center;
}
.main-home-content .main-shelf-titleWrapper .e-10810-legacy-list-row__header p {
  display: none !important;
}
.main-home-content .search-searchCategory-contentArea::after,
.search-searchCategory-contentArea::before {
  background-image: none !important;
}
.main-playlistEditDetailsModal-container,
.main-trackCreditsModalV2-container,
.profile-userEditDetails-container {
  backdrop-filter: blur(15px) brightness(120%);
  background-color: #00000050 !important;
  border-radius: 8px;
  border: solid 2px white;
  transition: all 500ms ease;
}
.main-contextMenu-menu {
  position: relative;
  background: transparent !important;
  border: 2px solid white;
  border-radius: 8px;
  overflow: visible !important;
  isolation: isolate;
  transition: all 500ms ease;
}
.main-contextMenu-menu .main-contextMenu-menu {
  margin-left: 4px;
}
.main-contextMenu-menu::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: var(--current-ambience-color-transparent) !important;
  backdrop-filter: blur(15px) brightness(30%) !important;
  -webkit-backdrop-filter: blur(15px) brightness(30%);
  border-radius: 8px;
}
.Root__right-sidebar {
  height: 120px;
  transition: all 0.3s ease;
}
:has(#Desktop_PanelContainer_Id[aria-label="Queue"]) .Root__right-sidebar {
  height: 100% !important;
}
:has(#Desktop_PanelContainer_Id[aria-label="Connect to a device"]) .Root__right-sidebar {
  height: 100% !important;
}
#Desktop_PanelContainer_Id[aria-label="Now playing view"] .main-nowPlayingView-mainContainer {
  display: none;
}
.Root__right-sidebar > :nth-child(1) {
  background-color: var(--empty);
}
#Desktop_PanelContainer_Id::before {
  background-color: var(--empty) !important;
}
#Desktop_PanelContainer_Id {
  background: none !important;
}
.main-nowPlayingView-headerButtonContainer {
  display: none;
}
[aria-label="Hide Now Playing view"] {
  display: none;
}
[aria-label="Now playing view"] .main-nowPlayingView-headerTextWrapper {
  position: static !important;
  width: 100% !important;
  transform: none !important;
  margin-top: 50px;
}
[aria-label="Now playing view"] .main-nowPlayingView-headerTextWrapper .main-watchFeed-contentWrapper {
  margin-left: auto;
  margin-right: auto;
}
[aria-label="Now playing view"] .main-nowPlayingView-headerTextWrapper h1 {
  font-size: 25px !important;
}
.Root__now-playing-bar {
  margin: 0 4px 4px 4px;
  border-radius: 8px;
  background-image: linear-gradient(to bottom, #00000055 0%, #00000055 50%, transparent 100%);
  background-color: #00000000;
  transition: all 500ms ease;
}
.Root__right-sidebar,
#Desktop_LeftSidebar_Id,
.Root__now-playing-bar {
  margin: 0 8px 8px 8px !important;
}
.Root__globalNav {
  margin: 16px !important;
}
#main-view {
  margin: 0 0 8px 0;
}
.Root {
  --panel-gap: 0px !important;
}
.Root__top-container {
  overflow: hidden;
  grid-template-areas: "left-sidebar    main-view         now-playing-bar" "left-sidebar    main-view         right-sidebar";
  grid-template-rows: auto auto 1fr;
}
.global-nav .Root__top-container {
  grid-template-areas: "top-banner global-nav global-nav" "left-sidebar main-view now-playing-bar" "left-sidebar main-view right-sidebar" !important;
}
.main-nowPlayingView-headerTextWrapper,
.main-nowPlayingView-headerContainer,
.Root__right-sidebar > :nth-child(1),
.Root__right-sidebar > :nth-child(1) > :nth-child(1),
.main-nowPlayingView-container {
  position: static !important;
  width: 100% !important;
  max-width: none !important;
  min-width: 0 !important;
  margin: 0 !important;
  left: auto !important;
  right: auto !important;
  top: auto !important;
  bottom: auto !important;
  transform: none !important;
}
.Root__now-playing-bar {
  min-width: 250px !important;
  width: min(25vw, 450px) !important;
}
.main-nowPlayingBar-container {
  flex-direction: column;
  min-width: 100%;
  max-width: 100%;
  width: 100%;
}
.main-nowPlayingBar-nowPlayingBar {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.main-nowPlayingBar-nowPlayingBar > :nth-child(1) {
  margin-top: auto;
  margin-bottom: 10px;
}
.main-nowPlayingBar-nowPlayingBar > :nth-child(3) {
  margin-top: auto;
}
.main-nowPlayingWidget-nowPlaying {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  min-width: 0;
}
.main-nowPlayingWidget-trackInfo.main-trackInfo-container {
  flex: 1 1 0;
  min-width: 0;
}
.main-nowPlayingWidget-actionButtonWrapper {
  flex: 0 0 25px;
}
.main-coverSlotCollapsed-container.main-coverSlotCollapsed-navAltContainer {
  margin-bottom: 10px !important;
  aspect-ratio: 1;
}
.main-coverSlotCollapsed-container.main-coverSlotCollapsed-navAltContainer .cover-art {
  width: 100% !important;
  height: 100% !important;
}
.main-coverSlotCollapsed-container.main-coverSlotCollapsed-navAltContainer .cover-art img {
  width: 100% !important;
  height: 100% !important;
  border-radius: 8px;
}
.main-nowPlayingWidget-actionButtonWrapper [aria-label="Hide in this album"] {
  display: none;
}
.main-nowPlayingWidget-trackInfo.main-trackInfo-container * {
  font-size: clamp(10px, 2vw, 16px);
}
[data-right-sidebar-hidden] .Root__main-view {
  grid-area: main-view/main-view/main-view/span 1;
}
.main-nowPlayingBar-center {
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
}
.main-nowPlayingBar-left {
  width: 100%;
  padding-top: 20px;
}
.HD9s7U5E1RLSWKpXmrqx {
  margin: auto;
  width: 100%;
}
.main-nowPlayingWidget-coverArt .cover-art {
  margin: auto;
  border-radius: 8px;
}
.main-coverSlotCollapsed-container {
  width: 100%;
  height: 100%;
}
.main-coverSlotCollapsed-container > :first-child {
  width: 100%;
  height: 100%;
}
.main-coverSlotCollapsed-container > :first-child > :first-child {
  width: 100%;
  height: 100%;
}
.main-nowPlayingWidget-coverArt {
  width: 80%;
  height: 80%;
}
.main-nowPlayingWidget-nowPlaying .main-useDropTarget-base.main-useDropTarget-album.main-useDropTarget-track.main-useDropTarget-local.main-useDropTarget-episode {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
[data-testid=CoverSlotCollapsed__container] > :nth-child(1) {
  margin: auto !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.main-nowPlayingWidget-nowPlaying {
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.main-coverSlotCollapsed-expandButton {
  right: 25%;
}
.player-controls__buttons.player-controls__buttons--new-icons {
  order: 2;
}
.playback-bar {
  order: 1;
}
.main-nowPlayingBar-right {
  width: 100%;
  padding-bottom: 20px;
  padding-top: 20px;
}
.main-nowPlayingBar-extraControls {
  justify-content: space-evenly;
}
button[data-testid=cover-art-button] {
  height: 220px !important;
  width: 220px !important;
  margin: auto;
  display: contents;
}
.main-entityHeader-backgroundColor,
.aotfMYhXr8Ag8I7a,
.Root__main-view,
.playlist-playlist-actionBarBackground-background,
.main-actionBarBackground-background,
.playlist-playlist-playlistContent {
  background: none !important;
  background-color: #00000000 !important;
}
.main-view-container .before-scroll-node > :nth-child(1) > :nth-child(2) {
  display: none;
}
#main-view .main-topBar-container {
  display: none;
}
.main-view-container {
  background-image: linear-gradient(var(--empty) 0%, var(--almost-empty) 25%, var(--almost-empty) 75%, var(--empty) 100%);
}
#main-view .before-scroll-node > :nth-child(1) > :nth-child(1) {
  -webkit-mask-image: linear-gradient(to bottom, black 75%, var(--empty) 100%);
  mask-image: linear-gradient(to bottom, black 75%, var(--empty) 100%);
}
.QbBd77Gr02YOoZzr {
  background-color: #00000000 !important;
}

      `).trim();
      document.head.appendChild(el);
    }
  })()
      })();
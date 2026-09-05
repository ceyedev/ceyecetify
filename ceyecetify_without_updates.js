(async function() {
        while (!Spicetify.React || !Spicetify.ReactDOM) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        var ceyecetify = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // src/app.js
  var isPlaying = false;
  async function main() {
    while (!(Spicetify == null ? void 0 : Spicetify.showNotification)) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    isPlaying = Spicetify.Player.isPlaying();
    Spicetify.showNotification("ceyecetify loaded!");
  }
  var app_default = main;
  (() => {
    const lock = () => {
      const container2 = document.querySelector(".Root__top-container");
      if (!container2 || container2.__scrollLocked) {
        return;
      }
      container2.__scrollLocked = true;
      const scrollTo = container2.scrollTo.bind(container2);
      const scrollBy = container2.scrollBy.bind(container2);
      container2.scrollTo = (...args) => {
        if (typeof args[0] === "object") {
          return scrollTo(__spreadProps(__spreadValues({}, args[0]), {
            left: 0,
            top: 0
          }));
        }
        return scrollTo(0, 0);
      };
      container2.scrollBy = () => {
      };
      container2.addEventListener("scroll", () => {
        if (container2.scrollLeft !== 0 || container2.scrollTop !== 0) {
          container2.scrollLeft = 0;
          container2.scrollTop = 0;
        }
      }, { passive: true });
      container2.scrollLeft = 0;
      container2.scrollTop = 0;
    };
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function(options) {
      var _a;
      if ((_a = this.closest) == null ? void 0 : _a.call(this, ".Root__top-container")) {
        return;
      }
      return originalScrollIntoView.call(this, options);
    };
    lock();
    new MutationObserver(lock).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  })();
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
      root.style.setProperty("--current-ambience-color", modifyHSV(currentColor, 0, 0, 0));
      root.style.setProperty("--current-ambience-color-dark", darkColor);
      root.style.setProperty("--current-ambience-color-transparent", transparentColor);
      console.log("[Ambience] CSS variables updated");
      console.log("[Ambience] --current-ambience-color:", currentColor);
      console.log("[Ambience] --current-ambience-color-dark:", darkColor);
      console.log("[Ambience] --current-ambience-color-transparent:", transparentColor);
      const darkCBG = `color-mix(in srgb, ${currentColor} 10%, black)`;
      const lightBG = `color-mix(in srgb, ${currentColor} 10%, transparent)`;
      root.style.setProperty("--background-color-dark", modifyHSV(currentColor, 20, -0.2, 0.2));
      root.style.setProperty("--background-color-default", modifyHSV(currentColor, 0, 0, 0));
      root.style.setProperty("--background-color-highlight", modifyHSV(currentColor, -20, 0.2, 0.2));
      refreshDynamicBackground();
      setHighQualityCover();
    } catch (error) {
      console.error("[Ambience] Color extraction failed:", error);
    }
  }
  setTimeout(() => {
    updateAmbienceColor();
  }, 1e3);
  function togglePlaying() {
    isPlaying = !isPlaying;
  }
  Spicetify.Player.addEventListener("songchange", updateAmbienceColor);
  Spicetify.Player.addEventListener("onplaypause", togglePlaying);
  function setHighQualityCover() {
    const img = document.querySelector(".main-nowPlayingWidget-nowPlaying .cover-art img");
    if (img) {
      img.src = Spicetify.Player.data.item.metadata.image_xlarge_url;
    }
  }
  function hexToHSV(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      if (max === r)
        h = (g - b) / d % 6;
      else if (max === g)
        h = (b - r) / d + 2;
      else
        h = (r - g) / d + 4;
      h *= 60;
      if (h < 0)
        h += 360;
    }
    const s = max === 0 ? 0 : d / max;
    const v = max;
    return { h, s, v };
  }
  function hsvToHex(h, s, v) {
    s = Math.max(0, Math.min(1, s));
    v = Math.max(0, Math.min(1, v));
    const c = v * s;
    const x = c * (1 - Math.abs(h / 60 % 2 - 1));
    const m = v - c;
    let r = 0;
    let g = 0;
    let b = 0;
    if (h < 60)
      [r, g, b] = [c, x, 0];
    else if (h < 120)
      [r, g, b] = [x, c, 0];
    else if (h < 180)
      [r, g, b] = [0, c, x];
    else if (h < 240)
      [r, g, b] = [0, x, c];
    else if (h < 300)
      [r, g, b] = [x, 0, c];
    else
      [r, g, b] = [c, 0, x];
    const toHex = (value) => Math.round((value + m) * 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  function modifyHSV(hex, h = 0, s = 0, v = 0) {
    const hsv = hexToHSV(hex);
    hsv.h = (hsv.h + h) % 360;
    if (hsv.h < 0)
      hsv.h += 360;
    hsv.s = Math.max(0, Math.min(0.7, hsv.s + s));
    hsv.v = Math.max(0, Math.min(0.8, hsv.v + v));
    return hsvToHex(hsv.h, hsv.s, hsv.v);
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
      time += isPlaying ? CONFIG.animationSpeed : 0;
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
  var React = Spicetify.React;
  var ReactDOM = Spicetify.ReactDOM || window.ReactDOM;
  function hexToRgb(hex) {
    if (!hex)
      return { r: 30, g: 215, b: 96, a: 1 };
    hex = hex.replace("#", "");
    return {
      r: parseInt(hex.substring(0, 2), 16) || 0,
      g: parseInt(hex.substring(2, 4), 16) || 0,
      b: parseInt(hex.substring(4, 6), 16) || 0,
      a: 1
    };
  }
  var WAVE_CONFIG = {
    sensitivity: 1,
    friction: 0.85,
    tension: 0.08,
    brightness: 100,
    minBarHeight: 15,
    topCornerRadius: 15,
    bottomCornerRadius: 15,
    pixelsPerBar: 15,
    delayMs: 0,
    targetColorTop: null,
    targetColorBottom: null
  };
  function VisualizadorPro() {
    const canvasRef = React.useRef(null);
    const audioDataRef = React.useRef({ segments: [], beats: [], loudnessHistory: [] });
    const lastUriRef = React.useRef(null);
    const initialColors = React.useMemo(() => {
      const topHex = getComputedStyle(document.documentElement).getPropertyValue("--background-color-highlight").trim();
      const bottomHex = getComputedStyle(document.documentElement).getPropertyValue("--background-color-dark").trim();
      return { top: hexToRgb(topHex), bottom: hexToRgb(bottomHex) };
    }, []);
    const currentColorBotRef = React.useRef(__spreadValues({}, initialColors.bottom));
    const currentColorTopRef = React.useRef(__spreadValues({}, initialColors.top));
    const targetColorBotRef = React.useRef(
      WAVE_CONFIG.targetColorBottom ? __spreadValues({}, WAVE_CONFIG.targetColorBottom) : __spreadValues({}, initialColors.bottom)
    );
    const targetColorTopRef = React.useRef(
      WAVE_CONFIG.targetColorTop ? __spreadValues({}, WAVE_CONFIG.targetColorTop) : __spreadValues({}, initialColors.top)
    );
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
    const lerpColor = (c, t, p) => ({
      r: c.r + (t.r - c.r) * p,
      g: c.g + (t.g - c.g) * p,
      b: c.b + (t.b - c.b) * p,
      a: c.a + (t.a - c.a) * p
    });
    const fetchAudioData = async () => {
      var _a;
      try {
        const item = (_a = Spicetify.Player.data) == null ? void 0 : _a.item;
        if (!item)
          return;
        const data = await Spicetify.getAudioData(item.uri);
        audioDataRef.current = data ? {
          segments: data.segments || [],
          beats: data.beats || [],
          loudnessHistory: []
        } : { segments: [], beats: [], loudnessHistory: [] };
        lastUriRef.current = item.uri;
      } catch (e) {
        audioDataRef.current = { segments: [], beats: [], loudnessHistory: [] };
      }
    };
    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas)
        return;
      const ctx = canvas.getContext("2d", { alpha: true });
      let animationId;
      let lastT = performance.now();
      let internalClock = 0;
      let lastP = 0;
      let colorTransitionProgress = 1;
      let bars = 1;
      let heights = new Array(bars).fill(0);
      let velocities = new Array(bars).fill(0);
      let smoothVolume = 0;
      let smoothPitches = new Array(12).fill(0);
      fetchAudioData();
      const onSongChange = () => {
        internalClock = 0;
        lastP = 0;
        colorTransitionProgress = 0;
        fetchAudioData();
      };
      Spicetify.Player.addEventListener("songchange", onSongChange);
      const renderLoop = (now) => {
        var _a, _b;
        if (!(canvas == null ? void 0 : canvas.parentElement)) {
          animationId = requestAnimationFrame(renderLoop);
          return;
        }
        const currentUri = (_b = (_a = Spicetify.Player.data) == null ? void 0 : _a.item) == null ? void 0 : _b.uri;
        if (currentUri && currentUri !== lastUriRef.current) {
          fetchAudioData();
        }
        const parent = canvas.parentElement;
        const logicalWidth = parent.clientWidth * 0.9;
        const logicalHeight = Math.max(0, parent.clientHeight - 20);
        if (logicalWidth <= 0 || logicalHeight <= 0) {
          animationId = requestAnimationFrame(renderLoop);
          return;
        }
        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== logicalWidth * dpr || canvas.height !== logicalHeight * dpr) {
          canvas.width = logicalWidth * dpr;
          canvas.height = logicalHeight * dpr;
        }
        canvas.style.width = logicalWidth + "px";
        canvas.style.height = logicalHeight + "px";
        canvas.style.position = "absolute";
        canvas.style.left = "50%";
        canvas.style.bottom = "20px";
        canvas.style.transform = "translateX(-50%)";
        canvas.style.margin = "0";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, logicalWidth, logicalHeight);
        const newBars = Math.max(1, Math.floor(logicalWidth / WAVE_CONFIG.pixelsPerBar));
        if (newBars !== bars) {
          bars = newBars;
          heights = new Array(bars).fill(WAVE_CONFIG.minBarHeight);
          velocities = new Array(bars).fill(0);
        }
        if (WAVE_CONFIG.targetColorTop) {
          targetColorTopRef.current = __spreadValues({}, WAVE_CONFIG.targetColorTop);
        } else {
          const cssTop = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue("--background-color-highlight").trim());
          if (cssTop.r !== targetColorTopRef.current.r || cssTop.g !== targetColorTopRef.current.g || cssTop.b !== targetColorTopRef.current.b) {
            targetColorTopRef.current = cssTop;
            colorTransitionProgress = 0;
          }
        }
        if (WAVE_CONFIG.targetColorBottom) {
          targetColorBotRef.current = __spreadValues({}, WAVE_CONFIG.targetColorBottom);
        } else {
          const cssBot = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue("--current-ambience-color").trim());
          if (cssBot.r !== targetColorBotRef.current.r || cssBot.g !== targetColorBotRef.current.g || cssBot.b !== targetColorBotRef.current.b) {
            targetColorBotRef.current = cssBot;
            colorTransitionProgress = 0;
          }
        }
        const { segments } = audioDataRef.current;
        const pProg = (Spicetify.Player.getProgress() || 0) / 1e3;
        const dt = Math.min((now - lastT) / 1e3, 0.05);
        lastT = now;
        if (Math.abs(pProg - lastP) > 0.3) {
          internalClock = pProg;
        } else if (pProg !== lastP) {
          internalClock += (pProg - internalClock) * 0.35;
        } else if (isPlaying) {
          internalClock += dt;
        }
        lastP = pProg;
        const exactTime = internalClock + WAVE_CONFIG.delayMs / 1e3;
        let targetPitches = new Array(12).fill(0);
        let targetVolume = 0;
        if (isPlaying && segments && segments.length > 0 && exactTime >= 0) {
          const sIdx = segments.findIndex((s) => exactTime >= s.start && exactTime < s.start + s.duration);
          if (sIdx !== -1) {
            const s1 = segments[sIdx];
            const s2 = segments[sIdx + 1] || s1;
            const progress = Math.max(0, Math.min(1, (exactTime - s1.start) / Math.max(s1.duration, 1e-3)));
            const ease = easeInOutCubic(progress);
            const p1 = s1.pitches || new Array(12).fill(0);
            const p2 = s2.pitches || p1;
            for (let i = 0; i < 12; i++) {
              targetPitches[i] = Math.max(0, p1[i] + (p2[i] - p1[i]) * ease);
            }
            const loudness = Math.max(0, Math.min(1, (s1.loudness_max + 60) / 60));
            targetVolume = Math.pow(loudness, 0.65);
          }
        }
        const volumeSpeed = targetVolume > smoothVolume ? 14 : 5;
        smoothVolume += (targetVolume - smoothVolume) * (1 - Math.exp(-dt * volumeSpeed));
        for (let i = 0; i < 12; i++) {
          const speed = targetPitches[i] > smoothPitches[i] ? 16 : 7;
          smoothPitches[i] += (targetPitches[i] - smoothPitches[i]) * (1 - Math.exp(-dt * speed));
        }
        colorTransitionProgress = Math.min(1, colorTransitionProgress + dt * 0.5);
        const colorEase = easeInOutSine(colorTransitionProgress);
        currentColorBotRef.current = lerpColor(currentColorBotRef.current, targetColorBotRef.current, colorEase);
        currentColorTopRef.current = lerpColor(currentColorTopRef.current, targetColorTopRef.current, colorEase);
        const cBot = currentColorBotRef.current;
        const cTop = currentColorTopRef.current;
        const finalTopR = Math.min(255, cTop.r + WAVE_CONFIG.brightness);
        const finalTopG = Math.min(255, cTop.g + WAVE_CONFIG.brightness);
        const finalTopB = Math.min(255, cTop.b + WAVE_CONFIG.brightness);
        const grad = ctx.createLinearGradient(0, 0, 0, logicalHeight);
        grad.addColorStop(0, `rgba(${finalTopR}, ${finalTopG}, ${finalTopB}, ${cTop.a})`);
        grad.addColorStop(1, `rgba(${cBot.r}, ${cBot.g}, ${cBot.b}, ${cBot.a})`);
        ctx.fillStyle = grad;
        ctx.shadowBlur = 0;
        const barWidth = logicalWidth / bars;
        for (let i = 0; i < bars; i++) {
          const normalized = i / (bars - 1);
          const pitchPosition = normalized * 11;
          const left = Math.floor(pitchPosition);
          const right = Math.min(11, left + 1);
          const mix = pitchPosition - left;
          const easedMix = easeInOutQuad(mix);
          const pitch = smoothPitches[left] * (1 - easedMix) + smoothPitches[right] * easedMix;
          const frequencyShape = 1 - Math.abs(normalized - 0.5) * 0.15;
          const targetHeight = pitch * smoothVolume * logicalHeight * frequencyShape * WAVE_CONFIG.sensitivity;
          const clampedTarget = Math.max(WAVE_CONFIG.minBarHeight, Math.min(logicalHeight, targetHeight));
          const spring = WAVE_CONFIG.tension;
          const damping = WAVE_CONFIG.friction;
          velocities[i] += (clampedTarget - heights[i]) * spring * dt * 60;
          velocities[i] *= Math.pow(damping, dt * 60);
          heights[i] += velocities[i] * dt * 60;
          if (heights[i] < WAVE_CONFIG.minBarHeight) {
            heights[i] = WAVE_CONFIG.minBarHeight;
            velocities[i] = 0;
          }
          if (heights[i] > logicalHeight) {
            heights[i] = logicalHeight;
            velocities[i] = 0;
          }
          const finalHeight = Math.min(logicalHeight, Math.max(WAVE_CONFIG.minBarHeight, heights[i]));
          const x = i * barWidth;
          const y = logicalHeight - finalHeight;
          const barDrawWidth = Math.max(1, barWidth - 3);
          const topRadius = Math.min(WAVE_CONFIG.topCornerRadius, barDrawWidth / 2, finalHeight / 2);
          const bottomRadius = Math.min(WAVE_CONFIG.bottomCornerRadius, barDrawWidth / 2, finalHeight / 2);
          ctx.beginPath();
          ctx.roundRect(x, y, barDrawWidth, finalHeight, [topRadius, topRadius, bottomRadius, bottomRadius]);
          ctx.fill();
        }
        animationId = requestAnimationFrame(renderLoop);
      };
      animationId = requestAnimationFrame(renderLoop);
      return () => {
        cancelAnimationFrame(animationId);
        Spicetify.Player.removeEventListener("songchange", onSongChange);
      };
    }, []);
    return React.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "hidden",
          pointerEvents: "none"
        }
      },
      React.createElement("canvas", {
        ref: canvasRef,
        style: { display: "block" }
      })
    );
  }
  var createButton = () => {
    const sideButtonContainer = document.querySelector(".Root__now-playing-bar .main-nowPlayingBar-extraControls");
    if (!sideButtonContainer || sideButtonContainer.querySelector('[aria-label="Ceye Waves Btn"]'))
      return;
    const button = document.createElement("button");
    button.className = "main-genericButton-button l-player-btn";
    button.setAttribute("aria-label", "Ceye Waves Btn");
    const wrapper = document.createElement("span");
    wrapper.className = "l-player-btn__wrapper";
    wrapper.innerHTML = `
        <svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 10v3"></path><path d="M6 6v11"></path><path d="M10 3v18"></path><path d="M14 8v7"></path><path d="M18 5v13"></path><path d="M22 10v3"></path>
        </svg>`;
    button.appendChild(wrapper);
    button.addEventListener("click", () => {
      const container2 = document.querySelector(".main-nowPlayingBar-nowPlayingBar");
      if (!container2)
        return;
      const existing = container2.querySelector(".ceye-waves-canvas");
      if (existing) {
        existing.style.transition = "height 0.5s ease, opacity 0.5s ease";
        existing.style.height = "0";
        existing.style.opacity = "0";
        const onTransitionEnd = () => {
          if (existing._reactRoot) {
            if (existing._reactRoot.unmount)
              existing._reactRoot.unmount();
            else if (ReactDOM.unmountComponentAtNode)
              ReactDOM.unmountComponentAtNode(existing);
          }
          existing.remove();
          existing.removeEventListener("transitionend", onTransitionEnd);
        };
        existing.addEventListener("transitionend", onTransitionEnd);
        button.classList.remove("main-genericButton-buttonActive", "main-genericButton-buttonActiveDot");
        return;
      }
      const visualizerWrapper = document.createElement("div");
      visualizerWrapper.className = "ceye-waves-canvas";
      visualizerWrapper.style.width = "100%";
      visualizerWrapper.style.height = "0";
      visualizerWrapper.style.overflow = "hidden";
      visualizerWrapper.style.position = "relative";
      visualizerWrapper.style.opacity = "0";
      visualizerWrapper.style.transition = "height 0.5s ease, opacity 0.5s ease";
      let reactRoot;
      if (ReactDOM.createRoot) {
        reactRoot = ReactDOM.createRoot(visualizerWrapper);
        reactRoot.render(React.createElement(VisualizadorPro));
      } else if (ReactDOM.render) {
        ReactDOM.render(React.createElement(VisualizadorPro), visualizerWrapper);
        reactRoot = { unmount: () => ReactDOM.unmountComponentAtNode(visualizerWrapper) };
      } else {
        console.error("ReactDOM nicht verf\xFCgbar");
        return;
      }
      visualizerWrapper._reactRoot = reactRoot;
      container2.appendChild(visualizerWrapper);
      const targetHeight = Math.max(container2.clientWidth / 4, 100);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          visualizerWrapper.style.height = targetHeight + "px";
          visualizerWrapper.style.opacity = "1";
        });
      });
      button.classList.add("main-genericButton-buttonActive", "main-genericButton-buttonActiveDot");
    });
    const miniplayer = sideButtonContainer.querySelector('[aria-label="Open Miniplayer"]');
    if (miniplayer)
      sideButtonContainer.insertBefore(button, miniplayer);
    else
      sideButtonContainer.appendChild(button);
  };
  createButton();
  var observer4 = new MutationObserver(createButton);
  observer4.observe(document.body, { childList: true, subtree: true });
  var fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17V5h10v8"></path><circle cx="7" cy="18" r="2"></circle><circle cx="17" cy="14" r="2"></circle></svg>`;
  var currentQueueUid = null;
  var getNextTrack = () => {
    const queueTrack = Spicetify.Queue.nextTracks[0];
    return (queueTrack == null ? void 0 : queueTrack.contextTrack) || null;
  };
  var updateNextTrack = (box, animate = true) => {
    var _a, _b;
    const track = getNextTrack();
    if (!track) {
      currentQueueUid = null;
      const cover2 = box.querySelector(".ceye-next-track-cover");
      const title2 = box.querySelector(".ceye-next-track-title");
      if (animate) {
        box.style.opacity = "0";
        box.style.transform = "translateY(4px)";
      }
      setTimeout(() => {
        if (!box.isConnected)
          return;
        cover2.innerHTML = fallbackSvg;
        if (cover2.firstElementChild) {
          cover2.firstElementChild.style.width = "28px";
          cover2.firstElementChild.style.height = "28px";
        }
        title2.textContent = "No track in queue";
        if (animate) {
          requestAnimationFrame(() => {
            box.style.opacity = "1";
            box.style.transform = "translateY(0)";
          });
        }
      }, animate ? 180 : 0);
      return;
    }
    const uid = (_b = (_a = Spicetify.Queue.nextTracks[0]) == null ? void 0 : _a.contextTrack) == null ? void 0 : _b.uid;
    if (uid === currentQueueUid)
      return;
    currentQueueUid = uid;
    const metadata = track.metadata;
    const imageUrl = (metadata == null ? void 0 : metadata.image_xlarge_url) || (metadata == null ? void 0 : metadata.image_large_url) || (metadata == null ? void 0 : metadata.image_url) || (metadata == null ? void 0 : metadata.image_small_url);
    const titleText = (metadata == null ? void 0 : metadata.title) || "Unknown track";
    const cover = box.querySelector(".ceye-next-track-cover");
    const title = box.querySelector(".ceye-next-track-title");
    const applyTrack = () => {
      if (!box.isConnected)
        return;
      title.textContent = titleText;
      cover.innerHTML = "";
      if (imageUrl) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.style.display = "block";
        cover.appendChild(img);
      } else {
        cover.innerHTML = fallbackSvg;
        if (cover.firstElementChild) {
          cover.firstElementChild.style.width = "28px";
          cover.firstElementChild.style.height = "28px";
        }
      }
      if (animate) {
        requestAnimationFrame(() => {
          box.style.opacity = "1";
          box.style.transform = "translateY(0)";
        });
      }
    };
    if (!animate) {
      applyTrack();
      return;
    }
    box.style.opacity = "0";
    box.style.transform = "translateY(4px)";
    setTimeout(applyTrack, 180);
  };
  var closeBox = (box, button) => {
    box.style.height = "0px";
    box.style.opacity = "0";
    box.style.transform = "translateY(4px)";
    button.classList.remove(
      "main-genericButton-buttonActive",
      "main-genericButton-buttonActiveDot"
    );
    const remove = () => {
      if (box.isConnected) {
        box.remove();
      }
    };
    box.addEventListener("transitionend", remove, { once: true });
    setTimeout(remove, 600);
  };
  var createNextTrackButton = () => {
    const sideButtonContainer = document.querySelector(
      ".Root__now-playing-bar .main-nowPlayingBar-extraControls"
    );
    if (!sideButtonContainer || sideButtonContainer.querySelector('[aria-label="Ceye Next Track Btn"]')) {
      return;
    }
    const button = document.createElement("button");
    button.className = "main-genericButton-button l-player-btn";
    button.setAttribute("aria-label", "Ceye Next Track Btn");
    const wrapper = document.createElement("span");
    wrapper.className = "l-player-btn__wrapper";
    wrapper.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M5 4v16"></path>
            <path d="M9 5l8 7-8 7V5z"></path>
            <path d="M20 5v14"></path>
        </svg>
    `;
    button.appendChild(wrapper);
    button.addEventListener("click", () => {
      const container2 = document.querySelector(
        ".main-nowPlayingBar-nowPlayingBar"
      );
      if (!container2)
        return;
      const existing = container2.querySelector(".ceye-next-track-box");
      if (existing) {
        closeBox(existing, button);
        return;
      }
      const box = document.createElement("div");
      box.className = "ceye-next-track-box";
      box.style.width = "100%";
      box.style.height = "0px";
      box.style.opacity = "0";
      box.style.overflow = "hidden";
      box.style.position = "relative";
      box.style.transform = "translateY(4px)";
      box.style.transition = "height 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
      const content = document.createElement("div");
      content.style.height = "68px";
      content.style.boxSizing = "border-box";
      content.style.display = "flex";
      content.style.alignItems = "center";
      content.style.gap = "12px";
      content.style.padding = "0px 16px 10px 16px";
      content.style.color = "var(--spice-text)";
      const cover = document.createElement("div");
      cover.className = "ceye-next-track-cover";
      cover.style.width = "48px";
      cover.style.height = "48px";
      cover.style.minWidth = "48px";
      cover.style.borderRadius = "6px";
      cover.style.overflow = "hidden";
      cover.style.display = "flex";
      cover.style.alignItems = "center";
      cover.style.justifyContent = "center";
      cover.style.background = "rgba(255,255,255,0.08)";
      const text = document.createElement("div");
      text.style.minWidth = "0";
      text.style.display = "flex";
      text.style.flexDirection = "column";
      text.style.justifyContent = "center";
      text.style.gap = "2px";
      const nextUp = document.createElement("div");
      nextUp.textContent = "next up:";
      nextUp.style.fontSize = "10px";
      nextUp.style.fontWeight = "600";
      nextUp.style.opacity = "0.5";
      nextUp.style.lineHeight = "12px";
      nextUp.style.letterSpacing = "0.2px";
      const title = document.createElement("div");
      title.className = "ceye-next-track-title";
      title.style.fontSize = "18px";
      title.style.fontWeight = "700";
      title.style.whiteSpace = "nowrap";
      title.style.overflow = "hidden";
      title.style.textOverflow = "ellipsis";
      title.style.lineHeight = "18px";
      text.appendChild(nextUp);
      text.appendChild(title);
      content.appendChild(cover);
      content.appendChild(text);
      box.appendChild(content);
      container2.appendChild(box);
      currentQueueUid = null;
      updateNextTrack(box, false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          box.style.height = "68px";
          box.style.opacity = "1";
          box.style.transform = "translateY(0)";
        });
      });
      button.classList.add(
        "main-genericButton-buttonActive",
        "main-genericButton-buttonActiveDot"
      );
    });
    const wavesButton = sideButtonContainer.querySelector(
      '[aria-label="Ceye Waves Btn"]'
    );
    const miniplayer = sideButtonContainer.querySelector(
      '[aria-label="Open Miniplayer"]'
    );
    if (wavesButton) {
      sideButtonContainer.insertBefore(button, wavesButton.nextSibling);
    } else if (miniplayer) {
      sideButtonContainer.insertBefore(button, miniplayer);
    } else {
      sideButtonContainer.appendChild(button);
    }
  };
  createNextTrackButton();
  var observer5 = new MutationObserver(() => {
    createNextTrackButton();
    const box = document.querySelector(".ceye-next-track-box");
    if (box) {
      updateNextTrack(box);
    }
  });
  observer5.observe(document.body, {
    childList: true,
    subtree: true
  });

  // ../../../../../private/var/folders/sw/v8f4vn6s70j30y4lprsdg7cw0000gn/T/spicetify-creator/index.jsx
  (async () => {
    await app_default();
  })();
})();
(async () => {
    if (!document.getElementById(`ceyecetify`)) {
      var el = document.createElement('style');
      el.id = `ceyecetify`;
      el.textContent = (String.raw`
  /* ../../../../../private/var/folders/sw/v8f4vn6s70j30y4lprsdg7cw0000gn/T/tmp-1336-bSCejIF15lwZ/1a06f1c848b76/style.css */
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
#global-nav-bar {
  height: 60px !important;
  padding: 0 !important;
}
#global-nav-bar .spicetify-sc-scroller {
  width: 60px !important;
  height: 60px !important;
  padding-left: 5px;
}
#global-nav-bar [aria-label=Marketplace],
#global-nav-bar [aria-label=Home],
#global-nav-bar button:has(.main-avatar-image) {
  background-color: var(--almost-empty) !important;
  width: 50px !important;
  height: 50px !important;
  border: solid 3px rgba(255, 255, 255, 0.5);
  margin-bottom: 0px;
  transition: all 0.3s ease;
}
#global-nav-bar [aria-label=Marketplace]:hover,
#global-nav-bar [aria-label=Home]:hover,
#global-nav-bar button:has(.main-avatar-image):hover {
  border: solid 3px white;
  transform: scale(1.1) !important;
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
  transition: all 0.3s ease !important;
  transform: scale(1);
}
.main-globalNav-searchInputSection:hover .main-topBar-searchBar {
  border: solid 3px rgba(255, 255, 255, 0.75);
  transform: scale(1.01);
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
  padding: 4px !important;
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
.playlistRecommenderContainer [role=row] button {
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s ease;
}
.playlistRecommenderContainer [role=row]:hover button {
  opacity: 1;
  transform: scale(1);
}
.main-cardImage-imageWrapper {
  border-radius: var(--big-card-radius);
  transition: all 1s ease;
  background-color: var(--current-ambience-color-dark) !important;
}
.main-cardImage-imageWrapper .main-image-image {
  border-radius: var(--big-card-radius);
  transition: all 0.2s ease;
  transform: scale(0.95);
}
.main-cardImage-imageWrapper {
  box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease !important;
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
  transform: scale(0.95);
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
.tsCJQaqF4ALEqTft .main-actionBar-ActionBarRow [aria-haspopup=menu] {
  display: none !important;
}
.artist-artistDiscography-headerContainer {
  background-color: var(--empty) !important;
  margin-bottom: 0;
}
.main-actionBar-ActionBarContainer .main-shelf-shelf.Shelf {
  padding-bottom: 10px !important;
}
.main-actionBar-ActionBarContainer .main-shelf-shelf.Shelf .e-10810-legacy-list-row__header {
  justify-content: center;
}
[aria-label=Discography] > :nth-child(2) > div {
  justify-content: center;
}
.tsCJQaqF4ALEqTft .main-gridContainer-gridContainerMargin > :nth-child(1) {
  width: 100% !important;
  position: relative;
  grid-column: 1 / -1;
}
.x-explicit-label {
  display: none !important;
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
#search-dropdown [data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYScroll"] > :nth-child(1) {
  display: none !important;
}
#search-dropdown [data-encore-id=listRow] button[aria-label=More] {
  display: none;
}
#search-dropdown [data-encore-id=listRow] .x-entityImage-imageContainer,
#search-dropdown [data-encore-id=listRow] .PQMaFYfZyRAAMjIZ {
  background-color: var(--empty) !important;
}
#search-dropdown span:has(> span > .x-explicit-icon) {
  display: none !important;
}
.HOf9H18Ya0DkJ4_K {
  background-color: transparent !important;
  position: relative;
}
.HOf9H18Ya0DkJ4_K .search-searchCategory-contentArea {
  margin: auto !important;
}
#search-dropdown .main-actionBar-ActionBarContainer {
  background-color: var(--current-ambience-color-transparent) !important;
  border: 2px solid white;
  border-radius: 16px;
  transition: all 500ms ease;
  backdrop-filter: blur(15px) brightness(30%);
  animation: search-dropdown-intro alternate 0.3s;
}
@keyframes search-dropdown-intro {
  0% {
    opacity: 0;
    transform: scaleX(0.75) scaleY(0.25);
    backdrop-filter: blur(0px) brightness(100%);
  }
  65% {
    transform: scaleX(1.05) scaleY(1.05);
    backdrop-filter: blur(15px) brightness(30%);
  }
  100% {
    opacity: 1;
    transform: scaleX(1) scaleY(1);
  }
}
#search-dropdown [data-encore-id=listRow] {
  background-color: var(--empty) !important;
  transform: scale(0.95);
  transition: all 0.2s ease;
  border: solid 1px;
  border-color: var(--empty);
}
#search-dropdown [data-encore-id=listRow]:hover {
  background-color: var(--current-ambience-color) !important;
  transform: scale(1);
  border-color: white;
  transition:
    all 0.5s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}
#search-dropdown [data-encore-id=listRow] .e-10810-legacy-list-row__header button {
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s ease;
}
#search-dropdown [data-encore-id=listRow]:hover .e-10810-legacy-list-row__header button {
  opacity: 1;
  transform: scale(1);
}
#search-dropdown [data-encore-id=listRow] a:hover {
  text-decoration: none !important;
}
#search-dropdown [data-encore-id=listRow] .gQsOCrC4O3kYXib2 {
  transition: all 0.3s ease;
}
#search-dropdown [data-encore-id=listRow] .gQsOCrC4O3kYXib2 svg {
  transform: scale(0.5);
  opacity: 0;
  transition: all 0.2s ease;
}
#search-dropdown [data-encore-id=listRow]:hover .gQsOCrC4O3kYXib2 svg {
  transform: scale(1);
  opacity: 1;
}
#search-dropdown [data-encore-id=listRow]:has([data-encore-id="listRowSubtitle"]) [data-encore-id=listRowTitle] {
  transform: translateY(10px);
  transition: all 0.2s ease;
}
#search-dropdown [data-encore-id=listRow]:has([data-encore-id="listRowSubtitle"]):hover [data-encore-id=listRowTitle] {
  transform: translateY(0);
}
#search-dropdown [data-encore-id=listRow] [data-encore-id=listRowSubtitle] {
  transform: scale(0.9);
  opacity: 0;
  transition: all 0.2s ease;
}
#search-dropdown [data-encore-id=listRow]:hover [data-encore-id=listRowSubtitle] {
  transform: scale(1);
  opacity: 1;
}
#searchPage .search-searchCategory-contentArea::after,
#searchPage .search-searchCategory-contentArea::before {
  background-image: none !important;
}
.main-trackList-trackListRow.main-trackList-trackListRowGrid [aria-haspopup=menu] {
  display: none;
}
.main-trackList-trackListRow.main-trackList-trackListRowGrid button:is([aria-label="Add to Liked Songs"], [aria-label="Add to playlist"]) {
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s ease;
}
.main-trackList-trackListRow.main-trackList-trackListRowGrid:hover button:is([aria-label="Add to Liked Songs"], [aria-label="Add to playlist"]) {
  opacity: 1;
  transform: scale(1);
}
.main-trackList-trackListHeader {
  top: 0 !important;
  border-radius: 8px;
  background-color: transparent !important;
  transition: all 0.3s ease;
}
.main-trackList-trackListHeader.Ltz8hFoxXpck1XAk {
  background-color: var(--current-ambience-color-dark) !important;
  box-shadow: none !important;
}
.main-trackList-trackListRow.main-trackList-trackListRowGrid span:has(> span[aria-label="Explicit"]) {
  display: none !important;
}
.main-trackList-trackListRow.main-trackList-trackListRowGrid {
  background-color: var(--empty) !important;
  transform: scale(0.975);
  transition: all 0.2s ease;
  border: solid 1px;
  border-color: var(--empty);
}
.main-trackList-trackListRow.main-trackList-trackListRowGrid:hover {
  background-color: var(--current-ambience-color) !important;
  transform: scale(1);
  border-color: white;
  transition:
    all 0.5s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
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
.search-searchCategory-carouselButton {
  background-color: var(--almost-empty) !important;
  border: solid 2px rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease !important;
}
.search-searchCategory-carouselButton:hover {
  border: solid 2px white;
  transform: scale(1.25) !important;
}
.search-searchCategory-carouselButton:active {
  border: solid 2px rgba(255, 255, 255, 0.75);
  transform: scale(1.1) !important;
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
.main-home-content .search-searchCategory-contentArea::before {
  background-image: none !important;
}
.main-home-content [data-shelf=carousel] .e-10810-legacy-list-row__header-side img {
  display: none !important;
}
.search-searchCategory-categoryGrid [data-carousel-item=true]:has([aria-label="Music \2014  Following"]) {
  display: none !important;
}
.main-home-content .C8qLX8lOHwAx63FP.bKWw7XkMnYJ6al1a {
  display: none !important;
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
  min-height: 0px;
  max-height: 65px;
  transition: all 0.3s ease;
}
:has(#Desktop_PanelContainer_Id[aria-label="Queue"]) .Root__right-sidebar {
  max-height: calc(100% - 8px) !important;
}
:has(#Desktop_PanelContainer_Id[aria-label="Connect to a device"]) .Root__right-sidebar {
  max-height: calc(100% - 8px) !important;
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
  transition: all 0.3s ease;
}
.main-nowPlayingView-container:has(:is([aria-label="Connect to a device"], [aria-label="Queue"])) [aria-label="Now playing view"] .main-nowPlayingView-headerTextWrapper h1 {
  opacity: 0;
}
[aria-label="Connect to a device"] .main-nowPlayingView-headerTextWrapper h1 {
  font-size: 22px;
}
[aria-label="Connect to a device"] .main-nowPlayingView-headerTextWrapper {
  justify-items: center !important;
}
[aria-label="Connect to a device"] a:is([href="https://support.spotify.com/article/spotify-connect/"], [href="https://www.spotify.com/connect?utm_campaign=connect&utm_medium=app&utm_source=desktop"]) {
  display: none !important;
}
[aria-label="Connect to a device"] .os-scrollbar {
  display: none !important;
}
.main-nowPlayingView-headerContainer {
  box-shadow: none !important;
}
[aria-label="Connect to a device"] [aria-label="Current device"] {
  background-color: var(--almost-empty) !important;
  border: solid 3px rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  transition: all 0.2s ease;
  transform: scale(0.95);
}
[aria-label="Connect to a device"] [aria-label="Current device"]:hover {
  background-color: var(--current-ambience-color) !important;
  border: solid 3px white;
  transform: scale(1);
}
[aria-label="Connect to a device"] [aria-label="Current device"]:hover > :nth-child(1) {
  background-color: transparent !important;
}
.Root__right-sidebar::before {
  border-radius: 8px;
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0;
  background-image: linear-gradient(to top, #00000040 0%, #00000020 25%, transparent 100%);
  transition: all 0.3s ease;
}
.Root__right-sidebar:has(:is([aria-label="Connect to a device"], [aria-label="Queue"]))::before {
  opacity: 1;
}
.wskqaMF_9vIdCfEN.qniLkpbkE7Y8nGFS {
  display: none;
}
[aria-label=Queue] :is([aria-label="Next up"], [aria-label="Now playing"], [aria-label="Next in queue"]) > div li > div::after,
[aria-label=Queue] [aria-label="Recently played"] li > div::after {
  inset: 0;
  width: auto !important;
  height: auto !important;
  background-color: var(--empty) !important;
  transition: all 0.2s ease;
  border: solid 1px transparent;
  transform: scale(0.95);
}
[aria-label=Queue] :is([aria-label="Next up"], [aria-label="Now playing"], [aria-label="Next in queue"]) > div li > div:hover::after,
[aria-label=Queue] [aria-label="Recently played"] li > div:hover::after {
  background-color: var(--current-ambience-color) !important;
  border-color: white;
  transform: scale(1);
}
[aria-label=Queue] :is([aria-label="Next up"], [aria-label="Now playing"], [aria-label="Next in queue"]) > div li > div,
[aria-label=Queue] [aria-label="Recently played"] li > div {
  transition: all 0.2s ease;
  transform: scale(0.95);
}
[aria-label=Queue] :is([aria-label="Next up"], [aria-label="Now playing"], [aria-label="Next in queue"]) > div li > div:hover,
[aria-label=Queue] [aria-label="Recently played"] li > div:hover {
  transform: scale(1);
}
[aria-label=Queue] button[aria-haspopup=menu] {
  display: none;
}
#queue-panel h2 {
  font-size: 20px;
}
#queue-panel .vdNj5Kuby0wJApMc {
  justify-content: left !important;
}
[aria-label=Queue] .main-nowPlayingView-headerWrapper {
  justify-content: center !important;
}
[aria-label=Queue] .main-nowPlayingView-headerWrapper button {
  background-color: var(--empty) !important;
  font-size: 20px;
}
.Root__right-sidebar span:has(> span > span > .x-explicit-icon) {
  display: none !important;
}
[aria-label=Queue] :is([aria-label="Next up"], [aria-label="Now playing"], [aria-label="Next in queue"], [aria-label="Recently played"]) .znTd53DrNIcJnJvv.K7NGZRkvXDE1F7Qp {
  transition: all 0.3s ease;
}
[aria-label=Queue] :is([aria-label="Next up"], [aria-label="Now playing"], [aria-label="Next in queue"], [aria-label="Recently played"]) .main-playButton-PlayButton svg {
  transform: scale(0.5);
  opacity: 0;
  transition: all 0.2s ease;
}
[aria-label=Queue] :is([aria-label="Next up"], [aria-label="Now playing"], [aria-label="Next in queue"], [aria-label="Recently played"]) li > div:hover .main-playButton-PlayButton svg {
  transform: scale(1);
  opacity: 1;
}
[aria-label=Queue] :is([aria-label="Next up"], [aria-label="Now playing"], [aria-label="Next in queue"], [aria-label="Recently played"]) li > div [data-encore-id=listRowTitle] {
  transform: translateY(10px);
  transition: all 0.2s ease;
}
[aria-label=Queue] :is([aria-label="Next up"], [aria-label="Now playing"], [aria-label="Next in queue"], [aria-label="Recently played"]) li > div:hover [data-encore-id=listRowTitle] {
  transform: translateY(0);
}
[aria-label=Queue] :is([aria-label="Next up"], [aria-label="Now playing"], [aria-label="Next in queue"], [aria-label="Recently played"]) li > div [data-encore-id=listRowSubtitle] {
  transform: scale(0.9);
  opacity: 0;
  transition: all 0.2s ease;
}
[aria-label=Queue] :is([aria-label="Next up"], [aria-label="Now playing"], [aria-label="Next in queue"], [aria-label="Recently played"]) li > div:hover [data-encore-id=listRowSubtitle] {
  transform: scale(1);
  opacity: 1;
}
body:not(:has(.fullscreen-content)) .lucid-background {
  display: none !important;
}
body:not(:has(.fullscreen-content)) #lucid-page {
  background-image: linear-gradient(var(--empty) 0%, var(--almost-empty) 25%, var(--almost-empty) 75%, var(--empty) 100%);
}
.tippy-trigger:has(.lucide-maximize) {
  display: none !important;
}
.tippy-trigger:has([aria-label="Open Picture-in-Picture"]) {
  display: none !important;
}
.volume-slider-wrapper {
  display: none !important;
}
.player-widget__image-wrapper .player-widget__like-btn,
.player-widget__image-wrapper .player-widget__controls,
.player-widget__top-controls {
  display: none !important;
}
.widget-area:hover .player-widget__image-wrapper img {
  filter: blur(0px) !important;
}
.player-widget__info {
  opacity: 1 !important;
}
[data-testid=progress-bar-handle] {
  display: block !important;
  opacity: 0;
  height: 2px;
  width: 2px;
  transition:
    opacity 0.3s ease,
    height 0.3s ease,
    width 0.3s ease !important;
}
:has([data-testid="progress-label"]) [data-testid=progress-bar-handle] {
  opacity: 1;
  height: 12px;
  width: 12px;
}
.x-progressBar-fillColor {
  transition: background-color 0.3s ease !important;
}
.x-progressBar-progressFillColor {
  display: block !important;
  opacity: 0;
  transition: opacity 0.75s ease !important;
}
:has([data-testid="progress-label"]) .x-progressBar-progressFillColor {
  opacity: 1;
}
.Root__now-playing-bar {
  margin: 0 4px 4px 4px;
  border-radius: 8px;
  background-image: linear-gradient(to bottom, #00000040 0%, #00000040 50%, transparent 100%);
  background-color: #00000000;
  transition: all 0.5s ease;
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
.main-nowPlayingWidget-actionButtonWrapper [aria-label="Hide in this album"],
.main-nowPlayingWidget-actionButtonWrapper [aria-label="Hide song"],
.main-nowPlayingWidget-actionButtonWrapper [aria-label="Hide in this playlist"] {
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
  pointer-events: none;
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
.Root__top-container {
  overflow-x: clip !important;
  overflow-y: hidden !important;
}
.main-connectBar-connected {
  justify-content: center !important;
  margin: 0 20px 10px 20px;
}
.cxqVoTTSQMxeQF9d {
  transform: scale(1);
  transition: all 0.3s ease;
}
.cxqVoTTSQMxeQF9d:hover {
  transform: scale(1.1);
}
.cxqVoTTSQMxeQF9d:active {
  transform: scale(0.95);
}
.cxqVoTTSQMxeQF9d img {
  transform: rotate(0) translateY(0px);
  width: 100%;
  height: 100%;
  filter: blur(2px) brightness(0.8);
  border: solid 5px transparent;
  border-radius: 17px;
  transition: all 0.3s ease;
}
.cxqVoTTSQMxeQF9d:hover img {
  filter: blur(4px) brightness(0.6);
  border: solid 50px transparent;
  transform: scale(1.5);
}
.cxqVoTTSQMxeQF9d > :nth-child(1) > :nth-child(1) {
  border-radius: 16px !important;
  outline: 2px solid transparent;
  transition: all 0.3s ease;
}
.cxqVoTTSQMxeQF9d:hover > :nth-child(1) > :nth-child(1) {
  outline: 2px solid white;
}
.cxqVoTTSQMxeQF9d .encore-text-title-small {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex !important;
  justify-content: center !important;
}
.cxqVoTTSQMxeQF9d .encore-text-title-small span {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: auto;
  transition: all 0.3s ease;
}
#context-menu .main-contextMenu-menuItem [aria-disabled=true] {
  display: none;
}

      `).trim();
      document.head.appendChild(el);
    }
  })()
      })();
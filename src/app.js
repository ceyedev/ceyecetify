import "./style.css";

async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  Spicetify.showNotification("ceyecetify loaded!");
}

export default main;


/* Prevent scrolling when in queue */
(() => {
    const lock = () => {
        const container = document.querySelector('.Root__top-container');

        if (!container || container.__scrollLocked) {
            return;
        }

        container.__scrollLocked = true;

        const scrollTo = container.scrollTo.bind(container);
        const scrollBy = container.scrollBy.bind(container);

        container.scrollTo = (...args) => {
            if (typeof args[0] === 'object') {
                return scrollTo({
                    ...args[0],
                    left: 0,
                    top: 0
                });
            }

            return scrollTo(0, 0);
        };

        container.scrollBy = () => {};

        container.addEventListener('scroll', () => {
            if (container.scrollLeft !== 0 || container.scrollTop !== 0) {
                container.scrollLeft = 0;
                container.scrollTop = 0;
            }
        }, { passive: true });

        container.scrollLeft = 0;
        container.scrollTop = 0;
    };

    const originalScrollIntoView = Element.prototype.scrollIntoView;

    Element.prototype.scrollIntoView = function(options) {
        if (this.closest?.('.Root__top-container')) {
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



/* Artist/Playlist big picture */
const observer = new MutationObserver(() => {
  const viewport = document.querySelector(
    '#main-view .main-view-container__scroll-node [data-overlayscrollbars-viewport]'
  );

  const target = document.querySelector(
    '#main-view .before-scroll-node > :nth-child(1) > :nth-child(1)'
  );

  if (!viewport || !target || target.dataset.scrollEffect) return;

  target.dataset.scrollEffect = 'true';

  const update = () => {
    const progress = Math.min(Math.max(viewport.scrollTop / 500, 0), 0.8);

    target.style.opacity = 1 - progress;
    target.style.filter = `blur(${progress * 15}px)`;
    target.style.transform = `scale(${1 + progress * 0.2})`;
  };

  viewport.addEventListener('scroll', update, { passive: true });
  update();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});









const clampToPalette = false;

const ambiencePalette = [
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

		const distance =
			Math.pow(rgb.r - paletteRgb.r, 2) +
			Math.pow(rgb.g - paletteRgb.g, 2) +
			Math.pow(rgb.b - paletteRgb.b, 2);

		if (distance < smallestDistance) {
			smallestDistance = distance;
			closestColor = color;
		}
	}

	return closestColor;
}

async function updateAmbienceColor() {
	console.log("[Ambience] Updating...");

	const track = Spicetify.Player.data?.item;

	if (!track) {
		console.log("[Ambience] No current track");
		return;
	}

	console.log("[Ambience] Track:", track.name);
	console.log("[Ambience] Artist:", track.artists?.map(artist => artist.name).join(", "));
	console.log("[Ambience] URI:", track.uri);

	const imageUrl =
		track.metadata?.image_small_url ||
		track.images?.[0]?.url ||
		track.album?.images?.[0]?.url;

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

			currentColor =
				"#" +
				[r, g, b]
					.map(value => Math.round(value).toString(16).padStart(2, "0"))
					.join("");

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

		/*root.style.setProperty("--background-color-dark", mixColors(currentColor, "#000000", 0.3));
        root.style.setProperty("--background-color-default", currentColor);
        root.style.setProperty("--background-color-highlight", mixColors(currentColor, "#ffffff", 0.3));*/

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
}, 1000);



let isPlaying = Spicetify.Player.isPlaying();
function togglePlaying() {
    isPlaying = !isPlaying;
}

Spicetify.Player.addEventListener("songchange", updateAmbienceColor);
Spicetify.Player.addEventListener("onplaypause", togglePlaying)

function setHighQualityCover() {
    const img = document.querySelector('.main-nowPlayingWidget-nowPlaying .cover-art img');

    if (img) {
        img.src = Spicetify.Player.data.item.metadata.image_xlarge_url;
    }
}



function mixColors(color1, color2, amount = 0.5) {
    const hexToRGB = hex => {
        hex = hex.replace("#", "");

        return {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16)
        };
    };

    const rgbToHex = ({ r, g, b }) =>
        `#${[r, g, b]
            .map(v => Math.round(v).toString(16).padStart(2, "0"))
            .join("")}`;

    const a = hexToRGB(color1);
    const b = hexToRGB(color2);

    return rgbToHex({
        r: a.r + (b.r - a.r) * amount,
        g: a.g + (b.g - a.g) * amount,
        b: a.b + (b.b - a.b) * amount
    });
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
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;

        h *= 60;
        if (h < 0) h += 360;
    }

    const s = max === 0 ? 0 : d / max;
    const v = max;

    return { h, s, v };
}

function hsvToHex(h, s, v) {
    s = Math.max(0, Math.min(1, s));
    v = Math.max(0, Math.min(1, v));

    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let r = 0;
    let g = 0;
    let b = 0;

    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    const toHex = value =>
        Math.round((value + m) * 255)
            .toString(16)
            .padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function modifyHSV(hex, h = 0, s = 0, v = 0) {
    const hsv = hexToHSV(hex);

    hsv.h = (hsv.h + h) % 360;
    if (hsv.h < 0) hsv.h += 360;

    hsv.s = Math.max(0, Math.min(0.7, hsv.s + s));
    hsv.v = Math.max(0, Math.min(0.8, hsv.v + v));

    return hsvToHex(hsv.h, hsv.s, hsv.v);
}










const PARENT_SELECTOR = ".Root__top-container";

const CONFIG = {
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

const container = document.querySelector(PARENT_SELECTOR);

if (container) {
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

    function getCssColor(variable) {
        return getComputedStyle(container)
            .getPropertyValue(variable)
            .trim();
    }

    function parseHexColor(color) {
        const value = color.replace("#", "").trim();

        if (!/^[0-9a-fA-F]{6}$/.test(value)) {
            console.log("[Dynamic Background] Ungültige Farbe:", color);
            return [0, 0, 0];
        }

        return [
            parseInt(value.slice(0, 2), 16),
            parseInt(value.slice(2, 4), 16),
            parseInt(value.slice(4, 6), 16)
        ];
    }

    function readPalette() {
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
    }

    function clonePalette(palette) {
        return {
            base: [...palette.base],
            dark: [...palette.dark],
            light: [...palette.light]
        };
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function lerpColor(current, target, amount) {
        current[0] += (target[0] - current[0]) * amount;
        current[1] += (target[1] - current[1]) * amount;
        current[2] += (target[2] - current[2]) * amount;
    }

    function smooth(t) {
        return t * t * (3 - 2 * t);
    }

    function hash(x, y) {
        const n =
            Math.sin(x * 127.1 + y * 311.7) *
            43758.5453;

        return n - Math.floor(n);
    }

    function noise(x, y) {
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
    }

    function fbm(x, y, t) {
        let value = 0;
        let amplitude = CONFIG.octavePersistence;

        for (let i = 0; i < CONFIG.noiseOctaves; i++) {
            value += noise(x, y) * amplitude;

            x =
                x * CONFIG.octaveLacunarity +
                t * CONFIG.octaveSpeedX;

            y =
                y * CONFIG.octaveLacunarity -
                t * CONFIG.octaveSpeedY;

            amplitude *= CONFIG.octavePersistence;
        }

        return value;
    }

    function resize() {
        const rect = container.getBoundingClientRect();

        const newWidth = Math.max(1, Math.ceil(rect.width));
        const newHeight = Math.max(1, Math.ceil(rect.height));

        if (
            newWidth === width &&
            newHeight === height
        ) {
            return;
        }

        const oldNoiseCanvas = document.createElement("canvas");
        oldNoiseCanvas.width = noiseCanvas.width;
        oldNoiseCanvas.height = noiseCanvas.height;

        if (
            noiseCanvas.width > 0 &&
            noiseCanvas.height > 0
        ) {
            oldNoiseCanvas
                .getContext("2d")
                .drawImage(noiseCanvas, 0, 0);
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

        if (
            oldNoiseCanvas.width > 0 &&
            oldNoiseCanvas.height > 0
        ) {
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
    }

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

    function updateColors() {
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
    }

    function draw() {
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

                const warpX =
                    noise(
                        nx * CONFIG.warpScale +
                        time * CONFIG.warpSpeedX,
                        ny * CONFIG.warpScale
                    ) * CONFIG.warpStrength;

                const warpY =
                    noise(
                        nx * CONFIG.warpScale,
                        ny * CONFIG.warpScale -
                        time * CONFIG.warpSpeedY
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

                data[i] =
                    from[0] +
                    (to[0] - from[0]) * t;

                data[i + 1] =
                    from[1] +
                    (to[1] - from[1]) * t;

                data[i + 2] =
                    from[2] +
                    (to[2] - from[2]) * t;

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
    }

    const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(resize);
    });

    resizeObserver.observe(container);

    resize();

    window.refreshDynamicBackground();

    draw();
}





/* old color theme code */
/*
const root = document.documentElement;

let currentColor = 'hsl(157.04, 57.45%, 27.65%)';

root.style.setProperty('--current-ambience-color', currentColor);
root.style.setProperty('--current-ambience-color-dark', `color-mix(in srgb, ${currentColor} 70%, black)`);
root.style.setProperty('--current-ambience-color-transparent', `color-mix(in srgb, ${currentColor} 30%, transparent)`);

const hexToRGB = hex =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) =>
    '#' + r + r + g + g + b + b
  )
  .substring(1)
  .match(/.{2}/g)
  .map(x => parseInt(x, 16));

function RGBToHSL(rgb) {
  let [r, g, b] = rgb.map(x => x / 255);
  let cmin = Math.min(r, g, b);
  let cmax = Math.max(r, g, b);
  let delta = cmax - cmin;

  let h = 0;

  if (delta) {
    if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  let s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * ((cmax + cmin) / 2) - 1));
  let l = (cmax + cmin) / 2;

  s = Math.min(50, +(s * 100).toFixed(1));
  l = Math.max(8, Math.min(35, +(l * 100).toFixed(1)));

  return `hsl(${h},${s}%,${l}%)`;
}

async function fetchAmbienceColor() {
  try {
    const url = Spicetify.Player.data?.item?.metadata?.image_url;
    if (!url) return 'hsl(0,0%,8%)';

    const token =
      Spicetify.Platform?.AuthorizationAPI?.getState?.()?.token?.accessToken;

    if (!token) {
      throw new Error("Spotify access token nicht gefunden");
    }

    const res = await fetch(
      `https://api-partner.spotify.com/pathfinder/v1/query?operationName=fetchExtractedColors&variables=${encodeURIComponent(
        JSON.stringify({ uris: [url] })
      )}&extensions=${encodeURIComponent(
        JSON.stringify({
          persistedQuery: {
            version: 1,
            sha256Hash:
              'd7696dd106f3c84a1f3ca37225a1de292e66a2d5aced37a66632585eeb3bbbfa'
          }
        })
      )}`,
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const hex = data.data?.extractedColors?.[0]?.colorRaw?.hex;

    return RGBToHSL(hex ? hexToRGB(hex) : [128, 128, 128]);

  } catch (err) {
    console.error('[Ambience] Fehler:', err);
    return 'hsl(0,0%,8%)';
  }
}


async function updateAmbienceColor() {
  const color = await fetchAmbienceColor();

  root.style.setProperty('--current-ambience-color', color);
  root.style.setProperty(
    '--current-ambience-color-dark',
    `color-mix(in srgb, ${color} 70%, black)`
  );
  root.style.setProperty(
    '--current-ambience-color-transparent',
    `color-mix(in srgb, ${color} 30%, transparent)`
  );
}

function init() {
  updateAmbienceColor();
  Spicetify.Player.addEventListener('songchange', updateAmbienceColor);
}

if (Spicetify.Player.data) {
  init();
} else {
  const observer = new MutationObserver((_, observer) => {
    if (Spicetify.Player.data) {
      observer.disconnect();
      init();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

setTimeout(() => {
    updateAmbienceColor();
}, 5000);
*/











const React = Spicetify.React;
const ReactDOM = Spicetify.ReactDOM || window.ReactDOM;

function hexToRgb(hex) {
    if (!hex) return { r: 30, g: 215, b: 96, a: 1 };
    hex = hex.replace('#', '');
    return {
        r: parseInt(hex.substring(0, 2), 16) || 0,
        g: parseInt(hex.substring(2, 4), 16) || 0,
        b: parseInt(hex.substring(4, 6), 16) || 0,
        a: 1.0
    };
}

const WAVE_CONFIG = {
    sensitivity: 1.0,
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
        const topHex = getComputedStyle(document.documentElement)
            .getPropertyValue("--background-color-highlight").trim();
        const bottomHex = getComputedStyle(document.documentElement)
            .getPropertyValue("--background-color-dark").trim();
        return { top: hexToRgb(topHex), bottom: hexToRgb(bottomHex) };
    }, []);

    const currentColorBotRef = React.useRef({ ...initialColors.bottom });
    const currentColorTopRef = React.useRef({ ...initialColors.top });
    const targetColorBotRef = React.useRef(
        WAVE_CONFIG.targetColorBottom ? { ...WAVE_CONFIG.targetColorBottom } : { ...initialColors.bottom }
    );
    const targetColorTopRef = React.useRef(
        WAVE_CONFIG.targetColorTop ? { ...WAVE_CONFIG.targetColorTop } : { ...initialColors.top }
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
        try {
            const item = Spicetify.Player.data?.item;
            if (!item) return;
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
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
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
            if (!canvas?.parentElement) {
                animationId = requestAnimationFrame(renderLoop);
                return;
            }

            const currentUri = Spicetify.Player.data?.item?.uri;
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

            canvas.style.width = logicalWidth + 'px';
            canvas.style.height = logicalHeight + 'px';
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
                targetColorTopRef.current = { ...WAVE_CONFIG.targetColorTop };
            } else {
                const cssTop = hexToRgb(getComputedStyle(document.documentElement)
                    .getPropertyValue("--background-color-highlight").trim());
                if (cssTop.r !== targetColorTopRef.current.r || cssTop.g !== targetColorTopRef.current.g ||
                    cssTop.b !== targetColorTopRef.current.b) {
                    targetColorTopRef.current = cssTop;
                    colorTransitionProgress = 0;
                }
            }

            if (WAVE_CONFIG.targetColorBottom) {
                targetColorBotRef.current = { ...WAVE_CONFIG.targetColorBottom };
            } else {
                const cssBot = hexToRgb(getComputedStyle(document.documentElement)
                    .getPropertyValue("--current-ambience-color").trim());
                if (cssBot.r !== targetColorBotRef.current.r || cssBot.g !== targetColorBotRef.current.g ||
                    cssBot.b !== targetColorBotRef.current.b) {
                    targetColorBotRef.current = cssBot;
                    colorTransitionProgress = 0;
                }
            }

            const isPlaying = Spicetify.Player.isPlaying();
            const { segments } = audioDataRef.current;
            const pProg = (Spicetify.Player.getProgress() || 0) / 1000;
            const dt = Math.min((now - lastT) / 1000, 0.05);
            lastT = now;

            if (Math.abs(pProg - lastP) > 0.3) {
                internalClock = pProg;
            } else if (pProg !== lastP) {
                internalClock += (pProg - internalClock) * 0.35;
            } else if (isPlaying) {
                internalClock += dt;
            }
            lastP = pProg;

            const exactTime = internalClock + WAVE_CONFIG.delayMs / 1000;
            let targetPitches = new Array(12).fill(0);
            let targetVolume = 0;

            if (isPlaying && segments && segments.length > 0 && exactTime >= 0) {
                const sIdx = segments.findIndex(s => exactTime >= s.start && exactTime < s.start + s.duration);
                if (sIdx !== -1) {
                    const s1 = segments[sIdx];
                    const s2 = segments[sIdx + 1] || s1;
                    const progress = Math.max(0, Math.min(1, (exactTime - s1.start) / Math.max(s1.duration, 0.001)));
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

    return React.createElement('div', {
        style: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden',
            pointerEvents: 'none'
        }
    },
        React.createElement('canvas', {
            ref: canvasRef,
            style: { display: 'block' }
        })
    );
}

const createButton = () => {
    const sideButtonContainer = document.querySelector('.Root__now-playing-bar .main-nowPlayingBar-extraControls');
    if (!sideButtonContainer || sideButtonContainer.querySelector('[aria-label="Ceye Waves Btn"]')) return;

    const button = document.createElement('button');
    button.className = 'main-genericButton-button l-player-btn';
    button.setAttribute('aria-label', 'Ceye Waves Btn');

    const wrapper = document.createElement('span');
    wrapper.className = 'l-player-btn__wrapper';
    wrapper.innerHTML = `
        <svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 10v3"></path><path d="M6 6v11"></path><path d="M10 3v18"></path><path d="M14 8v7"></path><path d="M18 5v13"></path><path d="M22 10v3"></path>
        </svg>`;
    button.appendChild(wrapper);

    button.addEventListener('click', () => {
        const container = document.querySelector('.main-nowPlayingBar-nowPlayingBar');
        if (!container) return;

        const existing = container.querySelector('.ceye-waves-canvas');
        if (existing) {
            existing.style.transition = 'height 0.5s ease, opacity 0.5s ease';
            existing.style.height = '0';
            existing.style.opacity = '0';
            const onTransitionEnd = () => {
                if (existing._reactRoot) {
                    if (existing._reactRoot.unmount) existing._reactRoot.unmount();
                    else if (ReactDOM.unmountComponentAtNode) ReactDOM.unmountComponentAtNode(existing);
                }
                existing.remove();
                existing.removeEventListener('transitionend', onTransitionEnd);
            };
            existing.addEventListener('transitionend', onTransitionEnd);
            button.classList.remove('main-genericButton-buttonActive', 'main-genericButton-buttonActiveDot');
            return;
        }

        const visualizerWrapper = document.createElement('div');
        visualizerWrapper.className = 'ceye-waves-canvas';
        visualizerWrapper.style.width = '100%';
        visualizerWrapper.style.height = '0';
        visualizerWrapper.style.overflow = 'hidden';
        visualizerWrapper.style.position = 'relative';
        visualizerWrapper.style.opacity = '0';
        visualizerWrapper.style.transition = 'height 0.5s ease, opacity 0.5s ease';

        let reactRoot;
        if (ReactDOM.createRoot) {
            reactRoot = ReactDOM.createRoot(visualizerWrapper);
            reactRoot.render(React.createElement(VisualizadorPro));
        } else if (ReactDOM.render) {
            ReactDOM.render(React.createElement(VisualizadorPro), visualizerWrapper);
            reactRoot = { unmount: () => ReactDOM.unmountComponentAtNode(visualizerWrapper) };
        } else {
            console.error('ReactDOM nicht verfügbar');
            return;
        }
        visualizerWrapper._reactRoot = reactRoot;
        container.appendChild(visualizerWrapper);

        const targetHeight = Math.max(container.clientWidth / 4, 100);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                visualizerWrapper.style.height = targetHeight + 'px';
                visualizerWrapper.style.opacity = '1';
            });
        });

        button.classList.add('main-genericButton-buttonActive', 'main-genericButton-buttonActiveDot');
    });

    const miniplayer = sideButtonContainer.querySelector('[aria-label="Open Miniplayer"]');
    if (miniplayer) sideButtonContainer.insertBefore(button, miniplayer);
    else sideButtonContainer.appendChild(button);
};

createButton();
const observer4 = new MutationObserver(createButton);
observer4.observe(document.body, { childList: true, subtree: true });
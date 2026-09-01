import "./style.css";

async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  Spicetify.showNotification("ceyecetify loaded!");
}

export default main;






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
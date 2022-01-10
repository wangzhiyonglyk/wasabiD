
/**
 * 
 * @param {{red,green,blue}} rgb 
 * @returns 
 */
function rgbToHsv(rgb) {
    let h = 0, s = 0, v = 0;
    let r = rgb.r, g = rgb.g, b = rgb.b;
    let arr = [r, g, b];
  
    arr.sort(function (a, b) {
        return a - b;
    })
    let max = arr[2]
    let min = arr[0];
    v = max / 255;
    if (max === 0) {
        s = 0;
    } else {
        s = 1 - (min / max);
    }
    if (max === min) {
        h = 0;//事实上，max===min的时候，h无论为多少都无所谓
    } else if (max === r && g >= b) {
        h = 60 * ((g - b) / (max - min)) + 0;
    } else if (max === r && g < b) {
        h = 60 * ((g - b) / (max - min)) + 360
    } else if (max === g) {
        h = 60 * ((b - r) / (max - min)) + 120
    } else if (max === b) {
        h = 60 * ((r - g) / (max - min)) + 240
    }
    h = parseInt(h);
    s = parseInt(s * 100);
    v = parseInt(v * 100);
    return {
        h: h,
        s: s,
        v: v
    }
}

function hsvToRgb(hsv) {
    let h = hsv.h, s = hsv.s, v = hsv.v;
    s = s / 100;
    v = v / 100;
    let r = 0, g = 0, b = 0;
    let i = parseInt((h / 60) % 6);
    let f = h / 60 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch (i) {
        case 0:
            r = v; g = t; b = p;
            break;
        case 1:
            r = q; g = v; b = p;
            break;
        case 2:
            r = p; g = v; b = t;
            break;
        case 3:
            r = p; g = q; b = v;
            break;
        case 4:
            r = t; g = p; b = v;
            break;
        case 5:
            r = v; g = p; b = q;
            break;
        default:
            break;
    }
    r = parseInt(r * 255.0)
    g = parseInt(g * 255.0)
    b = parseInt(b * 255.0)
    return { r: r, g: g, b: b };
}

function rgbToHex(rgb) {

    let hex = "#" + ((1 << 24) + (rgb.red << 16) + (rgb.green << 8) + rgb.blue).toString(16).slice(1);
    return hex;
}
/**
 * 
 * @param {*} hex 
 * @returns 
 */
function hexToRgb(hex) {
    return {
        r: parseInt("0x" + hex.slice(1, 3)),
        g: parseInt("0x" + hex.slice(3, 5)),
        b: parseInt("0x" + hex.slice(5, 7)),
    }
}


export default { hexToRgb, rgbToHex, hsvToRgb, rgbToHsv }

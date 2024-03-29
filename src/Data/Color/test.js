(function(c, f, h, k) {
    var g = function(a, b) {
        this.eve = a;
        this.defaults = {
            width: 230,
            height: 400,
            color: "#1926dc",
            recommend: !1,
            title: "\u6700\u8fd1\u4f7f\u7528"
        };
        this.options = c.extend({}, this.defaults, b);
        console.log(this.options)
    };
    g.prototype = {
        init: function() {
            this.getPosition();
            this.initDefaultColor();
            this.latelyColor();
            this.createHtml();
            this.on()
        },
        createHtml: function() {
            var a = this.options
              , b = a.bg.r + "," + a.bg.g + "," + a.bg.b
              , d = "";
            c.each(a.lately, function(a, b) {
                if (9 < a)
                    return !1;
                d += '\x3cdiv style\x3d"width: 20px;height: 20px;margin:5px 11px;float: left;box-shadow: 0 0 5px #ccc;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg\x3d\x3d)"\x3e\x3cdiv style\x3d"width: 100%px;height: 100%;background: rgba(' + b + ');" class\x3d"paigusu-lately" data-color\x3d"' + b + '"\x3e\x3c/div\x3e\x3c/div\x3e'
            });
            a = ['\x3cdiv style\x3d"position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 9999;"  id\x3d"paigusu-screen"\x3e', '\x3cdiv style\x3d"width: ' + a.width + "px;height: " + a.height + "px;background: #fff;position: absolute;top: " + a.positionTop + "px;left: " + a.positionLeft + 'px;border-radius: 6px 6px 0 0;box-shadow: 0 0 10px #ddd;z-index:99999;" id\x3d"paigusu-color-picker"\x3e', '\x3cdiv style\x3d"width:100%;height: 150px;background: rgb(' + b + ');position: absolute;border-radius: 6px 6px 0 0 ;overflow: hidden;" id\x3d"color-block"\x3e', '\x3cdiv style\x3d"width:100%;height:100%;background: linear-gradient(to right, #fff, rgba(255,255,255,0));position: absolute;"\x3e\x3cdiv style\x3d"width: 100%;height: 100%;background: linear-gradient(to top, #000, rgba(0,0,0,0));position: absolute;"\x3e', '\x3cdiv style\x3d"width: 12px;height: 12px;border-radius: 6px;box-shadow: inset 0 0 0 1px #fff;position: absolute;top: ' + a.ident.top + "px;left: " + a.ident.left + 'px; z-index:1;" id\x3d"block-ident"\x3e\x3c/div\x3e', '\x3cdiv style\x3d"width:100%;height:100%;position:absolute;top:0;left:0;right:0;bottom:0;z-index:2;" id\x3d"paigusu-palette"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d"width: 100%;height:100px;position: absolute;top: 150px;box-shadow: 0 2px 10px #ccc;padding: 10px 20px;box-sizing: border-box;"\x3e\x3cdiv style\x3d"width:16px;height:16px;border-radius: 8px;background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg\x3d\x3d);box-shadow: inset 0 0 0 1px rgba(0,0,0,.1); float: left;margin-top: 5px;"\x3e', '\x3cdiv style\x3d"width:16px;height:16px;border-radius: 8px;background: rgba(' + a.color.r + "," + a.color.g + "," + a.color.b + ');" id\x3d"final-color"\x3e\x3c/div\x3e', '\x3c/div\x3e\x3cdiv style\x3d"width:160px;height: 10px;background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);float: right;position:relative;margin-bottom: 10px;"\x3e', '\x3cdiv style\x3d"width:10px;height: 10px;background-color: #fff;border-radius: 5px;box-shadow: 0 0 2px #ccc;position: absolute;left:' + (a.colorSlider - 5) + 'px; z-index:1;" id\x3d"paigusu-slider-btn"\x3e\x3c/div\x3e', '\x3cdiv style\x3d"width:100%;height:100%;position: absolute;left:0;top:0;right:0;bottom:0;z-index:2;" id\x3d"paigusu-slider"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d"width:160px;height: 10px;float: right;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg\x3d\x3d);position: relative;"\x3e', '\x3cdiv style\x3d"width: 100%;height: 10px;background:linear-gradient(to right, rgba(' + b + ", 0) 0%, rgba(" + b + ', 1) 100%);position: relative;" id\x3d"paigusu-alpha-block"\x3e', '\x3cdiv style\x3d"width:10px;height: 10px;background-color: #fff;border-radius: 5px;box-shadow: 0 0 2px #ccc;position: absolute;right:-5px;z-index:1;" id\x3d"paigusu-alpha-btn"\x3e\x3c/div\x3e\x3cdiv style\x3d"width:100%;height:100%;position: absolute;left:0;top:0;right:0;bottom:0;z-index:2;" id\x3d"paigusu-alpha"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d"width: 100%;height:45px;clear: both;padding-top: 10px;"\x3e\x3cdiv style\x3d"width: 153px;height: 100%;float: left;"\x3e\x3cdiv style\x3d"width:100%;height:100%; " id\x3d"paigusu-rgba"\x3e', '\x3cinput type\x3d"text" name\x3d"paigusu-r" style\x3d"width: 33px;height:20px;padding:0;border: 1px solid #ccc;border-radius: 5px;margin-right: 4px;text-align:center;color:#333" value\x3d"' + a.color.r + '"\x3e', '\x3cinput type\x3d"text" name\x3d"paigusu-g" style\x3d"width: 33px;height:20px;padding:0;border: 1px solid #ccc;border-radius: 5px;margin-right: 4px;text-align:center;color:#333" value\x3d"' + a.color.g + '"\x3e', '\x3cinput type\x3d"text" name\x3d"paigusu-b" style\x3d"width: 33px;height:20px;padding:0;border: 1px solid #ccc;border-radius: 5px;margin-right: 4px;text-align:center;color:#333" value\x3d"' + a.color.b + '"\x3e', '\x3cinput type\x3d"text" name\x3d"paigusu-a" style\x3d"width: 33px;height:20px;padding:0;border: 1px solid #ccc;border-radius: 5px;text-align:center;color:#333" value\x3d"' + a.color.a + '"\x3e', '\x3cp style\x3d"color:#666;letter-spacing: 29px;text-indent: 13px;line-height: 25px;margin:0;"\x3eRGBA\x3c/p\x3e\x3c/div\x3e\x3cdiv style\x3d"width:100%;height:100%;float: left; display: none;" id\x3d"paigusu-rex"\x3e', '\x3cinput type\x3d"text" name\x3d"paigusu-hex" style\x3d"width:100%;height:20px;border: 1px solid #ccc;border-radius: 5px;text-align:center;color:#333" value\x3d"#' + a.hex + '" \x3e', '\x3cp style\x3d"color:#666;text-align:center;letter-spacing: 8px;text-indent: 13px;line-height: 25px;margin:0;"\x3eHEX\x3c/p\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d"width:35px;height: 100%;float: right;cursor: pointer;padding-top: 8px;text-align: right;" id\x3d"paigusu-tab"\x3e\x3csvg style\x3d"width:85%;" viewBox\x3d"0 0 24 24" data-reactid\x3d".0.0.q.0.0.0.0.0.1.1.1.0.0" \x3e\x3cpath fill\x3d"#333" d\x3d"M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" data-reactid\x3d".0.0.q.0.0.0.0.0.1.1.1.0.0.0"\x3e\x3c/path\x3e\x3c/svg\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d"width:100%;height: 100px;position: absolute;bottom: 50px;padding:10px;box-sizing: border-box;"\x3e', '\x3cp style\x3d"color:#666;text-indent: 10px;margin:0;"\x3e' + a.title + "\x3c/p\x3e", '\x3cdiv style\x3d"height: 70px;width:100%;padding: 5px 0;box-sizing: border-box;"\x3e', d, '\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d"width:100%;height: 50px;text-align: center;position: absolute;bottom: 0;line-height: 50px;box-shadow: 0 -2px 10px #ccc;"\x3e\x3cbutton style\x3d"line-height:18px;border: 1px solid #333;background: #fff;padding: 5px 30px;border-radius: 4px;color: #333;cursor: pointer;font-size:12px;" id\x3d"paigusu-ok"\x3e\u786e\u5b9a\x3c/button\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e'].join("");
            c("body").append(a)
        },
        initDefaultColor: function() {
            var a = this.options.color.split(",");
            if (1 == a.length) {
                var b = this.hexToRgb(a[0]);
                b.a = 1;
                var d = this.rgbToHex(b)
                  , e = this.rgbToHsb(b)
            } else
                3 == a.length ? (b = a[0],
                d = a[1],
                e = a[2],
                a = 1) : 4 == a.length ? (b = a[0],
                d = a[1],
                e = a[2],
                a = a[3]) : (b = 42,
                d = 0,
                e = 255,
                a = 1),
                b = {
                    r: 255 < parseInt(b) ? 255 : parseInt(b),
                    g: 255 < parseInt(d) ? 255 : parseInt(d),
                    b: 255 < parseInt(e) ? 255 : parseInt(e),
                    a: parseFloat(.9 < parseFloat(a).toFixed(1) ? 1 : parseFloat(a).toFixed(1))
                },
                d = this.rgbToHex(b),
                e = this.rgbToHsb(b);
            a = this.hsbToRgb({
                h: e.h,
                s: 100,
                b: 100
            });
            this.set({
                color: b,
                hex: d,
                hsb: e,
                bg: a,
                ident: {
                    top: 150 - e.b / 100 * 150 - 6,
                    left: e.s / 100 * 230 - 6
                },
                colorSlider: parseInt(e.h / 360 * 160)
            })
        },
        latelyColor: function() {
            if (this.options.recommend) {
                var a = this.options.recommend.split("|");
                this.options.lately = a;
                this.options.title = "\u63a8\u8350\u8272"
            } else if (f.localStorage) {
                var a = f.localStorage
                  , b = a.getItem("paigusu-lately");
                b ? b = b.split("-") : (b = "0,0,51,1 0,51,102,1 0,102,153,1 0,153,204,1 0,204,255,1 102,0,51,1 102,51,102,1 102,102,153,1 102,204,204,1 102,255,255,1".split(" "),
                a.setItem("paigusu-lately", b.join("-")));
                this.options.lately = b
            }
        },
        rgbToHsb: function(a) {
            var b = {
                h: 0,
                s: 0,
                b: 0
            }
              , d = Math.min(a.r, a.g, a.b)
              , e = Math.max(a.r, a.g, a.b)
              , c = e - d;
            b.b = e;
            b.s = 0 !==e ? 255 * c / e : 0;
            b.h = 0 !==b.s ? a.r == e ? (a.g - a.b) / c : a.g == e ? 2 + (a.b - a.r) / c : 4 + (a.r - a.g) / c : -1;
            e == d && (b.h = 0);
            b.h *= 60;
            0 > b.h && (b.h += 360);
            b.s *= 100 / 255;
            b.b *= 100 / 255;
            return b = {
                h: Math.round(b.h),
                s: Math.round(b.s),
                b: Math.round(b.b)
            }
        },
        hexToRgb: function(a) {
            a = -1 < a.indexOf("#") ? a.substring(1) : a;
            3 == a.length && (a = a.split(""),
            a = a[0] + a[0] + a[1] + a[1] + a[2] + a[2]);
            a = parseInt(a, 16);
            return {
                r: a >> 16,
                g: (a & 65280) >> 8,
                b: a & 255
            }
        },
        rgbToHex: function(a) {
            var b = [a.r.toString(16), a.g.toString(16), a.b.toString(16)];
            c.each(b, function(a, e) {
                1 == e.length && (b[a] = "0" + e)
            });
            return b.join("")
        },
        hsbToRgb: function(a) {
            var b, d, e;
            b = a.h;
            var c = 255 * a.s / 100;
            a = 255 * a.b / 100;
            if (0 == c)
                b = d = e = a;
            else {
                var c = (255 - c) * a / 255
                  , f = b % 60 * (a - c) / 60;
                360 == b && (b = 0);
                60 > b ? (b = a,
                e = c,
                d = c + f) : 120 > b ? (d = a,
                e = c,
                b = a - f) : 180 > b ? (d = a,
                b = c,
                e = c + f) : 240 > b ? (e = a,
                b = c,
                d = a - f) : 300 > b ? (e = a,
                d = c,
                b = c + f) : 360 > b ? (b = a,
                d = c,
                e = a - f) : e = d = b = 0
            }
            return {
                r: Math.round(b),
                g: Math.round(d),
                b: Math.round(e)
            }
        },
        hsbToHex: function(a) {
            a = this.hsbToRgb(a);
            var b = [a.r.toString(16), a.g.toString(16), a.b.toString(16)];
            c.each(b, function(a, c) {
                1 == c.length && (b[a] = "0" + c)
            });
            return b.join("")
        },
        getPosition: function() {
            var a = this.options
              , b = c(f).width()
              , d = c(f).height()
              , e = this.eve.getBoundingClientRect();
            b - e.right > a.width ? this.set({
                positionLeft: e.right + 5
            }) : this.set({
                positionLeft: e.left - a.width - 5
            });
            d - e.bottom > a.height ? this.set({
                positionTop: e.top
            }) : this.set({
                positionTop: e.bottom - a.height
            })
        },
        doploy: function() {
            var a = this.options;
            c("#paigusu-slider-btn").css("left", a.colorSlider - 5);
            var b = this.hsbToHex({
                h: a.colorSlider / 160 * 360,
                s: 100,
                b: 100
            })
              , d = this.hexToRgb(b)
              , e = {
                h: a.colorSlider / 160 * 360,
                s: 100,
                s: a.hsb.s,
                b: a.hsb.b
            }
              , b = this.hsbToHex(e)
              , f = this.hexToRgb(b);
            f.a = a.color.a;
            this.set({
                bg: d,
                color: f,
                hex: b,
                hsb: e
            });
            this.setInputColor()
        },
        setInputColor: function() {
            var a = this.options
              , b = a.color.r + "," + a.color.g + "," + a.color.b;
            c("#final-color").css("background", "rgba(" + b + "," + a.color.a + ")");
            var d = a.bg.r + "," + a.bg.g + "," + a.bg.b;
            console.log(d);
            c("#color-block").css("background", "rgb(" + d + ")");
            c("#paigusu-alpha-block").css("background", "linear-gradient(to right, rgba(" + b + ", 0) 0%, rgba(" + b + ", 1) 100%)");
            c.each(a.color, function(a, b) {
                c("input[name\x3d'paigusu-" + a + "']").val(b)
            });
            c("input[name\x3d'paigusu-hex']").val("#" + a.hex);
            this.callFun()
        },
        inputSetColor: function() {
            var a = this.options.hsb
              , b = this.hsbToRgb({
                h: 0 == a.h ? 250 : a.h,
                s: 100,
                b: 100
            })
              , d = 150 - a.b / 100 * 150 - 6
              , e = a.s / 100 * 230 - 6
              , a = parseInt(a.h / 360 * 160)
              , f = this.options.color;
            this.set({
                bg: b,
                ident: {
                    top: d,
                    left: e
                },
                colorSlider: a
            });
            c("#color-block").css("background", "rgb(" + b.r + "," + b.g + "," + b.b + ")");
            c("#block-ident").css({
                top: d,
                left: e
            });
            c("#paigusu-slider-btn").css("left", a - 5);
            c("#final-color").css("background", "rgb(" + f.r + "," + f.g + "," + f.b + "," + f.a + ")");
            c("#paigusu-alpha-block").css("background", "linear-gradient(to right, rgba(0,17,255, 0) 0%, rgba(" + b.r + "," + b.g + "," + b.b + ", 1) 100%)");
            c("#paigusu-alpha-btn").css("left", parseInt(160 * f.a) - 5);
            this.callFun()
        },
        palette: function() {
            var a = this.options;
            c("#block-ident").css(a.ident);
            var b = 0 > a.ident.top ? 0 : a.ident.top
              , d = 0 > a.ident.left ? 0 : a.ident.left
              , a = {
                s: ((230 < d ? 230 : d) + 6) / 230 * 100,
                b: 100 - ((150 < b ? 150 : b) + 6) / 150 * 100,
                h: a.hsb.h
            }
              , b = this.hsbToHex(a)
              , d = this.hexToRgb(b);
            this.options.hex = b;
            this.options.hsb = a;
            this.options.color.r = d.r;
            this.options.color.g = d.g;
            this.options.color.b = d.b;
            this.setInputColor()
        },
        callFun: function() {
            var a = this.options
              , b = a.color;
            this.callBack(this.eve, {
                hex: a.hex,
                rgba: b.r + "," + b.g + "," + b.b + "," + b.a,
                rgb: b.r + "," + b.g + "," + b.b
            })
        },
        set: function(a) {
            this.options = c.extend({}, this.options, a);
            return this
        },
        on: function() {
            var a = this;
            c("#paigusu-screen").off().on("mousedown", function() {
                c(this).remove();
                return !1
            });
            c("#paigusu-color-picker").off().on("mousedown", function(a) {
                a.stopPropagation()
            });
            c("#paigusu-tab").off().on("click", function() {
                c("#paigusu-rgba").is(":hidden") ? (c("#paigusu-rgba").show(),
                c("#paigusu-rex").hide()) : (c("#paigusu-rgba").hide(),
                c("#paigusu-rex").show())
            });
            c("#paigusu-palette").off().on("mousedown", function(b) {
                b = b || f.event;
                f.paigusupalette = !0;
                a.set({
                    ident: {
                        top: b.offsetY - 6,
                        left: b.offsetX - 6
                    }
                });
                a.palette()
            }).on("mousemove", function(b) {
                b = b || f.event;
                f.paigusupalette && (a.set({
                    ident: {
                        top: b.offsetY - 6,
                        left: b.offsetX - 6
                    }
                }),
                a.palette())
            }).on("mouseup", function() {
                f.paigusupalette = !1
            }).on("mouseleave", function() {
                f.paigusupalette = !1
            });
            c("#paigusu-slider").off().on("mousedown", function(b) {
                b = b || f.event;
                f.paigususlider = !0;
                a.set({
                    colorSlider: b.offsetX
                });
                a.doploy()
            }).on("mousemove", function(b) {
                b = b || f.event;
                f.paigususlider && (a.set({
                    colorSlider: 0 > b.offsetX ? 0 : b.offsetX
                }),
                a.doploy())
            }).on("mouseup", function() {
                f.paigususlider = !1
            }).on("mouseleave", function() {
                f.paigususlider = !1
            });
            c("#paigusu-alpha").off().on("mousedown", function(b) {
                b = b || f.event;
                f.paigusualpha = !0;
                c("#paigusu-alpha-btn").css("left", b.offsetX - 6);
                a.options.color.a = parseFloat((b.offsetX / 160).toFixed(1));
                a.setInputColor()
            }).on("mousemove", function(b) {
                b = b || f.event;
                f.paigusualpha && (c("#paigusu-alpha-btn").css("left", b.offsetX - 6),
                a.options.color.a = parseFloat(((0 > b.offsetX ? 0 : b.offsetX) / 160).toFixed(1)),
                a.setInputColor())
            }).on("mouseup", function() {
                f.paigusualpha = !1
            }).on("mouseleave", function() {
                f.paigusualpha = !1
            });
            c('input[name\x3d"paigusu-r"],input[name\x3d"paigusu-g"],input[name\x3d"paigusu-b"],input[name\x3d"paigusu-a"]').on("keyup", function() {
                var b = c(this).attr("name").split("-");
                if ("a" == b[1]) {
                    var d = parseFloat(c(this).val()) || 1
                      , d = parseFloat(d.toFixed(1));
                    if (1 < d || 0 > d)
                        c(this).val(1),
                        d = 1
                } else
                    d = parseInt(c(this).val()) || 0,
                    0 > d ? (c(this).val(0),
                    d = 0) : 255 < d && (c(this).val(255),
                    d = 255);
                a.options.color[b[1]] = d;
                b = a.rgbToHex(a.options.color);
                c('input[name\x3d"paigusu-hex"]').val("#" + b);
                a.options.hex = b;
                b = a.rgbToHsb(a.options.color);
                a.options.hsb = b;
                a.inputSetColor()
            });
            c('input[name\x3d"paigusu-hex"]').on("keyup", function() {
                var b = c(this).val().replace("#", "");
                if (3 == b.length || 6 == b.length)
                    b = a.hexToRgb(b),
                    b.a = 1,
                    a.set({
                        color: b,
                        hex: a.rgbToHex(b),
                        hsb: a.rgbToHsb(b)
                    }),
                    c.each(b, function(a, b) {
                        c('input[name\x3d"paigusu-' + a + '"]').val(b)
                    }),
                    a.inputSetColor()
            });
            c(".paigusu-lately").on("click", function() {
                var b = c(this).data("color")
                  , d = b.split(",")
                  , e = {
                    r: parseInt(d[0]),
                    g: parseInt(d[1]),
                    b: parseInt(d[2])
                }
                  , b = e;
                b.a = d["3"] || 1;
                d = a.rgbToHex(e);
                a.callBack(a.eve, {
                    hex: d,
                    rgba: b.r + "," + b.g + "," + b.b + "," + b.a,
                    rgb: b.r + "," + b.g + "," + b.b
                });
                c("#paigusu-screen").remove()
            });
            c("#paigusu-ok").on("click", function() {
                a.callFun();
                var b = a.options.color;
                if (f.localStorage) {
                    var d = f.localStorage
                      , e = d.getItem("paigusu-lately")
                      , e = e.split("-");
                    e.shift();
                    e.push(b.r + "," + b.g + "," + b.b + "," + b.a);
                    d.setItem("paigusu-lately", e.join("-"))
                }
                c("#paigusu-screen").remove()
            })
        }
    };
    c.fn.extend({
        paigusu: function(a, b) {
            this.each(function(d, e) {
                c(this).off().on("click", function() {
                    var c = new g(this,a);
                    c.init();
                    c.callBack = b
                });
                return this
            })
        }
    })
}
)(jQuery, window, document);

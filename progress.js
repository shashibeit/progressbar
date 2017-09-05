; (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Progress = factory();
    }
})(this, function () {
    var Progress = {};
    Progress.status = null;

    Progress.configure = function (options) {
        var key, value;
        for (key in options) {
            value = options[key];
            if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
        }
        return this;
    };

    var Settings = Progress.settings = {
        minimum: 20,
        maximum: 95,
        speed: .5,
        increaseSpeed: 50,
        height: 3,
        defaultColor: '#9400D3',
        color: ["#9400D3"],
        barSelector: '[role="bar"]',
        parent: 'body',
        template: '<div id="bar" role="bar"></div>'
    };
    /*
    *   tart the progress with minimum width set up in settings.
    */
    Progress.start = function (progress) {

        if (Progress.isStarted()) return;

        if (Progress.status == null) {

            if (typeof progress === "undefined")
                Progress.go(Settings.minimum);
            else
                Progress.go(progress);

        }
    };
    /*
    * Increament progress up to given width
    */
    Progress.go = function (progress) {

        Progress.status = (progress === 1 ? null : progress);

        if (!Progress.isRendered())
            Progress.render();

        var barCss = getBarCss(progress, Settings.speed);
        var progressBar = document.getElementById("bar-progress");
        var Bar = progressBar.querySelector(Settings.barSelector);
        document.getElementById("bar-progress").offsetWidth;

        applyCss(Bar, barCss);

        setTimeout(function () {
            if (progress === 100) {
                fadeOut(Bar);
                Progress.remove();
                Progress.status = null;
            }
            else {
                var barCss = getBarCss(Settings.maximum, Settings.increaseSpeed);
                applyCss(Bar, barCss);
            }
        }, parseFloat(Settings.speed) * 1000);
    };
    /*
    * complete the progress bar by setting up width to 100%.
    */
    Progress.complete = function () {
        return Progress.go(100);
    };
    /*
    * Increament progress by bit and continue till maximum width set up in settings.
    */
    Progress.increament = function (amount) {
        var n = Progress.status;

        if (!n) {
            return Progress.start(0);
        } else if (n > 100) {
            return;
        } else {
            if (typeof amount !== 'number') {
                if (n >= 0 && n < 20) { amount = 10; }
                else if (n >= 20 && n < 50) { amount = 4; }
                else if (n >= 50 && n < 80) { amount = 2; }
                else if (n >= 80 && n < 99) { amount = 1; }
                else { amount = 0; }
            }
            n = clamp(n + amount, 0, 99);

            return Progress.go(n);
        }
    };
    /*
    * Render element 
    */
    Progress.render = function () {
        var progressBar = Progress.createElement();
        progressBar.innerHTML = Settings.template;
        var elem = progressBar.querySelector(Settings.barSelector);
        var styles = {};

        styles.height = Settings.height + 'px';
        styles.width = 0 + '%';
        styles.position = 'fixed';
        styles.zIndex = '1031';
        styles.top = '0';
        styles.left = '0';
        styles.boxShadow = '0 0 2px #29d, 0 0 1px #29d';

        if (Settings.color.length > 1) {
            var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];
            var colorstr = "";

            for (var color = 0; color < Settings.color.length; color++)
                colorstr = colorstr + ", " + Settings.color[color];
            colorstr = colorstr.substring(1);

            for (var i = 0; i < prefixes.length; i++)
                styles.background = prefixes[i] + 'linear-gradient(right,' + colorstr + ')';

        }
        else if (Settings.color.length == 1) {
            styles.background = Settings.color[0];
        }
        else {
            styles.background = Settings.defaultColor;
        }
        applyCss(elem, styles);
    };
    /*
    * returns an bar-progress element.
    */
    Progress.createElement = function () {
        var progressDivNode = null;
        var parent = document.querySelector(Settings.parent);
        if (!Progress.isRendered()) {
            progressDivNode = document.createElement('div');
            progressDivNode.id = 'bar-progress';
            progressDivNode.style.width = "100%";
            progressDivNode.style.zIndex = "1031";
            progressDivNode.style.position = "fixed";
            progressDivNode.style.top = "0";
            progressDivNode.style.background = 'transparent';

            if (parent != document.body) {
                addClass(parent, 'bar-progress-custom-parent');
            }
            parent.appendChild(progressDivNode);
        }
        return document.getElementById("bar-progress");
    };
    /*
    * removes the element 
    */
    Progress.remove = function () {
        function removeElement(element) {
            element && element.parentNode && element.parentNode.removeChild(element);
        }
        var progressBar = document.getElementById("bar-progress");
        removeElement(progressBar);
    }
    /*
    * returns min or max number if n is null 
    */
    function clamp(n, min, max) {
        if (n < min) return min;
        if (n > max) return max;
        return n;
    };
    /*
    * checks progress bar started or not.
    */
    Progress.isStarted = function () {
        return typeof Progress.status === 'number';
    }
    /*
    * checks element is created or not.
    */
    Progress.isRendered = function () {
        return !!document.getElementById('bar-progress');
    };
    /*
    * return the newly generated css for the progress bar.
    */
    function getBarCss(progress, speed) {
        var barCss = {};
        var bodyStyle = document.body.style;
        var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
            ('MozTransform' in bodyStyle) ? 'Moz' :
                ('msTransform' in bodyStyle) ? 'ms' :
                    ('OTransform' in bodyStyle) ? 'O' : '';

        var prop = vendorPrefix + 'Transition';
        barCss[prop] = "width " + speed + "s linear";
        barCss["width"] = progress + "%";

        return barCss;
    }
    /*
    *  Add a class from an element.
    */
    function addClass(element, name) {
        var oldList = classList(element),
            newList = oldList + name;

        if (hasClass(oldList, name)) return;

        element.className = newList.substring(1);
    }
    /*
    * returns the list of all present class to element.
    */
    function classList(element) {
        return (' ' + (element && element.className || '') + ' ').replace(/\s+/gi, ' ');
    }
    /*
    * (Internal) Check element has a class to element.
    */
        function hasClass(element, name) {
            var list = typeof element == 'string' ? element : classList(element);
            return list.indexOf(' ' + name + ' ') >= 0;
          }
    /*
    *  apply css to the element.
    */
    var applyCss = (function () {
        var browserPrefixes = ['Webkit', 'O', 'Moz', 'ms'];
        var classProps = {};

        function toCamelCase(str) {
            return str.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function (match, letter) {
                return letter.toUpperCase();
            });
        };


        function getVendorProp(name) {
            var style = document.body.style;
            if (name in style) return name;

            var i = browserPrefixes.length,
                capName = name.charAt(0).toUpperCase() + name.slice(1),
                vendorName;
            while (i--) {
                vendorName = browserPrefixes[i] + capName;
                if (vendorName in style) return vendorName;
            }

            return name;
        };

        function vendorPrefix() {
            var bodyStyle = document.body.style;
            var vendorPrefix = ('WebkitTransform' in bodyStyle) ? '-webkit-' :
                ('MozTransform' in bodyStyle) ? '-moz-' :
                    ('msTransform' in bodyStyle) ? '-ms-' :
                        ('OTransform' in bodyStyle) ? '-o-' : '';

            return vendorPrefix;
        };

        function getStyleProp(name) {
            name = toCamelCase(name);
            return classProps[name] || (classProps[name] = getVendorProp(name));
        };

        function setCss3Style(element, prop, val) {
            var Property = getStyleProp(prop);
            element.style[Property] = val;
        };

        return function (element, properties) {
            var args = arguments,
                prop,
                value;

            if (args.length == 2) {
                for (prop in properties) {
                    value = properties[prop];
                    if (value !== undefined && properties.hasOwnProperty(prop)) setCss3Style(element, prop, value);
                }
            } else {
                setCss3Style(element, args[1], args[2]);
            }
        };
    })();
    /*
    *  fade out the element.
    */
    function fadeOut(elem) {
        elem.style.opacity -= 0.1;
        if (elem.style.opacity < 0.0) {
            elem.style.opacity = 0.0;
        } else {
            setTimeout(fadeOut(elem), 100);
        }
    };

    return Progress;
});
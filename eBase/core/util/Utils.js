/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var Utils = exports;

    /**
     * <回调包装方法>
     */
    Utils.cb = function(fn, context/*, arg1, arg2*/) {
        var func = arguments[0];
        var target = arguments[1];

        if( typeof func == "string") {
            func = target[func];
        }

        if(!func) {
            throw new Error("callback function can't be null.");
        }

        var args = Array.prototype.slice.call(arguments, 2);

        return function() {
            var arr = new Array;
            var count = 0;
            for(var i = 0; i < args.length; i++) {
                if(args[i] == $ || args[i] == "$") {
                    arr.push(arguments[count++]);
                }
                else if( typeof args[i] == "string" && args[i].indexOf("$.") == 0) {
                    var param = arguments[count++];
                    var name = args[i].split("$.")[1];
                    var value = param[name];
                    if( typeof value == "function") {
                        value = param[name]();
                    }

                    arr.push(value);
                }
                else {
                    arr.push(args[i]);
                }
            }

            arr = arr.concat(Array.prototype.slice.call(arguments, count));

            return func.apply(target || {}, arr);
        };
    };

    /**
     * <扩展s到r,区别于继承,第三个参数可选用于排除不需要克隆的属性>
     */
    Utils.mixin = function(r, s, wl) {
        // Copy "all" properties including inherited ones.
        for(var p in s) {
            if(s.hasOwnProperty(p)) {
                if(wl && indexOf(wl, p) === -1)
                    continue;

                // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
                if(p !== 'prototype') {
                    r[p] = s[p];
                }
            }
        }
    };

    var indexOf = Array.prototype.indexOf ? function(arr, item) {
        return arr.indexOf(item);
    } : function(arr, item) {
        for(var i = 0, len = arr.length; i < len; i++) {
            if(arr[i] === item) {
                return i;
            }
        }
        return -1;
    };

    Utils.xbCss = function(el, props) {
        var key, pkey;
        for(key in props ) {
            if(props.hasOwnProperty(key)) {
                pkey = pfx(key);
                if(pkey !== null) {
                    el.style[pkey] = props[key];
                }
            }
        }
        return el;
    };

    var pfx = (function() {
        var style = document.createElement('dummy').style, prefixes = 'Webkit Moz O ms Khtml'.split(' '), memory = {};

        return function(prop) {
            if( typeof memory[prop] === "undefined") {

                var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1), props = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');

                memory[prop] = null;
                for(var i in props ) {
                    if(style[props[i]] !== undefined) {
                        memory[prop] = props[i];
                        break;
                    }
                }

            }

            return memory[prop];
        };

    })();

});

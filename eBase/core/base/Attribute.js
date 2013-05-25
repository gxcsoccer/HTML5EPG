/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var Attribute = exports;

    /**
     * <初始化属性>
     * @param {Object} attrs
     */
    Attribute.initAttrs = function(config) {
        var attrs, inheritedAttrs, userValues;

        // Get all inherited attributes.
        inheritedAttrs = getInheritedAttrs(this);
        attrs = merge({}, inheritedAttrs);
        if(config) {
            userValues = normalize(config);
            merge(attrs, userValues);
        }

        // Automatically register `this._onChangeAttr` method as
        // a `change:attr` event handler.
        parseEventsFromInstance(this, attrs);

        this.attrs = attrs;

        // 对于有 setter 的属性，要用初始值 set 一下，以保证关联属性也一同初始化
        setSetterAttrs(this, attrs, userValues);

        return this;
    };

    /**
     * <获取属性值>
     * @param {Object} key
     */
    Attribute.get = function(key) {
        var attr = this.attrs[key] || {};
        var val = attr.value;
        return attr.getter ? attr.getter.call(this, val, key) : val;
    };

    /**
     * <设置属性值>
     * @param {Object} key
     * @param {Object} value
     * @param {Object} option
     */
    Attribute.set = function(key, value, option) {
        var attrs = {};

        // set("key", val, option)
        if(isString(key)) {
            attrs[key] = value;
        }
        // set({ "key": val, "key2": val2 }, option)
        else {
            attrs = key;
            option = value;
        }

        option || ( option = {});
        var silent = option.silent;
        var now = this.attrs;
        var changed = this.__changedAttrs || (this.__changedAttrs = {});

        for(k in attrs) {
            if(!attrs.hasOwnProperty(k))
                continue;

            var attr = now[k] || (now[k] = {}), v = attrs[k];

            if(attr.readOnly) {
                throw 'This attribute is readOnly: ' + k;
            }

            // invoke validator
            if(attr.validator) {
                var error = attr.validator.call(this, v, k);
                if(error) {
                    if(option.errorHandler) {
                        option.errorHandler.call(this, error);
                    }
                    continue;
                }
            }

            // invoke setter
            if(attr.setter) {
                v = attr.setter.call(this, v, k);
            }

            // 获取设置前的 prev 值
            var prev = this.get(k);

            // 获取需要设置的 val 值
            // 都为对象时，做 merge 操作，以保留 prev 上没有覆盖的值
            if(isPlainObject(prev) && isPlainObject(v)) {
                v = merge(merge({}, prev), v);
            }

            // set finally
            now[k].value = v;

            // invoke change event
            // 初始化时对 set 的调用，不触发任何事件
            if(!this.__initializingAttrs && !isEqual(prev, v)) {
                if(silent) {
                    changed[key] = [v, prev];
                }
                else {
                    this.trigger('change:' + k, v, prev, k);
                }
            }
        }

        return this;
    };

    /**
     * <手动触发onChangeXXX事件>
     */
    Attribute.change = function() {
        var changed = this.__changedAttrs;

        if(changed) {
            for(var key in changed) {
                if(changed.hasOwnProperty(key)) {
                    var args = changed[key];
                    this.trigger('change:' + key, args[0], args[1], key);
                }
            }
            delete this.__changedAttrs;
        }

        return this;
    };

    /**
     * <清理被修改过的属性缓存>
     */
    Attribute.clearChangedAttrs = function() {
        delete this.__changedAttrs;
    };

    // Helpers
    // -------
    var keys = Object.keys;

    var toString = Object.prototype.toString;

    var isArray = Array.isArray ||
    function(val) {
        return toString.call(val) === '[object Array]';
    };

    function isString(val) {
        return toString.call(val) === '[object String]';
    }

    function isFunction(val) {
        return toString.call(val) === '[object Function]';
    }

    var EVENT_NAME_PATTERN = /^(Change)?([A-Z])(.*)/;
    function parseEventsFromInstance(host, attrs) {
        for(var attr in attrs) {
            if(attrs.hasOwnProperty(attr)) {
                var m = '_onChange' + ucfirst(attr);
                if(host.on && host[m]) {
                    host.on('change:' + attr, host[m]);
                }
            }
        }
    }

    /**
     * <初始化调用attrs的setter方法>
     */
    function setSetterAttrs(host, attrs, userValues) {
        var option = {
            silent: true
        };
        host.__initializingAttrs = true;

        for(var key in userValues) {
            if(userValues.hasOwnProperty(key)) {
                if(attrs[key] && attrs[key].setter) {
                    host.set(key, userValues[key].value, option);
                }
            }
        }
        delete host.__initializingAttrs;
    }

    /**
     * <格式化attrs属性>
     */
    var ATTR_SPECIAL_KEYS = ['value', 'getter', 'setter', 'validator', 'readOnly'];
    // normalize `attrs` to
    //
    //   {
    //      value: 'xx',
    //      getter: fn,
    //      setter: fn,
    //      validator: fn,
    //      readOnly: boolean
    //   }
    //
    function normalize(attrs) {
        // clone it
        attrs = merge({}, attrs);

        for(var key in attrs) {
            var attr = attrs[key];

            if(isPlainObject(attr) && hasOwnProperties(attr, ATTR_SPECIAL_KEYS)) {
                continue;
            }

            attrs[key] = {
                value: attr
            };
        }

        return attrs;
    }

    /**
     * <返回继承链上的attrs属性>
     */
    function getInheritedAttrs(instance) {
        var inherited = [];
        var proto = instance.constructor.prototype;

        while(proto) {
            // 不要拿到 prototype 上的
            if(!proto.hasOwnProperty('attrs')) {
                proto.attrs = {};
            }

            // 为空时不添加
            if(!isEmptyObject(proto.attrs)) {
                inherited.unshift(proto.attrs);
            }

            // 向上回溯一级
            proto = proto.constructor.Super;
        }

        // Merge and clone default values to instance.
        var result = {};
        for(var i = 0, len = inherited.length; i < len; i++) {
            result = merge(result, normalize(inherited[i]));
        }

        return result;
    }

    function hasOwnProperties(object, properties) {
        for(var i = 0, len = properties.length; i < len; i++) {
            if(object.hasOwnProperty(properties[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * <判断是否是空对象>
     * @param {Object} o
     */
    function isEmptyObject(o) {
        for(p in o) {
            if(o.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    }

    /**
     * <首字母大写>
     * @param {Object} str
     */
    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    /**
     * <将supplier的属性复制到receiver上>
     * @param {Object} receiver
     * @param {Object} supplier
     */
    function merge(receiver, supplier) {
        var key, value;

        for(key in supplier) {
            if(supplier.hasOwnProperty(key)) {
                value = supplier[key];

                // 只 clone 数组和 plain object，其他的保持不变
                if(isArray(value)) {
                    value = value.slice();
                }
                else if(isPlainObject(value)) {
                    value = merge(receiver[key] || {}, value);
                }

                receiver[key] = value;
            }
        }

        return receiver;
    }

    /**
     * <判断是否是通过{}或者new Object()生成的对象>
     */
    var isPlainObject = $.isPlainObject ? $.isPlainObject : function(o) {
        return o &&
        // 排除 boolean/string/number/function 等
        // 标准浏览器下，排除 window 等非 JS 对象
        // 注：ie8- 下，toString.call(window 等对象)  返回 '[object Object]'
        toString.call(o) === '[object Object]' &&
        // ie8- 下，排除 window 等非 JS 对象
        ('isPrototypeOf' in o);
    };

    // 判断属性值 a 和 b 是否相等，注意仅适用于属性值的判断，非普适的 === 或 == 判断。
    function isEqual(a, b) {
        if(a === b)
            return true;

        if(isEmptyAttrValue(a) && isEmptyAttrValue(b))
            return true;

        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if(className != toString.call(b))
            return false;

        switch (className) {

            // Strings, numbers, dates, and booleans are compared by value.
            case '[object String]':
                // Primitives and their corresponding object wrappers are
                // equivalent; thus, `"5"` is equivalent to `new String("5")`.
                return a == String(b);

            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive. An `equal`
                // comparison is performed for other numeric values.
                return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);

            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values.
                // Dates are compared by their millisecond representations.
                // Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a == +b;

            // RegExps are compared by their source patterns and flags.
            case '[object RegExp]':
                return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;

            // 简单判断数组包含的 primitive 值是否相等
            case '[object Array]':
                var aString = a.toString();
                var bString = b.toString();

                // 只要包含非 primitive 值，为了稳妥起见，都返回 false
                return aString.indexOf('[object') === -1 && bString.indexOf('[object') === -1 && aString === bString;
        }

        if( typeof a != 'object' || typeof b != 'object')
            return false;

        // 简单判断两个对象是否相等，只判断第一层
        if(isPlainObject(a) && isPlainObject(b)) {

            // 键值不相等，立刻返回 false
            if(!isEqual(keys(a), keys(b))) {
                return false;
            }

            // 键相同，但有值不等，立刻返回 false
            for(var p in a) {
                if(a[p] !== b[p])
                    return false;
            }

            return true;
        }

        // 其他情况返回 false, 以避免误判导致 change 事件没发生
        return false;
    }

    // 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined, '', [], {}
    function isEmptyAttrValue(o) {
        return o == null || // null, undefined
        (isString(o) || isArray(o)) && o.length === 0 || // '', []
        isPlainObject(o) && isEmptyObject(o);
        // {}
    }

});

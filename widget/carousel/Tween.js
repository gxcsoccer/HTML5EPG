/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var Tween = exports;

    Tween.linear = function(t, c, d) {
        return c * t / d;
    };

    Tween.circEaseIn = function(t, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1);
    };

    Tween.elasticEaseIn = function(t, c, d, a, p) {
        if(t == 0)
            return 0;
        if((t /= d) == 1)
            return c;
        if(!p)
            p = d * .3;
        if(!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p));

    };

    Tween.quartEaseIn = function(t, c, d) {
        return c * (t /= d) * t * t * t;
    };

    Tween.cubicEaseIn = function(t, c, d) {
        return c * (t /= d) * t * t;
    };

    Tween.cubicEaseOut = function(t, c, d) {
        return c * (( t = t / d - 1) * t * t + 1);
    }

    Tween.cubicEaseInOut = function(t, c, d) {
        if((t /= d / 2) < 1)
            return c / 2 * t * t * t;
        return c / 2 * ((t -= 2) * t * t + 2);
    }
})

/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var console = window.console;
    var slice = Array.prototype.slice;
    var Logger = {};
    $.each(["debug", "info", "warn", "error"], function(index, fn) {
        Logger[fn] = function() {
            var message = slice.call(arguments, 0).join(' ');
            console[fn](message);
        };
    });
    return Logger;
});

/**
 * @author g00201348
 */
seajs.config({
    base: './',
    alias: {
        '_': 'eBase/lib/underscore',
        //'css': 'customize/real6/asset/css',
        'css': 'customize/real6/asset/stylesheets',
        'core': 'eBase/core',
        'customize': 'customize/real6',
        'widget': 'widget',
        'juicer': 'eBase/lib/juicer'
    }
});

define(function(require) {
    var windowManager = require('core/view/WindowManager');
    var eventManager = require('core/event/EventManager');

    /**
     * <请求动画的下一帧>
     */
    var requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    $(document).ready(function() {
        //console.log('everything start here.');
        windowManager.start();
        eventManager.start();
    });
});

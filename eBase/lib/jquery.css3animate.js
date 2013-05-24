/*
 * jQuery.css3animate.js v.0.21 by David Aerne ( meodai.ch )
 * free to use and/or modify not protected by any kind of lisence.
 * Last modification: 2011-3-13
 *
 * Animates with CSS3 Transition if possible
 * usage: .css3animate([ css object ], speed, callback);
 *
 * Depends on: modernizer.js && jQuery
 *
 * Special thanks to Stackoverflow.
 */

( function($, undefined) {

        //global plugin variables
        var settings, browserPrefix, animation, transitionEndEvent, $fnStop;
        var isSuppertCssTransitions = "WebKitTransitionEvent" in window || validStyle('transition', 'height 100ms linear');

        function validStyle(prop, value, check_vend) {
            var div = document.createElement('div'), uc = function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1);
            }, vend_pref = function(vend) {
                return "-" + vend.charAt(0).toLowerCase() + vend.substr(1) + "-";
            }, check_style = function(vend) {
                var vend_prop = vend_pref(vend) + prop + ": " + value + ";", uc_vend = uc(vend), propStyle = uc_vend + uc(prop);

                div.setAttribute("style", vend_prop);

                if(!!div.style[propStyle]) {
                    ret = true;
                }
            }, check_vends = check_vend ? [check_vend] : vendors, ret;

            for( i = 0; i < check_vends.length; i++) {
                check_style(check_vends[i]);
            }
            return !!ret;
        }

        //default settings
        settings = {
            "speed": 500,
            "browsers": {
                "webkit": {
                    "prefix": "-webkit-",
                    "endEvent": "webkitTransitionEnd"
                },
                "mozilla": {
                    "prefix": "-moz-",
                    "endEvent": "transitionend"
                },
                "opera": {
                    "prefix": "-o-",
                    "endEvent": "oTransitionEnd"
                },
                "msie": {
                    "prefix": "-ms-",
                    "endEvent": "TransitionEnd"
                },
                "fallback": {
                    "prefix": "",
                    "endEvent": "transitionend"
                }
            }
        };

        //deterime browser prefix and transitionEndEvent
        if($.browser.webkit) {
            browserPrefix = settings.browsers.webkit.prefix;
            transitionEndEvent = settings.browsers.webkit.endEvent;
        }
        else if($.browser.msie) {
            browserPrefix = settings.browsers.msie.prefix;
            transitionEndEvent = settings.browsers.msie.endEvent;
        }
        else if($.browser.mozilla) {
            browserPrefix = settings.browsers.mozilla.prefix;
            transitionEndEvent = settings.browsers.mozilla.endEvent;
        }
        else if($.browser.opera) {
            browserPrefix = settings.browsers.opera.prefix;
            transitionEndEvent = settings.browsers.opera.endEvent;
        }
        else {
            browserPrefix = settings.browsers.fallback.prefix;
            transitionEndEvent = settings.browsers.fallback.endEvent;
        }

        animation = function($obj, cssObject, speed, callback) {
            // if(!speed) {
            // var speed = settings.speed;
            // }
            console.warn('GAOXIAOCHEN --------------> speed:' + speed);
            console.log(cssObject);
            if(isSuppertCssTransitions) {
                console.log('using native css-transitions');
                $obj.data("css3animate", true);
                $obj.css(browserPrefix + "transition", "all " + speed + "ms ease-in-out");
                $obj.css(cssObject);
                $obj.data('animationCss', cssObject);
                $obj.bind(transitionEndEvent, function(event) {
                    $obj.unbind(transitionEndEvent);
                    $.isFunction(callback) && callback($(event.target), event);
                });

            }
            else {
                console.log('falling back to jquery animation');
                $obj.animate(cssObject, speed, function() {
                    $.isFunction(callback) && callback($(this));
                });
            }
        };

        //plugin methods
        methods = {
            run: function(cssObject, speed, callback) {
                return this.each(function() {
                    var $that;
                    $that = $(this);
                    animation($that, cssObject, speed, callback);
                });
            },
            setDefaults: function(options) {
                $.extend({}, settings, options);
            },
            stop: function(clearQueue, jumpToEnd) {
                return this.each(function() {
                    var $that = $(this);
                    var currentCss = {};
                    var animationCss = $that.data('animationCss');
                    for(var prop in animationCss)
                    currentCss[prop] = $that.css(prop);

                    if(jumpToEnd) {
                        animation($that, currentCss, 0, function() {
                            //animation($that, animationCss, 0);
                        });
                    }
                    else {
                        console.log('pause');
                        animation($that, currentCss, 1);
                    }
                    console.log("stop was called");
                });
            }
        };

        $.fn.css3animate = function(method) {
            // if( typeof Modernizr === "undefined") {
            // $.error("Please include modernizer.js to your HTML");
            // }
            // else {
            if(methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            else if( typeof method === "object" || !method) {
                return methods.run.apply(this, arguments);
            }
            else {
                $.error("Method " + method + " does not exist on jQuery.css3animate");
            }
            // }
        };

        //extend stop functionality to css3
        if(isSuppertCssTransitions) {
            $fnStop = $.fn.stop();
            $.fn.stop = function(clearQueue, jumpToEnd) {
                if(this.data("css3animate")) {
                    return methods.stop.apply(this, arguments);
                }
                else {
                    return $fnStop.call(this, arguments);
                }
            };
        }

    }(jQuery));
/* Example
 -----------------
 $(function() {
 // added for monitoring purposes
 var $an = $('#animatable');
 var $mon = $('#monitor');
 function update() {
 $mon.html($an.css('width') + '<br />' + $an.css('height') + '<br />' +
 $an.css('-webkit-transition-duration'));
 }

 var int = setInterval(update, 100);
 $('button.c1').click(function() {
 clearInterval(int);
 $an.stop();
 });
 $('button.c2').click(function() {
 clearInterval(int);
 $an.stop(true, true);
 });

 $an.css3animate({
 "height": "200px",
 "width": "400px"
 }, 1500, function($o) {
 $o.html("with callback");
 });
 });
 */

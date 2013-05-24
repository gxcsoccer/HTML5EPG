/**
 * @author g00201348
 */
define(function(require, exports, module) {
    require('css/Transition.css');
    var vendors = [ "Webkit", "Moz", "O" ];
    var isSuppertCssTransitions = "WebKitTransitionEvent" in window || validStyle( 'transition', 'height 100ms linear' );
    var animationComplete = exports.animationComplete = function(element, callback) {
        if(isSuppertCssTransitions) {
            return element.one('webkitAnimationEnd animationend oAnimationEnd mozAnimationEnd', callback);
        }
        else {
            // defer execution for consistency between webkit/non webkit
            setTimeout(callback, 0);
            return element;
        }
    };

    var toggleViewportClass = function(page, transition) {
        var container = page.get('parentNode');
        container.toggleClass("ui-viewport-transitioning viewport-" + transition);
    };
    var transitonHandlers = {
        'default': function(fromPage, toPage, transition, reverse) {
            var dtd = $.Deferred();
            if(reverse) {
                toggleViewportClass(fromPage, transition);
                fromPage.$el.removeClass(transition + ' in').addClass(transition + ' out reverse');
                animationComplete(fromPage.$el, function() {
                    if(toPage) {
                        toPage.$el.removeClass(transition + ' out').addClass(transition + ' in reverse');
                        toPage.show();
                        animationComplete(toPage.$el, function() {
                            dtd.resolve();
                            toggleViewportClass(fromPage, transition);
                        });
                    }
                    else {
                        dtd.resolve();
                        toggleViewportClass(fromPage, transition);
                    }
                });
            }
            else {
                toggleViewportClass(toPage, transition);
                var fn = function() {
                    toPage.$el.removeClass(transition + ' out reverse').addClass(transition + ' in');
                    toPage.show();
                    animationComplete(toPage.$el, function() {
                        dtd.resolve();
                        toggleViewportClass(toPage, transition);
                    });
                };
                if(fromPage) {
                    fromPage.$el.removeClass(transition + ' in reverse').addClass(transition + ' out');
                    animationComplete(fromPage.$el, function() {
                        fromPage.hide();
                        fn();
                    });
                }
                else {
                    fn();
                }
            }

            return dtd.promise();
        }
    };

    exports.addCustomHandler = function(name, handler) {
        transitonHandlers[name] = fn;
    };

    exports.transitionPages = function(fromPage, toPage, transition, reverse) {
		if(transition === "none") {
			return noneTransition(fromPage, toPage, reverse);
		}
	
        return transitonHandlers['default'](fromPage, toPage, transition, reverse);
    };
	
	function noneTransition(fromPage, toPage, reverse) {
		return $.Deferred(function(dtd) {
			fromPage && fromPage.hide();
			toPage && toPage.show();
			dtd.resolve();
		}).promise();
	}

    function validStyle(prop, value, check_vend) {
        var div = document.createElement('div'), uc = function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1)
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

});

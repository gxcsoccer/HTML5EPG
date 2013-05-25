/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var View = require('./View');
    var Log = require('core/util/Logger');
    var Transition = require('./PageTransition');
    var UT = require('core/util/Utils');
    var defaultTransition = 'none';

    return View.extend({
        tagName: 'section',
        /**
         * Push page to current panel
         * @param {Object} page
         * @param {Object} option
         */
        pushPage: function(page) {
            var topPage = this.getTopPage();
            if(topPage && topPage.get('pageName') == page.get('pageName')) {
                Log.warn('[Panel]:', 'The page already there.');
                return;
            }
            this.appendChild(page.hide());
            Transition.transitionPages(topPage, page, defaultTransition, false);
        },
        /**
         * Pop the top page
         */
        popPage: function() {
            var len = this.children.length;
            var fromPage = this.getTopPage();
            var toPage = this.children[len - 2];
            if(len > 0) {
                Transition.transitionPages(fromPage, toPage, defaultTransition, true).done(UT.cb(function() {
                    this.removeChildAt(len - 1);
                }, this));
            }
        },
        getTopPage: function() {
            var len = this.children.length;
            if(len > 0) {
                return this.children[len - 1];
            }

            return null;
        },
        eventHandler: {
            BACK_KEY: function(e) {
                this.popPage();
            }
        }
    });
});

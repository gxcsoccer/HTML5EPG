/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var Observable = require('core/event/Observable');
    var Attribute = require('./Attribute');
    var UT = require('core/util/Utils');

    return $.Class.extend({
        init: function() {
            UT.mixin(this, Observable);
            UT.mixin(this, Attribute);
        }
    });
});

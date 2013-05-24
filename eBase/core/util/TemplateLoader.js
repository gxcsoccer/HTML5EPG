/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var _ = require('_');
    var id2Url = seajs.pluginSDK.util.id2Uri;
    var templateCache = {};

    var normalize = function(pageName) {
        return pageName.replace(/[^A-Z][A-Z]/g, function(str) {
            return str.slice(0, 1) + '_' + str.slice(1, 2).toLowerCase();
        }).replace(/[A-Z][^A-Z]/g, function(str) {
            return '_' + str.slice(0, 1).toLowerCase() + str.slice(1, 2);
        }).toLowerCase().slice(1);
    };

    var loadTemplate = exports.loadTemplate = function(pageName) {
        if(templateCache[pageName]) {
            return templateCache[pageName];
        }

        var dtd = templateCache[pageName] = $.Deferred();
        var templateName = normalize(pageName) + '.html#';

        $.ajax({
            url: id2Url('customize/template/' + templateName),
            dataType: 'html'
        }).done(dtd.resolve).fail(dtd.reject);

        return dtd.promise();
    };
});

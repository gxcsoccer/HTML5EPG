/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var TL = require('core/util/TemplateLoader');
    var UT = require('core/util/Utils');

    var desktopClass = require('./Desktop');
    var desktop = exports.desktop = new desktopClass();

    /**
     * <页面导航>
     */
    var navigate = exports.navigate = function(url, option) {
        var fragArr = url.split('/'), panelName, viewName;
        switch(fragArr.length) {
            case 1:
                panelName = 'main';
                pageName = fragArr[1];
                break;
            default:
                panelName = fragArr[0];
                pageName = fragArr[fragArr.length - 1];
                break;
        }

        seajs.use('customize/view/' + url, function(pageClass) {
            TL.loadTemplate(pageName).done(UT.cb(function(template) {
                var page = new pageClass({
                    pageName: pageName,
                    template: template
                });
                desktop.pushPage(panelName, page);

            }, this));
        });
    };

    /**
     * <模拟浏览器后退操作>
     */
    var back = exports.back = function() {
        desktop.popPage();
    };

    /**
     * <启动>
     */
    var start = exports.start = function() {
        navigate('main/MainMenuPage');
    };
});

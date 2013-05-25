/**
 * @author g00201348
 */
define(function(require, exports, module) {
    require('css/Desktop.css');
    //require('customize/asset/stylesheets/Desktop.css');
    var _ = require('_');
    var UT = require('core/util/Utils');
    var Log = require('core/util/Logger');
    var View = require('./View');
    var PanelClass = require('./Panel');
    var $desktop = $('#desktop');

    return View.extend({
        panelCollection: ['main', 'video'],
        attrs: {
            $el: ($desktop.length == 0) ? $('<div id="desktop"></div>') : $desktop
        },
        init: function(option) {
            this.Super.apply(this, arguments);
            this.render();
        },
        render: function() {
            this.$el.html('');
            $.each(this.panelCollection || [], UT.cb(function(index, panelName) {
                this[panelName] = (new PanelClass({
                    'id': panelName + '_panel',
                    'class': 'panel'
                })).hide();
                this.appendChild(this[panelName]);
            }, this));

            return this.Super.apply(this, arguments);
        },
        pushPage: function(panelName, page) {
            if(!this[panelName]) {
                Log.error('[Desktop]', 'the panel: ' + panelName + ' dose not exist!');
                return;
            }
            this.showPanel(panelName);
            this[panelName].pushPage(page);
        },
        popPage: function(panelName) {
            var panel = panelName ? this[panelName] : (this['main'].isActive ? this['main'] : this['video']);
            if(panel) {
                Log.error('[Desktop]', 'the panel: ' + panelName + ' dose not exist!');
                return;
            }
            panel.popPage(page);
        },
        showPanel: function(panelName, option) {
            switch(panelName) {
                case 'main':
                    this['video'].reset().hide();
                    break;
                case 'video':
                    this['main'].hide();
                default:
                    break;
            }
            this[panelName].show(option);
        },
        hidePanel: function(panelName, option) {
            this[panelName].hide(option);
        }
    });
});

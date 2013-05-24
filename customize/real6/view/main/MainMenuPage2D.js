/**
 * @author g00201348
 */
define(function(require, exports, module) {
    require('css/MainMenuPage.css');
    var View = require('core/view/View');
    var Position = require('core/view/Position');
    var WindowManager = require('core/view/WindowManager');
    var GallaryWidget = require('widget/GallaryWidget');

    return View.extend({
        attrs: {
            categoryIndex: 0
        },
        eventHandler: {
            OK_KEY: function(e) {
                var currentIndex = this.get('categoryIndex');
                WindowManager.navigate($.data(this.categoryList[currentIndex], 'url'));
            },
            RIGHT_KEY: function() {
                var prev = this.get('categoryIndex');
                if(prev < (this.categoryCount - 1)) {
                    this.set('categoryIndex', prev + 1);
                }
                this.$gallaryWidget.reShow();
            },
            LEFT_KEY: function() {
                var prev = this.get('categoryIndex');
                if(prev > 0) {
                    this.set('categoryIndex', prev - 1);
                }
                this.$gallaryWidget.reShow();
            },
            UP_KEY: function() {
                if(!this.$gallaryWidget.isActive) {
                    this.$gallaryWidget.active().refresh();
                    this.$shadow.hide();
                }
            },
            DOWN_KEY: function() {
                if(this.$gallaryWidget.isActive) {
                    this.$gallaryWidget.deactive().refresh();
                    this.$shadow.show();
                }
            }
        },
        render: function() {
            this.$gallaryWidget = new GallaryWidget({
                $el: this.$('#canvas')
            });
            this.appendChild(this.$gallaryWidget);

            return this.Super.apply(this, arguments);
        },
        onLoad: function() {
            this.$shadow = this.$('#shadow_effect');
            this.categoryList = $.map(this.$('#menu_list > li') || [], function(dom, index) {
                var $item = $(dom);
                $.data($item, 'url', $item.find('a').attr('href'));
                return $item;
            });
            this.categoryCount = this.categoryList.length;
            this.$gallaryWidget.deactive();
        },
        _onChangeCategoryIndex: function(now, prev, key) {
            this.categoryList[prev].removeClass('focus_item');
            this.categoryList[now].addClass('focus_item');
            Position.pin(this.$shadow[0], {
                element: this.categoryList[now].find('a')[0],
                x: '50%-91px',
                y: 48
            });
        }
    });
});

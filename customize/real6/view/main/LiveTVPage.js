/**
 * @author g00201348
 */
define(function(require, exports, module) {
    require('css/LiveTVPage.css');
    var View = require('core/view/View');
    var ShadowWidget = require('widget/ShadowWidget');
    var FavChannelWidget = require('widget/FavChannelWidget');
    var HotChannelWidget = require('widget/HotChannelWidget');
    var AllChannelWidget = require('widget/AllChannelWidget');
    var Position = require('core/view/Position');
    var UT = require('core/util/Utils');

    return View.extend({
        attrs: {
            categoryIndex: 0
        },
        eventHandler: {
            OK_KEY: function(e) {
            },
            RIGHT_KEY: function() {
                var prev = this.get('categoryIndex');
                if(prev < (this.categoryCount - 1)) {
                    this.set('categoryIndex', prev + 1);
                }
            },
            LEFT_KEY: function() {
                var prev = this.get('categoryIndex');
                if(prev > 0) {
                    this.set('categoryIndex', prev - 1);
                }
            },
            UP_KEY: function() {
                var categoryIndex = this.get('categoryIndex');
                var currentContent = this.widgetList[categoryIndex];
                var self = this;
                if(currentContent && currentContent.isActive) {
                    this.$shadow.show();
                    setTimeout(function() {
                        currentContent.deactive();
                        self.shadowWidget.up();
                    }, 0);

                    this.$arrow.removeClass('deactive');
                }
            },
            DOWN_KEY: function() {
                var categoryIndex = this.get('categoryIndex');
                var currentContent = this.widgetList[categoryIndex];
                var self = this;
                if(currentContent) {
                    this.shadowWidget.config(currentContent.shadowConfig);
                    this.shadowWidget.down().done(function() {
                        currentContent.active();
                        self.$shadow.hide();
                    });
                    this.$arrow.addClass('deactive');
                }
            }
        },
        render: function() {
            this.widgetList = [new FavChannelWidget({
                $el: this.$('#favorite_section')
            }), new HotChannelWidget({
                $el: this.$('#hot_section')
            }), new AllChannelWidget({
                $el: this.$('#all_channel_section')
            })];
            var categoryIndex = this.get('categoryIndex');
            $.each(this.widgetList || [], UT.cb(function(index, widget) {
                this.appendChild(widget, this.$el, categoryIndex != index);
                categoryIndex == index && widget.hide();
            }, this));
            this.widgetList[categoryIndex].show({
                active: false
            });

            this.$shadow = this.$('#nav_shadow');
            this.shadowWidget = new ShadowWidget({
                $el: this.$shadow
            });
            this.appendChild(this.shadowWidget);

            return this.Super.apply(this, arguments);
        },
        onLoad: function() {

            this.$arrow = this.$('#nav_arrow');
            this.categoryList = $.map(this.$('#category_list > li') || [], function(dom, index) {
                var $item = $(dom);
                return $item;
            });
            this.categoryCount = this.categoryList.length;
        },
        _onChangeCategoryIndex: function(now, prev, key) {
            this.categoryList[prev].removeClass('focus_item');
            this.categoryList[now].addClass('focus_item');
            var baseElement = this.categoryList[now].find('a')[0];
            Position.pin(this.$shadow[0], {
                element: baseElement,
                x: '50%-95px',
                y: '100%+2px'
            });
            Position.pin(this.$arrow[0], {
                element: baseElement,
                x: '-20px',
                y: '2px'
            });
            if(this.widgetList[prev]) {
                this.widgetList[prev].hide();
            }
            if(this.widgetList[now]) {
            	!this.widgetList[now].isRender && this.widgetList[now].render();
                this.widgetList[now].show({
                    active: false
                });
            }
        }
    });
});

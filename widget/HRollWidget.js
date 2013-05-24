/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var View = require('core/view/View');
    var UT = require('core/util/Utils');
    var juicer = require('juicer');
    var template = juicer.compile('{@each list as it,index}<li><img src="customize/real6/asset/img/${it.poster}" /><span>${it.programName}</span></li>{@/each}');

    var HRollWidget = View.extend({
        offset: 197,
        attrs: {
            baseIndex: 0
        },
        eventHandler: {
            LEFT_KEY: function() {
                var parent = this.get('parent');
                var focusCoordinate = parent.get('focusCoordinate');
                if(focusCoordinate.x > 0) {
                    return 0;
                }

                var baseIndex = this.get('baseIndex');
                if(baseIndex == 0) {
                    return 1;
                }

                this.set('baseIndex', baseIndex - 1);
            },
            RIGHT_KEY: function() {
                var parent = this.get('parent');
                var focusCoordinate = parent.get('focusCoordinate');
                if(focusCoordinate.x < (parent.maxColumn - 1)) {
                    return 0;
                }

                var baseIndex = this.get('baseIndex');
                if(baseIndex == this.itemList.length - parent.maxColumn) {
                    return 1;
                }

                this.set('baseIndex', baseIndex + 1);
            }
        },
        render: function() {
            // console.time('HRollWidget --> render');

            var title = this.get('title');
            this.itemList = this.get('list');
            this.$rollBox = this.$('.horizontal_box');
            // console.timeEnd('HRollWidget --> render');

            return this.Super.apply(this, arguments);
        },
        onLoad: function() {
        },
        active: function() {
            var baseIndex = this.get('baseIndex');
            var parent = this.get('parent');
            var rightArrow = (baseIndex + parent.maxColumn < this.itemList.length) ? 'right_arrow ' : '';
            var leftArrow = baseIndex > 0 ? 'left_arrow' : '';
            this.$el.addClass(rightArrow + leftArrow);
            return this.Super.apply(this, arguments);
        },
        deactive: function() {
            this.$el.removeClass();
            return this.Super.apply(this, arguments);
        },
        _onChangeBaseIndex: function(now, prev, key) {
            var translateX = -(now * this.offset);
            // this.$rollBox.css({
            // 'WebkitTransform': 'translate3d(' + translateX + 'px, 0px, 0px)'
            // });

            UT.xbCss(this.$rollBox[0], {
                'transform': 'translate3d(' + translateX + 'px, 0px, 0px)'
            });
            var parent = this.get('parent');
            var rightArrow = (now + parent.maxColumn < this.itemList.length) ? 'right_arrow ' : '';
            var leftArrow = now > 0 ? 'left_arrow' : '';
            this.$el.removeClass().addClass(rightArrow + leftArrow);
        }
    });

    return HRollWidget;
});

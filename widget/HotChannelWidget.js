/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var View = require('core/view/View');
    var HRollWidget = require('widget/HRollWidget');
    var UT = require('core/util/Utils');
    var categoryArr = ['News', 'Sports', 'UGC', 'Top', 'Latest', 'Popular', 'Featured'];
    var imageArray = ['Queen.jpg', 'Avatar.jpg', 'The Avengers.jpg', 'God Father.jpg', 'Madagascar.jpg', 'Journalist.jpg', 'Steve Jobs.jpg', 'Mother.jpg', 'Green Lantern.jpg', 'Green Lantern Cartoon.jpg', 'Black Man.jpg', 'Jeremy Lin.jpg', 'Horrible.jpg', 'Cartoon.jpg'];
    var randomItem = function(array) {
        var count = array.length;
        return array[Math.round(Math.random() * (count - 1))];
    };

    var juicer = require('juicer');
    var template = juicer.compile('{@each categoryList as category,index}<li><div id="hot_sub_container" class="view_port"><div class="title">${category.categoryName}</div><ul class="horizontal_box scroll_box">{@each category.programList as it,index}<li><img src="customize/real6/asset/img/${it.poster}" /><span>${it.programName}</span></li>{@/each}</ul></div></li> {@/each}');

    var mockData = function() {
        var jj = 5;
        var categoryList = $.map(categoryArr, function(category, index) {
            var obj = {
                categoryName: category,
                programList: []
            };

            for(var i = 0; i < 10; i++) {
                var img = imageArray[jj];
                obj.programList.push({
                    programName: img.slice(0, -4),
                    poster: img
                });
                jj = (jj == (imageArray.length - 1) ? 0 : (jj + 1));
            }

            return obj;
        });

        return categoryList;
    };
    var data = mockData();

    var HotChannelWidget = View.extend({
        categoryList: [],
        maxColumn: 5,
        maxRow: 3,
        boxSize: {
            width: 197,
            height: 178
        },
        shadowConfig: {
            width: 187,
            height: 105,
            radius: 5,
            offsetLeft: 148, //-143.5,
            offsetTop: 182, //66
            orginLeft: 293.5,
            orginTop: 116
        },
        attrs: {
            categoryIndex: 0,
            focusCoordinate: {
                x: 0,
                y: 0
            },
            canvasVerticalIndex: 0
        },
        eventHandler: {
            OK_KEY: function() {
                alert(1);
            },
            UP_KEY: function() {
                var categoryIndex = this.get('categoryIndex');
                var focusCoordinate = this.get('focusCoordinate');
                if(categoryIndex == 0) {
                    if(focusCoordinate.x === 0) {
                        return 0;
                    }
                    else {
                        this.set('focusCoordinate', {
                            x: 0,
                            y: focusCoordinate.y
                        });
                        return 1;
                    }
                }

                this.set('categoryIndex', categoryIndex - 1);
            },
            DOWN_KEY: function() {
                var categoryIndex = this.get('categoryIndex');
                if(categoryIndex == (this.categoryList.length - 1)) {
                    return 1;
                }

                this.set('categoryIndex', categoryIndex + 1);
            },
            LEFT_KEY: function() {
                var focusCoordinate = this.get('focusCoordinate');
                if(focusCoordinate.x > 0) {
                    this.set('focusCoordinate', {
                        x: focusCoordinate.x - 1,
                        y: focusCoordinate.y
                    });
                }
            },
            RIGHT_KEY: function() {
                var focusCoordinate = this.get('focusCoordinate');
                if(focusCoordinate.x < (this.maxColumn - 1)) {
                    this.set('focusCoordinate', {
                        x: focusCoordinate.x + 1,
                        y: focusCoordinate.y
                    });
                }
            }
        },
        render: function() {
            this.categoryList = data;

            var $container = this.$chanContainer = this.$('#hot_channels');
            this.$focusBox = this.$('#hot_focus_box');
            //console.time('HotChannelWidget --> render');

            var html = template.render({
                categoryList: this.categoryList
            });
            $container.html(html);
            var that = this;
            this.rollWidgetList = [];
            this.$('#hot_channels > li').each(function(index, el) {
                var rollWidget = new HRollWidget({
                    $el: $(el),
                    list: that.categoryList[index].programList,
                    parent: that
                });
                that.appendChild(rollWidget, $container);
                rollWidget.deactive();
                that.rollWidgetList.push(rollWidget);
            });

            //console.timeEnd('HotChannelWidget --> render');

            // reflection effect for last row in view port
            var effectRow = this.rollWidgetList.length >= this.maxRow ? (this.maxRow - 1) : (this.rollWidgetList.length - 1);
            this.rollWidgetList[effectRow].$('.horizontal_box').addClass('bottom_box');

            return this.Super.apply(this, arguments);
        },
        active: function() {
            if(this.rollWidgetList[this.get('categoryIndex')]) {
                this.rollWidgetList[this.get('categoryIndex')].active();
            }
            this.$el.addClass('active');
            return this.Super.apply(this, arguments);
        },
        deactive: function() {
            if(this.rollWidgetList[this.get('categoryIndex')]) {
                this.rollWidgetList[this.get('categoryIndex')].deactive();
            }
            this.$el.removeClass('active');
            return this.Super.apply(this, arguments);
        },
        _onChangeCategoryIndex: function(now, prev, key) {
            this.rollWidgetList[prev].deactive();
            this.rollWidgetList[now].active();

            var focusCoordinate = this.get('focusCoordinate');
            var canvasVerticalIndex = this.get('canvasVerticalIndex');
            var gap = now - prev;
            if((focusCoordinate.y + gap) < 0) {
                this.set('canvasVerticalIndex', canvasVerticalIndex + gap);
                var effectRow = this.rollWidgetList.length >= this.maxRow ? (this.maxRow - 1) : (this.rollWidgetList.length - 1);
                this.rollWidgetList[prev + effectRow].$rollBox.removeClass('bottom_box');
                this.rollWidgetList[now + effectRow].$rollBox.addClass('bottom_box');
            }
            else if((focusCoordinate.y + gap) >= this.maxRow) {
                this.set('canvasVerticalIndex', canvasVerticalIndex + gap);
                this.rollWidgetList[prev].$rollBox.removeClass('bottom_box');
                this.rollWidgetList[now].$rollBox.addClass('bottom_box');
            }
            else {
                this.set('focusCoordinate', {
                    x: focusCoordinate.x,
                    y: focusCoordinate.y + gap
                });
            }
        },
        _onChangeFocusCoordinate: function(now, prev, key) {
            var translateX = 30 + now.x * this.boxSize.width;
            var translateY = 35 + now.y * this.boxSize.height;
            // this.$focusBox.css({
            // 'WebkitTransform': 'translate3d(' + translateX + 'px, ' +
            // translateY + 'px, 0px)'
            // });

            UT.xbCss(this.$focusBox[0], {
                'transform': 'translate3d(' + translateX + 'px, ' + translateY + 'px, 0px)'
            });
        },
        _onChangeCanvasVerticalIndex: function(now, prev, key) {
            var translateY = -this.boxSize.height * now;
            var categoryIndex = this.get('categoryIndex');
            var focusCoordinate = this.get('focusCoordinate');
            // this.$chanContainer.css({
            // 'WebkitTransform': 'translate3d(0px, ' + translateY + 'px, 0px)'
            // });

            UT.xbCss(this.$chanContainer[0], {
                'transform': 'translate3d(0px, ' + translateY + 'px, 0px)'
            });
        }
    });

    return HotChannelWidget;
});

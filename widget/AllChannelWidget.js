/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var View = require('core/view/View');
    var SubChannelWidget = require('widget/SubChannelWidget');
    var UT = require('core/util/Utils');

    var channelArr = ['Sky Turk', 'Sony Pix', 'Show TV', 'NBC', 'Brava', 'TRT 6', 'CCTV 5', 'BTV 1', 'HBO', 'ABC', 'ESPN', 'Channel V'];
    var imageArray = ['ABC.png', 'brava.png', 'NBC.png', 'SHOW.png', 'SKY.png', 'TRT.png'];
    var playbillArr = ['Sunshine', 'Flicka 2', 'Road Rage', 'Good Deal with Dave', 'Cath it Keep it', 'Pokemon DP', 'The A-Team', 'Parks and Recreation', 'For Love of the Game', 'Stone of Destiny', 'Boy on the Side', 'Pay it Forward', 'My One and Only', 'Blind Injustice', 'Seven Years in Tibet'];
    var randomItem = function(array) {
        var count = array.length;
        return array[Math.round(Math.random() * (count - 1))];
    };
    var mockData = function() {
        var channelList = []
        for(var ii = 0; ii < 12; ii++) {
            var obj = {
                id: ii + 1,
                name: randomItem(channelArr),
                logo: randomItem(imageArray),
                playbillList: []
            };

            for(var i = 0; i < 24; i++) {
                obj.playbillList.push({
                    name: randomItem(playbillArr),
                    time: i
                });
            }
            channelList.push(obj);
        }

        return channelList;
    };
    var data = mockData();

    var juicer = require('juicer');
    var template = juicer.compile('{@each channelList as channel, index}<li class="focus_item"><div class="chan_info"><img class="chan_logo" src="customize/real6/asset/img/${channel.logo}" /><div class="chan_key"><span class="chan_num">${channel.id}</span><span class="chan_title">${channel.name}</span></div></div><div id="all_sub_container" class="view_port"><ul class="horizontal_box scroll_box">{@if index < 6}{@each channel.playbillList as playbill}<li {@if hours == playbill.time}class="current"{@/if}><span class="prog_title">${playbill.name}</span><span class="prog_time">{@if playbill.time < 10}0${playbill.time}{@else}${playbill.time}{@/if}:00</span><div class="prog_progress"><div class="prog_current"></div></div></li>{@/each}{@/if}</ul></div></li>{@/each}');

    var AllChannelWidget = View.extend({
        channelList: [],
        maxRow: 6,
        maxColumn: 3,
        boxSize: {
            width: 300,
            height: 79
        },
        shadowConfig: {
            width: 300,
            height: 80,
            radius: 5,
            offsetLeft: 638, //186,
            offsetTop: 173, //57
            orginLeft: 455.5,
            orginTop: 116
        },
        attrs: {
            channelIndex: 0,
            focusCoordinate: {
                x: 1,
                y: 0
            },
            canvasVerticalIndex: 0
        },
        eventHandler: {
            DOWN_KEY: function() {
                var channelIndex = this.get('channelIndex');
                if(channelIndex >= (this.channelList.length - 1)) {
                    return 1;
                }

                this.set('channelIndex', channelIndex + 1);
            },
            UP_KEY: function() {
                var channelIndex = this.get('channelIndex');
                var focusCoordinate = this.get('focusCoordinate');
                if(channelIndex == 0) {
                    this.set('focusCoordinate', {
                        x: 1,
                        y: 0
                    });
                    return 0;
                }

                this.set('channelIndex', channelIndex - 1);
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
            this.channelList = data;
            this.$focusBox = this.$('#all_focus_box');
            this.$focusBar = this.$('#all_focus_bar');
            this.$allChannel = this.$('#all_channels');
            console.time('AllChannelWidget --> render');

            var now = new Date();
            var hours = now.getHours();
            var percentage = Math.floor((now.getMinutes() * 100) / 60) + '%';

            var html = template.render({
                channelList: this.channelList,
                hours: hours
            });
            var that = this;

            this.$('.prog_current').css({
                width: percentage
            });

            this.$allChannel.html(html);
            this.channelWidgetList = [];
            this.$('#all_channels > li').each(function(index, el) {
                var channelWidget = new SubChannelWidget({
                    $el: $(el),
                    channel: that.channelList[index],
                    parent: that,
                    initIndex: hours,
                    preRender: index < that.maxRow,
                    hours: hours
                });
                that.appendChild(channelWidget, that.$allChannel, index >= that.maxRow);
                index < that.maxRow && channelWidget.deactive();
                that.channelWidgetList.push(channelWidget);
            });

            console.timeEnd('AllChannelWidget --> render');

            return this.Super.apply(this, arguments);
        },
        active: function() {
            this.$el.addClass('active');
            var channelIndex = this.get('channelIndex');
            if(this.channelWidgetList[channelIndex]) {
                this.channelWidgetList[channelIndex].active();
            }

            return this.Super.apply(this, arguments);
        },
        deactive: function() {
            this.$el.removeClass('active');
            var channelIndex = this.get('channelIndex');
            if(this.channelWidgetList[channelIndex]) {
                this.channelWidgetList[channelIndex].deactive();
            }
            return this.Super.apply(this, arguments);
        },
        _onChangeChannelIndex: function(now, prev, key) {
            var bottomIndex = now + this.maxRow - 1;
            this.channelWidgetList[bottomIndex] && !this.channelWidgetList[bottomIndex].isRender && this.channelWidgetList[bottomIndex].render().deactive().onLoad();
            this.channelWidgetList[prev].deactive();
            this.channelWidgetList[now].active();
            var baseIndex = (this.maxRow / 2) - 1;

            var focusCoordinate = this.get('focusCoordinate');
            var canvasVerticalIndex = this.get('canvasVerticalIndex');
            if(focusCoordinate.y != baseIndex || (((canvasVerticalIndex + this.maxRow) >= this.channelList.length) && now > prev) || (canvasVerticalIndex == 0 && now < prev)) {
                this.set('focusCoordinate', {
                    x: 1,
                    y: focusCoordinate.y + now - prev
                });
            }
            else {
                this.set('canvasVerticalIndex', canvasVerticalIndex + now - prev);
                this.set('focusCoordinate', {
                    x: 1,
                    y: focusCoordinate.y
                });
            }
        },
        _onChangeFocusCoordinate: function(now, prev, key) {
            var translateX = 302 + now.x * this.boxSize.width;
            var translateY = now.y * this.boxSize.height;
            // this.$focusBar.css({
            // 'WebkitTransform': 'translate3d(14px, ' + translateY + 'px, 0px)'
            // });
            // this.$focusBox.css({
            // 'WebkitTransform': 'translate3d(' + translateX + 'px, 0px, 0px)'
            // });
            UT.xbCss(this.$focusBar[0], {
                'transform': 'translate3d(14px, ' + translateY + 'px, 0px)'
            });
            UT.xbCss(this.$focusBox[0], {
                'transform': 'translate3d(' + translateX + 'px, 0px, 0px)'
            });
        },
        _onChangeCanvasVerticalIndex: function(now, prev, key) {
            var translateY = -this.boxSize.height * now;
            // this.$allChannel.css({
            // 'WebkitTransform': 'translate3d(0px, ' + translateY + 'px, 0px)'
            // });

            UT.xbCss(this.$allChannel[0], {
                'transform': 'translate3d(0px, ' + translateY + 'px, 0px)'
            });
        }
    });

    return AllChannelWidget;
});

/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var View = require('core/view/View');
    var UT = require('core/util/Utils');
    
    var juicer = require('juicer');
    var template = juicer.compile('{@each list as playbill}<li {@if hours == playbill.time}class="current"{@/if}><span class="prog_title">${playbill.name}</span><span class="prog_time">{@if playbill.time < 10}0${playbill.time}{@else}${playbill.time}{@/if}:00</span><div class="prog_progress"><div class="prog_current"></div></div></li>{@/each}');


    var SubChannelWidget = View.extend({
        boxWidth: 298,
        attrs: {
            baseIndex: 0
        },
        eventHandler: {
            LEFT_KEY: function() {
                var parent = this.get('parent');
                var focusCoordinate = parent.get('focusCoordinate');
                var baseIndex = this.get('baseIndex');
                if(baseIndex == 0 || focusCoordinate.x > 1) {
                    return 0;
                }

                this.set('baseIndex', baseIndex - 1);
            },
            RIGHT_KEY: function() {
                var parent = this.get('parent');
                var focusCoordinate = parent.get('focusCoordinate');
                var channel = this.get('channel');
                var baseIndex = this.get('baseIndex');
                if((baseIndex == channel.playbillList.length - parent.maxColumn) || focusCoordinate.x < 1) {
                    return 0;
                }

                this.set('baseIndex', baseIndex + 1);
            }
        },
        render: function() {
            this.Super.apply(this, arguments);
            var initIndex = this.get('initIndex');
            var channel = this.get('channel');
            // var now = new Date();
            // var hours = now.getHours();
            // var percentage = Math.floor((now.getMinutes() * 100) / 60);
            // this.$('.chan_logo').attr('src', 'customize/real6/asset/img/' + channel.logo);
            // this.$('.chan_num').text(channel.id);
            // this.$('.chan_title').text(channel.name);
            var preRender = this.get('preRender');
            var hours = this.get('hours');

            this.$rollBox = this.$('.horizontal_box');
            if(!preRender) {
            	console.time('SubChannelWidget --> render');
                var html = template.render({
                    list: channel.playbillList,
                    hours: hours
                });
                this.$rollBox.html(html);
                console.timeEnd('SubChannelWidget --> render');
            }
            
            
            //var $template = this.$('.horizontal_box > li').remove();
            // $.each(channel.playbillList || [], UT.cb(function(index, playbill) {
                // var $item = $template.clone();
                // var timeStr = playbill.time < 10 ? ('0' + playbill.time) : ('' + playbill.time);
// 
                // $item.find('.prog_title').text(playbill.name);
                // $item.find('.prog_time').text(timeStr + ':00');
                // $item.find('.prog_current').css({
                    // width: percentage + '%'
                // });
                // if(playbill.time == hours) {
                    // $item.addClass('current');
                // }
                // $item.appendTo(this.$rollBox);
            // }, this));
            this.gotoIndex(initIndex);
            return this;
        },
        active: function() {
            this.$el.addClass('focus_item');
            return this.Super.apply(this, arguments);
        },
        deactive: function() {
            this.$el.removeClass('focus_item');
            var now = new Date();
            this.gotoIndex(now.getHours());
            return this.Super.apply(this, arguments);
        },
        gotoIndex: function(index) {
            this.set('baseIndex', index - 1);
        },
        _onChangeBaseIndex: function(now, prev, key) {
            if(!this.isRender) {
                return;
            }
            var translateX = -now * this.boxWidth;
            // this.$rollBox.css({
            // 'WebkitTransform': 'translate3d(' + translateX + 'px, 0px, 0px)'
            // });
            UT.xbCss(this.$rollBox[0], {
                'transform': 'translate3d(' + translateX + 'px, 0px, 0px)'
            });
        }
    });

    return SubChannelWidget;
});

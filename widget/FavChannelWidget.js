/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var View = require('core/view/View');
    var Position = require('core/view/Position');
    var UT = require('core/util/Utils');

    var imageArray = ['ABC.png', 'brava.png', 'NBC.png', 'SHOW.png', 'SKY.png', 'TRT.png'];
    var videoArray = ['1.mp4', '1.mp4', '1.mp4', '1.mp4', '1.mp4'];
    var randomItem = function(array) {
        var count = array.length;
        return array[Math.round(Math.random() * (count - 1))];
    };

    var favoriteChannels = [];
    for(var i = 0; i < 30; i++) {
        var image = randomItem(imageArray);
        favoriteChannels.push({
            name: image.slice(0, -4),
            logo: image,
            videoUrl: 'customize/real6/asset/video/4.webm' //+
            // randomItem(videoArray)
        });
    }

    var FavChannelWidget = View.extend({
        maxColumn: 3,
        maxRow: 4,
        boxSize: {
            width: 214,
            height: 121
        },
        shadowConfig: {
            width: 212,
            height: 120,
            radius: 5,
            offsetLeft: 594,//445,
            offsetTop: 176,//60
            orginLeft: 149,
            orginTop: 116
        },
        attrs: {
            favoriteChannels: favoriteChannels,
            channelIndex: 0,
            focusCoordinate: {
                x: 0,
                y: 0
            },
            canvasVerticalIndex: 0
        },
        eventHandler: {
            OK_KEY: function() {
                this.isPlaying ? this.pauseVideo() : this.playVideo();
            },
            RIGHT_KEY: function() {
                var channelIndex = this.get('channelIndex');
                if(channelIndex == this.totalCount - 1) {
                    return 1;
                }

                this.set('channelIndex', channelIndex + 1);
            },
            LEFT_KEY: function() {
                var channelIndex = this.get('channelIndex');
                if(channelIndex == 0) {
                    return 1;
                }

                this.set('channelIndex', channelIndex - 1);
            },
            UP_KEY: function() {
                var channelIndex = this.get('channelIndex');
                if((channelIndex - this.maxColumn) < 0) {
                	if(channelIndex === 0) {
                		return 0;
                	}
                	else {
                		this.set('channelIndex', 0);
                		return 1;
                	}
                }

                this.set('channelIndex', (channelIndex - this.maxColumn));
            },
            DOWN_KEY: function() {
                var channelIndex = this.get('channelIndex');
                if((channelIndex + this.maxColumn) >= this.totalCount) {
                    return 1;
                }

                this.set('channelIndex', (channelIndex + this.maxColumn));
            }
        },
        render: function() {
            this.$favChannel = this.$('#favorite_channels');
            this.$focusBox = this.$('#fav_focus_box');
            if(!this.$template) {
                this.$template = this.$favChannel.children().remove();
            }
            else {
                this.$favChannel.html('');
            }
            var favChannelList = this.get('favoriteChannels');
            this.totalCount = favChannelList.length;
            
            //console.time('FavChannelWidget --> render');
            this.favChannelList = $.map(favChannelList || [], UT.cb(function(channel, index) {
                var $item = this.$template.clone();
                $item.css({
                    'backgroundImage': "url('customize/real6/asset/img/" + channel.logo + "')"
                });
                $item.appendTo(this.$favChannel);
                return $item;
            }, this));
            //console.timeEnd('FavChannelWidget --> render');

            return this.Super.apply(this, arguments);
        },
        onLoad: function() {
            this.$video = this.$('#video_play');
			if(this.$video.length === 0) {
				this.$video = null;
			}
            var self = this;
            this.$video && this.$video.on('playing', function(e) {
                self.isPlaying = true;
            });
            this.$videoName = this.$('#video_name').text(this.get('favoriteChannels')[0].name);
            if($.browser.mozilla && this.$video) {
                this.$video.attr('src', 'customize/real6/asset/video/5.webm');
            }

            //this.playVideo();
        },
        playVideo: function() {
            this.$video && this.$video[0].play && this.$video[0].play();
            //this.$video[0].play();
        },
        pauseVideo: function() {
            this.isPlaying = false;
            this.$video && this.$video[0].pause && this.$video[0].pause();
            //this.$video[0].pause();
        },
        show: function() {
            this.Super.apply(this, arguments);
            //this.playVideo();
        },
        hide: function() {
            this.Super.apply(this, arguments);
            this.pauseVideo();
        },
        active: function() {
            if(this.$focusBox) {
                this.$focusBox.show();
            }
            return this.Super.apply(this, arguments);
        },
        deactive: function() {
            if(this.$focusBox) {
                this.$focusBox.hide();
            }
            return this.Super.apply(this, arguments);
        },
        _onChangeChannelIndex: function(now, prev, key) {
            var focusCoordinate = this.get('focusCoordinate');
            var favoriteChannels = this.get('favoriteChannels');
            var canvasVerticalIndex = this.get('canvasVerticalIndex');
            var offsetY = Math.floor(now / this.maxColumn) - Math.floor(prev / this.maxColumn);
            if((focusCoordinate.y + offsetY) < 0 || (focusCoordinate.y + offsetY) >= this.maxRow) {
                this.set('canvasVerticalIndex', canvasVerticalIndex + offsetY);
                this.set('focusCoordinate', {
                    x: now % this.maxColumn,
                    y: focusCoordinate.y
                });
            }
            else {
                this.set('focusCoordinate', {
                    x: now % this.maxColumn,
                    y: focusCoordinate.y + offsetY
                });
            }
            //this.$video.attr('src', favoriteChannels[now].videoUrl);
            this.$videoName.text(favoriteChannels[now].name);
            //this.playVideo();
        },
        _onChangeFocusCoordinate: function(now, prev, key) {
            var translateX = now.x * this.boxSize.width;
            var translateY = now.y * this.boxSize.height;
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
            // this.$favChannel.css({
            // 'WebkitTransform': 'translate3d(0px, ' + translateY + 'px, 0px)'
            // });

            UT.xbCss(this.$favChannel[0], {
                'transform': 'translate3d(0px, ' + translateY + 'px, 0px)'
            });
        }
    });

    return FavChannelWidget;
});

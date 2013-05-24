/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var View = require('core/view/View');
    var Gallary = require('./carousel/Gallary');
    var Poster = require('./carousel/Poster');

    var GallaryWidget = View.extend({
        eventHandler: {
            OK_KEY: function() {
            },
            RIGHT_KEY: function() {
                this.gallary.next();
            },
            LEFT_KEY: function() {
                this.gallary.previous();
            }
        },
        render: function() {
            this.canvas = this.$el[0];
            var adjustY = 10;
            this.gallary = new Gallary(this.canvas, [{
                left: 190,
                top: 310 - adjustY,
                width: 278 * 1.4,
                height: 414 * 1.4,
                opacity: 0
            }, {
                left: 410,
                top: 315 - adjustY,
                width: 278,
                height: 414,
                opacity: 1
            }, {
                left: 610,
                top: 275 - adjustY,
                width: 278 * 0.7,
                height: 414 * 0.7,
                opacity: 1
            }, {
                left: 750,
                top: 255 - adjustY,
                width: 278 * 0.55,
                height: 414 * 0.55,
                opacity: 1
            }, {
                left: 850,
                top: 255 - adjustY,
                width: 278 * 0.5,
                height: 414 * 0.5,
                opacity: 1
            }, {
                left: 950,
                top: 250 - adjustY,
                width: 278 * 0.4,
                height: 414 * 0.4,
                opacity: 1
            }, {
                left: 1030,
                top: 250 - adjustY,
                width: 278 * 0.35,
                height: 414 * 0.35,
                opacity: 1
            }, {
                left: 1100,
                top: 250 - adjustY,
                width: 278 * 0.3,
                height: 414 * 0.3,
                opacity: 1
            }, {
                left: 1200,
                top: 250 - adjustY,
                width: 278 * 0.20,
                height: 414 * 0.20,
                opacity: 0
            }], {
                duration: 400
            });
            return this.Super.apply(this, arguments);
        },
        onLoad: function() {
        	function ImageDtd(image) {
        		var dtd = $.Deferred();
        		image.addEventListener('load', function() {
                	dtd.resolve();
                });
                return dtd;
        	}
        	
			var adjustY = 10;
            var image, dtdArray = [], that = this;
            var posterNames = ['Iron Man 2', 'Kongfu Panda', 'Transformer 3', 'Casino Royale', 'Kill Bill', 'Perfume', 'Narnia 3D', 'Batman', 'Happy Feel'];
            for(var i = 0; i < 9; i++) {
                image = new Image();
                image.src = 'customize/real6/asset/img/vod' + i + '.jpg';
                dtdArray.push(ImageDtd(image));
                
                var poster = new Poster(this.canvas, posterNames[i], image, {
                    width: 278,
                    height: 414
                }, {
                    left: 1100,
                    top: 250 - adjustY,
                    width: 278 * 0.3,
                    height: 414 * 0.3,
                    opacity: (i === 0 || i === 8) ? 0 : 1
                });
                this.gallary.addChild(poster);
            }
            
            $.when.apply($, dtdArray).done(function() {
            	that.gallary.show();
            })
        },
        reShow: function() {
            this.gallary.show();
        },
        active: function() {
            this.Super.apply(this, arguments);
            this.gallary.active();
            return this;
        },
        deactive: function() {
            this.Super.apply(this, arguments);
            this.gallary.deactive();
            return this;
        },
        refresh: function() {
            this.gallary.render();
        }
    });

    return GallaryWidget;
});

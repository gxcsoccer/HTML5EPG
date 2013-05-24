/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var View = require('core/view/View');

    var ShadowWidget = View.extend({
        render: function() {
            this.Super.apply(this, arguments);
            var self = this;
            this.ctx = this.$el[0].getContext('2d');
            this.ctx.lineWidth = 2;
            this.ctx.shadowColor = "rgba(255, 255, 255, 1)";
            this.ctx.shadowBlur = 10;
            this.timer
            this.imageObj = new Image();
            this.imageObj.src = "customize/real6/asset/img/nav_shadow.png";
            this.imageObj.onload = function() {
                self.drawImage();
            };
            return this
        },
        config: function(option) {
            $.extend(this, option);
        },
        drawImage: function() {
            this.ctx.drawImage(this.imageObj, 0, 0);
        },
        roundRect: function(sx, sy, ex, ey, r) {
            var r2d = Math.PI / 180;
            if((ex - sx ) - (2 * r ) < 0) {
                r = ((ex - sx ) / 2 );
            }//ensure that the radius isn't too large for x
            if((ey - sy ) - (2 * r ) < 0) {
                r = ((ey - sy ) / 2 );
            }//ensure that the radius isn't too large for y
            this.ctx.beginPath();
            this.ctx.moveTo(sx + r, sy);
            this.ctx.lineTo(ex - r, sy);
            this.ctx.arc(ex - r, sy + r, r, r2d * 270, r2d * 360, false);
            this.ctx.lineTo(ex, ey - r);
            this.ctx.arc(ex - r, ey - r, r, r2d * 0, r2d * 90, false);
            this.ctx.lineTo(sx + r, ey);
            this.ctx.arc(sx + r, ey - r, r, r2d * 90, r2d * 180, false);
            this.ctx.lineTo(sx, sy + r);
            this.ctx.arc(sx + r, sy + r, r, r2d * 180, r2d * 270, false);
            this.ctx.closePath();
            this.ctx.stroke();
        },
        down: function() {
            var dtd = $.Deferred();
            // this.$el.css({
            // left: "+=" + this.offsetLeft,
            // top: "+=" + this.offsetTop
            // });
            // this.orginLeft = this.$el.css('left');
            // this.orginTop = this.$el.css('top');
            this.$el.css({
                left: this.offsetLeft,
                top: this.offsetTop
            });

            var counter = 40;
            var self = this;
            clearInterval(this.timer);
            this.timer = setInterval(function() {
                var factor = Math.cos(counter / 25);
                if(factor == 1) {
                    clearInterval(self.timer);
                    dtd.resolve();
                }

                var width = 212, height = 120, radius = 5;
                width = self.width * factor;
                height = self.height * factor;
                radius = self.radius * factor;
                self.ctx.strokeStyle = "rgba(255, 255, 255, " + factor + ")";

                self.ctx.clearRect(0, 0, 320, 150);
                if(width < 50) {
                    self.drawImage();
                }
                else {
                    if(width < 190) {
                        self.roundRect(95 - (width / 2), 1, 95 + (width / 2), height, radius);
                    }
                    else {
                        self.roundRect(1, 1, width + 1, height + 1, radius);
                    }
                }

                counter--;
            }, 1.5);

            return dtd.promise();
        },
        up: function() {
            var dtd = $.Deferred();

            this.$el.css({
                left: this.orginLeft,
                top: this.orginTop
            });

            var counter = 0;
            var self = this;
            clearInterval(this.timer);
            this.timer = setInterval(function() {
                var factor = Math.cos(counter / 25);
                var width = 212, height = 120, radius = 5;
                width = self.width * factor;
                height = self.height * factor;
                radius = self.radius * factor;
                self.ctx.strokeStyle = "rgba(255, 255, 255, " + factor + ")";

                self.ctx.clearRect(0, 0, 320, 150);
                if(width < 50) {
                    self.drawImage();
                    clearInterval(self.timer);
                    dtd.resolve();
                }
                else {
                    if(width < 190) {
                        self.roundRect(95 - (width / 2), 1, 95 + (width / 2), height, radius);
                    }
                    else {
                        self.roundRect(1, 1, width + 1, height + 1, radius);
                    }
                }
                counter++;
            }, 1.5);

            return dtd.promise();
        }
    });
    return ShadowWidget;
});

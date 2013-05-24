/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var Base = require('core/base/Base');
    var Tween = require('./Tween');

    var Poster = Base.extend({
        init: function(canvas, name, image, size, layout) {
            this.ctx = canvas.getContext('2d');
            this.name = name;
            this.image = image;
            this.size = size;
            this.originalLayout = layout;
            this.currentLayout = layout;
            this.destLayout = layout;
        },
        render: function(dt, duration) {
            this.ctx.save();

            var left = this.__tween(dt, 'left', duration);
            var top = this.__tween(dt, 'top', duration);
            var width = this.__tween(dt, 'width', duration);
            var height = this.__tween(dt, 'height', duration);
            left = left - width / 2;
            top = top - height / 2;

            this.ctx.globalAlpha = this.__tween(dt, 'opacity', duration);

            if(this.ctx.globalAlpha > 0) {
                // 画倒影
                this.ctx.save();
                this.ctx.translate(0, top + (2 * height));
                this.ctx.scale(1, -1);
                this.ctx.drawImage(this.image, 0, 0, this.size.width, this.size.height, left, 0, width, height);
                this.ctx.translate(0, top + (2 * height));
                this.ctx.scale(1, -1);

                this.ctx.globalAlpha = 1;
                var alphaGradient = this.ctx.createLinearGradient(left, top + height, left, top + (2 * height) + 1);

                var alpha = this.__tween(dt, 'opacity', duration);
                alpha = (1 - alpha) * 0.3 + 0.7;
                alphaGradient.addColorStop(0, "rgba(255, 255, 255, " + alpha + ")");
                alphaGradient.addColorStop(0.2, "rgba(255, 255, 255, 1)");
                this.ctx.fillStyle = alphaGradient;
                // 这句是让背景不至于被倒影盖住
                this.ctx.globalCompositeOperation = "destination-out";
                this.ctx.fillRect(left - 1, top + height, width + 2, height + 1);
                this.ctx.restore();
            }

            // 画图片
            this.ctx.drawImage(this.image, 0, 0, this.size.width, this.size.height, left, top, width, height);

            if(dt === duration) {
                this.currentLayout = this.destLayout;
            }

            this.ctx.restore();
        },
        restore: function() {
            var opacity = this.currentLayout.opacity;
            this.currentLayout = this.originalLayout;
            this.currentLayout.opacity = opacity;
        },
        setLayout: function(layout) {
            this.destLayout = layout;
        },
        __tween: function(dt, prop, dur) {
            var tween = this.tween || Tween.linear;
            var src = this.currentLayout[prop], dest = this.destLayout[prop];
            var diff = dest - src;
            return Math.abs(src + tween(dt, diff, dur));
        }
    });

    return Poster;
});

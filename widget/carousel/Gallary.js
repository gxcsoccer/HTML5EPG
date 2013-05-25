/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var Base = require('core/base/Base');
    var Tween = require('./Tween');

    var defaultAnimationCfg = {
        duration: 600,
        tween: Tween.cubicEaseInOut
    };

    /**
     * <请求动画的下一帧>
     */
    var requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    var Gallary = Base.extend({
        /**
         * <构造函数>
         * @param {HTMLCanvasElement} canvas
         * @param {Array} layout
         * @param {Object} animationCfg
         */
        init: function(canvas, layout, animationCfg) {
            this.ctx = canvas.getContext('2d');
            this.canvasWidth = canvas.width, this.canvasHeight = canvas.height;
            this.children = [];
            this.layout = layout;
            this.offset = 0;
            this.animationCfg = $.extend(defaultAnimationCfg, animationCfg);
            this.isActive = false;
            this.isInAnimation = false;
        },
        render: function(dt, duration) {
        	if(dt == undefined || duration == undefined) {
        		dt = duration = 1;
        	}
        	
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

            var i = len = this.children.length, index;
            while(i--) {
                index = (i - this.offset + len) % len;
                this.children[index].render(dt, duration);
            }
			
			if(!this.isActive) {
				return;
			}

            // 写字
            var posterName = this.children[this.offset].name;
            this.ctx.save();

            this.ctx.font = "40px 'Century Gothic'";
            this.ctx.lineWidth = 2;
            this.ctx.fillStyle = "white";
            
            var metrics = this.ctx.measureText(posterName);
        	var width = metrics.width, height = 40 ,left = 630, top = 500;
        	
			this.ctx.save();
            this.ctx.translate(0, top + 5);
            this.ctx.scale(1, -1);
            this.ctx.fillText(posterName, left, 0);
            this.ctx.translate(0, top + 5);
            this.ctx.scale(1, -1);
            var alphaGradient = this.ctx.createLinearGradient(left, top + 5, left, top + height + 5);
            alphaGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
            alphaGradient.addColorStop(0.3, "rgba(255, 255, 255, 1)");
            this.ctx.fillStyle = alphaGradient;
            // 这句是让背景不至于被倒影盖住
            this.ctx.globalCompositeOperation = "destination-out";
            this.ctx.fillRect(left, top + 5, width, height);
            this.ctx.restore();

            this.ctx.shadowBlur = 5;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 2;
            this.ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
            this.ctx.fillText(posterName, left, top);

            this.ctx.restore();
        },
        addChild: function(child) {
            child.father = this;
            child.tween = this.animationCfg.tween;
            this.children.push(child);
        },
        next: function() {
        	if(this.isInAnimation) {
        		return;
        	}
        	
            var len = this.children.length;
            if(this.offset < (len - 1)) {
                this.offset += 1;
            }
            else {
                this.offset = 0;
            }
            this.__setLayout();
            this.__centralTimer();
        },
        previous: function() {
        	if(this.isInAnimation) {
        		return;
        	}
        	
            var len = this.children.length;
            if(this.offset === 0) {
                this.offset = len - 1;
            }
            else {
                this.offset -= 1;
            }
            this.__setLayout();
            this.__centralTimer();
        },
        show: function() {
            var len = this.children.length;
            while(len--) {
                this.children[len].restore();
            }

            this.__setLayout();
            this.__centralTimer();
        },
        active: function() {
        	this.isActive = true;
        	return this;
        },
        deactive: function() {
        	this.isActive = false;
        	return this;
        },
        __setLayout: function() {
            var i = 0, len = this.children.length, layoutIndex, offset = this.offset;
            for(; i < len; i++) {
                layoutIndex = (i + offset) % len;
                this.children[i].setLayout(this.layout[layoutIndex]);
            }
        },
        __centralTimer: function() {
            var startTime = +(new Date());
            var that = this;
            var duration = this.animationCfg.duration;
            this.isInAnimation = true;
            requestAnimFrame(function() {
                var currentTime = +(new Date());
                var dt = currentTime - startTime;
                dt = dt > duration ? duration : dt;
                that.render(dt, duration);

                if(dt < duration) {
                    requestAnimFrame(arguments.callee);
                } else {
                	that.isInAnimation = false;
                }
            });
        }
    });

    return Gallary;
});

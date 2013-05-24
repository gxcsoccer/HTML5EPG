/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var View = require('core/view/View');
    var UT = require('core/util/Utils');

    var transitionComplete = function(element, callback) {
        return element.one('webkitTransitionEnd mozTransitionEnd transitionend', callback);
    };

    var rawData = [{
        url: "customize/real6/asset/img/vod0.jpg",
        name: "Kongfu Panda"
    }, {
        url: "customize/real6/asset/img/vod1.jpg",
        name: "Iron Man 2"
    }, {
        url: "customize/real6/asset/img/vod2.jpg",
        name: "Transformer 3"
    }, {
        url: "customize/real6/asset/img/vod3.jpg",
        name: "Casino Royale"
    }, {
        url: "customize/real6/asset/img/vod4.jpg",
        name: "Kill Bill"
    }, {
        url: "customize/real6/asset/img/vod5.jpg",
        name: "Perfume"
    }, {
        url: "customize/real6/asset/img/vod6.jpg",
        name: "Narnia 3D"
    }, {
        url: "customize/real6/asset/img/vod7.jpg",
        name: "Batman"
    }, {
        url: "customize/real6/asset/img/vod8.jpg",
        name: "Happy Feel"
    }];

    var rawData2 = [{
        url: "customize/real6/asset/img/movie8.jpg",
        name: "LiL Wayne"
    }, {
        url: "customize/real6/asset/img/movie0.jpg",
        name: "SKYLINE"
    }, {
        url: "customize/real6/asset/img/movie1.jpg",
        name: "Franken Weenie"
    }, {
        url: "customize/real6/asset/img/movie2.jpg",
        name: "Harry Potter"
    }, {
        url: "customize/real6/asset/img/movie3.jpg",
        name: "Sherlock Holmes"
    }, {
        url: "customize/real6/asset/img/movie4.jpg",
        name: "Closet Space"
    }, {
        url: "customize/real6/asset/img/movie5.jpg",
        name: "YOU WILL KNOW HER NAME"
    }, {
        url: "customize/real6/asset/img/movie6.jpg",
        name: "CAUBERE"
    }, {
        url: "customize/real6/asset/img/movie7.jpg",
        name: "Minuit a Paris"
    }];

    var juicer = require('juicer');
    var template = juicer.compile('{@each posterList as poster,i}<li class="position_8"><a><img src="${poster.url}"/><canvas class="img-canvas" width="278px" height="828px" data-image="${poster.url}"></canvas><span>${poster.name}</span></a></li>{@/each}');

    var PosterWidget = View.extend({
        eventHandler: {
            OK_KEY: function() {
            },
            RIGHT_KEY: function() {
                if(this.animationRunning) {
                    return;
                }

                this.animationRunning = true;
                var $ui;
                $.each(this.posterList || [], function(index, $item) {
                    var prevPosition = $.data($item[0], 'position');
                    var newPosition = prevPosition == 8 ? 0 : (prevPosition + 1);
                    $.data($item[0], 'position', newPosition);
                    $item.removeClass().addClass('transition position_' + newPosition);
                    $ui = $item;
                });

                transitionComplete($ui, UT.cb(function() {
                    this.animationRunning = false;
                }, this));
            },
            LEFT_KEY: function() {
                if(this.animationRunning) {
                    return;
                }

                this.animationRunning = true;
                var $ui;
                $.each(this.posterList || [], function(index, $item) {
                    var prevPosition = $.data($item[0], 'position');
                    var newPosition = prevPosition == 0 ? 8 : (prevPosition - 1);
                    $.data($item[0], 'position', newPosition);
                    $item.removeClass().addClass('transition position_' + newPosition);
                    $ui = $item;
                });
                transitionComplete($ui, UT.cb(function() {
                    this.animationRunning = false;
                }, this));
            }
        },
        onLoad: function() {
            this.initPosterList(0);
            this.animationRunning = false;
        },
        active: function() {
            this.Super.apply(this, arguments);
            this.$el.removeClass('deactive');
        },
        deactive: function() {
            this.Super.apply(this, arguments);
            this.$el.addClass('deactive');
        },
        initPosterList: function(index) {
            this.$el.html(template.render({
                posterList: index % 2 ? rawData2 : rawData
            }));
            this.posterList = $.map(this.$('li') || [], function(dom, index) {
                var $item = $(dom);
                $.data($item[0], 'position', index);
                return $item;
            });

            function DrawImageWithReflection(currentContext, itemPath, xPos, yPos) {
                var mainImage = new Image();
                mainImage.src = itemPath;
                mainImage.onload = function() {
                    currentContext.save();
                    var imgWidth = mainImage.width;
                    var imgHeight = mainImage.height;

                    // Draw main image
                    //currentContext.drawImage(mainImage, xPos, yPos, imgWidth,
                    // imgHeight);
                    // Setup a reflection (via reversing scale in y-direction
                    // around an axis that is two times the height of the image)
                    currentContext.translate(0, yPos + (2 * imgHeight));
                    currentContext.scale(1, -1);
                    currentContext.drawImage(mainImage, xPos, 0, imgWidth, imgHeight);
                    // Revert transform and scale
                    currentContext.translate(0, yPos + (2 * imgHeight));
                    currentContext.scale(1, -1);
                    // Reflection image overlay (to created fade out effect)
                    // Our gradient starts with 0.85 opacity, then goes to 1.
                    var alphaGradient = currentContext.createLinearGradient(xPos, yPos + imgHeight, xPos, yPos + (2 * imgHeight));
                    alphaGradient.addColorStop(0, "rgba(255, 255, 255, 0.7)");
                    alphaGradient.addColorStop(0.2, "rgba(255, 255, 255, 1)");
                    currentContext.fillStyle = alphaGradient;
                    currentContext.globalCompositeOperation = "destination-out";

                    currentContext.fillRect(xPos, yPos + imgHeight, imgWidth, imgHeight);
                    currentContext.restore();
                };
            }


            $.each(this.$('.img-canvas'), function(index, canvas) {
                var imgSrc = canvas.getAttribute('data-image');
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                DrawImageWithReflection(ctx, imgSrc, 0, 0);
            });

            this.$el.hide();
            // $.each(this.posterList || [], function(index, $item) {
            // $item.removeClass().addClass('position_8');
            // });
            this.$el.show();
            setTimeout(UT.cb(function() {
                $.each(this.posterList || [], function(index, $item) {
                    var position = $.data($item[0], 'position');
                    $item.removeClass('position_8').addClass('position_' + position + ' transition_' + position);
                });
            }, this), 0);
        }
    });

    return PosterWidget;
});

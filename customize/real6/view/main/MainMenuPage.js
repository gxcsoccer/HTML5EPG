/**
 * @author g00201348
 */
define(function(require, exports, module) {
    require('css/MainMenuPage.css');
    //require('customize/asset/stylesheets/MainMenuPage.css');
    var View = require('core/view/View');
    var Position = require('core/view/Position');
    var WindowManager = require('core/view/WindowManager');
    var PosterWidget = require('widget/PosterWidget');

    return View.extend({
        attrs: {
            categoryIndex: 0
        },
        eventHandler: {
            OK_KEY: function(e) {
                var currentIndex = this.get('categoryIndex');
                WindowManager.navigate($.data(this.categoryList[currentIndex], 'url'));
            },
            RIGHT_KEY: function() {
                var prev = this.get('categoryIndex');
                if(prev < (this.categoryCount - 1)) {
                    this.set('categoryIndex', prev + 1);
                    this.$posterWidget.initPosterList(prev + 1);
                }
            },
            LEFT_KEY: function() {
                var prev = this.get('categoryIndex');
                if(prev > 0) {
                    this.set('categoryIndex', prev - 1);
                    this.$posterWidget.initPosterList(prev - 1);
                }
            },
            UP_KEY: function() {
                if(!this.$posterWidget.isActive) {
                    this.$posterWidget.active();
                    this.$shadow.hide();
                }
            },
            DOWN_KEY: function() {
                if(this.$posterWidget.isActive) {
                    this.$posterWidget.deactive();
                    this.$shadow.show();
                }
            }
        },
        render: function() {
            this.$posterWidget = new PosterWidget({
                $el: this.$('#poster_list')
            });
            this.appendChild(this.$posterWidget);

            /*function DrawImageWithReflection(currentContext, itemPath, xPos, yPos) {
                var mainImage = new Image();
                mainImage.src = itemPath;
                mainImage.onload = function() {
                    var imgWidth = mainImage.width;
                    var imgHeight = mainImage.height;

                    // Draw main image
                    //currentContext.drawImage(mainImage, xPos, yPos, imgWidth, imgHeight);
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
                };
            }


            $.each(this.$('.img-canvas'), function(index, canvas) {
                var imgSrc = canvas.getAttribute('data-image');
                var ctx = canvas.getContext('2d');
                DrawImageWithReflection(ctx, imgSrc, 0, 0);
            });*/

            return this.Super.apply(this, arguments);
        },
        onLoad: function() {
            this.$shadow = this.$('#shadow_effect');
            this.categoryList = $.map(this.$('#menu_list > li') || [], function(dom, index) {
                var $item = $(dom);
                $.data($item, 'url', $item.find('a').attr('href'));
                return $item;
            });
            this.categoryCount = this.categoryList.length;
            this.$posterWidget.deactive();
        },
        _onChangeCategoryIndex: function(now, prev, key) {
            this.categoryList[prev].removeClass('focus_item');
            this.categoryList[now].addClass('focus_item');
            Position.pin(this.$shadow[0], {
                element: this.categoryList[now].find('a')[0],
                x: '50%-91px',
                y: 48
            });
        }
    });
});

/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var Base = require('core/base/Base');
    var _ = require('_');
    var UT = require('core/util/Utils');

    var contains = $.contains ||
    function(a, b) {
        return !!(a.compareDocumentPosition(b) & 16);
    };

    var isInDocument = function(parent, element) {
        return contains(parent, element);
    };

    return Base.extend({
        tagName: 'div',
        /**
         * Default attributes
         */
        attrs: {
            parentNode: $('body')
        },
        init: function(attrs) {
            this.Super.apply(this, arguments);
            this.isActive = false;
            this.isRender = false;
            // nested views
            this.children = [];
            this.initAttrs(attrs);
            this.initElement();
        },
        $: function(selector) {
            return this.$el.find(selector);
        },
        initElement: function() {
            var $el = this.get('$el');
            if(!$el) {
                var template = this.get('template');
                var id = this.get('id');
                var className = this.get('className');
                this.setElement( template ? $(template) : this.make({
                    'id': id,
                    'class': className
                }));
            }
            else {
                this.setElement($el);
            }
        },
        render: function() {
            var parentNode = this.get('parentNode');
            if(parentNode && !isInDocument(parentNode[0], this.$el[0])) {
                this.$el.appendTo(parentNode);
            }
            this.active();
            this.isRender = true;
            return this;
        },
        reset: function() {
            this.$el.html('');
            this.children = [];
            return this;
        },
        make: function(attributes, content) {
            var $el = $('<' + (this.tagName || 'div') + '>', attributes || {});
            $el.html(content || '');
            return $el;
        },
        setElement: function(element) {
            this.$el = element;
            this.el = element.get(0);
            return this;
        },
        active: function() {
            this.isActive = true;
            return this;
        },
        deactive: function() {
            this.isActive = false;
            return this;
        },
        show: function(option) {
            if(option && typeof option.active == 'boolean' && !option.active) {
                this.deactive();
            }
            else {
                this.active();
            }
            this.$el.show();
            return this;
        },
        hide: function(option) {
            if(option && typeof option.active == 'boolean' && option.active) {
                this.active();
            }
            else {
                this.deactive();
            }
            this.$el.hide();
            return this;
        },
        appendChild: function(childView, $el, noRender) {
            this.children.push(childView);
            childView.set('parentNode', $el || this.$el);
            !noRender && childView.render().onLoad();
            return this;
        },
        removeChild: function(childView) {
            var childIndex;
            $.each(this.children || [], function(index, view) {
                if(childView.name == view.name) {
                    childIndex = index;
                    return false;
                }
            });
            if(childIndex) {
                this.removeChildAt(childIndex);
            }

            return this;
        },
        removeChildAt: function(index) {
            var childView = this.children[index];
            childView.$el.remove();
            childView.onRemove();
            this.children.splice(index, 1);
            return this;
        },
        /**
         * Trigger while the view being added to DOM tree
         */
        onLoad: function() {
        },
        /**
         * Trigger while the view being remove from DOM tree
         */
        onRemove: function() {
            $.each(this.children || [], function(index, child) {
                child.onRemove();
            });
        },
        dispatchEvent: function(event) {
            if(!this.isActive) {
                return 0;
            }

            var ret = 0;
            $.each(this.children || [], function(index, child) {
                ret = child.dispatchEvent(event);
                return ret === 0;
            });

            if(ret === 0) {
                var handler = this.eventHandler[event.toString()];

                if(_.isFunction(handler)) {
                    ret = handler.call(this, event);
                }
                else if(_.isString(handler)) {
                    ret = this[handler](event);
                }
                ret = typeof ret == 'undefined' ? 1 : ret;
            }
            return ret;
        },
        /**
         * Example:
         * eventHandler: {
         * 		KeyEvent.OK_KEY: function(e) {
         * 			alert('OK');
         * 		},
         * 		KeyEvent.BACK_KEY: function(e) {
         * 			alert('BACK');
         * 		}
         * }
         */
        eventHandler: {}
    });
});

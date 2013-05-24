/**
 * @author g00201348
 */
define(function() {
    var Event = $.Class.extend({
        init: function(name, type, body) {
            this.name = name;
            this.type = type;
            this.body = body;
        },
        getBody: function() {
            return this.body;
        },
        setBody: function(body) {
            this.body = body;
        },
        toString: function() {
            return this.name;
        }
    });

    Event.TYPE_KEY_EVENT = 0;
    Event.TYPE_STB_EVENT = 1;

    return Event;
});

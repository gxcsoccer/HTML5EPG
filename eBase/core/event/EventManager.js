/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var desktop = require('core/view/WindowManager').desktop;
    var KeyEvent = require('./KeyEvent');
    var EventManager = exports;
    var isEnable = true;

    EventManager.start = function() {
        //console.log('GAOXIAOCHEN ------------------> eventManager start!');
        //console.log(document);
        $(document).on('keydown', handleKeyEvent);
        $(document).on('click', function(e) {
            e.preventDefault();
        });
    };

    EventManager.disableKeyEvent = function() {
        isEnable = false;
    };

    EventManager.enableKeyEvent = function() {
        isEnable = true;
    };

    /**
     * 遥控器按键映射
     */
    var REMOTE_EVENT_MAP = {
        '256': KeyEvent.POWER_KEY,
        '261': KeyEvent.MUTE_KEY,
        // 此为主菜单
        '272': KeyEvent.MENU_KEY,
        '1109': KeyEvent.VOD_KEY,
        //一键进直播
        //'1108': KeyEvent.TV_KEY,
        // TV GUIDE
        '1108': KeyEvent.GUIDE_KEY,
        // TODO: Hack Here
        //'110': KeyEvent.INFO_KEY,
        '268': KeyEvent.INFO_KEY,
        '38': KeyEvent.UP_KEY,
        '37': KeyEvent.LEFT_KEY,
        '39': KeyEvent.RIGHT_KEY,
        '40': KeyEvent.DOWN_KEY,
        '13': KeyEvent.OK_KEY,
        '285': KeyEvent.SET_KEY,
        '1111': KeyEvent.PVR_KEY,
        '33879': KeyEvent.LONG_PVR_KEY,
        '8': KeyEvent.BACK_KEY,
        '24': KeyEvent.BACK_KEY,

        '34': KeyEvent.PAGEDOWN_KEY,
        '33': KeyEvent.PAGEUP_KEY,
        '265': KeyEvent.FBWD_KEY,
        '264': KeyEvent.FFWD_KEY,
        '263': KeyEvent.PAUSEPLAY_KEY,

        '275': KeyEvent.RED_KEY,
        '276': KeyEvent.GREEN_KEY,
        '277': KeyEvent.YELLOW_KEY,
        '278': KeyEvent.BLUE_KEY,

        '48': KeyEvent.ZERO_KEY,
        '49': KeyEvent.ONE_KEY,
        '50': KeyEvent.TWO_KEY,
        '51': KeyEvent.THREE_KEY,
        '52': KeyEvent.FOUR_KEY,
        '53': KeyEvent.FIVE_KEY,
        '54': KeyEvent.SIX_KEY,
        '55': KeyEvent.SEVEN_KEY,
        '56': KeyEvent.EIGHT_KEY,
        '57': KeyEvent.NINE_KEY,
        '106': KeyEvent.STAR_KEY,
        '105': KeyEvent.POUND_KEY
    };
    /**
     * 键盘事件映射
     */
    var KEYBOARD_EVENT_MAP = {
        '38': KeyEvent.UP_KEY,
        '37': KeyEvent.LEFT_KEY,
        '39': KeyEvent.RIGHT_KEY,
        '40': KeyEvent.DOWN_KEY,
        '13': KeyEvent.OK_KEY,

        '84': KeyEvent.GUIDE_KEY,
        '98': KeyEvent.RADIO_KEY,
        '97': KeyEvent.MUTE_KEY,
        '24': KeyEvent.TT_KEY,
        '25': KeyEvent.RESTART_KEY,
        '88': KeyEvent.H_KEY,
        '82': KeyEvent.MENU_KEY,
        '91': KeyEvent.RECORD_KEY,
        '124': KeyEvent.PAGEUP_KEY,
        '125': KeyEvent.PAGEDOWN_KEY,
        '117': KeyEvent.RED_KEY,
        '118': KeyEvent.GREEN_KEY,
        '119': KeyEvent.YELLOW_KEY,
        '120': KeyEvent.BLUE_KEY,

        '89': KeyEvent.TV_KEY, //Y
        '76': KeyEvent.POWER_KEY, // L
        '85': KeyEvent.LIVE_KEY, // U
        '69': KeyEvent.VOD_KEY, // E
        '87': KeyEvent.VAS_KEY, // W
        '72': KeyEvent.MENU_KEY, // H
        '73': KeyEvent.INFO_KEY, // I
        '81': KeyEvent.BTV_KEY, // Q
        '27': KeyEvent.EXIT_KEY, // ESC
        '79': KeyEvent.AUDIO_KEY, // -
        '80': KeyEvent.SUBTITLE_KEY, // =
        '75': KeyEvent.MUTE_KEY,
        '66': KeyEvent.BACK_KEY, // B
        '188': KeyEvent.PAGEUP_KEY, // <
        '190': KeyEvent.PAGEDOWN_KEY, // >
        '16': KeyEvent.FBWD_KEY, // Shift
        '17': KeyEvent.FFWD_KEY, // Ctrl
        '192': KeyEvent.PAUSEPLAY_KEY, // `
        '65': KeyEvent.RED_KEY, // A
        '83': KeyEvent.GREEN_KEY, // S
        '68': KeyEvent.YELLOW_KEY, // D
        '70': KeyEvent.BLUE_KEY, // F
        '219': KeyEvent.STAR_KEY,
        '221': KeyEvent.POUND_KEY,
        '84': KeyEvent.TEST_KEY, // T
        '78': KeyEvent.FBWD_KEY, // N
        '77': KeyEvent.FFWD_KEY, // M
        '67': KeyEvent.LOCAL_MEDIA_KEY, // C
        '112': KeyEvent.PVR_KEY, // F1
        '113': KeyEvent.LONG_PVR_KEY // F2
    };

    var parseEvent = function(e) {
        //console.log('the key: ' + e.which);
        var event = REMOTE_EVENT_MAP[e.which];
        if( typeof event == 'undefined') {
            event = KEYBOARD_EVENT_MAP[e.which];
        }
        if( typeof event == 'undefined') {
            return KeyEvent.NULL_KEY;
        }
        return event;
    };

    var handleKeyEvent = function(e) {
        //console.log('GAOXIAOCHEN ----------------> here is in handleKeyEvent');
        if(isEnable) {
            var event = parseEvent(e);
            desktop.dispatchEvent(event);
        }
        e.preventDefault();
    };
});

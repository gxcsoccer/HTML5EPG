/**
 * @author g00201348
 */
define(function(require, exports, module) {
    var Event = require('./Event');
    return {
        // "确认"
        OK_KEY: new Event("OK_KEY", Event.TYPE_KEY_EVENT),
        // "左"
        LEFT_KEY: new Event("LEFT_KEY", Event.TYPE_KEY_EVENT),
        // "右"
        RIGHT_KEY: new Event("RIGHT_KEY", Event.TYPE_KEY_EVENT),
        // "上"
        UP_KEY: new Event("UP_KEY", Event.TYPE_KEY_EVENT),
        // "下"
        DOWN_KEY: new Event("DOWN_KEY", Event.TYPE_KEY_EVENT),
        // "上翻页" <
        PAGEUP_KEY: new Event("PAGEUP_KEY", Event.TYPE_KEY_EVENT),
        // "下翻页" >
        PAGEDOWN_KEY: new Event("PAGEDOWN_KEY", Event.TYPE_KEY_EVENT),
        // "数字"
        NUMERIC_KEY: new Event("NUMERIC_KEY", Event.TYPE_KEY_EVENT),

        ZERO_KEY: new Event("ZERO_KEY", Event.TYPE_KEY_EVENT),

        ONE_KEY: new Event("ONE_KEY", Event.TYPE_KEY_EVENT),

        TWO_KEY: new Event("TWO_KEY", Event.TYPE_KEY_EVENT),

        THREE_KEY: new Event("THREE_KEY", Event.TYPE_KEY_EVENT),

        FOUR_KEY: new Event("FOUR_KEY", Event.TYPE_KEY_EVENT),

        FIVE_KEY: new Event("FIVE_KEY", Event.TYPE_KEY_EVENT),

        SIX_KEY: new Event("SIX_KEY", Event.TYPE_KEY_EVENT),

        SEVEN_KEY: new Event("SEVEN_KEY", Event.TYPE_KEY_EVENT),

        EIGHT_KEY: new Event("EIGHT_KEY", Event.TYPE_KEY_EVENT),

        NINE_KEY: new Event("NINE_KEY", Event.TYPE_KEY_EVENT),
        // "#" [
        POUND_KEY: new Event("POUND_KEY", Event.TYPE_KEY_EVENT),
        // "*" ]
        STAR_KEY: new Event("STAR_KEY", Event.TYPE_KEY_EVENT),
        // "返回" B
        BACK_KEY: new Event("BACK_KEY", Event.TYPE_KEY_EVENT),
        // "退出" ESC
        EXIT_KEY: new Event("EXIT_KEY", Event.TYPE_KEY_EVENT),
        // "菜单" H
        MENU_KEY: new Event("MENU_KEY", Event.TYPE_KEY_EVENT),
        // "Guide" Q
        BTV_KEY: new Event("BTV_KEY", Event.TYPE_KEY_EVENT),
        // "直播" Y
        TV_KEY: new Event("TV_KEY", Event.TYPE_KEY_EVENT),
        // "Live TV" U
        LIVE_KEY: new Event("LIVE_KEY", Event.TYPE_KEY_EVENT),
        // "VOD" V
        VOD_KEY: new Event("VOD_KEY", Event.TYPE_KEY_EVENT),
        // "i-mode" W
        VAS_KEY: new Event("VAS_KEY", Event.TYPE_KEY_EVENT),
        // "设置" R
        SETTING_KEY: new Event("SETTING_KEY", Event.TYPE_KEY_EVENT),
        // "搜索" T
        SEARCH_KEY: new Event("SEARCH_KEY", Event.TYPE_KEY_EVENT),
        // "帮助" [
        HELP_KEY: new Event("HELP_KEY", Event.TYPE_KEY_EVENT),
        // "红色" A
        RED_KEY: new Event("RED_KEY", Event.TYPE_KEY_EVENT),
        // "绿色" S
        GREEN_KEY: new Event("GREEN_KEY", Event.TYPE_KEY_EVENT),
        // "黄色" D
        YELLOW_KEY: new Event("YELLOW_KEY", Event.TYPE_KEY_EVENT),
        // "蓝色" F
        BLUE_KEY: new Event("BLUE_KEY", Event.TYPE_KEY_EVENT),
        // "静音" K
        MUTE_KEY: new Event("MUTE_KEY", Event.TYPE_KEY_EVENT),
        // "音轨" O
        AUDIO_KEY: new Event("AUDIO_KEY", Event.TYPE_KEY_EVENT),
        // "字幕" P
        SUBTITLE_KEY: new Event("SUBTITLE_KEY", Event.TYPE_KEY_EVENT),
        // "信息" I
        INFO_KEY: new Event("INFO_KEY", Event.TYPE_KEY_EVENT),
        // "画中画"
        PIP_KEY: new Event("PIP_KEY", Event.TYPE_KEY_EVENT),
        // "电源" L
        POWER_KEY: new Event("POWER_KEY", Event.TYPE_KEY_EVENT),
        // 暂停 `
        PAUSEPLAY_KEY: new Event("PAUSEPLAY_KEY", Event.TYPE_KEY_EVENT),
        // "快进" Shift
        FFWD_KEY: new Event("FFWD_KEY", Event.TYPE_KEY_EVENT),
        // "快退" Ctrl
        FBWD_KEY: new Event("FBWD_KEY", Event.TYPE_KEY_EVENT),
        // "测试" T
        TEST_KEY: new Event("TEST_KEY", Event.TYPE_KEY_EVENT),
        // "本地设置" N
        LOCAL_SETTING_KEY: new Event("LOCAL_SETTING_KEY", Event.TYPE_KEY_EVENT),
        // "本地调试" M
        LOCAL_DIAGNOSE_KEY: new Event("LOCAL_DIAGNOSE_KEY", Event.TYPE_KEY_EVENT),
        // "本地播放" C
        LOCAL_MEDIA_KEY: new Event("LOCAL_MEDIA_KEY", Event.TYPE_KEY_EVENT),
        // "短按Pvr" F1
        PVR_KEY: new Event("PVR_KEY", Event.TYPE_KEY_EVENT),
        // "长按Pvr" F2
        LONG_PVR_KEY: new Event("LONG_PVR_KEY", Event.TYPE_KEY_EVENT),
        // "Restart TV" F3
        RESTART_KEY: new Event('RESTART_KEY', Event.TYPE_KEY_EVENT),
        // 'Repeat TV' F4
        H_KEY: new Event('H_KEY', Event.TYPE_KEY_EVENT),
        // 'Teltext' F5
        TT_KEY: new Event('TT_KEY', Event.TYPE_KEY_EVENT),
        // 'Radio Channel'
        RADIO_KEY: new Event('RADIO_KEY', Event.TYPE_KEY_EVENT),
        // 'Widget Portal'
        WIDGET_KEY: new Event('WIDGET_KEY', Event.TYPE_KEY_EVENT),
        // "tvod menu"
        TVOD_MENU_KEY: new Event("TVOD_MENU_KEY", Event.TYPE_KEY_EVENT),
        // 没有映射的按键
        NULL_KEY: new Event("NULL_KEY", Event.TYPE_KEY_EVENT)
    };
});

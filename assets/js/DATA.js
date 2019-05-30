//数据存储

const global = {
    ROAD_HEIGHT: -100,

    HEIGHT_HIT_PLAYER: -75,

    RESTART: false,

    PLAYER_SHOWUP: false, // 人物落地后为true

    BARRIER_SCHEDULED: false, //关卡schedule后为true

    QUESTION_BARRIER: false,

    CURRENT_QUESTION_LABEL: '哪个节气白天最长晚上最短?',

    CURRENT_QUESTION_ANSWER: '夏至',

    ASKED_QUESTION: [],

    NORMAL_ROAD_SPEED: 500,
    NORMAL_BG_SPEED: 250,

    SHOWUP_SPEED: 1000,

    CURRENT_SCORE: 0,

    GAME_STATUS: { //游戏状态枚举

        WAIT_FOR_START: 0,
        PAUSE: 1,
        OVER: 2,
        SHOWING_HOMEPAGE: 3,
        HIDING_HOMEPAGE: 4,
        PLAYING: 5
    },

    BARRIER_TYPE: {
        ARROW: 0,
        STONE: 1,
        SWORD: 2
    }
}

export default global;
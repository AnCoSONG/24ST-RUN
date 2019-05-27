//数据存储

const global = {
    ROAD_HEIGHT: -150,

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
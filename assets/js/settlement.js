import global from "./DATA";

// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        points: cc.Label
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.points.string = global.CURRENT_SCORE;
    },

    start() {

    },


    onBack() {
        global.RESTART = false;
        global.PLAYER_SHOWUP = false;
        global.BARRIER_SCHEDULED = false;

        global.ASKED_QUESTION = []; //已问过的清空
        cc.director.loadScene('home')
    },

    onRestart() {
        global.RESTART = true;
        global.PLAYER_SHOWUP = false;
        global.BARRIER_SCHEDULED = false;

        global.ASKED_QUESTION = []; //已问过的清空


        cc.director.loadScene('home')
    },

    // update (dt) {},
});
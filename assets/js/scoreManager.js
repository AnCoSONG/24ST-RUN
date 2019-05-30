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
        pointText: cc.Label,

        secondPoint: 0
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on('addScore', function (num) {
            // this.pointToAdd.push(num)
            this.point += num;
        })
    },

    start() {

    },

    init(gm) {
        this.gameManager = gm;
        this.point = 0;
        this.renderText();
        this.pointToAdd = [];
    },




    addPoint(pt) {
        this.point += pt;

        // this.pointToAdd.push(pt);
    },

    renderText() {
        this.pointText.string = this.point;
    },

    updateScore() {
        global.CURRENT_SCORE = this.point;
        cc.log(global.CURRENT_SCORE);
    },

    clearPointToAdd() {
        while (this.pointToAdd.length != 0) {
            this.point += this.pointToAdd.shift();
        }
    },

    update(dt) {
        if (this.gameManager.gameStart && global.PLAYER_SHOWUP) {
            this.point += Math.round(this.secondPoint * dt);
            // this.clearPointToAdd();
            this.renderText();
        }
    },
});
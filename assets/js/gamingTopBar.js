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
        point: cc.Label
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    init(gm) {
        this.gameManager = gm;
        this.viewportWidth = this.gameManager.viewportWidth;
        this.viewportHeight = this.gameManager.viewportHeight;
        this.fixPos();
    },

    fixPos() {
        this.node.x = 0;
        this.node.y = this.viewportHeight / 2 + 100;
    },

    showMe() {
        let showUp = cc.moveBy(1, cc.v2(0, -230)).easing(cc.easeCubicActionInOut());

        this.node.runAction(showUp);
    },

    hideMe() {
        let showDown = cc.moveBy(1, cc.v2(0, 230)).easing(cc.easeCubicActionInOut());

        this.node.runAction(showDown);
    },

    onPause() {
        cc.log('pause')
    },

    // update (dt) {},
});
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
        // },
        opText: cc.Label,
        speed: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    init(gm, qm) {
        this.gameManager = gm;
        this.questionManager = qm;
        this.viewportHeight = this.gameManager.viewportHeight;
        this.viewportWidth = this.gameManager.viewportWidth;


        this.fixPos();
        this.isShoot = false;
    },

    fixPos() {
        this.node.x = this.viewportWidth / 2 + 100;

    },

    setY(y) {
        this.node.y = y;
    },

    shoot() {
        this.isShoot = true;

    },

    setText(text) {
        this.opText.string = text;
    },

    getText() {
        return this.opText.string;
    },

    update(dt) {
        if (this.isShoot) {
            this.node.x -= dt * this.speed;
        }
    },

    onTap() {
        cc.log('tap on', this.opText.string)
        this.questionManager.verifyAnswer(this.getText());

    }
});
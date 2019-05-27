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
        damage: 0,
        speed: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.viewportHeight = 0;
        this.viewportWidth = 0;
        this.isShoot = false;

    },

    start() {

    },

    init(gm) {
        this.gameManager = gm;
        this.fixPos(); //初始化位置
    },

    fixPos() {
        if (this.gameManager) {
            this.viewportHeight = this.gameManager.viewportHeight;
            this.viewportWidth = this.gameManager.viewportWidth;

        } else {
            this.viewportHeight = cc.winSize.height;
            this.viewportWidth = cc.winSize.width;
        }

        //设置位置在视口边缘

        this.node.x = this.viewportWidth / 2 + 100;

    },

    addXOffset(x) {
        this.node.x += x;
    },

    setY(y) {
        this.node.y = y;
    },

    //这是坐标实现
    //也可以试试动作系统实现
    shoot() {
        this.isShoot = true;
        cc.log(this.isShoot);
    },

    //接受碰撞回调

    onCollisionEnter: function (other, self) {
        cc.log(self, '撞到', other)

        //碰到了玩家就destroy自己
        if (other.tag == 0) {
            //播放destroy效果
            this.node.destroy();
        }

    },


    update(dt) {

        if (this.isShoot) {
            cc.log('IS MOVE');
            this.node.x -= this.speed * dt;
        }
    },
});
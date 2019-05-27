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
        damage: 0,
        speed: 0
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //
        cc.log('stone loaded')
        this.isShoot = false;
        this.viewportWidth = 0;
        this.viewportHeight = 0;

    },

    start() {

    },

    init(gm) {
        this.gameManager = gm;
        this.fixPos();
    },
    // fixPos不能写在onLoad中，因为onLoad是在addChild的时候才调用的
    // fixPos不能写在OnLoad中
    fixPos() {
        if (this.gameManager) {
            this.viewportWidth = this.gameManager.viewportWidth;
            this.viewportHeight = this.gameManager.viewportHeight;
        } else {
            this.viewportWidth = cc.winSize.width;
            this.viewportHeight = cc.winSize.height;
        }

        this.setX(this.viewportWidth / 2 + 100); //设置在 视口边100像素的位置
        //y轴无所谓，根据情况定，但x必须设置在看不见的地方，这样比较好控制
    },

    setX(x) {
        this.node.x = x;
    },

    setXOffset(offset) {
        this.node.x += offset;
        cc.log(this.node.x, this.node.y)
    },

    setY(y) {
        this.node.y = y;
    },

    setYOffset(offset) {
        this.node.y += offset;
    },

    setSpeed(speed) {
        this.speed = speed;

    },


    shoot() {
        this.isShoot = true;
    },

    update(dt) {
        if (this.isShoot) {
            //发射

            cc.log('stone move', this.node.x, this.node.y)
            this.node.x -= this.speed * dt;
        }
    },

    onCollisionEnter: function (other, self) {
        cc.log(self, '撞到', other)

        //碰到了玩家就destroy自己
        if (other.tag == 0) {
            //播放destroy效果
            this.node.destroy();
        }

    },
});
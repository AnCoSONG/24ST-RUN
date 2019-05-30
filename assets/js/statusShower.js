// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const typeToText = ['答对+1000', '答错了-20', 'HP-15', 'HP-20', 'HP-30']
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
        wrap: cc.Prefab
        // },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.wrapList = []
    },

    start() {

    },

    init(gm) {
        this.gameManager = gm;
    },

    setStatus(textType) {
        if (this.wrapList.length > 0) {
            this.removeFirst()
        }
        let line = cc.instantiate(this.wrap)
        line.getChildByName('text').getComponent(cc.Label).string = typeToText[textType];

        this.node.addChild(line)
        this.wrapList.push(line)

        this.scheduleOnce(_ => {
            this.removeFirst()

        }, 5)


    },

    removeFirst() {
        if (this.wrapList.length > 0) {

            let first_wrap = this.wrapList.shift();
            let remove = cc.spawn(cc.moveBy(1, cc.v2(0, 100)), cc.fadeOut(1))
            first_wrap.runAction(remove);
            this.scheduleOnce(_ => {
                first_wrap.removeFromParent();
            }, 2)
        }
    }

    // update (dt) {},
});
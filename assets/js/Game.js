// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import player from 'player';
import barriersManager from 'barriersManager'

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
        moveSpeed: 0,
        background: {
            type: cc.Node,
            default: null
        },
        startButton: {
            type: cc.Node,
            default: null
        },
        exitButton: {
            type: cc.Node,
            default: null
        },

        // mapPrefab: {
        //     type: cc.Prefab,
        //     default: null
        // },

        particleSystem: {
            type: cc.ParticleSystem,
            default: null
        },

        character: {
            type: player,
            default: null
        },

        bgList: [cc.Node],

        road: cc.Node,

        barriersManager: barriersManager

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        //碰撞检测部分开启和debug
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;

        //初始化变量
        this.gameStart = false;

        // this.gamingMap = cc.instantiate(this.mapPrefab)
        this.viewportWidth = cc.winSize.width
        this.viewportHeight = cc.winSize.height;
        let bg1 = this.bgList[0];
        let bg2 = this.bgList[1];

        //end

        // this.node.addChild(this.gamingMap);
        // let bgBox = this.background.getBoundingBox();
        // cc.log(bgBox);
        // let v2 = this.node.convertToWorldSpace(cc.v2(bgBox.xMax, bgBox.yMin));
        // cc.log(v2);
        // this.gamingMap.setPosition(v2);
        cc.log(this.node)

        let frameSize = cc.view.getFrameSize();
        let canvasSize = cc.view.getCanvasSize();
        let designSize = cc.view.getDesignResolutionSize();

        cc.log(frameSize);
        cc.log(canvasSize);
        cc.log(designSize);
        // 切入场景
        let bgAction = cc.spawn(cc.scaleTo(2, 0.6), cc.moveBy(2, cc.v2(-1200, 0))).easing(cc.easeCubicActionInOut());
        // let buttonAction = cc.moveBy(2, cc.v2(-400, 0)).easing(cc.easeCubicActionInOut());
        this.background.runAction(bgAction);
        this.fixBgPos(bg1, bg2, this.background) //初始化游戏地图的位置
        // for (let i of bgList) {
        //     i.runAction(bgAction.clone());
        // }
        // this.gamingMap.runAction(bgAction.clone());
        this.showHomePage();
        // cc.log(this.gamingMap)
        //调用init函数
        this.init();



        //事件注册
        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchend', this.onTouchEnd, this);



    },

    onTouchStart(event) {
        if (event.getLocationX() < this.viewportWidth / 2) {
            //左半屏触摸
            cc.log('left')
            if (this.gameStart) {
                this.character.jumpNew();
            }

        } else {
            // 右半屏触摸
            cc.log('right')
        }

        //判断是否点进了某个刚体组件
        if (cc.Intersection.pointInPolygon(event.getLocation(), this.character.getComponent(cc.BoxCollider).world.points)) {
            cc.log('point in character')
        } else {
            cc.log('nothing')
        }
    },

    onTouchEnd(event) {
        cc.log('touchend', event)

    },

    init() {
        //其实就是将游戏逻辑绑定到其它各组件上

        //使他们之间建立起联系，同时也可以建立起各组件的联系


        //游戏人物init
        this.character.init(this);
        //路面init
        this.road.getComponent('road').init(this);

        //地图元素init

        this.barriersManager.init(this);

        //状态系统init
    },

    start() {
        cc.log(this.viewportWidth, this.viewportHeight);


    },

    update(dt) {
        if (this.gameStart) {

            this.background.x -= dt * this.moveSpeed; //移动
            // this.gamingMap.x -= dt * this.moveSpeed;

            this.gamebgMove(dt * this.moveSpeed, this.bgList);
            this.checkBgReset(this.bgList)
        }
        // cc.log(this.bgList)
        // cc.log(this.gamingMap.getChildByName('gameing_nextpart').getChildByName('pointer').convertToWorldSpace(cc.v2(0, 0))) //尝试判断是否快要离开地图
        // cc.log('游戏地图', this.gamingMap);
        // cc.log('首页地图包围盒x边界', this.background.getBoundingBox().xMax, this.background.getBoundingBox().yMin);
        // if (this.gamingMap.getChildByName('gameing_nextpart').getChildByName('pointer').convertToWorldSpaceAR(cc.v2(0, 0)).x <= this.viewportWidth - 10) {
        //     this.gameStart = false;
        // }
    },

    showHomePage() {
        //展示状态栏

        //展示按钮
        //借助它scheduleOnce展示人物
        this.showButton();



    },

    showButton() {
        let buttonAction = cc.moveBy(2, cc.v2(-400, 0)).easing(cc.easeCubicActionInOut());
        //人物部分交给人物实现
        // let charAction = cc.moveBy(2, cc.v2(0, -680)).easing(cc.easeQuarticActionOut());
        this.scheduleOnce(() => {
            this.startButton.runAction(buttonAction);
            this.exitButton.runAction(buttonAction.clone());
            // this.character.node.runAction(charAction);
            this.character.appear();

        }, 1.5)
    },

    hideButton() {
        let buttonAction = cc.moveBy(2, cc.v2(400, 0)).easing(cc.easeCubicActionInOut());
        // let charAction = cc.sequence(cc.jumpBy(1.5, cc.v2(400, -250), 50, 1).easing(cc.easeCubicActionOut()), cc.moveBy(1, cc.v2(-400, 0)).easing(cc.easeQuadraticActionInOut()));
        this.scheduleOnce(() => {
            this.startButton.runAction(buttonAction);
            this.exitButton.runAction(buttonAction.clone());
            //人物部分交给人物自己实现
            // this.character.node.runAction(charAction);

        }, 0)
    },

    //废弃
    // showRoad() {
    //     let roadAppearAction = cc.moveTo(1, -this.viewportWidth / 2, -260).easing(cc.easeCubicActionInOut());
    //     this.road.runAction(roadAppearAction);
    // },

    startGame() {

        //隐藏按钮
        this.hideButton();
        cc.log('开跑');

        //开启渲染
        this.gameStart = true;
        //展示路面
        // this.showRoad();
        //人物开始游戏
        this.character.run();
    },
    exitGame() {
        cc.log('退出')
        cc.game.end();
    },



    //游戏地图移动相关

    //可能会动态获取这个地图，先开放一个方法
    LoadMap() {
        //用cc.loader动态的从服务器下载图片
        //或者接入云开发，使用wx的接口从服务器拿图片也可以

        //拿到之后,回调函数中设置当前游戏开始
    },
    gamebgMove(speed, bgList) {
        for (let i of bgList) {
            i.x -= speed; //背景移动
            // cc.log('Game Background Moved ' + i.name + ' ' + i.x)

        }
    },
    fixBgPos(bg1, bg2, bg) {
        cc.log(bg1, bg2, bg)
        bg1.x = bg.getBoundingBox().xMax * 0.6 - 2000; //这个需要实验之后设置
        //第一张图，由于是接着home背景图直接衔接，由于图片有动画效果的缩放，但动作系统由于是并行，导致当时还没有修改home的包围盒，需要手动计算
        bg1.y = 0; //这个设置到0即可，0是相对于canvas中心的，canvas的锚点在他的中心
        cc.log('bg1', bg1.x, bg1.y);
        var bg1BoundingBox = bg1.getBoundingBox();
        bg2.setPosition(bg1BoundingBox.xMax, 0); //将下一幅图位置设置在图1的包围盒xMax处，这是bg1的最右边界，可以实现衔接的效果
        cc.log('bg2', bg2.x, bg2.y);
    },
    checkBgReset(bgList) {
        // cc.log(bgList[0].getBoundingBox())
        let first_xMax = bgList[0].getBoundingBox().xMax; //拿到列表内第一张图的有边界
        // cc.log('CheckBgReset', first_xMax)
        // cc.log('half of viewportWidt', this.viewportWidth / 2);
        // cc.log('CheckBgReset Complete', first_xMax + this.viewportWidth / 2)
        if (first_xMax + this.viewportWidth / 2 <= 0) { //由于canvas的锚点居中，所以需要加半个视口来确定这个图片的右边界离开了视口
            let preFirstBg = bgList.shift(); //离开之后移除这个图片
            bgList.push(preFirstBg); //重新push进列尾
            let curFirstBg = bgList[0]; //拿到现在的图片引用
            preFirstBg.x = curFirstBg.getBoundingBox().xMax; //将刚加入队尾的图片设置到当前图片的xMax位置

            //之后，这个队列跟着gamebgMove函数开始继续移动，由此就可以实现背景循环

        }
    }



});
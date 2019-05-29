// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import global from 'DATA'
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
        roads: [cc.Node],
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.visible = false;
        cc.log('路面高度', global.ROAD_HEIGHT);


        cc.log('road loaded')
        cc.log(this.gameManager)


    },

    init(gm) {
        cc.log('road inited');
        this.gameManager = gm;
        cc.log(this.name + 'initialization done!')
        this.roadList = []; //存储游戏中使用的路
        this.moveSpeed = this.gameManager.moveSpeed; //这里需要改，路和玩家移动速度应该时一样快的，且都大于背景移动速度
        //改写完成后
        for (let i of this.roads) {
            this.roadList.push(i);
        }

        this.fixRoadPos(this.roadList)

    },

    start() {

    },

    setMoveSpeed(speed) {
        this.moveSpeed = speed;
    },
    update(dt) {
        //地图入场
        // if (!this.visible && this.gameManager.gameStart) {

        //     this.node.x -= dt * this.gameManager.moveSpeed * 4;
        //     cc.log('road', this.node.getBoundingBox().xMin)
        //     if ((this.node.getBoundingBox().xMin + this.gameManager.viewportWidth / 2) < 0) {
        //         cc.log('到边了,停止继续移动');
        //         this.visible = true;
        //     }
        // }

        //改写之后的写法
        //当需要路面进场时 gameStart应该改为GameStatus为START的时候开始
        // cc.log(this.gameManager.gameStart, this.moveSpeed);
        // cc.log('road 1', this.roadList[0].x, 'road 2', this.roadList[1].x)
        if (this.gameManager.gameStart) {
            this.move(this.moveSpeed * dt, this.roadList);
            this.checkRoadReset(this.roadList);
        }
    },

    getCurrentRoad() {
        return this.roadList[0];
    },

    move(speed, roadList) {
        for (let i of roadList) {
            i.x -= speed;
            // cc.log('move', i.x)
        }
    },

    fixRoadPos(roadList) {
        //可以将x设置一些偏移
        cc.log(this.gameManager.viewportWidth)
        roadList[0].setPosition(this.gameManager.viewportWidth / 2 + 50, global.ROAD_HEIGHT);
        for (let i = 1; i < roadList.length; i++) {
            roadList[i].setPosition(roadList[i - 1].getBoundingBox().xMax, global.ROAD_HEIGHT);
        }

        // cc.log(roadList)
    },

    checkRoadReset(roadList) {
        //可以通过改写实现路面随机搭配

        //rand一个随机数
        //先将已经出去的移除
        //再从roads中拿到对应随机数位置的road，push进去，设置它的x和y位置即可

        let first_xMax = roadList[0].getBoundingBox().xMax;
        if (first_xMax + this.gameManager.viewportWidth / 2 <= 0) {
            let lastRoad = roadList[roadList.length - 1];

            let preFirstRoad = roadList.shift(); //离开之后移除这个图片
            roadList.push(preFirstRoad); //重新push进列尾
            preFirstRoad.x = lastRoad.getBoundingBox().xMax; //将刚加入队尾的图片设置到当前图片的xMax位置
            //可以将x设置一些偏移
        }

        // cc.log('after check', roadList);
    },

});
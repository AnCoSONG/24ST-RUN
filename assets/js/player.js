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
        // },

        jumpHeight: 0,
        jumpDuration: 0,
        verticalAccel: 0, //纵向加速度,其实就是重力
        verticalSpeed: 0, //纵向速度预制值
        jumpTime: 2,
        hp: 0,
        mp: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //游戏核心逻辑维护
        // this.hSpeed = 0; //水平移动速度
        // this.hAccel = 0; //水平加速度
        this.vSpeed = 0; //纵向速度
        this.vMove = false; //是否纵向可动 jumpNew 实现依赖
        this.vAccel = 0; //是否纵向可动 jumpNew 实现依赖
        this.jumpEnable = true; //可否跳跃 jump实现依赖
        this.player = this.node.getComponent(dragonBones.ArmatureDisplay);
        cc.log(this.player);

        //接受人物死亡事件
        this.node.on('player_dead', this.playerDead, this);
    },

    init(gm) {
        this.gameManager = gm; //只要用this标明了那就是类变量，不用非在生命函数最开始的部分声明
        cc.log(this.name + 'initialization done!')
        this.fixPos();


    },

    start() {

    },

    //初始化人物位置
    fixPos() {
        this.node.x = -300;
        this.node.y = -750;
    },

    //人物出现
    appear() {

        let jumpUp = cc.moveBy(0.5, cc.v2(130, 860)).easing(cc.easeSineOut());
        let jumpDown = cc.moveBy(0.2, cc.v2(10, -60)).easing(cc.easeSineIn());

        this.node.runAction(cc.sequence(cc.callFunc(_ => this.setDragonBonesAnimation('jump1')), jumpUp, jumpDown, cc.callFunc(_ => this.setDragonBonesAnimation('stand2'))));
    },

    //开跑


    run() {
        cc.log('开始游戏')
        let jumpAnimation = cc.callFunc(_ => {
            this.setDragonBonesAnimation('jump1')
        })
        let jumpDown = cc.moveBy(0.2, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        let jumpUp = cc.moveBy(0.5, cc.v2(0, -470)).easing(cc.easeCubicActionIn());
        let runAnimation = cc.callFunc(() => {
            this.setDragonBonesAnimation('run')
        });

        this.node.runAction(cc.sequence(jumpAnimation, jumpDown, jumpUp, runAnimation));
    },

    //使用坐标控制实现更准确地开跑
    runNew() {
        //蓄力

        let superJump = cc.callFunc(_ => {
            //蓄力
            //起跳
            this.setDragonBonesAnimation('jump1');
            this.vSpeed = 2000;
            this.vAccel = 2000;
            this.vMove = true;
        })
        this.node.runAction(superJump);



    },

    glide() {
        //下滑动作包括几个部分
        //1. 人物下滑动作
        //2. 下滑时人物的碰撞包围盒变动
        //3. 人物向前移动一小截
        //4. 人物匀速移动回原位
        //5. 人物包围盒恢复
    },

    //暂时不可行
    // moveForward(x, duration) {
    //     //向前移动，通过x=1/2at^2来控制a的值从而实现

    // },
    // //暂时不可行

    // moveBackward(x, duration) {

    // },

    //弃用
    jump() {

        //可能得重写，得手动用加速度和坐标去实现跳跃

        let jumpAnimation = cc.callFunc(_ => {
            this.setDragonBonesAnimation('jump1')
        })

        let runAction = cc.callFunc(_ => {
            this.setDragonBonesAnimation('run')
        })

        let addTime = cc.callFunc(_ => {
            this.jumpTime--
            if (this.jumpTime == 0) {
                this.jumpEnable = false;
            }
        });
        let resetTime = cc.callFunc(_ => {
            this.jumpTime = 2;
            this.jumpEnable = true;
        })

        let jumpUp = cc.moveBy(0.5, cc.v2(0, this.jumpHeight)).easing(cc.easeCircleActionOut());

        // let jumpUpDouble = cc.moveBy(0.5, cc.v2(0, this.jumpHeight * 2)).easing(cc.easeQuadraticActionInOut())





        let jumpDown = cc.moveBy(0.5, cc.v2(0, -this.jumpHeight)).easing(cc.easeCircleActionOut());

        let firstJump = cc.sequence(addTime, jumpAnimation, jumpUp, jumpDown, runAction);

        let clearFirstJump = cc.callFunc(_ => {
            this.node.stopAction(firstJump);
        })




        let secondJump = cc.sequence(addTime, jumpAnimation, jumpUp, jumpDown, runAction, resetTime);
        cc.log('jumpEnable', this.jumpEnable);
        cc.log(this.gameManager)
        if (this.jumpEnable && this.gameManager.gameStart) {

            if (this.jumpTime == 2) {

                this.node.runAction(firstJump);
                console.log('firstJump', this.jumpTime);
            } else if (this.jumpTime == 1) {
                this.node.runAction(secondJump);
                console.log('SecondJump', this.jumpTime);
            }
        }



    },

    jumpNew() {
        if (this.jumpTime == 2 || this.jumpTime == 1) {
            if (this.jumpTime == 2) {
                this.setDragonBonesAnimation('jump1')
            } else if (this.jumpTime == 1) {
                this.setDragonBonesAnimation('jump2')
            }

            this.jumpTime--;
            this.vSpeed = this.verticalSpeed;
            this.vAccel = this.verticalAccel;
            this.vMove = true;
        } else if (this.jumpTime == 0) {
            // do nothing

        }
    },

    playerDead() {
        //提示GameOver
        cc.log('game over')

        //播放人物死亡动画
        this.gameManager.scoreManager.updateScore();
        //切换到gameover界面
        cc.director.loadScene('gameover');
    },

    //type: 0. 问题打错扣血 1. 被石头击中15 2. 被飞镖集中20 3. 被地剑击中30 
    damage(count, type) {

        this.hp -= count;
        cc.log('after hit', this.hp)
        switch (type) {
            case 0:
                this.gameManager.statusShower.setStatus(1)
                break;

            case 1:
                this.gameManager.statusShower.setStatus(2)

                break;
            case 2:
                this.gameManager.statusShower.setStatus(3)

                break;
            case 3:
                this.gameManager.statusShower.setStatus(4)

                break;
        }


    },





    update(dt) {




        //通过速度判断当前动画




        // cc.log('人物高度', this.node.y)
        // cc.log(this.node.getBoundingBox())

        //水平移动


        //水平移动结束

        //跳跃逻辑
        // 判断是否进入跳跃状态
        // cc.log(this.vMove, this.vSpeed, this.vAccel);
        if (this.vMove) {
            this.node.y += this.vSpeed * dt; //改变y坐标
            this.vSpeed -= this.vAccel * dt; //改变纵向速度



        }
        if (this.gameManager.gameStart) {
            // cc.log(this.gameManager.road_manager.getCurrentRoad());

            if (this.gameManager.road_manager.getCurrentRoad().name == "road1") {

                if (this.node.getBoundingBox().yMin < this.gameManager.road_manager.getCurrentRoad().getBoundingBox().yMax - 5) {
                    //检测地面碰撞情况
                    cc.log('落地')
                    this.node.y = this.gameManager.road_manager.getCurrentRoad().getBoundingBox().yMax - 5;
                }
            } else if (this.gameManager.road_manager.getCurrentRoad().name == 'road2') {
                if (this.node.getBoundingBox().yMin < this.gameManager.road_manager.getCurrentRoad().getBoundingBox().yMax - 3) {
                    //检测地面碰撞情况
                    cc.log('落地')
                    this.node.y = this.gameManager.road_manager.getCurrentRoad().getBoundingBox().yMax - 3;
                }
            }
        }
        //Limit Pos
        // if (this.gameManager.gameStart) {

        //     if (this.node.getBoundingBox().yMax > this.gameManager.viewportHeight / 2) {
        //         //不能飞出视口
        //         this.vSpeed = 0;

        //     } 
        //     else if (this.node.y < this.gameManager.road.getBoundingBox().yMax) {
        //         //不能低于路面 这个时候说明落到地面上了，那么重置跳跃状态
        //         this.y = this.gameManager.road.getBoundingBox().yMax;
        //         this.vSpeed = 0; //将纵向速度变为0
        //         // this.player.playAnimation('run');
        //         this.jumpTime = 2;
        //         this.vMove = true;
        //     }
        // }

    },


    //碰撞检测
    onCollisionEnter: function (other, self) {
        cc.log('on collision enter')
        if (self.tag == 0 && other.tag == 1) {
            cc.log('on the road');
            if (!global.PLAYER_SHOWUP) {
                global.PLAYER_SHOWUP = true;
                this.gameManager.road_manager.setMoveSpeed(global.NORMAL_ROAD_SPEED);
                this.gameManager.setBgSpeed(global.NORMAL_BG_SPEED);
                this.node.runAction(cc.moveBy(3, cc.v2(-150, 0)));
                cc.log(this.gameManager.bgSpeed);
                cc.log(this.gameManager.road_manager.moveSpeed);
            }
            //碰撞检测的方式在速度过快的情况下会反应不及时
            this.vMove = true;
            this.vSpeed = 0; //将纵向速度变为0 停止总想运动
            this.vAccel = 0;
            this.setDragonBonesAnimation('run')
            this.jumpTime = 2;


        } else if (other.tag == 2) {
            //arrow
            let arrow_damage = this.gameManager.barriersManager.arrow.data.getComponent('arrow').damage; //从prefab资源中直接拿到数据
            cc.log('arrow damage ', arrow_damage);
            this.damage(arrow_damage, 2)
            if (this.hp <= 0) {
                cc.log('You are dead');
                //Game Over 效果
                this.node.emit('player_dead');
            }
        } else if (other.tag == 3) {
            let stone_damage = this.gameManager.barriersManager.arrow.data.getComponent('arrow').damage
            cc.log('stone damage', stone_damage)
            this.damage(stone_damage, 1)
            this.hp -= this.gameManager.barriersManager.stone.data.getComponent('stone').damage;
            if (this.hp <= 0) {
                cc.log('You are dead');
                //Game Over 效果
                this.node.emit('player_dead');
            }
        }
    },

    setDragonBonesAnimation(name) {
        if (this.player.animationName != name) {

            this.player.playAnimation(name);
        }
    }
});
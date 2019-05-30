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

const WAIT = 0;
const GENERATING = 1;
const DONE = 2;
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
        arrow: cc.Prefab,
        stone: cc.Prefab,
        sword: cc.Prefab,
        question: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.arrowList = []; //飞镖库，生成一系列飞镖
        this.stoneList = []; //石头库，生成一系列石头
        this.swordList = []; //刀剑库，生成一系列刀剑

        this.generationStatus = WAIT;

        this.node.on('question-answered', function (res) {
            cc.log(res)
            this.node.getChildByName('questionManager').removeFromParent();
            this.generationStatus = DONE;
            global.QUESTION_BARRIER = false;
            cc.log('当前生成状态', this.generationStatus)
        }, this)


        // this.node.on('questionComingTipFinish', function (question, answer, options) {
        //     // 显示主框



        // })

        // this.node.on('mainbarFinish', function () {
        //     //minibar显示以及问题显示
        // })

    },

    start() {
        // this.schedule(this.generateBarrier, 5, cc.macro.REPEAT_FOREVER, 10);

    },

    init(gm) {
        this.gameManager = gm;
        cc.log(this.name + 'initialization done!')

    },

    //思路:
    // 随机数选出现模式 Pattern
    // 现在的问题！！
    // 如何生成多排攻击？ 就是如何让多排攻击效果实现，比如一排飞完立马又一排飞过来这种，组合度高一点的关卡
    generateArrowBarrier() {
        this.generationStatus = GENERATING;
        let randNum = Math.floor(Math.random() * 2) //1是关卡数
        // randNum = 1;
        cc.log('当前Arrow关卡', randNum);
        switch (randNum) {
            case 0:
                //关卡0 是并排发射一排飞镖
                //这个得加一个下滑动作以躲开
                this.arrowList = [];
                //  生成一定数量的arrow
                for (let i = 0; i < 4; i++) {
                    let arrowOne = cc.instantiate(this.arrow)
                    arrowOne.getComponent('arrow').init(this.gameManager);
                    arrowOne.getComponent('arrow').setY(300 - 150 * i);
                    arrowOne.getComponent('arrow').addXOffset(300 * i);

                    this.node.addChild(arrowOne);
                    this.arrowList.push(arrowOne);
                }
                // cc.log(this.arrowList);


                //在发射之前做足准备工作
                this.arrowList.forEach(element => {
                    element.getComponent('arrow').shoot();
                    //发射
                });

                //n s后移除这个关卡并将其状态设置为完成
                //n 取决于debug时测试的时长，保证动画可以完成
                this.scheduleOnce(() => {
                    this.generationStatus = DONE;
                    this.node.removeAllChildren();
                }, 7);



                break;
            case 1:
                this.arrowList = [];
                //  生成一定数量的arrow
                for (let i = 0; i < 9; i++) {
                    let arrowOne = cc.instantiate(this.arrow)
                    arrowOne.getComponent('arrow').init(this.gameManager);
                    arrowOne.getComponent('arrow').setY(300 - 200 * Math.floor(i / 3)); //setY
                    arrowOne.getComponent('arrow').addXOffset(1000 * Math.floor(i % 3)); //setXOffset

                    this.node.addChild(arrowOne);
                    this.arrowList.push(arrowOne);
                }
                // cc.log(this.arrowList);


                //在发射之前做足准备工作
                this.arrowList.forEach(element => {
                    element.getComponent('arrow').shoot();
                    //发射
                });

                //n s后移除这个关卡并将其状态设置为完成
                //n 取决于debug时测试的时长，保证动画可以完成
                this.scheduleOnce(() => {
                    this.generationStatus = DONE;
                    this.node.removeAllChildren();
                }, 10);
                break;
            default:
                break;
        }

    },

    generateStoneBarrier() {
        //待补充
        this.generationStatus = GENERATING;
        let randNum = Math.floor(Math.random() * 1) //1是关卡数
        cc.log('当前Stone关卡', randNum);
        switch (randNum) {
            case 0:
                this.stoneList = [];
                for (let i = 0; i < 6; i++) {
                    let stoneOne = cc.instantiate(this.stone)
                    cc.log('stone init');
                    stoneOne.getComponent('stone').init(this.gameManager);
                    stoneOne.getComponent('stone').setY(global.HEIGHT_HIT_PLAYER);
                    stoneOne.getComponent('stone').setXOffset(i * 1000);
                    cc.log('stone', stoneOne.x, stoneOne.y);
                    this.node.addChild(stoneOne);
                    this.stoneList.push(stoneOne);
                }

                //发射

                this.stoneList.forEach(element => {
                    element.getComponent(cc.Animation).play(); //播放动画
                    cc.log('shoot', element.x, element.y);
                    element.getComponent('stone').shoot()
                });

                // n s后移除这个关卡
                this.scheduleOnce(_ => {
                    this.generationStatus = DONE;
                    this.node.removeAllChildren();
                }, 10);
                break;
            default:
                break;
        }

    },

    generateSwordBarrier() {
        //待补充
    },

    generateQuestionBarrier() {
        /*生成问题关卡流程
         1.提示问题来了
         2.提示消失
         3.2s后问题在卷轴上出现
         4.展示5s
         5.问题卷轴消失
         6.之后问题bar显示
         7.答案道具出现，答案是一个按钮，点击就会触发回答事件，这个按钮被点击后会调用上层问答监听器的验证答案回调，答案验证会在这执行
         8.答案正确，则会加分，加分的实现依靠gameManager的积分系统引用，答案不对则会掉血，这个依靠player引用
        */
        this.generationStatus = GENERATING;
        global.QUESTION_BARRIER = true;
        let questionNode = cc.instantiate(this.question)
        cc.log('instantiate', questionNode.x, questionNode.y)
        questionNode.getComponent('questionManager').init(this.gameManager);
        cc.log('after init', questionNode.x, questionNode.y)
        questionNode.getComponent('questionManager').loadQuestion(); //通过question内部事件实现一步一步的操作
        this.node.addChild(questionNode);

        // questionNode.getComponent('questionManager').showAndHideTip();
        // questionNode.getComponent('questionManager').showAndHideMainBar();
        // questionNode.getComponent('questionManager').showMiniBar();
        // questionNode.getComponent('questionManager').showOption();


        // this.scheduleOnce(_ => {
        //     questionNode.getComponent('questionManager').hideMiniBar();
        //     questionNode.getComponent('questionManager').hideOption();


        // }, 20)

        // this.scheduleOnce(_ => {
        //     questionNode.removeFromParent();
        //     this.generationStatus = DONE;
        //     global.QUESTION_BARRIER = false;
        // }, 5)
        //这个实现有很多问题，我觉得有过度封装的问题，导致逻辑混乱，太过耦合
        //因此我准备直接将节点设置在位置上的做法

        //随机数生成去选择要load哪个问题
        //cc.log('生成问题')
        // let self = this;
        // this.generationStatus = GENERATING;
        // cc.loader.loadRes('solarsystemquz', function (error, res) {
        //     if (error) {
        //         cc.log(error)
        //     }
        //     cc.log('res', res)
        //     let question = res.json.question
        //     let ans = res.json.answer;
        //     let options = res.json.options

        //     global.CURRENT_QUESTION_LABEL = question;
        //     global.CURRENT_QUESTION_ANSWER = ans;
        //     global.ASKED_QUESTION.push(question);

        //     cc.log('load res and question coming')
        //     self.questionComingTip.opacity = 0;
        //     self.questionComingTip.setPosition(0, 100)
        //     let finishTip = cc.callFunc(_ => {
        //         self.setPosition(-1000, -1000); //移动到外面

        //         this.node.emit('questionComingTipFinish');
        //     })
        //     self.questionComingTip.runAction(cc.sequence(cc.fadeIn(1), cc.repeat(cc.sequence(cc.moveBy(0.5, cc.v2(0, 0)), cc.moveBy(0.5, cc.v2(0, 0))), 2), cc.fadeOut(1), finishTip))


        // })

    },

    generateCountryBarrier() {

    },

    generateBarrier() {
        if (this.gameManager.gameStart) {
            cc.log('game start')

            if (this.generationStatus == WAIT) {
                cc.log('wait for barrier');
                //随机数看生成什么关卡
                let rand = Math.floor(Math.random() * 4)
                // rand = 3;
                cc.log('当前关卡', rand)
                switch (rand) {
                    case 0:
                        cc.log('arrow 关')
                        this.generateArrowBarrier();
                        break;
                    case 1:
                        cc.log('stone 关')
                        this.generateStoneBarrier()
                        break;
                    case 2:
                        cc.log('sword 关')
                        this.generateSwordBarrier();
                        break;
                    case 3:
                        cc.log('节气问题 关');
                        this.generateQuestionBarrier()
                        break;
                    case 4:
                        cc.log('党的问题 关')
                        this.generateCountryBarrier()
                        break;
                    case 5:
                        cc.log('金币关')
                        break;
                    case 6:
                        cc.log('金币关')
                        break;

                }

            } else if (this.generationStatus == DONE) {
                this.generationStatus = WAIT;
            }
        }
    },

    __generateGeneralBarrier(type, row_count, col_count, each_row_offset, each_col_offset) {
        switch (type) {
            case global.BARRIER_TYPE.ARROW:
                break;
            case global.BARRIER_TYPE.STONE:
                break;
            case global.BARRIER_TYPE.SWORD:
                break;
            default:
                cc.log('Wrong type');
                break;
        }
    },

    update(dt) {
        // if (this.gameManager.gameStart) {
        //     cc.log('game start')

        //     if (this.generationStatus == WAIT) {
        //         cc.log('wait for barrier');
        //         //随机数看生成什么关卡
        //         let rand = Math.round(Math.random() * 3)
        //         switch (rand) {
        //             case 0:
        //                 cc.log('arrow 关')
        //                 this.generateArrowBarrier();
        //                 break;
        //             case 1:
        //                 cc.log('stone 关')
        //                 this.generateStoneBarrier()
        //                 break;
        //             case 2:
        //                 cc.log('sword 关')
        //                 this.generateSwordBarrier();
        //                 break;
        //         }

        //     } else if (this.generationStatus == DONE) {
        //         this.generationStatus = WAIT;
        //     }
        // }
        if (global.PLAYER_SHOWUP && !global.BARRIER_SCHEDULED) {

            let interval = 3;
            let delay = 5;
            this.schedule(this.generateBarrier, interval, cc.macro.REPEAT_FOREVER, delay);
            global.BARRIER_SCHEDULED = true;
        }
    },
});
import global from "../DATA";

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
        tips: cc.Node,
        mainbar: cc.Node,
        minibar: cc.Node,

        option: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.node.on('loadDone', this.showAndHideTip, this)
        this.node.on('hideTip', this.showAndHideMainBar, this)
        this.node.on('hideMainBar', function () {
            this.showMiniBar();
            this.showOption();
        }, this)

        this.node.on('answered', function (res) {
            cc.log(res)
            this.hideOption();
            this.hideMiniBar();
            //关卡的事件响应
            //关闭这个关卡
            let result = res;
            this.scheduleOnce(_ => {

                this.gameManager.barriersManager.node.emit('question-answered', result)
            }, 1.5)

            //状态模块响应
            //不管对错都在右侧加一个提示信息

            //得分模块响应
            //对就加1000，错就不理睬
            if (res) {

                this.gameManager.scoreManager.addPoint(1000);
                this.gameManager.statusShower.setStatus(0);
            } else {
                //扣血并发出通知
                this.gameManager.character.damage(20, 0)
            }


        }, this)
    },

    start() {

    },

    init(gm) {
        this.gameManager = gm;
        this.minibar.getComponent('questionBar').init(this.gameManager, this)
        this.mainbar.getComponent('mainbar').init(this.gameManager, this)
        this.initTips()

        //初始化当次问题
        this.question = '';
        this.answer = '';
        this.options = [];

        this.optionsPrefabList = [];
        cc.log('fix', this.node.x, this.node.y)
        this.fixPos();

    },

    initTips() {
        this.tips.opacity = 0;

    },

    fixPos() {
        this.node.x = 0;
        this.node.y = 320;
    },

    loadQuestion() {
        //读取完之后存入data中,后期优化这个吧，暂时无所谓，这个只不过是可以防止重复的发生。
        // if (global.QUESTIONS_BANK) {
        //     cc.log('已读取过')

        // }
        //读取问题
        cc.loader.loadRes('solarsystemquz', function (err, res) {
            if (err) {
                cc.log(err)
                return;
            }
            cc.log(res);
            // global.QUESTIONS_BANK = res;
            let questionNum = res.json.length;
            cc.log('共有题目', questionNum)
            let currentNumber = Math.floor(Math.random() * questionNum)
            cc.log('当前题目', currentNumber)
            let currentQuestion = res.json[currentNumber]
            this.question = currentQuestion.question
            this.answer = currentQuestion.answer
            this.options = currentQuestion.options

            global.CURRENT_QUESTION_LABEL = this.question;
            global.CURRENT_QUESTION_ANSWER = this.ans;

            global.ASKED_QUESTION.push(currentNumber);

            this.node.emit('loadDone')


        }.bind(this))
    },

    showAndHideTip() {
        let show = cc.fadeIn(1);
        let wait = cc.moveBy(2, cc.v2(0, 0))
        let hide = cc.fadeOut(1)
        let hideDone = cc.callFunc(_ => {
            this.node.emit('hideTip')
        })
        this.tips.runAction(cc.sequence(show, wait, hide, hideDone));



        // this.tips.runAction(cc.sequence(show, hide));
    },

    showAndHideMainBar() {
        this.mainbar.getComponent('mainbar').setText(this.question);
        let show = cc.fadeIn(1);
        let wait = cc.moveBy(5, cc.v2(0, 0))
        let hide = cc.fadeOut(1)
        let hideDone = cc.callFunc(_ => {
            this.node.emit('hideMainBar')
        })

        this.mainbar.runAction(cc.sequence(show, wait, hide, hideDone))
    },

    showMiniBar() {
        this.minibar.getComponent('questionBar').setText(this.question);
        this.minibar.getComponent('questionBar').showMe()

        //也可以试试showQuestion(text)方法
    },

    hideMiniBar() {
        this.minibar.getComponent('questionBar').hideMe()
    },

    showOption() {
        let num = this.options.length;
        for (let i = 0; i < num; i++) {
            let optionOne = cc.instantiate(this.option);
            this.node.addChild(optionOne)
            optionOne.getComponent('option').init(this.gameManager, this);
            optionOne.getComponent('option').setY(150 - i * 50)
            optionOne.getComponent('option').setText(this.options[i])
            this.optionsPrefabList.push(optionOne)
        }
        this.optionsPrefabList.forEach(element => {
            element.getComponent('option').shoot()
        });

    },

    hideOption() {
        this.optionsPrefabList.forEach(element => {
            element.runAction(cc.fadeOut(1))

        })
    },

    verifyAnswer(ans) {
        if (ans == this.answer) {
            cc.log('回答正确')
            //给一个提示
            cc.log('加1000分');
            //清除选项
            let result = true
            this.node.emit('answered', result)
            // this.optionsPrefabList.forEach(element => {
            //     element.removeFromParent();
            // })
        } else {
            cc.log('回答错误')

            //扣血
            cc.log('扣血20滴')
            let result = false;
            this.node.emit('answered', result)
            //清除选项
            // this.optionsPrefabList.forEach(element => {
            //     element.removeFromParent();
            // })
            //显示一张卡片介绍本节气
        }
    },


    // update (dt) {},
});
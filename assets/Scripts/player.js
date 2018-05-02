
cc.Class({
    extends: cc.Component,
    
    properties: {
        canvas:
            {
                default: null,
                type:cc.Node,
            },
        background:
            {
                default:null,
                type:cc.Node,
            },
        player: {
            default: null,
            type: cc.Prefab,
        },
        playersleep: {
            default: null,
            type: cc.Prefab,
        },
        block: {
            default: null,
            type: cc.Prefab,
        },

        food_2:{
            default: null,
            type:cc.Prefab,
        },
        food_4: {
            default: null,
            type: cc.Prefab,
        },
        food_8: {
            default: null,
            type: cc.Prefab,
        },
        food_16: {
            default: null,
            type: cc.Prefab,
        },
        food_32: {
            default: null,
            type: cc.Prefab,
        },
        food_64: {
            default: null,
            type: cc.Prefab,
        },
        food_128: {
            default: null,
            type: cc.Prefab,
        },

        Rehabilitation_2: {
            default: null,
            type: cc.Prefab,
        },

        Rehabilitation_4: {
            default: null,
            type: cc.Prefab,
        },

        Rehabilitation_8: {
            default: null,
            type: cc.Prefab,
        },

        Rehabilitation_16: {
            default: null,
            type: cc.Prefab,
        },

        Rehabilitation_32: {
            default: null,
            type: cc.Prefab,
        },

        Rehabilitation_64: {
            default: null,
            type: cc.Prefab,
        },

        Rehabilitation_128: {
            default: null,
            type: cc.Prefab,
        },

        enermy_4: {
            default: null,
            type: cc.Prefab,
        },

        enermy_8: {
            default: null,
            type: cc.Prefab,
        },

        enermy_16: {
            default: null,
            type: cc.Prefab,
        },
        enermy_32: {
            default: null,
            type: cc.Prefab,
        },
        enermy_64: {
            default: null,
            type: cc.Prefab,
        },
        enermy_128: {
            default: null,
            type: cc.Prefab,
        },
        enermy_256: {
            default: null,
            type: cc.Prefab,
        },
        enermy_512: {
            default: null,
            type: cc.Prefab,
        },

        enermysleep_4: {
            default: null,
            type: cc.Prefab,
        },

        enermysleep_8: {
            default: null,
            type: cc.Prefab,
        },
        enermysleep_16: {
            default: null,
            type: cc.Prefab,
        },
        enermysleep_32: {
            default: null,
            type: cc.Prefab,
        },
        enermysleep_64: {
            default: null,
            type: cc.Prefab,
        },
        enermysleep_128: {
            default: null,
            type: cc.Prefab,
        },
        enermysleep_256: {
            default: null,
            type: cc.Prefab,
        },

        bgm: {
            url: cc.AudioClip,
            default: null
        },
        bgm_play:true,
        energy: 1000,
        Rehabilitation:0,
        step: 0,
        sleep: 0,
        score:0,
    },
    
    //最开始加载
    onLoad: function () {
        this.current = cc.audioEngine.play(this.bgm, false, 1);
        cc.audioEngine.setLoop(this.bgm, true);
        this.PositonMaker();
        this.initData();
        this.background.getChildByName("next").getComponent(cc.Label).string = 35-this.step;
        this.background.getChildByName("score").getComponent(cc.Label).string = this.score;
        this.addTouchEvent();
    },

    //添加手势操作（这是采用的是点控手势，放在手机上就是触屏）
    addTouchEvent: function () {
        var self = this;
        this.node.on('touchend', function (event) {
            var touchstart_point = event.getStartLocation();
            var touchend_point = event.getLocation();
            cc.log(touchstart_point.x, touchstart_point.y);
            //上下滑动
            if (Math.abs(touchend_point.y - touchstart_point.y) > Math.abs(touchend_point.x - touchstart_point.x)) {
                if (touchend_point.y > touchstart_point.y) {
                    self.moveUp();
                    cc.log(self.data);
                }
                else {
                    self.moveDown();
                    cc.log(self.data);
                    //      self.addItem();
                }
            }
                //左右滑动
            else {
                if (touchend_point.x > touchstart_point.x) {
                    self.moveRight();
                    cc.log(self.data);
                    //     self.addItem();
                }
                else {
                    self.moveLeft();
                    cc.log(self.data);
                    //       self.addItem();
                }
            }
        });
    },

    //存储位置信息（在游戏最开始时候利用一个空节点铺满4*4的方格，用来记录每个方格的坐标，放在position数组中）
    PositonMaker: function ()
    {
        var self = this;
        var betweenWidth = 0;
        var size = 120;
        self.ItemSize = size;
        var x = -180;
        var y = -275;
        var s = 0;
        self.positions = [];
        for (var i = 0; i < 4; i++) {
            self.positions.push([]);
            for (var j = 0; j < 4; j++) {
                var b = cc.instantiate(this.block);
                b.attr({
                    x: x,
                    y: y,
                    width: size,
                    height: size-10,
                });
                self.positions[i].push(cc.p(x, y));
                x += (size + betweenWidth);
                self.background.addChild(b);
            }
            y += (size-10 + betweenWidth);
            x = -180;
        }
        //      cc.log(this.positions);
    },
    
    //用来查看4*4的方格中空格子，存放在数组中并返回
    getEmptyLocations: function () {
        // 空闲的位置
        var emptyLocations = [];
        for (var i = 0; i < this.data.length; i++) {
            for (var j = 0; j < this.data[i].length; j++) {
                if (this.data[i][j] == 0) {
                    emptyLocations.push(i * 4 + j);
                }
            }
        }
        return emptyLocations;
    },

    //添加物体（能量、攻击力、敌人）
    addItem: function (x1,y1,num) {
        // 空闲的位置
        var emptyLocations = this.getEmptyLocations();
        cc.log(emptyLocations);
        /// 没有空位了
        if (emptyLocations.length == 0) {
            return false;
        }
        var p1 = Math.floor(cc.random0To1() * emptyLocations.length);
        p1 = emptyLocations[p1];
        if (x1 == undefined)
            var x = Math.floor(p1 / 4);
        else
            var x = x1;
        if (y1 == undefined)
            var y = Math.floor(p1 % 4);
        else
            var y = y1;
        //cc.log(this.positions[0][0]);
        var Itemtypes = [0, 1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,100,101];
        var choice = Math.floor(cc.random0To1()*2);
        cc.log(choice);
        if(choice == 0)
            var n = Math.floor(cc.random0To1() + 1);
        else
            var n = Math.floor(cc.random0To1() + 8);
        if (num != undefined) {
            n = num;
        }
        if(Itemtypes[n]==1)
            var b = cc.instantiate(this.food_2);
        else if (Itemtypes[n] == 2)
            var b = cc.instantiate(this.food_4);
        else if (Itemtypes[n] == 3)
            var b = cc.instantiate(this.food_8);
        else if (Itemtypes[n] == 4)
            var b = cc.instantiate(this.food_16);
        else if (Itemtypes[n] == 5)
            var b = cc.instantiate(this.food_32);
        else if (Itemtypes[n] == 6)
            var b = cc.instantiate(this.food_64);
        else if (Itemtypes[n] == 7)
            var b = cc.instantiate(this.food_128);
        else if (Itemtypes[n] == 8)
            var b = cc.instantiate(this.Rehabilitation_2);
        else if (Itemtypes[n] == 9)
            var b = cc.instantiate(this.Rehabilitation_4);
        else if (Itemtypes[n] == 10)
            var b = cc.instantiate(this.Rehabilitation_8);
        else if (Itemtypes[n] == 11)
            var b = cc.instantiate(this.Rehabilitation_16);
        else if (Itemtypes[n] == 12)
            var b = cc.instantiate(this.Rehabilitation_32);
        else if (Itemtypes[n] == 13)
            var b = cc.instantiate(this.Rehabilitation_64);
        else if (Itemtypes[n] == 14)
            var b = cc.instantiate(this.Rehabilitation_128);
        else if (Itemtypes[n] == 15)
            var b = cc.instantiate(this.enermy_4);
        else if (Itemtypes[n] == 16)
            var b = cc.instantiate(this.enermy_8);
        else if (Itemtypes[n] == 17)
            var b = cc.instantiate(this.enermy_16);
        else if (Itemtypes[n] == 18)
            var b = cc.instantiate(this.enermy_32);
        else if (Itemtypes[n] == 19)
            var b = cc.instantiate(this.enermy_64);
        else if (Itemtypes[n] == 20)
            var b = cc.instantiate(this.enermy_128);
        else if (Itemtypes[n] == 21)
            var b = cc.instantiate(this.enermy_256);
        else if (Itemtypes[n] == 22)
            var b = cc.instantiate(this.enermysleep_4);
        else if (Itemtypes[n] == 23)
            var b = cc.instantiate(this.enermysleep_8);
        else if (Itemtypes[n] == 24)
            var b = cc.instantiate(this.enermysleep_16);
        else if (Itemtypes[n] == 25)
            var b = cc.instantiate(this.enermysleep_32);
        else if (Itemtypes[n] == 26)
            var b = cc.instantiate(this.enermysleep_64);
        else if (Itemtypes[n] == 27)
            var b = cc.instantiate(this.enermysleep_128);
        else if (Itemtypes[n] == 28)
            var b = cc.instantiate(this.enermysleep_256);
        else if (Itemtypes[n] == 100)
        {
            var b = cc.instantiate(this.player);
            b.getChildByName('energy').getComponent(cc.Label).string = this.energy;
            b.getChildByName('Rehabilitation').getComponent(cc.Label).string = this.Rehabilitation;
        }
        else if (Itemtypes[n] == 101) 
            var b = cc.instantiate(this.playersleep);
        this.ItemSize = 110;
        b.attr({
            width: this.ItemSize,
            height: this.ItemSize,
        });
        b.setPosition(this.positions[x][y]);
        this.background.addChild(b);
        this.Item[x][y] = b;
        b.scaleX = 0;
        b.scaleY = 0;
        if (Itemtypes[n] < 15) {
            var show = cc.scaleTo(0.1, 1, 1);
            b.runAction(show);
        }
        else {
            var show = cc.scaleTo(0.01, 1, 1);
            b.runAction(show);
        }
        this.data[x][y] = Itemtypes[n];
        return true;
    },

    /// 初始化数据
    initData: function () {
        if (this.Item) {
            for (var i = 0; i < this.Item.length; i++) {
                for (var j = 0; j < this.Item[i].length; j++) {
                    if (this.Item[i][j]) {
                        this.Item[i][j].destroy();
                    }
                }
            }
        }
        this.data = [];
        this.Item = [];
        for (var i = 0; i < 4; i++) {
            this.data.push([0, 0, 0, 0]);
            this.Item.push([null, null, null, null]);
        }
        /*this.addItem(1, 1, 0);
        this.addItem(1, 2, 0);
        this.addItem(1, 3, 1);*/
        this.addItem(1, 1, 29);
        this.addItem(1, 2, 15);
        this.addItem(0, 0, 1);
        //     cc.log(this.data);
    },

    //移动操作（物块移动的滑行轨迹函数）
    moveAction: function (block, pos, callback,time) {
        if (time == undefined)
            var time = 0.1;
        var m = cc.moveTo(time, pos);
        var finished = cc.callFunc(function () {
            callback();
        });
        block.runAction(cc.sequence(m, finished));
    },

    //合并操作
    mergeAction: function (p_x,p_y,b1, b2, num, callback) {
        b1.destroy(); // 合并后销毁
        b2.destroy();
        this.addItem(p_x, p_y, num);
        this.judge_sleep();
        if (this.sleep <= 39) 
            var isbug = this.bug_add();
    },
    //几个move函数目前应该没问题（采用递归移动）
    moveLeft: function () {
        var self = this;
        // 递归移动操作
        var isMoved = false;
        var merged = [];
        for (var i = 0; i < 4; i++) {
            merged.push([0, 0, 0, 0]);
        }

        var move = function (x, y, callback) {
            if (y == 0) {
                if (callback) {
                    callback();
                }
                return;
            }
           

                //物品合并
            else if (self.data[x][y - 1] != 0 && self.data[x][y - 1] != self.data[x][y]&&(self.data[x][y]<15||(self.data[x][y]>=22&&self.data[x][y]<=28))) {
                if (callback) {
                    callback();
                }
                return;
            }
            else if (self.data[x][y - 1] == self.data[x][y] && !merged[x][y - 1]) {
                merged[x][y - 1] = 1;
                self.data[x][y - 1] += 1;
                var b2 = self.Item[x][y - 1];
                var b1 = self.Item[x][y];
                var p = self.positions[x][y - 1];
                self.Item[x][y] = null;
                // self.Item[x][y - 1] = null;
                self.data[x][y] = 0;
                var num = self.data[x][y - 1];
                cc.log(num);
                // self.data[x][y-1] = 0;
                self.moveAction(b1, p, function () {
                    self.mergeAction(x,y-1,b1, b2, num, callback);
                });
                isMoved = true;
            }

            else if (self.data[x][y - 1] == 0) {
                self.data[x][y - 1] = self.data[x][y];
                self.data[x][y] = 0;
                var b = self.Item[x][y];
                var p = self.positions[x][y - 1];
                self.Item[x][y - 1] = b;
                self.Item[x][y] = null;
                self.moveAction(b, p, function () {
                    move(x, y - 1, callback);
                });
                isMoved = true;
            }
                //吃食物
            else if (self.data[x][y - 1] && self.data[x][y - 1] <= 7 && (self.data[x][y] == 100 || self.data[x][y] >= 15 && self.data[x][y] <= 21)) {
                if (self.data[x][y] == 100) {
                    var energy_num = self.data[x][y - 1];
                    energy_num = Math.pow(2, energy_num);
                    self.energyadd(energy_num);
                    //this.energy += energy_num;
                    cc.log("getenergy:", energy_num);
                    var b1 = self.Item[x][y];
                    var b2 = self.Item[x][y - 1];
                    var p = self.positions[x][y - 1];
                    var show = cc.scaleTo(0.2, 0, 0);
                    b2.runAction(show);
                    self.data[x][y - 1] = self.data[x][y];
                    self.data[x][y] = 0;
                    self.Item[x][y - 1] = b1;
                    self.Item[x][y] = null;
                    self.moveAction(b1, p, callback, 0.2);
                    isMoved = true;
                }
                else {
                    var b1 = self.Item[x][y];
                    var b2 = self.Item[x][y - 1];
                    var p = self.positions[x][y - 1];
                    var show = cc.scaleTo(0.2, 0, 0);
                    b2.runAction(show);
                    self.data[x][y - 1] = self.data[x][y];
                    self.data[x][y] = 0;
                    self.Item[x][y - 1] = b1;
                    self.Item[x][y] = null;
                    self.moveAction(b1, p, callback, 0.2);
                    isMoved = true;
                }
            }
                //获取修复力
            else if (self.data[x][y - 1] >= 8 && self.data[x][y - 1] <= 14 && self.data[x][y] == 100) {
                var attack_num = self.data[x][y - 1] - 7;
                self.Rehabilitation_add(attack_num);
                //this.energy += energy_num;
                cc.log("getattacknum:", attack_num);
                var b1 = self.Item[x][y];
                var b2 = self.Item[x][y - 1];
                var p = self.positions[x][y - 1];
                var show = cc.scaleTo(0.2, 0, 0);
                b2.runAction(show);
                self.data[x][y - 1] = self.data[x][y];
                self.data[x][y] = 0;
                self.Item[x][y - 1] = b1;
                self.Item[x][y] = null;
                self.moveAction(b1, p, callback, 0.2);
                isMoved = true;
            }
                //bug获取修复力
            else if (self.data[x][y - 1] >= 8 && self.data[x][y - 1] <= 14 && self.data[x][y] >= 15 && self.data[x][y] <= 21) {
                var attack_num = self.data[x][y - 1] + 6;
                if (attack_num < self.data[x][y])
                    attack_num = self.data[x][y];
                cc.log("Debug");
                var b1 = self.Item[x][y];
                var b2 = self.Item[x][y - 1];
                var p = self.positions[x][y - 1];
                var show = cc.scaleTo(0.2, 0, 0);
                b2.runAction(show);
                self.data[x][y - 1] = attack_num;
                self.data[x][y] = 0;
                self.Item[x][y] = null;
                self.moveAction(b1, p, function () {
                    self.mergeAction(x, y - 1, b1, b2, attack_num, callback);
                });
                isMoved = true;
            }
                //消灭bug
            else if (self.data[x][y - 1] >= 15 && self.data[x][y - 1] <= 21 && self.data[x][y] == 100) {
                var enermy_attack = self.data[x][y - 1] - 13;
                if (enermy_attack > self.Rehabilitation) {
                    var anim = self.Item[x][y].getComponent(cc.Animation);
                    anim.play("hploss");
                    self.energyloss(19);
                }
                else
                    self.Rehabilitation_add(-enermy_attack);
                //this.energy += energy_num;
                self.score += 1;
                self.background.getChildByName("score").getComponent(cc.Label).string = self.score;
                cc.log("win");
                var b1 = self.Item[x][y];
                var b2 = self.Item[x][y - 1];
                var p = self.positions[x][y - 1];
                var show = cc.scaleTo(0.2, 0, 0);
                b2.runAction(show);
                self.data[x][y - 1] = self.data[x][y];
                self.data[x][y] = 0;
                self.Item[x][y - 1] = b1;
                self.Item[x][y] = null;
                self.moveAction(b1, p, callback, 0.2);
                isMoved = true;
            }
            else {
                callback();
            }
        };

        var total = 0;
        var counter = 0;
        var willMove = [];
        for (var y = 1; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                var n = this.data[x][y];
                if (n != 0) {
                    total += 1;
                    willMove.push({ x: x, y: y });
                }
            }
        }
        for (var i = 0; i < willMove.length; i++) {
            var x = willMove[i].x;
            var y = willMove[i].y;
            move(x, y, function () {
                counter += 1;
                if (counter == total) {
                    //            cc.log('counter: ' + counter + " total: " + total);
                    if (self.sleep <= 39) {
                        self.energyloss();
                    }
                    self.judge_sleep();
                    self.afterMove(isMoved);
                }
            });
        }
    },

    moveRight: function () {
        var self = this;
        // 递归移动操作
        var isMoved = false;
        var merged = [];
        for (var i = 0; i < 4; i++) {
            merged.push([0, 0, 0, 0]);
        }



        var move = function (x, y, callback) {
            if (y == 3) {
                if (callback) {
                    callback();
                }
                return;
            }

                //物品合并
            else if (self.data[x][y + 1] != 0 && self.data[x][y + 1] != self.data[x][y]&&(self.data[x][y]<15||(self.data[x][y]>=22&&self.data[x][y]<=28))) {
                if (callback) {
                    callback();
                }
                return;
            }

            else if (self.data[x][y + 1] == self.data[x][y] && !merged[x][y + 1]) {
                merged[x][y + 1] = 1;
                self.data[x][y + 1] += 1;
                var b1 = self.Item[x][y + 1];
                var b = self.Item[x][y];
                var p = self.positions[x][y + 1];
                self.Item[x][y] = null;
                // self.Item[x][y + 1] = null;
                self.data[x][y] = 0;
                var num = self.data[x][y + 1];
                cc.log(num);
                //self.data[x][y + 1] = 0;
                self.moveAction(b, p, function () {
                    self.mergeAction(x,y+1,b, b1, num, callback);
                });
                isMoved = true;
            }
            else if (self.data[x][y + 1] == 0) {
                self.data[x][y + 1] = self.data[x][y];
                self.data[x][y] = 0;
                var b = self.Item[x][y];
                var p = self.positions[x][y + 1];
                self.Item[x][y + 1] = b;
                self.Item[x][y] = null;

                self.moveAction(b, p, function () {
                    move(x, y + 1, callback);
                    isMoved = true;
                });
            }
                //吃食物
            else if (self.data[x][y + 1] && self.data[x][y + 1] <= 7 && (self.data[x][y] == 100 || self.data[x][y] >= 15 && self.data[x][y] <= 21)) {
                if (self.data[x][y] == 100) {
                    var energy_num = self.data[x][y + 1];
                    energy_num = Math.pow(2, energy_num);
                    self.energyadd(energy_num);
                    //this.energy += energy_num;
                    cc.log("getenergy:", energy_num);
                    var b1 = self.Item[x][y];
                    var b2 = self.Item[x][y + 1];
                    var p = self.positions[x][y + 1];
                    var show = cc.scaleTo(0.2, 0, 0);
                    b2.runAction(show);
                    self.data[x][y + 1] = self.data[x][y];
                    self.data[x][y] = 0;
                    self.Item[x][y + 1] = b1;
                    self.Item[x][y] = null;
                    self.moveAction(b1, p, callback, 0.2);
                    isMoved = true;
                }
                else {
                    var b1 = self.Item[x][y];
                    var b2 = self.Item[x][y + 1];
                    var p = self.positions[x][y + 1];
                    var show = cc.scaleTo(0.2, 0, 0);
                    b2.runAction(show);
                    self.data[x][y + 1] = self.data[x][y];
                    self.data[x][y] = 0;
                    self.Item[x][y + 1] = b1;
                    self.Item[x][y] = null;
                    self.moveAction(b1, p, callback, 0.2);
                    isMoved = true;
                }
            }
                //获取修复力
            else if (self.data[x][y + 1] >= 8 && self.data[x][y + 1] <= 14 && self.data[x][y] == 100) {
                var attack_num = self.data[x][y + 1] - 7;
                self.Rehabilitation_add(attack_num);
                //this.energy += energy_num;
                cc.log("getattacknum:", attack_num);
                var b1 = self.Item[x][y];
                var b2 = self.Item[x][y + 1];
                var p = self.positions[x][y + 1];
                var show = cc.scaleTo(0.2, 0, 0);
                b2.runAction(show);
                self.data[x][y + 1] = self.data[x][y];
                self.data[x][y] = 0;
                self.Item[x][y + 1] = b1;
                self.Item[x][y] = null;
                self.moveAction(b1, p, callback, 0.2);
                isMoved = true;
            }
                //bug获取修复力
            else if (self.data[x][y + 1] >= 8 && self.data[x][y + 1] <= 14 && self.data[x][y] >= 15&&self.data[x][y]<=21) {
                var attack_num = self.data[x][y + 1] + 6;
                if (attack_num < self.data[x][y])
                    attack_num = self.data[x][y];
                cc.log("Debug");
                var b1 = self.Item[x][y];
                var b2 = self.Item[x][y + 1];
                var p = self.positions[x][y + 1];
                var show = cc.scaleTo(0.2, 0, 0);
                b2.runAction(show);
                self.data[x][y + 1] = attack_num;
                self.data[x][y] = 0;
                self.Item[x][y] = null;
                self.moveAction(b1, p, function () {
                    self.mergeAction(x, y + 1, b1, b2, attack_num, callback);
                });
                isMoved = true;
            }
                //消灭bug
            else if (self.data[x][y + 1] >= 15 && self.data[x][y + 1] <=21 && self.data[x][y] == 100) {
                var enermy_attack = self.data[x][y + 1] - 13;
                if (enermy_attack > self.Rehabilitation) {
                    var anim = self.Item[x][y].getComponent(cc.Animation);
                    anim.play("hploss");
                    self.energyloss(19);
                }
                else
                    self.Rehabilitation_add(-enermy_attack);
                //this.energy += energy_num;
                self.score += 1;
                self.background.getChildByName("score").getComponent(cc.Label).string = self.score;
                cc.log("win");
                var b1 = self.Item[x][y];
                var b2 = self.Item[x][y + 1];
                var p = self.positions[x][y + 1];
                var show = cc.scaleTo(0.2, 0, 0);
                b2.runAction(show);
                self.data[x][y + 1] = self.data[x][y];
                self.data[x][y] = 0;
                self.Item[x][y + 1] = b1;
                self.Item[x][y] = null;
                self.moveAction(b1, p, callback, 0.2);
                isMoved = true;
            }
            else {
                callback();
            }

        };

        var total = 0;
        var counter = 0;
        var willMove = [];
        for (var y = 2; y >= 0; y--) {
            for (var x = 0; x < 4; x++) {
                var n = this.data[x][y];
                if (n != 0) {
                    total += 1;
                    willMove.push({ x: x, y: y });
                }
            }
        }
        for (var i = 0; i < willMove.length; i++) {
            var x = willMove[i].x;
            var y = willMove[i].y;
            move(x, y, function () {
                counter += 1;
                if (counter == total) {
                    //               cc.log('counter: ' + counter + " total: " + total);
                    if (self.sleep <= 39) {
                        self.energyloss();
                    }
                    self.judge_sleep();
                    self.afterMove(isMoved);
                }
            });
        }
    },

    moveUp: function () {
        var self = this;
        // 递归移动操作
        var isMoved = false;
        var merged = [];
        for (var i = 0; i < 4; i++) {
            merged.push([0, 0, 0, 0]);
        }

        var move = function (x, y, callback) {
            if (x == 3) {
                if (callback) {
                    callback();
                }
                return;
            }


                //物品合并
            else if (self.data[x + 1][y] != 0 && self.data[x + 1][y] != self.data[x][y]&&(self.data[x][y]<15||(self.data[x][y]>=22&&self.data[x][y]<=28))) {
                if (callback) {
                    callback();
                }
                return;
            }
            else if (self.data[x + 1][y] == self.data[x][y] && !merged[x + 1][y]) {
                merged[x + 1][y] = 1;
                self.data[x + 1][y] += 1;
                var b1 = self.Item[x + 1][y];
                var b = self.Item[x][y];
                var p = self.positions[x + 1][y];
                self.Item[x][y] = null;
                //   self.Item[x + 1][y] = null;
                self.data[x][y] = 0;
                var num = self.data[x + 1][y];
                cc.log(num);
                //  self.data[x + 1][y] = 0;
                self.moveAction(b, p, function () {
                    self.mergeAction(x+1,y,b, b1, num, callback);
                });
                isMoved = true;
            }
            else if (self.data[x + 1][y] == 0) {
                self.data[x + 1][y] = self.data[x][y];
                self.data[x][y] = 0;
                var b = self.Item[x][y];
                var p = self.positions[x + 1][y];
                self.Item[x + 1][y] = b;
                self.Item[x][y] = null;

                self.moveAction(b, p, function () {
                    move(x + 1, y, callback);
                    isMoved = true;
                });
            }
            
                //吃食物
            else if (self.data[x + 1][y] && self.data[x + 1][y] <= 7 && (self.data[x][y] == 100 || self.data[x][y] >= 15 && self.data[x][y] <= 21)) {
                if (self.data[x][y] == 100) {
                    var energy_num = self.data[x + 1][y];
                    energy_num = Math.pow(2, energy_num);
                    self.energyadd(energy_num);
                    //this.energy += energy_num;
                    cc.log("getenergy:", energy_num);
                    var b1 = self.Item[x][y];
                    var b2 = self.Item[x + 1][y];
                    var p = self.positions[x + 1][y];
                    var show = cc.scaleTo(0.2, 0, 0);
                    b2.runAction(show);
                    self.data[x + 1][y] = self.data[x][y];
                    self.data[x][y] = 0;
                    self.Item[x + 1][y] = b1;
                    self.Item[x][y] = null;
                    self.moveAction(b1, p, callback, 0.2);
                    isMoved = true;
                }
                else {
                    var b1 = self.Item[x][y];
                    var b2 = self.Item[x + 1][y];
                    var p = self.positions[x + 1][y];
                    var show = cc.scaleTo(0.2, 0, 0);
                    b2.runAction(show);
                    self.data[x + 1][y] = self.data[x][y];
                    self.data[x][y] = 0;
                    self.Item[x + 1][y] = b1;
                    self.Item[x][y] = null;
                    self.moveAction(b1, p, callback, 0.2);
                    isMoved = true;
                }
            }
                //获取修复力
            else if (self.data[x+1][y] >= 8 && self.data[x+1][y] <= 14 && self.data[x][y] == 100) {
                var attack_num = self.data[x+1][y] - 7;
                self.Rehabilitation_add(attack_num);
                //this.energy += energy_num;
                cc.log("getattacknum:", attack_num);
                var b1 = self.Item[x][y];
                var b2 = self.Item[x+1][y];
                var p = self.positions[x+1][y];
                var show = cc.scaleTo(0.2, 0, 0);
                b2.runAction(show);
                self.data[x+1][y] = self.data[x][y];
                self.data[x][y] = 0;
                self.Item[x+1][y] = b1;
                self.Item[x][y] = null;
                self.moveAction(b1, p, callback, 0.2);
                isMoved = true;
            }

                //bug获取修复力
            else if (self.data[x+1][y] >= 8 && self.data[x+1][y] <= 14 && self.data[x][y] >= 15&&self.data[x][y]<=21) {
                var attack_num = self.data[x+1][y] + 6;
                if (attack_num < self.data[x][y])
                    attack_num = self.data[x][y];
                cc.log("Debug");
                var b1 = self.Item[x][y];
                var b2 = self.Item[x+1][y ];
                var p = self.positions[x+1][y];
                var show = cc.scaleTo(0.2, 0, 0);
                b2.runAction(show);
                self.data[x+1][y] = attack_num;
                self.data[x][y] = 0;
                self.Item[x][y] = null;
                self.moveAction(b1, p, function () {
                    self.mergeAction(x+1, y, b1, b2, attack_num, callback);
                });
                isMoved = true;
            }

                //消灭bug
            else if (self.data[x+1][y] >= 15 && self.data[x+1][y] <= 21 && self.data[x][y] == 100) {
                var enermy_attack = self.data[x+1][y] - 13;
                if (enermy_attack > self.Rehabilitation) {
                    var anim = self.Item[x][y].getComponent(cc.Animation);
                    anim.play("hploss");
                    self.energyloss(19);
                }
                else
                    self.Rehabilitation_add(-enermy_attack);
                //this.energy += energy_num;
                self.score += 1;
                self.background.getChildByName("score").getComponent(cc.Label).string = self.score;
                cc.log("win");
                var b1 = self.Item[x][y];
                var b2 = self.Item[x+1][y];
                var p = self.positions[x+1][y];
                var show = cc.scaleTo(0.2, 0, 0);
                b2.runAction(show);
                self.data[x+1][y] = self.data[x][y];
                self.data[x][y] = 0;
                self.Item[x+1][y] = b1;
                self.Item[x][y] = null;
                self.moveAction(b1, p, callback, 0.2);
                isMoved = true;
            }
            else {
                callback();
            }

        };

        var total = 0;
        var counter = 0;
        var willMove = [];
        for (var x = 2; x >= 0; x--) {
            for (var y = 0; y < 4; y++) {
                var n = this.data[x][y];
                if (n != 0) {
                    total += 1;
                    willMove.push({ x: x, y: y });
                }
            }
        }
        for (var i = 0; i < willMove.length; i++) {
            var x = willMove[i].x;
            var y = willMove[i].y;
            move(x, y, function () {
                counter += 1;
                if (counter == total) {
                    //             cc.log('counter: ' + counter + " total: " + total);
                    if (self.sleep <= 39) {
                        self.energyloss();
                    }
                    self.judge_sleep();
                    self.afterMove(isMoved);
                }
            });
        }
    },

    moveDown: function () {
        var self = this;
        // 递归移动操作
        var isMoved = false;
        var merged = [];
        for (var i = 0; i < 4; i++) {
            merged.push([0, 0, 0, 0]);
        }

        var move = function (x, y, callback) {
            if (x == 0) {
                if (callback) {
                    callback();
                }
                return;
            }

                //物品合并
            else if (self.data[x - 1][y] != 0 && self.data[x - 1][y] != self.data[x][y]&&(self.data[x][y]<15||(self.data[x][y]>=22&&self.data[x][y]<=28))) {
                if (callback) {
                    callback();
                }
                return;
            }
            else if (self.data[x - 1][y] == self.data[x][y] && !merged[x - 1][y]) {
                merged[x - 1][y] = 1;
                self.data[x - 1][y] += 1;
                var b1 = self.Item[x - 1][y];
                var b = self.Item[x][y];
                var p = self.positions[x - 1][y];
                self.Item[x][y] = null;
                //  self.Item[x - 1][y] = null;
                self.data[x][y] = 0;
                var num = self.data[x - 1][y];
                cc.log(num);
                // self.data[x - 1][y] = 0;
                self.moveAction(b, p, function () {
                    self.mergeAction(x-1,y,b, b1, num, callback);
                });
                isMoved = true;
            }
            else if (self.data[x - 1][y] == 0) {
                self.data[x - 1][y] = self.data[x][y];
                self.data[x][y] = 0;
                var b = self.Item[x][y];
                var p = self.positions[x - 1][y];
                self.Item[x - 1][y] = b;
                self.Item[x][y] = null;

                self.moveAction(b, p, function () {
                    move(x - 1, y, callback);
                    isMoved = true;
                });
            }

                //吃食物
            else if (self.data[x - 1][y] && self.data[x - 1][y] <= 7 && (self.data[x][y] == 100 || self.data[x][y] >= 15 && self.data[x][y] <= 21)) {
                if (self.data[x][y] == 100) {
                    var energy_num = self.data[x - 1][y];
                    energy_num = Math.pow(2, energy_num);
                    self.energyadd(energy_num);
                    //this.energy += energy_num;
                    cc.log("getenergy:", energy_num);
                    var b1 = self.Item[x][y];
                    var b2 = self.Item[x - 1][y];
                    var p = self.positions[x - 1][y];
                    var show = cc.scaleTo(0.2, 0, 0);
                    b2.runAction(show);
                    self.data[x - 1][y] = self.data[x][y];
                    self.data[x][y] = 0;
                    self.Item[x - 1][y] = b1;
                    self.Item[x][y] = null;
                    self.moveAction(b1, p, callback, 0.2);
                    isMoved = true;
                }
                else {
                    var b1 = self.Item[x][y];
                    var b2 = self.Item[x - 1][y];
                    var p = self.positions[x - 1][y];
                    var show = cc.scaleTo(0.2, 0, 0);
                    b2.runAction(show);
                    self.data[x - 1][y] = self.data[x][y];
                    self.data[x][y] = 0;
                    self.Item[x - 1][y] = b1;
                    self.Item[x][y] = null;
                    self.moveAction(b1, p, callback, 0.2);
                    isMoved = true;
                }
            }
                //获取修复力
            else if (self.data[x-1][y] >= 8 && self.data[x-1][y] <= 14 && self.data[x][y] == 100) {
                var attack_num = self.data[x-1][y] - 7;
                self.Rehabilitation_add(attack_num);
                //this.energy += energy_num;
                cc.log("getattacknum:", attack_num);
                var b1 = self.Item[x][y];
                var b2 = self.Item[x-1][y];
                var p = self.positions[x-1][y];
                var show = cc.scaleTo(0.2, 0, 0);
                b2.runAction(show);
                self.data[x-1][y] = self.data[x][y];
                self.data[x][y] = 0;
                self.Item[x-1][y ] = b1;
                self.Item[x][y] = null;
                self.moveAction(b1, p, callback, 0.2);
                isMoved = true;
            }

                //bug获取修复力
            else if (self.data[x-1][y] >= 8 && self.data[x-1][y] <= 14 && self.data[x][y] >= 15&&self.data[x][y]<=21) {
                var attack_num = self.data[x-1][y] + 6;
                if (attack_num < self.data[x][y])
                    attack_num = self.data[x][y];
                cc.log("Debug");
                var b1 = self.Item[x][y];
                var b2 = self.Item[x-1][y];
                var p = self.positions[x-1][y];
                var show = cc.scaleTo(0.2, 0, 0);
                b2.runAction(show);
                self.data[x-1][y] = attack_num;
                self.data[x][y] = 0;
                self.Item[x][y] = null;
                self.moveAction(b1, p, function () {
                    self.mergeAction(x-1, y, b1, b2, attack_num, callback);
                });
                isMoved = true;
            }

                //消灭bug
            else if (self.data[x-1][y] >= 15 && self.data[x-1][y] <= 21 && self.data[x][y] == 100) {
                var enermy_attack = self.data[x-1][y] - 13;
                if (enermy_attack > self.Rehabilitation) {
                    var anim = self.Item[x][y].getComponent(cc.Animation);
                    anim.play("hploss");
                    self.energyloss(19);
                }
                else
                    self.Rehabilitation_add(-enermy_attack);
                //this.energy += energy_num;
                self.score += 1;
                self.background.getChildByName("score").getComponent(cc.Label).string = self.score;
                cc.log("win");
                var b1 = self.Item[x][y];
                var b2 = self.Item[x-1][y];
                var p = self.positions[x-1][y];
                var show = cc.scaleTo(0.2, 0, 0);
                b2.runAction(show);
                self.data[x-1][y] = self.data[x][y];
                self.data[x][y] = 0;
                self.Item[x-1][y] = b1;
                self.Item[x][y] = null;
                self.moveAction(b1, p, callback, 0.2);
                isMoved = true;
            }

            else {
                callback();
            }

        };

        var total = 0;
        var counter = 0;
        var willMove = [];
        for (var x = 1; x < 4; x++) {
            for (var y = 0; y < 4; y++) {
                var n = this.data[x][y];
                if (n != 0) {
                    total += 1;
                    willMove.push({ x: x, y: y });
                }
            }
        }
        for (var i = 0; i < willMove.length; i++) {
            var x = willMove[i].x;
            var y = willMove[i].y;
            move(x, y, function () {
                counter += 1;
                if (counter == total) {
                    //              cc.log('counter: ' + counter + " total: " + total);
                    if (self.sleep <= 39) {
                        self.energyloss();
                    }
                    self.judge_sleep();
                    self.afterMove(isMoved);
                }
            });
        }
    },
    
    //每次移动结束后
    afterMove: function (moved) {
        cc.log('afterMove');
        if (moved) {
            if (this.sleep <= 39) {
                var isbug = this.bug_add();
                if (isbug == false)
                    this.addItem();
            }
            else
                this.addItem();
        }
        this.moving = false;
    },
    //获取主角节点坐标
    getPlayerpos: function () {
        var pos = [];
        for (var x = 0; x < 4; x++)
            for(var y=0;y<4;y++)
                if (this.data[x][y] == 100)
                {
                    pos.push({ x: x, y: y });
                    return pos;
                }
    },

    //获取目前所有敌人的攻击力的总和并返回（因为每过35步要有一次AOE扣血）
    getEnermy_attack: function () {
        var pos = [];
        var attack_sum = 0;
        for (var x = 0; x < 4; x++)
            for (var y = 0; y < 4; y++)
                if (this.data[x][y] >=15&&this.data[x][y]<=21) {
                    pos.push({ x: x, y: y });
                }
        for (var i = 0; i < pos.length; i++)
            attack_sum += this.data[pos[i].x][pos[i].y] - 14;
        return attack_sum;
    },

    //主角能量(hp)损耗函数【移动操作会执行，敌人伤害会执行，敌人AOE也会执行】
    energyloss: function (num) {
        if (num == undefined)
            num = 1;
        var pos = this.getPlayerpos();
        var player = this.Item[pos[0].x][pos[0].y];
        if (this.energy - num > 0)
            this.energy -= num
        else
            this.energy = 0;
        player.getChildByName("energy").getComponent(cc.Label).string = this.energy;
        if (this.energy == 0) {
            if (this.bgm_play) {
                cc.audioEngine.stop(this.current);
                this.bgm_play = false;
            }
            var t = setTimeout(function() { cc.director.loadScene("end"); }, 700);    
        }
            
    },

    //吃了能量丸加能量(hp)，仅限主角
    energyadd: function (num) {
        this.energy  += num;
        var pos = this.getPlayerpos();
        var player = this.Item[pos[0].x][pos[0].y];
        player.getChildByName("energy").getComponent(cc.Label).string = this.energy;
    },
    
    //记录步数（每过35步执行一次AOE，每过7/14/21/28生成一个敌人）
    bug_add:function(){
        this.step += 1;
        cc.log("step:", this.step);
        this.background.getChildByName("next").getComponent(cc.Label).string = 35 - this.step;    
        if (this.step == 35)
        {
            var pos = this.getPlayerpos();
            var hploss = this.getEnermy_attack();
            if (hploss) {
                var anim = this.Item[pos[0].x][pos[0].y].getComponent(cc.Animation);
                anim.play("hploss");
                this.energyloss(hploss);
            }
            this.step = 0;
            this.background.getChildByName("next").getComponent(cc.Label).string = 35 - this.step;
        }
        if (this.step == 7 || this.step == 14 || this.step == 21 || this.step == 28) {
            var emptyLocations = this.getEmptyLocations();
            if (emptyLocations.length == 0) {
                return false;
            }
            var p1 = Math.floor(cc.random0To1() * emptyLocations.length);
            p1 = emptyLocations[p1];
            this.addItem(p1.x, p1.y, 15);
            return true;
        }
        return false;
    },

    //判断是否该睡觉（即主角和敌人变成灰色）
    judge_sleep: function () {
        if(this.sleep<40)
            this.sleep += 1;
        cc.log("sleep:", this.sleep);
        if (this.sleep ==40) {
            this.fallasleep()
            this.sleep += 1;
        }
        var pos = this.judge_empty();
        cc.log("length:", pos.length);
        if (pos.length==0)
        {
            this.wake_up();
            this.sleep = 1;
        }
    },

    //睡觉函数
    fallasleep: function () {
        for (var x = 0; x < 4; x++)
            for (var y = 0; y < 4; y++) {
                if (this.data[x][y] == 100) {
                    this.Item[x][y].destroy();
                    this.addItem(x, y, 30);
                }

                if (this.data[x][y] >= 15 && this.data[x][y] <= 21)
                {
                    var num = this.data[x][y];
                    this.Item[x][y].destroy();
                    this.addItem(x, y, num + 7);
                }
            }
    },
   
    //醒来函数
    wake_up: function () {
        var pos = [];
        var pos_enemy = [];
        for (var x = 0; x < 4; x++)
            for (var y = 0; y < 4; y++) {
                if (this.data[x][y] == 101) {
                    this.Item[x][y].destroy();
                    this.data[x][y] = 0;
                    this.addItem(x, y, 29);
                }

                if (this.data[x][y] >= 22 && this.data[x][y] <= 28) {
                    var num = this.data[x][y];
                    this.Item[x][y].destroy();
                    this.data[x][y] = 0;
                    this.addItem(x, y, num - 7);
                }
            }
    },

    //判断是否还有空格子
    judge_empty: function () {
        var pos = [];
        for (var x = 0; x < 4; x++)
            for (var y = 0; y < 4; y++)
                if (this.data[x][y] ==0) {
                    pos.push({ x: x, y: y });
                }
        return pos;
    },

    //攻击力增加函数（主角和敌人通用）
    Rehabilitation_add: function (num) {
        cc.log(num);
        if (num <= this.Rehabilitation && num>0)
            return true;
        else if (num < 0)
        {
            this.Rehabilitation += num;
        }
            
        else
            this.Rehabilitation = num;
        var pos = this.getPlayerpos();
        var player = this.Item[pos[0].x][pos[0].y];
        player.getChildByName("Rehabilitation").getComponent(cc.Label).string = this.Rehabilitation;
    },

    //音乐开关
    judge_bgm: function () {
        if (this.bgm_play) {
            cc.audioEngine.stop(this.current);
            this.bgm_play = false;
        }
        else {
            this.current = cc.audioEngine.play(this.bgm, false, 1);
            cc.audioEngine.setLoop(this.bgm, true);
            this.bgm_play = true;
        }
    },

    //返回主界面
    load_Begin: function () {
        if (this.bgm_play) {
            cc.audioEngine.stop(this.current);
            this.bgm_play = false;
        }
        cc.director.loadScene('begin');
    },

});
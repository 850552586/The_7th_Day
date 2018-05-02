cc.Class({
    extends: cc.Component,

    properties: {

    },

    gameover: function () {
        cc.director.loadScene("begin");
    },
});

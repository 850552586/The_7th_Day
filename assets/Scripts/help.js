cc.Class({
    extends: cc.Component,

    properties: {

    },

    load_help: function () {
        cc.director.loadScene('help');
    },

    load_help2: function () {
        cc.director.loadScene('help2');
    },
    //����������
    load_Begin: function () {
        cc.director.loadScene('begin');
    },
});

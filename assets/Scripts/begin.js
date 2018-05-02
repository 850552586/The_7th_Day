
cc.Class({
    extends: cc.Component,

    properties: {

    },

    gamebegin: function ()
    {
        cc.director.loadScene('Main');
    },

    load_help: function () {
        cc.director.loadScene('help');
    },
});

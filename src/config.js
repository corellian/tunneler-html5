var Config = Backbone.Model.extend({
    defaults: {
        "renderType": "Canvas",
        "worldWidth": 640,
        "worldHeight": 480,
        "pixelSize": 4,
        "tankSize": 32,
        "tankSpeed": 4,
        "blueBaseColor": "#1f00fe",
        "greenBaseColor": "#22ff05",
        "dirtColors": ["#b56525", "#a94608"],
        "dirtColorsRGBA": [[181,101,37,255],[169,70,8,255]],
    },
    initialize: function() {

    },
});


var BlueTank = BaseEntity.extend({
    defaults: {
        'speed' : gameContainer.conf.get('tankSpeed'),
    },
    initialize: function() {
        var model = this;
        var entity = Crafty.e('2D, '+gameContainer.conf.get('renderType')+', Tank, Follow');

        entity.attr({ x: 340, y: 348 })
              .controls('right', model.get('speed'))
              .tank('blue')
              .setName('blueTank');

        //entity.origin(entity.w/2, entity.h/2);

        model.set({ 'entity': entity });
    }
});


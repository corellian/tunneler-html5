var GreenTank = BaseEntity.extend({
    defaults: {
        'speed' : gameContainer.conf.get('tankSpeed'),
    },
    initialize: function() {
        var model = this;
        var entity = Crafty.e('2D, '+gameContainer.conf.get('renderType')+', Tank');

        entity.attr({ x: 640, y: 348 })
              .controls('left', model.get('speed'))
              .tank('green')
              .setName('greenTank');

        //entity.origin(entity.w/2, entity.h/2);

        model.set({ 'entity': entity });
    }
});


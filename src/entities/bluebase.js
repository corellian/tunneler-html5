var BlueBase = BaseEntity.extend({
    defaults: {
        'color': gameContainer.conf.get('blueBaseColor'),
    },
    initialize: function() {
        var model = this;
        var entity = Crafty.e('2D, '+gameContainer.conf.get('renderType')+', Base');

        entity.attr({ x: 300, y: 300 })
              .base(model.get('color'))
              .setName('BlueBase');

        model.set({ 'entity' : entity });
    }
});


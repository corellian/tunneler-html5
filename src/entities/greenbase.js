var GreenBase = BaseEntity.extend({
    defaults: {
        'color': gameContainer.conf.get('greenBaseColor'),
    },
    initialize: function() {
        var model = this;
        var entity = Crafty.e('2D, '+gameContainer.conf.get('renderType')+', Base');

        entity.attr({ x: 600, y: 300 })
              .base(model.get('color'))
              .setName('GreenBase');

        model.set({ 'entity' : entity });
    }
});


var Level = BaseEntity.extend({
    defaults: {
        "width": 1000,
        "height": 1000,
    },
    initialize: function() {
        var model = this;
        var entity = Crafty.e("2D, "+gameContainer.conf.get("renderType")+", Level");

        entity.level(0, 0, model.get("width"), model.get("height"))
              .setName("Level");

        model.set({ "entity": entity });
    }
});


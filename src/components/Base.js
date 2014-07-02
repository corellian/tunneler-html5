Crafty.c('Base', {
    walls: null,

    init: function() {

        this.requires('2D, Canvas');

        // RT,R,RB,LB,L,LT
        this.walls = new Array(6);

        for(var i = 0; i < this.walls.length; i++) {
            this.walls[i] = Crafty.e('2D, Canvas, Color, solid');
        }
    },

    base: function(color) {

        var wall_width = 4, wall_length = 128, door_length = 32;

        this.walls[0].attr({
            x: this._x + (wall_length / 2) + (door_length / 2),
            y: this._y,
            w: (wall_length/2) - (door_length/2),
            h: wall_width
        });

        this.walls[1].attr({
            x: this._x + wall_length - wall_width,
            y: this._y,
            w: wall_width,
            h: wall_length
        });

        this.walls[2].attr({
            x: this._x + (wall_length / 2) + (door_length / 2),
            y: this._y + wall_length,
            w: (wall_length/2) - (door_length/2),
            h: wall_width
        });

        this.walls[3].attr({
            x: this._x,
            y: this._y + wall_length,
            w: (wall_length/2) - (door_length/2),
            h: wall_width
        });

        this.walls[4].attr({
            x: this._x,
            y: this._y,
            w: wall_width,
            h: wall_length
        });

        this.walls[5].attr({
            x: this._x,
            y: this._y,
            w: (wall_length/2) - (door_length/2),
            h: wall_width
        });

        for (var i = 0; i < this.walls.length; i++) {
            this.walls[i].color(color).attr({ z: this._z });
            this.attach(this.walls[i]);
        }

        this.trigger('Change');

        return this;
    }
});


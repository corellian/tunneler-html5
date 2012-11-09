Crafty.c('Tank', {
    _counter: 0,

    init: function() {
        this.requires('2D, Canvas, Controls, SpriteAnimation, Collision, solid');
        this.collision(new Crafty.polygon([[6,4],[14,0],[18,0],[26,4],
            [26,28],[6,28]]));

        this.bind('NewDirection', function (direction) {
                var new_dir = 'walk', new_hitbox, stopped = false;

                // Determine direction string
                if (direction.x)
                {
                    if (direction.x > 0) {
                        new_dir += '_right';
                    } else {
                        new_dir += '_left';
                    }
                }

                if (direction.y)
                {
                    if (direction.y > 0) {
                        new_dir += '_down';
                    } else {
                        new_dir += '_up';
                    }
                }

                switch(new_dir)
                {
                    case 'walk_right':
                        new_hitbox = [[4,6],[28,6],[32,14],[32,18],[28,26],
                            [4,26],[4,10]];
                        break;
                    case 'walk_right_down':
                        new_hitbox = [[13,2],[18,2],[30,14],[30,18],[26,26],
                            [18,30],[14,30],[2,18],[2,14]];
                        break;
                    case 'walk_down':
                        new_hitbox = [[6,4],[26,4],[26,28],[18,32],[14,32],
                            [6,28]];
                        break;
                    case 'walk_right_up':
                        new_hitbox = [[14,2],[18,2],[26,6],[30,14],[30,18],
                            [18,30],[14,30],[2,18],[2,14]];
                        break;
                    case 'walk_up':
                        new_hitbox = [[6,4],[14,0],[18,0],[26,4],[26,28],
                            [6,28]];
                        break;
                    case 'walk_left':
                        new_hitbox = [[4,6],[28,6],[28,26],[4,26],[0,18],
                            [0,14]];
                        break;
                    case 'walk_left_up':
                        new_hitbox = [[14,2],[18,2],[30,14],[30,18],[18,30],
                            [14,30],[2,18],[2,14],[6,6]];
                        break;
                    case 'walk_left_down':
                        new_hitbox = [[14,2],[18,2],[30,14],[30,18],[18,30],
                            [14,30],[6,26],[2,18],[2,14]];
                        break;
                    default:
                        this.stop();
                        stopped = true;
                        break;
                }

                if (!stopped && !this.isPlaying(new_dir))
                {
                    this.collision(new Crafty.polygon(new_hitbox));
                    this.stop().animate(new_dir, 0, 0);
                }
        })
        /*
        .onHit('solid', function () {
            // TODO: Move unit out of solid tile
        })
        */
        .bind('Moved', function(from) {
            if (this.hit('solid')) {
                this.attr({ x: from.x, y: from.y });
            }

            // Limit tank speed
            if (this._counter < 6) {
                this._counter++;
                this.attr({ x: from.x, y: from.y });
            } else {
                this._counter = 0;
            }
        })
        .onHit('fire', function() {
            //this.destroy();
            // TODO: Subtract life and play hit sound
        });
    },
    tank: function(color) {

        var sprite_row;

        switch (color)
        {
            case 'blue':
                sprite_row = 1;
                this.requires('blueTank');
                break;
            case 'green':
                sprite_row = 0;
                this.requires('greenTank');
                break;
            default:
                break;
        }

        this.animate('walk_down', 0, sprite_row, 0)
            .animate('walk_right_down', 1, sprite_row, 1)
            .animate('walk_right', 2, sprite_row, 2)
            .animate('walk_right_up', 3, sprite_row, 3)
            .animate('walk_up', 4, sprite_row, 4)
            .animate('walk_left_up', 5, sprite_row, 5)
            .animate('walk_left', 6, sprite_row, 6)
            .animate('walk_left_down', 7, sprite_row, 7);

        return this;
    }
});


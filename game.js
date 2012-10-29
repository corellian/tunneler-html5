window.onload = function () {
    var MAP_WIDTH = 640,
        MAP_HEIGHT = 480,
        TANK_WIDTH = 32,
        TANK_HEIGHT = 32,
        TANK_SPEED = 4,
        PIXEL_SIZE = 4,
        map;

    Crafty.init(MAP_WIDTH, MAP_HEIGHT);

    var EMPTY_COLOR = "#000000",
        // 0: blue, 1: green
        BASE_COLOR = ["#1f00fe", "#22ff05"],
        DIRT_COLOR = ["#b56525", "#a94608"],
        DIRT_COLOR_RGBA = [[181,101,37,255],[169,70,8,255]];
        // 0: blue, 1: green
        // TANK_COLOR = [["#f0eb18", "#1f00fe", "#0000a7"],
        //               ["#f0eb18", "#22ff05", "#159e04"]];

    var level, player1, player2, blueBase, greenBase, hole;

    // The loading screen that will display while our assets load
    Crafty.scene("loading", function () {

        // Load takes an array of assets and a callback when complete
        Crafty.load(["assets/sprites.png"], function () {
            Crafty.scene("main"); // When everything is loaded, run the main scene
        });

        // Black background with some loading text
        Crafty.background(EMPTY_COLOR);
        Crafty.e("2D, Canvas, Text")
            .attr({ w: 100, h: 20, x: 462, y: 374 })
            .text("Loading...");
    });

    Crafty.scene("main", function () {

        level = Crafty.e("Level")
            .level(0, 0, 1000, 1000);
        
        hole = level.map.getContext("2d").getImageData(0, 0, TANK_WIDTH, TANK_HEIGHT);
        for (var i = 0; i < hole.data.length; i++) {
            hole.data[i] = 150;
        }

        blueBase = Crafty.e("Base")
            .attr({ x:300, y:300 })
            .base(BASE_COLOR[0]);

        greenBase = Crafty.e("Base")
            .attr({ x:600, y:300 })
            .base(BASE_COLOR[1]);

        player1 = Crafty.e("Tank, Follow, WiredHitBox")
            .attr({ x: 340, y: 348 })
            .controls("right", TANK_SPEED)
            .tank("blue");

        player2 = Crafty.e("Tank")
            .attr({ x: 640, y: 348 })
            .controls("left", TANK_SPEED)
            .tank("green");
    });

    // Turn the sprite map into usable components
    Crafty.sprite(32, "assets/sprites.png", {
        blueTank: [4, 2],
        greenTank: [4, 1],
        empty: [0, 0]
    });

    Crafty.c("Controls", {
        init: function() {
            this.requires('Multiway');
        },

        controls: function(type, speed) {
            switch (type) {
                case "left":
                    this.multiway(speed, {
                        W: -90,
                        S: 90,
                        D: 0,
                        A: 180 
                    });
                    break;
                case "right":
                    this.multiway(speed, {
                        UP_ARROW: -90,
                        DOWN_ARROW: 90,
                        RIGHT_ARROW: 0,
                        LEFT_ARROW: 180
                    });
                    break;
                default:
                    break;
            }
            return this;
        }
    });

    Crafty.c("Follow", {
        _pixelsPerMovement: TANK_SPEED,

        init: function() {
            this.requires("2D, Multiway");
            this.bind("Moved", function(from) {
                var xdir = this._x - from.x,
                    ydir = this._y - from.y;

                if (xdir > 0)
                {
                    Crafty.viewport.x -= this._pixelsPerMovement;
                }
                else if (xdir < 0)
                {
                    Crafty.viewport.x += this._pixelsPerMovement;
                }

                if (ydir > 0)
                {
                    Crafty.viewport.y -= this._pixelsPerMovement;
                }
                else if (ydir < 0)
                {
                    Crafty.viewport.y += this._pixelsPerMovement;
                }
            });
        }
    });

    Crafty.c("Tank", {
        _counter: 0,

        init: function() {
            this.requires("2D, Canvas, Controls, SpriteAnimation, Collision, solid");
            this.collision(new Crafty.polygon([[6,4],[14,0],[18,0],[26,4],
                [26,28],[6,28]]));

            this.bind("NewDirection", function (direction) {
                    var new_dir = "walk", new_hitbox, stopped = false;

                    // Determine direction string
                    if (direction.x)
                    {
                        if (direction.x > 0) {
                            new_dir += "_right";
                        } else {
                            new_dir += "_left";
                        }
                    }

                    if (direction.y)
                    {
                        if (direction.y > 0) {
                            new_dir += "_down";
                        } else {
                            new_dir += "_up";
                        }
                    }

                    switch(new_dir)
                    {
                        case "walk_right":
                            new_hitbox = [[4,6],[28,6],[32,14],[32,18],[28,26],
                                [4,26],[4,10]];
                            break;
                        case "walk_right_down":
                            new_hitbox = [[13,2],[18,2],[30,14],[30,18],[26,26],
                                [18,30],[14,30],[2,18],[2,14]];
                            break;
                        case "walk_down":
                            new_hitbox = [[6,4],[26,4],[26,28],[18,32],[14,32],
                                [6,28]];
                            break;
                        case "walk_right_up":
                            new_hitbox = [[14,2],[18,2],[26,6],[30,14],[30,18],
                                [18,30],[14,30],[2,18],[2,14]];
                            break;
                        case "walk_up":
                            new_hitbox = [[6,4],[14,0],[18,0],[26,4],[26,28],
                                [6,28]];
                            break;
                        case "walk_left":
                            new_hitbox = [[4,6],[28,6],[28,26],[4,26],[0,18],
                                [0,14]];
                            break;
                        case "walk_left_up":
                            new_hitbox = [[14,2],[18,2],[30,14],[30,18],[18,30],
                                [14,30],[2,18],[2,14],[6,6]];
                            break;
                        case "walk_left_down":
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
            .onHit("solid", function () {
                // TODO: Move unit out of solid tile
            })
            */
            .bind("Moved", function(from) {

                if (this.hit("solid")) {
                    this.attr({ x: from.x, y: from.y });
                }

                // Limit tank speed
                if (this._counter < 6) {
                    this._counter++;
                    this.attr({ x: from.x, y: from.y });
                } else {
                    this._counter = 0;
                }

                level.map.getContext("2d").putImageData(hole, this._x, this._y, 0, 0, TANK_WIDTH, TANK_HEIGHT);

            })
            .onHit("fire", function() {
                //this.destroy();
                // TODO: Subtract life and play hit sound
            });
        },
        tank: function(color) {

            var sprite_row;

            switch (color)
            {
                case "blue":
                    sprite_row = 2;
                    this.requires("blueTank");
                    break;
                case "green":
                    sprite_row = 1;
                    this.requires("greenTank");
                    break;
                default:
                    break;
            }

            this.animate("walk_down", 0, sprite_row, 0)
                .animate("walk_right_down", 1, sprite_row, 1)
                .animate("walk_right", 2, sprite_row, 2)
                .animate("walk_right_up", 3, sprite_row, 3)
                .animate("walk_up", 4, sprite_row, 4)
                .animate("walk_left_up", 5, sprite_row, 5)
                .animate("walk_left", 6, sprite_row, 6)
                .animate("walk_left_down", 7, sprite_row, 7);

            return this;
        }
    });

    Crafty.c("Base", {
        walls: null,

        init: function() {

            this.requires("2D, Canvas");

            // RT,R,RB,LB,L,LT
            this.walls = new Array(6);

            for(var i = 0; i < this.walls.length; i++)
            {
                this.walls[i] = Crafty.e("2D, Canvas, Color, solid");
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

            for (var i = 0; i < this.walls.length; i++)
            {
                this.walls[i].color(color).attr({ z: this._z });
                this.attach(this.walls[i]);
            }

            this.trigger("Change");

            return this;
        }
    });

    Crafty.c("Level", {
        ready: false,
        map: null,

        init: function () {
            this.requires("2D, Canvas");

            var draw = function (e) {
                if (this.ready) {
                    e.ctx.drawImage(this.map, e.pos._x, e.pos._y);
                }
            };

            this.bind("Draw", draw).bind("RemoveComponent", function (id) {
                if (id === "Level") { this.unbind("Draw", draw); }
            });
        },

        level: function (x, y, w, h) {
            this.attr({x: x, y: y, w: w * PIXEL_SIZE, h: h * PIXEL_SIZE});

            if (!this.map) {
                this.map = document.createElement('canvas');
                this.map.height = this.h;
                this.map.width = this.w;
                var context = this.map.getContext('2d'),
                    color,
                    world = new Array(w);

                for (var _x = 0; _x < w; _x++) {
                    world[_x] = new Array(h);
                    for (var _y = 0; _y < h; _y++) {
                        world[_x][_y] = Crafty.math.randomElementOfArray([0,1]);
                    }
                }

                var image = context.getImageData(0, 0, this.w, this.h);

                var i, u, ru, v, rv;
                i = u = ru = v = rv = 0;
                while (u < w) {
                    while (v < h) {
                        color = DIRT_COLOR_RGBA[world[u][v]];
                        image.data[i]   = color[0];
                        image.data[i+1] = color[1];
                        image.data[i+2] = color[2];
                        image.data[i+3] = color[3];
                        i += 4;
                        rv++;
                        if (rv == PIXEL_SIZE) { v++; rv = 0; }
                    }
                    v = 0;
                    ru++;
                    if (ru == PIXEL_SIZE) { u++; ru = 0; }
                }
                context.putImageData(image, 0, 0);
                this.ready = true;
            }

            this.trigger("Change");

            return this;
        }
    });

/*
    Crafty.scene("main-menu", function () {
        Crafty.background("#000");
        Crafty.e("2D, Canvas, Text").attr({ w: 200, h: 20, x: 412, y: 100 })
            .text("TUNNELER HTML5")
            .css({ "text-align": "center",
                   "color": "#fc5454" });
        Crafty.e("2D, Canvas, Text").attr({ w: 200, h: 20, x: 412, y: 140 })
            .text("by Cristian Peraferrer")
            .css({ "text-align": "center",
                   "color": "#a80000" });

    });

    Crafty.scene("game", function () {
        Crafty.background("#000031");

    });
*/

    //automatically play the loading scene
    Crafty.scene("loading");
};


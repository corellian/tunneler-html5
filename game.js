window.onload = function () {
    var MAP_WIDTH = 1024,
        MAP_HEIGHT = 768;

    Crafty.init(MAP_WIDTH, MAP_HEIGHT);

    var EMPTY_COLOR = "#000000",
        // 0: blue, 1: green
        BASE_COLOR = ["#1f00fe", "#22ff05"],
        DIRT_COLOR = ["#b56525", "#a94608"];
        // 0: blue, 1: green
        // TANK_COLOR = [["#f0eb18", "#1f00fe", "#0000a7"],
        //               ["#f0eb18", "#22ff05", "#159e04"]];

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

        Crafty.background(EMPTY_COLOR);
        generateMap();

        var player1 = Crafty.e("2D, Canvas, BlueTank, Tank, Controls, solid")
                .attr({ x: 32, y: 32, z: 1 })
                .rightControls(1)
                .Tank("blue");
        var player2 = Crafty.e("2D, Canvas, GreenTank, Tank, Controls, solid")
                .attr({ x: 64, y: 32, z: 1 })
                .leftControls(1)
                .Tank("green");
        var blueBase = Crafty.e("2D, TankBase")
                .attr({x:200, y:200})
                .tankbase(BASE_COLOR[0]);
        var greenBase = Crafty.e("2D, TankBase")
                .attr({x:500, y:200})
                .tankbase(BASE_COLOR[1]);
        
        // Global viewport scrolling
        Crafty.bind("EnterFrame", function() {
            if (!player1) return;
            // Position of the viewport
            var vpx = (player1._x - (1024/2)),
                vpy = (player1._y - (768/2));
            // Max x in map * 32 - Crafty.viewport.width = 1164
            if (vpx > 0 && vpx < 1025) {
                Crafty.viewport.x = -vpx;
            }
            if(vpy > 0 && vpy < 769) {
                Crafty.viewport.y = -vpy;
            }
        }); 
    });    

    // Turn the sprite map into usable components
    Crafty.sprite(32, "assets/sprites.png", {
        BlueTank: [4, 2],
        GreenTank: [4, 1],
        empty: [0, 0]
    });

    // Function to generate the map
    function generateMap() {

        var world = new Array(256);

        for (var i = 0; i < 256; i++) {
            world[i] = new Array(192);
        }

        // Initialize the world
        for (var i = 0; i < 256; i++) {
            for (var j = 0; j < 192; j++) {
                // We first fill with dirt
                world[i][j] = Crafty.math.randomElementOfArray([0,1]));
            }
        }
    }                   

    Crafty.c("Controls", {
        init: function() {
            this.requires('Multiway');
        },
        
        leftControls: function(speed) {
            this.multiway(speed, {W: -90, S: 90, D: 0, A: 180})
            return this;
        },
        rightControls: function(speed) {
            this.multiway(speed, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
            return this;
        }
    });

    Crafty.c('Tank', {
        init: function() {
            this.requires("SpriteAnimation, Collision, Grid, WiredHitBox");
        },
        Tank: function(color) {
                
            var sprite_row = (color === "blue"? 2 : 1);  

            // Setup sprite
            this.animate("walk_down", 0, sprite_row, 0)
                .animate("walk_right_down", 1, sprite_row, 1)
                .animate("walk_right", 2, sprite_row, 2)
                .animate("walk_right_up", 3, sprite_row, 3)
                .animate("walk_up", 4, sprite_row, 4)
                .animate("walk_left_up", 5, sprite_row, 5)
                .animate("walk_left", 6, sprite_row, 6)
                .animate("walk_left_down", 7, sprite_row, 7)
                .bind("NewDirection", function (direction) {
                    if (direction.y > 0 && !direction.x) {
                        if (!this.isPlaying("walk_down")) {
                            this.stop().animate("walk_down", 0, 0);
                            this.collision(new Crafty.polygon([6,4],[26,4],
                                [26,28],[18,32],[14,32],[6,28])); 
                        }
                    }
                    else if (direction.y > 0 && direction.x > 0) {
                        if (!this.isPlaying("walk_right_down")) {
                            this.stop().animate("walk_right_down", 0, 0);
                            this.collision(new Crafty.polygon([14,2],[18,2],
                                [30,14],[30,18],[26,26],[18,30],[14,30],
                                [2,18],[2,14])); 
                        }
                    }
                    else if (direction.x > 0 && !direction.y) {
                        if (!this.isPlaying("walk_right")) {
                            this.stop().animate("walk_right", 0, 0);
                            this.collision(new Crafty.polygon([4,6],[28,6],
                                [32,14],[32,18],[28,26],[4,26],[4,10]));
                        }
                    }
                    else if (direction.y < 0 && direction.x > 0) {
                        if (!this.isPlaying("walk_right_up")) {
                            this.stop().animate("walk_right_up", 0, 0);
                            this.collision(new Crafty.polygon([0,0],[0,10],[10,10],[10,0])); 
                        }
                    }
                    else if (direction.y < 0 && !direction.x) {
                        if (!this.isPlaying("walk_up")) {
                            this.stop().animate("walk_up", 0, 0);
                            this.collision(new Crafty.polygon([0,0],[0,10],[10,10],[10,0])); 
                        }
                    }
                    else if (direction.y < 0 && direction.x < 0) {
                        if (!this.isPlaying("walk_left_up")) {
                            this.stop().animate("walk_left_up", 0, 0);
                            this.collision(new Crafty.polygon([0,0],[0,10],[10,10],[10,0])); 
                        }
                    }
                    else if (direction.x < 0 && !direction.y) {
                        if (!this.isPlaying("walk_left")) {
                            this.stop().animate("walk_left", 0, 0);
                            this.collision(new Crafty.polygon([0,0],[0,10],[10,10],[10,0])); 
                        }
                    }
                    else if (direction.y > 0 && direction.x < 0) {
                        if (!this.isPlaying("walk_left_down")) {
                            this.stop().animate("walk_left_down", 0, 0);
                            this.collision(new Crafty.polygon([0,0],[0,10],[10,10],[10,0])); 
                        }
                    }
                    else if(!direction.x && !direction.y) {
                        this.stop();
                    }
            })
            .onHit("solid", function () {
                // TODO: Move unit out of solid tile
            })
            .bind('Moved', function(from) {
                if(this.hit("solid")){
                    this.attr({x: from.x, y: from.y});
                }
            })
            .onHit("fire", function() {
                //this.destroy();
                // TODO: Subtract life and play hit sound
            });
            return this;
        }
    });

    Crafty.c("TankBase", {
        init: function() {

            this.requires("2D");
            
            this.leftwall = Crafty.e("Canvas, 2D, Color, solid");
            this.lefttopwall = Crafty.e("Canvas, 2D, Color, solid");
            this.leftbottomwall = Crafty.e("Canvas, 2D, Color, solid");
            this.rightwall = Crafty.e("Canvas, 2D, Color, solid");
            this.righttopwall = Crafty.e("Canvas, 2D, Color, solid");
            this.rightbottomwall = Crafty.e("Canvas, 2D, Color, solid");
        },
        tankbase: function(color) {
            var wall_width = 4, wall_length = 128, door_length = 32;

            this.leftwall.attr({
                    x: this.x, y: this.y, w: wall_width, h: wall_length
                }).color(color);
            this.lefttopwall.attr({
                    x: this.x, y: this.y, w: (wall_length/2) - (door_length/2), h: wall_width
                }).color(color);
            this.leftbottomwall.attr({
                    x: this.x, y: this.y + wall_length, w: (wall_length/2) - (door_length/2), h: wall_width
                }).color(color);

            this.rightwall.attr({
                    x: this.x + wall_length - wall_width, y: this.y, w: wall_width, h: wall_length
                }).color(color);
            this.righttopwall.attr({
                    x: this.x + (wall_length / 2) + (door_length / 2), y: this.y, w: (wall_length/2) - (door_length/2), h: wall_width
                }).color(color);
            this.rightbottomwall.attr({
                    x: this.x + (wall_length / 2) + (door_length / 2), y: this.y + wall_length, w: (wall_length/2) - (door_length/2), h: wall_width
                }).color(color);
            this.attach(this.leftwall);
            this.attach(this.lefttopwall);
            this.attach(this.leftbottomwall);
            this.attach(this.rightwall);
            this.attach(this.righttopwall);
            this.attach(this.rightbottomwall);
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


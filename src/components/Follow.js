Crafty.c("Follow", {
    _pixelsPerMovement: gameContainer.conf.get("tankSpeed"),

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


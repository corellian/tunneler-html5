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
        var pixelSize = gameContainer.conf.get("pixelSize"),
            dirtColorsRGBA = gameContainer.conf.get("dirtColorsRGBA");

        this.attr({x: x, y: y, w: w * pixelSize, h: h * pixelSize});

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
                    color = dirtColorsRGBA[world[u][v]];
                    image.data[i]   = color[0];
                    image.data[i+1] = color[1];
                    image.data[i+2] = color[2];
                    image.data[i+3] = color[3];
                    i += 4;
                    rv++;
                    if (rv == pixelSize) { v++; rv = 0; }
                }
                v = 0;
                ru++;
                if (ru == pixelSize) { u++; ru = 0; }
            }
            context.putImageData(image, 0, 0);
            this.ready = true;
        }

        this.trigger("Change");

        return this;
    }
});


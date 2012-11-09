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


/**
    examples:             
    'sprites_name' : {
         'file' : 'path/to/file',
         'tile' : width,
         'tileh' : height,
         'elements': {
             'sprite_name' : [0, 0]
         }
    },
*/

Sprites = Backbone.Model.extend({
    defaults: {
        images: {
            'tank': {
                'file': 'web/images/tank.png',
                'width': 32,
                'elements': {
                    'blueTank': [4, 1],
                    'greenTank': [4, 0]
                }
            }
        }
    },
    initialize: function() {
        
    },

    /**
     * Create Crafty sprites from images object
     * Pass key if You want create only one choosen sprite.
     * 
     * @param  string key - sprite definition key
     */
    create: function(key) {
        if (key != undefined) {
            element = this.get('images')[key];
            if (element['height'] == undefined) {
                Crafty.sprite(element['width'], element['file'], element['elements']);
            } else {
                Crafty.sprite(element['width'], element['height'], element['file'], element['elements']);
            }

            return true;
        };

        _.each(this.get('images'), function(element, k) { 
            if (element['height'] == undefined) {
                Crafty.sprite(element['width'], element['file'], element['elements']);
            } else {
                Crafty.sprite(element['width'], element['height'], element['file'], element['elements']);
            }
        });

    },

    /**
     * Get path for sprites files - for loading
     * 
     * @return array array of files paths
     */
    getPaths: function() {
        var array = [], i = 0;
        _.each(this.get('images'), function(element, key) { 
            array[i] = element['file']
            i++;
        });

        return array;
    }
});


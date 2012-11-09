Crafty.scene('main', function() {

	var elements = [
        'src/entities/level.js',
        'src/entities/bluebase.js',
        'src/entities/greenbase.js',
        'src/entities/bluetank.js',
        'src/entities/greentank.js'
	];
	
	// When everything is loaded, run the main scene
	require(elements, function() {	   
		sc['level'] = new Level();
		sc['bluebase'] = new BlueBase();
		sc['greenbase'] = new GreenBase();
		sc['bluetank'] = new BlueTank();
		sc['greentank'] = new GreenTank();

        var blueTank = sc['bluetank'].getEntity(),
            greenTank = sc['greentank'].getEntity(),
            level = sc['level'].getEntity(),
            tankSize = gameContainer.conf.get('tankSize'),
            hole = level.map.getContext('2d').getImageData(0, 0, tankSize, tankSize);
        for (var i = 0; i < hole.data.length; i += 4) {
            hole.data[i] = 50;
            hole.data[i+1] = 50;
            hole.data[i+2] = 50;
            hole.data[i+3] = 255;
        }

        blueTank.bind('Moved', function(from) {
            var tankSize = gameContainer.conf.get('tankSize');
            level.map.getContext('2d').putImageData(hole, this._x, this._y, 0, 0, tankSize, tankSize);
        });

        greenTank.bind('Moved', function(from) {
            var tankSize = gameContainer.conf.get('tankSize');
            level.map.getContext('2d').putImageData(hole, this._x, this._y, 0, 0, tankSize, tankSize);
        });
	});
});


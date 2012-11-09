This project is a test field on creating games using Crafty, the Javascript game
engine (http://craftyjs.com).

The structure tree is the CraftyBoilerplate's (https://github.com/flywithmonkey/CraftyBoilerplate) structure:

```
-- src
---- components -> Crafty components files
---- entities -> Files with entities
-------- base
------------ baseEntity.js -> Base entity
---- interfaces -> We keep here files with interface entities
---- levels -> Configuration files for levels
---- scenes -> Files with scenes declarations
---- windows -> Files with logic for interface windows
---- libs -> Other libraries files
-------- backbone
-------- jquery
-------- modernizr
-------- require-jquery
-------- underscore
---- config.js -> Game configuration
---- game.js -> Main file of the game
---- sprites.js -> Sprites definitions
-- web
---- images
---- css
-- index.html -> Game wrapper
``` 
In this case `Backbone` is used as a wrapper for entities and `require-jquery` for loading files when requested.

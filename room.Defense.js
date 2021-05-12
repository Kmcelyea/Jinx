var spawnManager = require('spawn.Manager');
var roleDefenderM = require('role.defenderM');
var roleDefenderR = require('role.defenderR');
var utilAutoConstructor = require('util.AutoConstructor');
var utilPanel = require('util.Panel');

var roomDefenseManager = {

    run: function(roomName) {

    },
    protect:function(room)
    {
        var thisRoom = Game.rooms[room];
        var hostiles = thisRoom.find(FIND_HOSTILE_CREEPS);
        
        if(thisRoom.controller.level > 1){
           var exits = thisRoom.memory.exits;
        if(exits != undefined && exits.length > 0)
        {
            //console.log("Room has :" + exits.length + " exits");
            for(var i in exits)
            {
                var ex = exits[i];
                if(ex != undefined)
                {
                    
                    //console.log("exit "+ i +" posx: " + ex.x+" posy: "+ ex.y);
                    //Top of map
                    if(ex.y == 0)
                    {
                        var newPosition = new RoomPosition(ex.x, ex.y + 2, thisRoom.name);
                        utilAutoConstructor.requestWall(thisRoom, newPosition);
                    }
                    //Left side of map
                    else if(ex.x == 0)
                    {
                        var x = ex.x + 2;
                        var y = ex.y;
                        
                        var newPosition = new RoomPosition(x, y, thisRoom.name);
                        utilAutoConstructor.requestWall(thisRoom, newPosition);
                    }
                    //Right side of map
                    else if(ex.x > ex.y)
                    {
                        var newPosition = new RoomPosition(ex.x - 2, ex.y, thisRoom.name);
                         utilAutoConstructor.requestWall(thisRoom, newPosition);
                    }
                    //Bottom of map
                    else if(ex.y > ex.x)
                    {
                        var newPosition = new RoomPosition(ex.x, ex.y - 2, thisRoom.name);
                        utilAutoConstructor.requestWall(thisRoom, newPosition);
                    }
                }
                
            }
        } 
        }
        
        
        
       
        if(thisRoom.memory.towers == undefined)
        {
             var towers = thisRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            thisRoom.memory.towers = towers;
        }
        
        
        if(hostiles != undefined && hostiles.length > 0) {

            var username = hostiles[0].owner.username;

            //Game.notify(`User ${username} spotted in room ${room}`);

            
            if(towers != undefined && towers.length > 0)
            {
                towers.forEach(tower => tower.attack(hostiles[0]));
            }

            var roomSpawns = Game.rooms[room].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}});

            const hostileCount = hostiles.length;
            utilPanel.createpanel(thisRoom, "",thisRoom.memory.utilRDX,thisRoom.memory.utilRDY+1,5,5,['Hostiles:'+hostileCount]);
            
            if(thisRoom.memory.harvesters > 2)
            {
                if(thisRoom.memory.techLevel != undefined && thisRoom.memory.techLevel <= 2)
                {
                    console.log("RD: room defense level 2 spawning melee fighters @ hostile count + 1");
                    spawnManager.defender(room, roomSpawns[0], hostileCount + 1);
                }
                if(thisRoom.memory.techLevel != undefined && thisRoom.memory.techLevel >= 3)
                {
                    console.log("RD: room defense level 3 and up spawning will be ranged and melee");
                    spawnManager.defender(room, roomSpawns[0], hostileCount + 1);
                    spawnManager.defenderR(room, roomSpawns[0], 2);
                }
                
                
               
            }
            
            var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defenderM');
            if(defenders != undefined && defenders.length > 0)
            {
               defenders.forEach(defender => roleDefenderM.run(defender));
            }
                
            var rangedDefenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defenderR');
            if(rangedDefenders != undefined && rangedDefenders.length > 0)
            {
               rangedDefenders.forEach(rangedDefender => roleDefenderR.run(rangedDefender));
            }

        }
        else{
            
            if(thisRoom.memory.techLevel != undefined && thisRoom.memory.techLevel >= 3)
            {
                var rangedDefenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defenderR');
                if(rangedDefenders != undefined && rangedDefenders.length > 0)
                {
                   rangedDefenders.forEach(rangedDefender => roleDefenderR.returnToEarth(rangedDefender));
                }
            }
            var meleeDefenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defenderM');
            if(meleeDefenders != undefined && meleeDefenders.length > 0)
            {
               meleeDefenders.forEach(meleeDefender => roleDefenderM.returnToEarth(meleeDefender));
            }
        }
        
        
        if(thisRoom.memory.towers != undefined)
        {
            var existing = thisRoom.memory.towers;
            //var exitCount = thisRoom.findExit()
        }
        //Add something here to help setup towers?
    },
    repair: function(room)
    {
            var thisRoom = Game.rooms[room];
            var targets = thisRoom.find(FIND_STRUCTURES,
            {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_ROAD ||
                        structure.structureType === STRUCTURE_RAMPART ||
                        structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_WALL) && (structure.hits < structure.hitsMax)
                }
            });

            if(targets.length > 0) {
                utilPanel.createpanel(thisRoom, "RD State",thisRoom.memory.utilRDX,thisRoom.memory.utilRDY,5,5,['Needs Repairs'],false);
               
                if(_.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length <= Math.round((targets.length / 10) + 1.51)){
                    spawnManager.repairer();
                }
            }
            if((targets.length == 0 || targets == undefined))
            {
                utilPanel.createpanel(thisRoom, "RD State",thisRoom.memory.utilRDX,thisRoom.memory.utilRDY,5,5,['Okay'],false);
            }
            
        }
};

module.exports = roomDefenseManager;

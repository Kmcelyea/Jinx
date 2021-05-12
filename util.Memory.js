var utilMemory = {
    updateRoomMemory: function(thisRoom)
    {
            console.log("URM: setting creep check");
            thisRoom.memory.lastCreepCheck = Game.time;
            thisRoom.memory.harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
            thisRoom.memory.collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector');
            thisRoom.memory.builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            thisRoom.memory.deciders =  _.filter(Game.creeps, (creep) => creep.memory.role == 'decider');
            thisRoom.memory.repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
            thisRoom.memory.csiteTargets = thisRoom.find(FIND_CONSTRUCTION_SITES);
            thisRoom.memory.containers = thisRoom.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER);
            }});
            thisRoom.memory.extensions = thisRoom.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION);
            }});
            thisRoom.memory.towers = thisRoom.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER);
            }});
           
            thisRoom.memory.spawns = thisRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}});
            thisRoom.memory.mainSpawn = thisRoom.memory.spawns[0];
            thisRoom.memory.sources = thisRoom.find(FIND_SOURCES);
            thisRoom.memory.exits = thisRoom.find(FIND_EXIT);
            //UI Positioning
            var spawn = thisRoom.memory.spawns[0];
            thisRoom.memory.utilRDX = spawn.pos.x-4;
            thisRoom.memory.utilRDY = spawn.pos.y-4;
            thisRoom.memory.utilACX = thisRoom.controller.pos.x;
            thisRoom.memory.utilACY = thisRoom.controller.pos.y-3;
            thisRoom.memory.techFlagX = thisRoom.controller.pos.x;
            thisRoom.memory.techFlagY = thisRoom.controller.pos.y + 2;
            thisRoom.memory.utilSMX = spawn.pos.x;
            thisRoom.memory.utilSMY = spawn.pos.y+3;
            thisRoom.memory.rdTower1x = thisRoom.controller.pos.x + 1;
            thisRoom.memory.rdTower1y = thisRoom.controller.pos.y + 2;
            //Zoning init
            if(thisRoom.memory.safeZones === undefined)
            {
                thisRoom.memory.safeZones = [];
            }
            //Management
            console.log("URM: manage structure memory");
            this.managestructures(thisRoom);
            console.log("URM: manage tech levels");
            this.manageTechLevels(thisRoom);
            //Final Setup
            thisRoom.memory.isSetup = true;
    },
    manageTechLevels:function(thisRoom)
    {
        thisRoom.memory.techLevel = thisRoom.controller.level;
        
        if(thisRoom.memory.techLevel == 1)
        {
            console.log("tech level 1");
            this.techLabel(thisRoom, '1');
            /* Description
                no extensions
                5 containers
                tech level one focus: harvest and build containers and upgrade the controller;
            */
        }
            
        if(thisRoom.memory.techLevel == 2)
        {
            console.log("tech level 2");
            this.techLabel(thisRoom, '2');
            /* Description
                no extensions
                5 containers
                tech level one focus: harvest and build containers and upgrade the controller;
            */
        }
        
        if(thisRoom.memory.techLevel == 3)
        {
            console.log("tech level 3");
            this.techLabel(thisRoom, '3');
            /* Description
                no extensions
                5 containers
                tech level one focus: harvest and build containers and upgrade the controller;
            */
        }
        
        if(thisRoom.memory.techLevel == 4)
        {
            console.log("tech level 4");
            this.techLabel(thisRoom, '4');
            /* Description
                no extensions
                5 containers
                tech level one focus: harvest and build containers and upgrade the controller;
            */
        }
        
        if(thisRoom.memory.techLevel == 5)
        {
            console.log("tech level 5");
            this.techLabel(thisRoom, '5');
            /* Description
                no extensions
                5 containers
                tech level one focus: harvest and build containers and upgrade the controller;
            */
        }
        
        if(thisRoom.memory.techLevel == 6)
        {
            console.log("tech level 6");
            this.techLabel(thisRoom, '6');
            /* Description
                no extensions
                5 containers
                tech level one focus: harvest and build containers and upgrade the controller;
            */
        }
        if(thisRoom.memory.techLevel == 7)
        {
            console.log("tech level 7");
            this.techLabel(thisRoom, '7');
            /* Description
                no extensions
                5 containers
                tech level one focus: harvest and build containers and upgrade the controller;
            */
        }
        if(thisRoom.memory.techLevel == 8)
        {
            console.log("tech level 8");
            this.techLabel(thisRoom, '8');
            /* Description
                no extensions
                5 containers
                tech level one focus: harvest and build containers and upgrade the controller;
            */
        }
    },
    techLabel:function(thisRoom, rlevel)
    {
        var flagName = thisRoom.name+" tech " +rlevel;
        var mainFlagList = thisRoom.find(FIND_FLAGS);
        if(Game.flags[flagName] == undefined)
        {
            console.log('UM: no tech flag - drawing');
            thisRoom.createFlag(thisRoom.memory.techFlagX, thisRoom.memory.techFlagY, flagName, COLOR_CYAN, COLOR_YELLOW);
        }
        var unusedFlags = _.filter(mainFlagList, (flag) => flag.name.includes("tech") && flag.name != flagName);
        if(unusedFlags != undefined && unusedFlags.length > 0)
        {
            console.log("UM:cleanup unused flags");
            unusedFlags.forEach(unusedFlag => unusedFlag.remove());
        }
    },
    managestructures:function(thisRoom)
    {
        this.manageC(thisRoom);
        this.manageE(thisRoom);

    },
    manageC:function(thisRoom)
    {
        var containers = thisRoom.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER);
            }});

        if(thisRoom.memory.c1 == true && containers.length < 1)
        {
            thisRoom.memory.c1 = false;
        }
        if(thisRoom.memory.c2 == true && containers.length < 2)
        {
            thisRoom.memory.c2 = false;
        }
        if(thisRoom.memory.c3 == true && containers.length < 3)
        {
            thisRoom.memory.c3 = false;
        }
        if(thisRoom.memory.c4 == true && containers.length < 4)
        {
            thisRoom.memory.c4 = false;
        }
        if(thisRoom.memory.c5 == true && containers.length < 5)
        {
            thisRoom.memory.c5 = false;
        }
    },
    manageE:function(thisRoom)
    {
        var extensions = thisRoom.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION);
            }});

        if(thisRoom.memory.e1 == true && extensions.length < 1)
        {
            thisRoom.memory.e1 = false;
        }
        if(thisRoom.memory.e2 == true && extensions.length < 2)
        {
            thisRoom.memory.e2 = false;
        }
        if(thisRoom.memory.e3 == true && extensions.length < 3)
        {
            thisRoom.memory.e3 = false;
        }
        if(thisRoom.memory.e4 == true && extensions.length < 4)
        {
            thisRoom.memory.e4 = false;
        }
        if(thisRoom.memory.e5 == true && extensions.length < 5)
        {
            thisRoom.memory.e5 = false;
        }
    },
    set:function(key, value)
    {

    },
    clean:function(){
        //console.log("cleaned memory");
        //Clean up memory
        for(var i in Memory.creeps)
        {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }


    }
};

module.exports = utilMemory;

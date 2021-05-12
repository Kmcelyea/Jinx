             //console.log(JSON.stringify(thisRoom.memory));
        /*
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var sharvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'superHarvester');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        var deciders = _.filter(Game.creeps, (creep) => creep.memory.role == 'decider');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var targets = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
        */

        //Clean up individual room memory
        /*
        for(var room in Game.rooms)
        {
            console.log("Clean the house");

            console.log(JSON.stringify(room));
            for(var m in room.memory)
            {

            }
        }
        */
/*
var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }


    var spawnManager = {

    run: function() {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

    var requestedHarvesters = 3;
    var requestedBuilders = Math.round((Game.spawns['HQ'].room.find(FIND_CONSTRUCTION_SITES).length / 10) + .51); //5 / 10 = .5 + .1 = 1 rounded /// 50 / 10 = 5 + .1 = 5
    var requestedCollectors = 3;
    var requestedUpgraders = 3;

    if(harvesters.length == 0)
    {
        var newName = 'Harvester' + Game.time;
            Game.spawns['HQ'].spawnCreep([WORK,CARRY,MOVE], newName,
                {memory: {role: 'harvester'}});
    }
    else
    {
        if(harvesters.length < requestedHarvesters)
        {
             var newName = 'Harvester' + Game.time;
                Game.spawns['HQ'].spawnCreep([WORK,CARRY,MOVE], newName,
                    {memory: {role: 'harvester'}});
        }
        if(builders.length < requestedBuilders) {
            var newName = 'Builder' + Game.time;
            //console.log('Spawning new builder: ' + newName);
            Game.spawns['HQ'].spawnCreep([WORK,CARRY,MOVE], newName,
                {memory: {role: 'builder'}});
        }
        if(collectors.length < requestedCollectors) {
                var newName = 'Collector' + Game.time;
                Game.spawns['HQ'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE], newName,
                    {memory: {role: 'collector'}});
        }
        if(upgraders.length < requestedUpgraders) {
                var newName = 'Upgrader' + Game.time;
                //console.log('Spawning new upgrader: ' + newName);
                Game.spawns['HQ'].spawnCreep([WORK,CARRY,MOVE], newName,
                    {memory: {role: 'upgrader'}});
        }
        if(Game.spawns['HQ'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['HQ'].spawning.name];
            Game.spawns['HQ'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['HQ'].pos.x + 1,
                Game.spawns['HQ'].pos.y,
                {align: 'left', opacity: 0.8});
            }
        }
    },
    repairer: function()
    {
        console.log("called for repairer");
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        var newName = 'Repairer' + Game.time;
        Game.spawns['HQ'].spawnCreep([WORK,CARRY,MOVE], newName,{memory: {role: 'repairer'}});
        return newName;

    },
    defender: function()
    {
        console.log("called for defender");
        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defenderM');
        if(defenders.length <= 0) {
                var newName = 'DefenderM' + Game.time;
                Game.spawns['HQ'].spawnCreep([ATTACK,MOVE, TOUGH], newName,{memory: {role: 'defenderM'}});
        }
    }
};

module.exports = spawnManager;

*/





















/*
creep.say();
var flag = Game.flags[creep.memory.zone.name];
var sourceClosestToFlag = flag.pos.findClosestByPath(FIND_SOURCES);
if(creep.memory.prospecting && (!creep.pos.isNearTo(sourceClosestToFlag) ||
 creep.carry.energy === creep.carryCapacity))
 {
  creep.say("Seeking");
  creep.memory.prospecting = false;
  creep.moveTo(flag, {visualizePathStyle: {stroke: '#ffaa00'}});
}
if(!creep.memory.prospecting
{
  creep.say("⛏" +creep.memory.zone.name);
  creep.memory.prospecting = true;

}

}
else {
if(!creep.pos.isNearTo(flag))
{
  creep.memory.nearZ = false;
}
var targets = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
}});

if(targets.length > 0) {
    targets.sort(function(a,b){return a.energy > b.energy ? -1 : 1});
    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
    }
}
else
{
   var targets = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
        return (
            structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy < structure.storeCapacity;
    }});

    if(targets.length > 0) {
        targets.sort(function(a,b){return a.energy > b.energy ? -1 : 1});
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}

*/

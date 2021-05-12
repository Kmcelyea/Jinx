var utilMemory = require('util.Memory');
var zoneController = require('zone.Controller');
var utilPanel = require('util.Panel');
var spawnRoles = require('spawn.Roles');

var spawnManager = {

    /** @param {Creep} creep **/
    run: function(room) {

        ///Room Cache
        var thisRoom = Game.rooms[room];
        var roomSpawns = Game.rooms[room].find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}});
        var rc = thisRoom.controller;
        var spawn = roomSpawns[0];
        //console.log(thisRoom);

        if(thisRoom.memory.lastCreepCheck == undefined ||
          thisRoom.memory.lastCreepCheck == 0 ||
           thisRoom.memory.isSetup == undefined ||
            !thisRoom.memory.isSetup)
        {
            spawn.room.visual.text("Updating memory ✔️", spawn.pos.x, spawn.pos.y - 3, {color: 'green', font: 0.5});
            //console.log("SM: update room memory " + thisRoom.name)
            utilMemory.updateRoomMemory(thisRoom);
        }
        if(Game.time > (thisRoom.memory.lastCreepCheck + 25))
        {
            spawn.room.visual.text("SM: Updating memory 🗄️", spawn.pos.x, spawn.pos.y - 3, {color: 'orange', font: 0.5});
            //console.log("SM: update room memory " + thisRoom.name)
            utilMemory.updateRoomMemory(thisRoom);
        }

        if(thisRoom.memory.isSetup)
        {
            //console.log("SM: PROCESS Build Requests for:" + thisRoom.name);
            spawn.room.visual.text("SM:Processing Requests ✔️", spawn.pos.x, spawn.pos.y - 5, {color: 'green', font: 0.5});
            this.buildrequests(thisRoom, spawn, rc);
        }
    },
    repairer: function(roomName, spawn, requested)
    {
        //console.log("called for repairer");
        //console.log(Game.rooms[roomName]);
        //console.log(JSON.stringify(Game.rooms[roomName]));
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

        if(repairers != undefined && repairers.length < requested)
        {

            if(spawn != undefined)
            {
                var newName = 'Repairer' + Game.time;
                spawn.spawnCreep([WORK,CARRY,MOVE], newName,{memory: {role: 'repairer'}});
            }

        }
    },
    defender: function(roomName,spawn, requested)
    {
        //console.log("called for defender");
        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defenderM');
        if(defenders != undefined && defenders.length < requested && Game.rooms[roomName].energyAvailable >= 140) {

                if(spawn != undefined){
                    var newName = 'DefenderM' + Game.time;
                    spawn.spawnCreep([ATTACK,MOVE,TOUGH], newName,{memory: {role: 'defenderM'}});
                }

        }
    },
    defenderR: function(roomName,spawn, requested)
    {
        //console.log("called for defender");
        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defenderR');
        if(defenders != undefined && defenders.length < requested && Game.rooms[roomName].energyAvailable >= 210) {

                if(spawn != undefined){
                    var newName = 'DefenderR' + Game.time;
                    spawn.spawnCreep([RANGED_ATTACK,MOVE,TOUGH], newName,{memory: {role: 'defenderR'}});
                }

        }
    },
    buildrequests:function(thisRoom, spawn, rc)
    {
            var requestedPanelData = [];
            var harvesters = thisRoom.memory.harvesters;
            var builders = thisRoom.memory.builders;
            var collectors = thisRoom.memory.collectors;
            var repairers = thisRoom.memory.repairers;
            var deciders = thisRoom.memory.deciders;
            var targets = thisRoom.memory.csiteTargets;
            var containers = thisRoom.memory.containers;
            var extensions = thisRoom.memory.extensions;

            //console.log(JSON.stringify(thisRoom.memory));
            var requestedHarvesters = 1;
            var providedZone = zoneController.provideZone(thisRoom);

            if(providedZone != undefined)
            {
                requestedPanelData.push("Requesting Harvesters: " +providedZone.name);
                var zone = Game.flags[providedZone.name];
                if(zone != undefined && zone.memory.workerCount != undefined)
                {
                    var currentW = zone.memory.workerCount;
                    if(currentW < zone.memory.workerNeed)
                    {
                      requestedHarvesters = harvesters.length + 1;
                    }
                }

            }

            var requestedBuilders = Math.round(targets.length / 2 + .51); //5 / 10 = .5 + .1 = 1 rounded /// 50 / 10 = 5 + .1 = 5
            //console.log("SM: requesting Builders:" +requestedBuilders+" has: "+builders.length);
            var requestedCollectors = Math.round(containers.length / 2 + .51);
            var requestedDeciders = 2;

            var spawn = Game.spawns[thisRoom.memory.mainSpawn.name];
            var spawnEnergy = spawn.store.energy;
            requestedPanelData.push("SE:"+spawnEnergy);
            var extensionEnergy = 0;
            var extensions = thisRoom.memory.extensions;
            for(var i in extensions)
            {
                var extension = extensions[i];
                var e = Game.getObjectById(extension.id);
                extensionEnergy = extensionEnergy + e.store.energy;
            }
            requestedPanelData.push("EE:"+extensionEnergy);

            var computedEnergyConstruction = spawnEnergy + extensionEnergy;

            //Check if we are abundent in a certain type already that might be starving out the others
            var xHarvesters = false
            if(harvesters.length > builders.length * 2 && requestedBuilders > 0)
            {
              xHarvesters = true;
              requestedPanelData.push("Excess Harvesters");
            }
            var xBuilders = false
            if(builders.length > collectors.length * 2 && requestedCollectors > 0)
            {
              xBuilders = true;
              requestedPanelData.push("Excess Builders");
            }


            if(harvesters.length < requestedHarvesters && !xHarvesters)
            {

                requestedPanelData.push("REQ> Harvester");
                spawnRoles.harvester(spawn,computedEnergyConstruction,thisRoom.memory.techLevel);

            }
            if(builders.length < requestedBuilders && !xBuilders)
            {
                requestedPanelData.push("REQ> Builder");
                spawnRoles.builder(spawn,computedEnergyConstruction,thisRoom.memory.techLevel);

            }
            if(collectors.length < requestedCollectors)
            {
                requestedPanelData.push("REQ> Collector");
                spawnRoles.collector(spawn,computedEnergyConstruction,thisRoom.memory.techLevel);
            }

            if(deciders.length < requestedDeciders)
            {
                requestedPanelData.push("REQ> Decider");
                spawnRoles.decider(spawn,computedEnergyConstruction,thisRoom.memory.techLevel);
            }

            /*
            var oldBots = _.filter(Game.creeps, (creep) => creep.memory.tier < thisRoom.memory.techLevel);
            if(oldBots != undefined && oldBots.length > 0)
            {
               oldBots.forEach(oldBot => oldBot.memory.obsolete = true);
            }*/

            utilPanel.createpanel(thisRoom, "Spawn manager", thisRoom.memory.utilSMX,thisRoom.memory.utilSMY,4,4,requestedPanelData, false);

    }
};

module.exports = spawnManager;

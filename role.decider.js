var zoneController = require('zone.Controller');
var utilMemory = require('util.Memory');

var roleDecider = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //creep.text('decider',creep.pos.x, creep.pos.y-1, {color: 'white', font: 0.6});
        if(creep.memory.idle == undefined)
        {
            creep.memory.idle = true;
        }

        if(creep.memory.gettingE != undefined && creep.memory.gettingE)
        {
            this.findenergy(creep);
        }
        else{
                if(creep.room.memory.buildTargets == undefined || creep.room.memory.buildTargets.length == 0)
                {
                    this.jobs(creep, true, false, false, false);
                }
                if(creep.room.memory.energyTargets == undefined || creep.room.memory.energyTargets.length == 0)
                {
                    this.jobs(creep, false, true, false, false)
                }

                if(creep.room.memory.repairTargets == undefined || creep.room.memory.repairTargets.length == 0)
                {
                    this.jobs(creep, false, false, true, false)
                }

                if(creep.room.memory.wallTargets == undefined || creep.room.memory.wallTargets.length == 0)
                {
                    this.jobs(creep, false, false, false, true)
                }
                //This is the opening loop of my super creep base
                if(creep.memory.idle)
                {
                    var thisRoom = Game.rooms[creep.room.name];
                    //Reset ALL JOBS
                    creep.memory.wallrepair = false;
                    creep.memory.repairing = false;
                    creep.memory.building = false;
                    creep.memory.harvesting = false;
                    creep.say("❓");

                    if(thisRoom.memory.isSetup)
                    {
                        creep.say("check mem");
                        
                        var totalBuilders = thisRoom.memory.builders;
                        var eAvailable = thisRoom.energyAvailable;
                        if(creep.room.memory.energyTargets != undefined && creep.room.memory.energyTargets.length > 0 && eAvailable < 300)
                        {
                             creep.memory.harvesting = true;
                             creep.memory.idle = false;
                        }
                        else if(creep.room.memory.wallTargets != undefined && creep.room.memory.wallTargets.length > 0){
                                var hostiles = thisRoom.find(FIND_HOSTILE_CREEPS);
                                if(hostiles != undefined && hostiles.length)
                                {
                                    creep.memory.wallrepair = true;
                                    creep.memory.idle = false;
                                }
                                else{
                                    creep.memory.repairing = true;
                                    creep.memory.idle = false;
                                }
                        }
                        else if(creep.room.memory.buildTargets != undefined && creep.room.memory.buildTargets.length > 0 || totalBuilders.length < 2)
                        {
                            creep.memory.building = true;
                            creep.memory.idle = false;
                        }
                        else if(creep.room.memory.repairTargets != undefined && creep.room.memory.repairTargets.length > 0)
                        {
                            creep.memory.repairing = true;
                            creep.memory.idle = false;
                        }
                    }
                    else
                    {
                        utilMemory.updateRoomMemory(thisRoom);
                    }
                }


                if(!creep.memory.idle && creep.memory.repairing)
                {
                    if(creep.room.memory.repairTargets != undefined && creep.room.memory.repairTargets.length > 0)
                    {
                         creep.say("Repair");
                         this.repair(creep, creep.room.memory.repairTargets);
                    }
                    else
                    {
                        creep.say("Repair ❓");
                        creep.memory.repairing = false;
                        creep.memory.idle = true;
                    }

                }

                if(!creep.memory.idle && creep.memory.building)
                {

                    if(creep.room.memory.buildTargets != undefined && creep.room.memory.buildTargets.length > 0)
                    {
                        creep.say("🔨");
                        this.build(creep, creep.room.memory.buildTargets);
                    }
                    else
                    {
                        creep.say("Build ❓");
                        creep.memory.building = false;
                        creep.memory.idle = true;
                    }
                }

                if(!creep.memory.idle && creep.memory.harvesting)
                {
                    if(creep.room.memory.energyTargets != undefined && creep.room.memory.energyTargets.length > 0)
                    {
                       creep.say("Gather");
                       this.harvest(creep, creep.room.memory.energyTargets);
                    }
                    else
                    {
                        creep.say("Gather ❓");
                        creep.memory.harvesting = false;
                        creep.memory.idle = true;
                    }
                }

                if(!creep.memory.idle && creep.memory.wallrepair)
                {
                    if(creep.room.memory.wallTargets != undefined && creep.room.memory.wallTargets.length > 0)
                    {
                        creep.say("Walls");
                        this.wall(creep, creep.room.memory.wallTargets);
                    }
                    else
                    {
                        creep.say("Walls ❓");
                        creep.memory.idle = true;
                        creep.memory.wallrepair = false;
                    }

                }
        }
    },
    repair:function(creep, targets)
    {
      if(creep.carry.energy == 0)
      {
          creep.memory.gettingE = true;
      }
      else{
          if(targets.length > 0) {
              targets.sort(function(a,b){return a.hits < b.hits ? -1 : 1});
              if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
              }
            }

          if(targets.length == 0)
          {
               creep.memory.repairing = false;
               creep.memory.idle = true;
          }
      }


    },
    wall:function(creep, targets)
    {

      if(creep.carry.energy == 0)
      {
          creep.memory.gettingE = true;
      }
      else{
        if(targets != undefined && targets.length > 0) {
          if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
          }
        }
        if(targets.length == 0)
        {
            creep.memory.wallrepair = false;
            creep.memory.idle = true;
        }
      }


    },
    build:function(creep, bTargets)
    {
         if(creep.carry.energy == 0)
         {
              creep.memory.gettingE = true;
         }
         else
         {
            if(bTargets != undefined && bTargets.length > 0)
            {
              if(creep.memory.buildTarget != undefined)
              {
                  var structure = Game.getObjectById(creep.memory.buildTarget);
                  if(structure != undefined)
                  {
                      if(structure.progress == structure.progressTotal)
                      {
                          creep.memory.buildTarget = undefined;
                      }
                      else
                      {
                          creep.say("Prev 🚧");

                                  if(creep.build(structure) == ERR_NOT_IN_RANGE)
                                  {
                                      creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});
                                  }
                      }
                  }
                  else{
                      creep.memory.buildTarget = undefined;
                  }

              }
              else
              {
                      creep.say("New site");
                      creep.memory.buildTarget = bTargets[0].id;
                      var isExisting = Game.getObjectById(bTargets[0]);
                      if(isExisting == undefined || !isExisting)
                      {
                          creep.room.memory.buildTargets.pop(0);
                      }
                      else
                      {
                          if(creep.build(bTargets[0]) == ERR_NOT_IN_RANGE) {
                          creep.moveTo(bTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                          }
                          if(bTargets[0].length > 0)
                          {
                               creep.say("Got Target");
                          }

                      }
              }

            }
        else
        {
            creep.memory.building = false;
            creep.memory.idle = true;
        }
         }



    },
    harvest:function(creep, spawnEnergy)
    {
        if(spawnEnergy != undefined && spawnEnergy.length > 0)
        {
           if(creep.carry.energy < creep.carryCapacity)
           {
               creep.say("mining")
               var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
           }

            if(creep.carry.energy == creep.carryCapacity)
            {

                this.transfer(creep, spawnEnergy[0]);

            }
        }
        else
        {
            creep.memory.harvesting = false;
            creep.memory.idle = true;
        }

    },
    transfer:function(creep, spawnEnergy)
    {
        if(spawnEnergy == undefined || spawnEnergy.length == 0)
        {
            creep.memory.harvest = false;
            creep.memory.idle = true;
        }

        if(spawnEnergy != undefined) {


            var targetDrop = Game.getObjectById(spawnEnergy.id);
            if(targetDrop.store.energy == targetDrop.storeCapacity)
            {
                creep.say("dump ⚡")
                creep.room.memory.energyTargets = undefined;
            }
            else{
                creep.say("transfer ⚡");
                if(targetDrop.store.energy < targetDrop.storeCapacity){
                    if(creep.transfer(targetDrop, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetDrop, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else{
                    creep.say("dump ⚡")
                    creep.room.memory.energyTargets = undefined;
                    creep.memory.harvesting = false;
                    creep.memory.idle = true;
                }

            }
        }
    },
    jobs:function(creep, getBuilding, getEnergy, getRepair, getWallRepair)
    {

        if(getBuilding)
        {
             var buildingsToMake = creep.room.find(FIND_CONSTRUCTION_SITES);
             creep.room.memory.buildTargets = undefined;
             creep.room.memory.buildTargets = buildingsToMake;
        }
        if(getEnergy)
        {
            var energyDebt = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy < structure.storeCapacity;
                }});
                creep.room.memory.energyTargets = energyDebt;
        }
        if(getRepair)
        {
            var repairsNeeded = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.hits < structure.hitsMax;
                }});
                creep.room.memory.repairTargets = repairsNeeded;
        }
        if(getWallRepair)
        {
             var wallRepairsNeeded = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_WALL) && structure.hits < 20000;
                }});
                 creep.room.memory.wallTargets = wallRepairsNeeded;
        }
    },
    findenergy:function(creep){
          //Get Energy

          if(creep.carry.energy == creep.carryCapacity)
          {
              creep.memory.gettingE = false;
          }

          var containers = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
              return (
                structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy >= 150;
          }});

          if(containers.length > 0) {

              if(creep.withdraw(containers[0], RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffffff'}});
              }
          }
          else
          {
              //console.log("ZC: Decider wants a zone");
              var zone = zoneController.provideZone(creep.room.name);
              if(zone != undefined && zone.length > 0)
              {
                  var flag = Game.flags[zone[0].name];

                  if(!creep.pos.isNearTo(flag))
                  {
                      creep.moveTo(flag, {visualizePathStyle:{stroke:"#eeeeee"}})
                  }
                  else{
                      var source = creep.pos.findClosestByPath(FIND_SOURCES);
                      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                          creep.moveTo(source, {visualizePathStyle:{stroke:'#000000'}});
                      }
                  }
              }
              else{
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle:{stroke:'#000000'}});
                }
              }
          }
    }


};

module.exports = roleDecider;

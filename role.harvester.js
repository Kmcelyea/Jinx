var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

            var thisRoom = Game.rooms[creep.room.name];
            creep.say("⛏");
              const dTarget = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
              if(dTarget != undefined) {
                  if(creep.pickup(dTarget) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(dTarget);
                  }
              }

             if(creep.memory.zone == undefined) {

                 var source = creep.pos.findClosestByPath(FIND_SOURCES);
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
              }

              //Zone Based Work
              if(creep.memory.zone != undefined)
              {

                var flag = Game.flags[creep.memory.zone.name];

                if(flag.memory.unsafe == true)
                {
                  creep.memory.zone = undefined;
                }
                else{
                  let prospect = flag.pos.findClosestByPath(FIND_SOURCES);
                  var roomSpawns = thisRoom.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}});
                  let home = roomSpawns[0];
                    if(creep.memory.prospecting && (!creep.pos.isNearTo(prospect) ||
                     creep.carry.energy == creep.carryCapacity)) {
                        creep.memory.prospecting = false;
                        creep.say('⛏ seeking');
                    }
                    if(!creep.memory.prospecting && (creep.carry.energy < creep.carryCapacity &&
                       creep.pos.isNearTo(prospect))) {
                        creep.memory.prospecting = true;
                        creep.say('Container');
                    }
                    if(creep.memory.prospecting) {
                        creep.say("⛏ " + creep.memory.zone.name);
                        if(creep.harvest(prospect) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(prospect, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                    if(!creep.memory.prospecting && creep.carry.energy < creep.carryCapacity) {

                        creep.moveTo(prospect, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                    else if (!creep.memory.prospecting && creep.carry.energy === creep.carryCapacity)
                    {

                            creep.say("🔆❓");
                            var energyDebt = thisRoom.find(FIND_STRUCTURES, {
                              filter: (structure) => {
                                  return (structure.structureType == STRUCTURE_EXTENSION ||
                                      structure.structureType == STRUCTURE_SPAWN ||
                                      structure.structureType == STRUCTURE_TOWER ||
                                      structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store.energy) != structure.energyCapacity;
                              }});
                            energyDebt.sort(function(a,b){return a.store.energy < b.store.energy ? -1 : 1});

                            if(creep.memory.eDropTarget == undefined || creep.memory.eDropTarget == false)
                            {

                               if(energyDebt != undefined && energyDebt.length > 0) {
                                  creep.memory.eDropTargetId = energyDebt[0].id;
                                    //console.log("Ed "+energyDebt[0]);
                                    creep.say("🔆🔆🔆");
                                    if(creep.transfer(energyDebt[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(energyDebt[0], {visualizePathStyle: {stroke: '#ffffff'}});
                                    }
                                  }
                            }
                            else
                            {
                                  var target = Game.getObjectById(creep.memory.eDropTargetId);
                                  creep.say("beep boop mmm");
                                  if(creep.transfer(target, RESOURCE_ENERGY, target.energyCapacity) == ERR_NOT_IN_RANGE)
                                  {
                                      creep.moveTo(target, {visualizePathStyle: {stroke:'#44EC0A'}});
                                  }

                            }



                    }
                }



          }
   }
};

module.exports = roleHarvester;

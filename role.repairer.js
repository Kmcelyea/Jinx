var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }

        if(creep.memory.repairing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER || 
                        structure.structureType == STRUCTURE_WALL || 
                        structure.structureType == STRUCTURE_ROAD || 
                        structure.structureType == STRUCTURE_CONTAINER) && structure.hits < structure.hitsMax;
                }});
            if(targets.length) {
                targets.sort(function(a,b){return a.hits < b.hits ? -1 : 1});
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else
            {
                
               var spawn = creep.pos.findClosestByRange(STRUCTURE_SPAWN);
               if(spawn != undefined)
               {
                   creep.say("I R S");
                   if(!creep.isNearTo(spawn))
                   {
                       creep.moveTo(spawn);
                   }
               }
               
               
            }
        }
        else {
            creep.say("getting E");
            var eTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_EXTENSION) && structure.energy > 0;
                }
            });
            
            if(eTargets != undefined && eTargets.length > 0)
            {
                if(creep.withdraw(eTargets[0], RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(eTargets[0]);
                }
            }
            else
            {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    }
};

module.exports = roleRepairer;
var roleCollector = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.memory.sourcing) {
	        var thisRoom = Game.rooms[creep.room.name];
            var sources = thisRoom.memory.sources;
            
            if(creep.memory.sourcingId == undefined)
            {
                if(sources != undefined && sources.length > 0)
                {   
                    creep.memory.sourcingId = sources[0].id;
                    creep.memory.sourcing = true;
                    creep.say("collecting");
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#EEF903'}});
                    }
                }
            }
            else{
                
                var source = Game.getObjectById(creep.memory.sourcingId);
                 if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#EEF903'}});
                }
            }
        }
        else {
            if(creep.carry.energy == 0)
            {
                creep.memory.sourcing = true;
            }
            else{
                creep.memory.sourcing = false;
                creep.say("finding a box");
                var thisRoom = Game.rooms[creep.room.name];
                var containers = thisRoom.memory.containers;
                if(containers != undefined && containers.length > 0) {
                    creep.say("deposit");
                    var container = Game.getObjectById(containers[0].id);
                    if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, {visualizePathStyle: {stroke: '#EEF903'}});
                    }
                }
                else{
                    creep.say("hanging out");
                    var spawns = thisRoom.memory.spawns;
                    if(spawns != undefined && spawns.length > 0)
                    {
                        creep.moveTo(Game.spawns[spawns[0].name]);
                    }
                    
                }
            }
            
            
        }
	}
};

module.exports = roleCollector;

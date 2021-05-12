var roleDefenderR = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var enemies = creep.room.find(FIND_HOSTILE_CREEPS);

        if(enemies.length > 0)
        {
            creep.say("HUNT 📯");
            if(creep.rangedAttack(enemies[0], 3) == ERR_NOT_IN_RANGE) {
                     creep.moveTo(enemies[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {

            if(Game.flags['Waiting'] != undefined)
            {
                if(creep.move(Game.flags['Waiting']) == ERR_NOT_IN_RANGE) {
                     creep.moveTo(Game.flags['Waiting'], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else
            {
                creep.say("Stay Alert");
                creep.moveTo(creep.pos.findClosestByRange(creep.room.spawns));
            }

        }
    },
    returnToEarth:function(creep)
    {
        creep.say("♻")
        var spawns = Game.rooms[creep.room.name].memory.spawns;
        if(spawns != undefined && spawns.length > 0){
            var spawn = Game.spawns[spawns[0].name];
            if(!creep.pos.isNearTo(spawn)) {
                     creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            else{
                Game.spawns[spawn.name].recycleCreep(creep);
            }
        }


    }
};

module.exports = roleDefenderR;

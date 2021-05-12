var spawnRoles = {
    
            /*
            Creep Part List
            MOVE:50
            WORK:100
            CARRY:50
            ATTACK:80
            RANGED_ATTACK:150
            HEAL:250
            CLAIM:600
            TOUGH:10
            */
    
    harvester:function(spawn, energyAvailable, tier)
    {
        if(energyAvailable <= 200 || tier < 2) 
        {
            this.spawner(spawn, [WORK,CARRY,MOVE], '2H', 'harvester', 1);
        }
        if(energyAvailable <= 300 || tier >= 2)
        {
            this.spawner(spawn, [WORK,WORK,CARRY,MOVE], '3H', 'harvester',2)
        }
        
        

    },
    collector:function(spawn, energyAvailable, tier)
    {
        if(energyAvailable <= 200 || tier < 2)
        {
            this.spawner(spawn, [WORK, CARRY, MOVE], '2C', 'collector', 1);
        }
        if(energyAvailable <= 300 || tier >= 2)
        {
            this.spawner(spawn, [WORK,WORK, CARRY, MOVE], '2C', 'collector', 2);
        }
    },
    builder:function(spawn, energyAvailable, tier)
    {
        if(energyAvailable <= 200 || tier < 2)
        {
            this.spawner(spawn, [WORK, CARRY, MOVE], '2B', 'builder', 1);
        }
        if(energyAvailable <= 300 || tier >= 2)
        {
            this.spawner(spawn, [WORK,WORK, CARRY, MOVE], '2B', 'builder', 2);
        }
    },
    decider:function(spawn, energyAvailable, tier)
    {
        if(energyAvailable <= 200 || tier < 2)
        {
            this.spawner(spawn, [WORK, CARRY, MOVE], '2D', 'decider', 1);
        }
        if(energyAvailable <= 300 || tier >= 2)
        {
            this.spawner(spawn, [WORK,WORK, CARRY, MOVE], '2D', 'decider', 2);
        }
    },
    spawner:function(spawn, parts, type, nrole, ntier)
    {
        var newName = type + Game.time;
        spawn.spawnCreep(parts, newName, {memory: {role: nrole, tier: ntier}});
        
        if(spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🚼' + spawningCreep.memory.role,
                spawn.pos.x,
                spawn.pos.y + 15,
                {align: 'left', opacity: 0.9});
        }
        
    },

};

module.exports = spawnRoles;

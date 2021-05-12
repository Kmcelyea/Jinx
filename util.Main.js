var roleHarvester = require('role.harvester');
var roleBuilderUpgrader = require('role.builderUpgrader');
var roleRepairer = require('role.repairer');
var roleDecider = require('role.decider');
var roleCollector = require('role.collector');
var roleDefenderM = require('role.defenderM');
var spawnManager = require('spawn.Manager');
var zoneController = require('zone.Controller');
var roomDefenseManager = require('room.Defense');
var utilAutoConstructor = require('util.AutoConstructor');


var utilMain = {


    main:function(usageReport)
    {   
        
        
        if(usageReport)
        {
               if(Game.cpu.getUsed() > Game.cpu.tickLimit / 2) {
                    console.log("Used half of CPU already!");
                }
                console.log("CPU BUCKET: " + Game.cpu.bucket + " CPU TICK LIMIT :" + Game.cpu.tickLimit + " CPU LIMIT :" + Game.cpu.limit);
        }
     
        
        for(var room in Game.rooms)
        {
            if(this.cpuAvailable){
                if(usageReport){
                        console.log("SM: CPU USAGE:" +Game.cpu.getUsed(spawnManager));
                        console.log("ZC: CPU USAGE:" +Game.cpu.getUsed(zoneController));
                        console.log("UAC: CPU USAGE:" +Game.cpu.getUsed(utilAutoConstructor));
                }
               
                spawnManager.run(room);
                zoneController.run(room);
                utilAutoConstructor.run(room, usageReport);
                
            }
        }
        this.defense(true);
    },
    jobs: function(usageReport)
    {
        //manage jobs
        for(var name in Game.creeps) {
            
            if(usageReport)
            {
                const startCpu = Game.cpu.getUsed();
                const elapsed = Game.cpu.getUsed() - startCpu;
                console.log('Creep '+name+' has used '+elapsed+' CPU time');
            }
           
            
            //console.log("get creep by name");
            var creep = Game.creeps[name];
            if(creep.memory.obsolete != undefined && creep.memory.obsolete)
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
            else{
                if(creep.ticksToLive < 100 || creep.memory.healing)
                {
                    creep.memory.healing = true;
                    this.renew(creep);
                }
                else{
                    if(creep.memory.role == 'harvester') {
                        roleHarvester.run(creep);
                    }
                    if(creep.memory.role == 'builder') {
                        roleBuilderUpgrader.run(creep);
                    }
                    if(creep.memory.role == 'repairer') {
                        roleRepairer.run(creep);
                    }
                    if(creep.memory.role == 'decider') {
                        roleDecider.run(creep);
                    }
                    if(creep.memory.role == 'collector') {
                        roleCollector.run(creep);
                    }
                }
            }
            


            
        }
    },
    defense:function(enabled)
    {
        for(var room in Game.rooms)
        {
          if(enabled)
          {
            roomDefenseManager.repair(room);
            roomDefenseManager.protect(room);
          }

        }
    },
    renew:function(creep)
    {
        if(creep.ticksToLive < 1000){
            creep.say("☕");
            var roomSpawns = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}});
            if(!creep.pos.isNearTo(roomSpawns[0]))
            {
               creep.moveTo(roomSpawns[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            else
            {
                creep.say("🥂");
                roomSpawns[0].renewCreep(creep);
            }
        }
        else{
            creep.say("Better");
            creep.memory.healing = false;
        }
            
    },
    cpuAvailable:function()
    {
        if(Game.cpu.getUsed() != Game.cpu.tickLimit) {
            return true;
                        
        }
        else{
            return false;
        }
    }
};

module.exports = utilMain;

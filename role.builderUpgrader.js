var zoneController = require("zone.Controller");

var roleBuilderUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.carry.energy == 0)
        {
            this.findenergy(creep);
        }
        
        
        if(creep.memory.building == undefined)
        {
            creep.memory.building = true;
        }
        
        
        
        if(creep.memory.gettingE != undefined && creep.memory.gettingE)
        {
            this.findenergy(creep);
        }
        else{
            if(!creep.memory.building)
            {
                creep.memory.upgrading = true;
            }
            
            if(creep.memory.building)
            {
                this.build(creep);
            }
            if(creep.memory.upgrading)
            {
                this.upgrade(creep);
            }
        }
        
        
       
    },
    upgrade:function(creep)
    {
            if(creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
                creep.memory.gettingE = true;
                
            }
            else
            {
                creep.memory.howMuchUpgraded = creep.memory.howMuchUpgraded + creep.carryCapacity;
                var rmclp = creep.room.controller.progressTotal * 0.01;
                if(rmclp > creep.memory.howMuchUpgraded )
                {
                    creep.memory.upgrading = false;
                    creep.memory.howMuchUpgraded = 0;
                }
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
    },
    build:function(creep)
    {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.memory.gettingE = true;
        }
        else if(creep.memory.building){
             var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length > 0)
            {
                targets.sort(function(a,b){return a.progress > b.progress ? -1 : 1});
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }  
            }
            else{
                creep.memory.upgrading = true;
                creep.memory.building = false;
            }
        }
        else {
            
            var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > 0;
            }});
            
            if(targets.length > 0) {
                if(creep.withdraw(targets[0], RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else
            {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                } 
            }
            
            
        }
    },
    findenergy:function(creep){
          //Get Energy
          creep.say('🔄 harvest');
          if(creep.carry.energy == creep.carryCapacity)
          {
              creep.memory.gettingE = false;
              creep.memory.building = true;
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
             // console.log("ZC: Decider wants a zone");
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

module.exports = roleBuilderUpgrader;
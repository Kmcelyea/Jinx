var utilPanel = require("util.Panel");

var zoneController = {

    /** @param {Creep} creep **/
    run: function(room) {
            if(Game.flags['Waiting'+room] == undefined)
            {
                var roomSpawns = Game.rooms[room].find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}});
                var spawn = roomSpawns[0];
                Game.rooms[room].createFlag(spawn.x + 2, spawn.y + 5, 'Waiting'+room, COLOR_YELLOW);
            }


            var sources = Game.rooms[room].find(FIND_SOURCES);

            sources.forEach(source => {
                //Declare a work zone around it by creating a flag and making a route that harvesters will work.
                var sourcePos = source.pos;
                if(Game.flags['Zone'+sourcePos.x+sourcePos.y] == undefined)
                {
                     Game.rooms[room].createFlag(sourcePos.x + 1, sourcePos.y, 'Zone' + sourcePos.x + sourcePos.y);
                }
                else{
                    var flagName = 'Zone'+sourcePos.x+sourcePos.y;
                    this.requestWork(Game.flags[flagName], room, source);
                }



            });
            //console.log(sources.length);

    },
    requestWork:function(zone, room, source)
    {
        //console.log("ZC: Requesting work in zone: " + zone.name);
        
        if(zone.memory.unsafe)
        {
            zone.setColor(COLOR_RED);
            var thisRoom = Game.rooms[room];
            thisRoom.visual.text("UNSAFE", zone.pos.x + 1, zone.pos.y, {color: 'red', font: 1}); 
        }
        else{
            if(zone.memory.workerCount == undefined)
            {
              console.log("ZC: undefined count: STARTUP: " + zone.name);
              zone.setColor(COLOR_GREEN, COLOR_WHITE);
              zone.memory.workerCount = 0;
            }
            if(zone.memory.needWorkers)
            {
              //console.log("ZC: " + zone.name + " needs more workers");
              zone.setColor(COLOR_GREEN, COLOR_WHITE);
            }
        

         var checkedCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' &&
         creep.memory.zone != undefined && creep.memory.zone.name == zone.name);

         //console.log("ZC: CC = " + checkedCount.length);
         //console.log("ZC: WC = " + zone.memory.workerCount);
        if(checkedCount != undefined && zone.memory.workerCount != checkedCount.length)
        {
           //console.log('ZC: update worker count in ' +zone.name + " : " + checkedCount.length);
           zone.memory.workerCount = checkedCount.length;
        }


        var zoneWorkerNeed = 2; //Min Need
        if(zone.memory.workerNeed != undefined)
        {
           zoneWorkerNeed = zone.memory.workerNeed;
        }
        else
        {
            console.log("ZC: calculating new base requested harvesters for zone: " + zone.name);
            var calculatedNeed = 0;
            var roomSpawns = Game.rooms[room].find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}});
            var spawn = roomSpawns[0];

            if(spawn.pos.getRangeTo(zone) <= 20)
            {
              //console.log(zone);
              //console.log("L 20");
              calculatedNeed = 2;
            }

            if(spawn.pos.getRangeTo(zone) >= 21 && spawn.pos.getRangeTo(zone) <= 45)
            {
              //console.log(zone);
              //console.log("G 20");
              calculatedNeed = 6;
            }
            else
            {
                calculatedNeed = 8;
            }
            zone.memory.workerNeed = calculatedNeed;
            zoneWorkerNeed = calculatedNeed;
            //console.log(zone.memory.workerNeed);
        }

        if(zone.memory.workerCount < zoneWorkerNeed)
        {

            var findCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.zone == undefined);

            if(findCreeps != undefined && findCreeps.length > 0)
            {
                var creep = findCreeps[0];
                creep.memory.zone = zone;
                zone.memory.workerCount == zone.memory.workerCount + 1;
                zone.memory.needWorkers = false;
            }
            else{
              zone.memory.needWorkers = true;
            }

        }
        else{
            zone.setColor(COLOR_RED, COLOR_WHITE);
            zone.memory.needWorkers = false;


        }
        }
        
        

    },
    provideZone:function(room)
    {
        var thisRoom = Game.rooms[room.name];
        if(thisRoom != undefined)
        {
           
            var zones = _.filter(thisRoom.find(FIND_FLAGS), flag => flag.name.includes("Zone") && flag.memory.needWorkers != undefined && flag.memory.needWorkers && flag.memory.workerCount < flag.memory.workerNeed);
            
            //console.log(zones);
            var safeZones = thisRoom.memory.safeZones;
            for(var i in zones)
            {
                var zone = zones[i];
                //console.log(zone);
                var safe = this.checkZoneEnemies(thisRoom, zone);
                
                if(safe == true)
                {
                    if(thisRoom.memory.saveZones == undefined)
                    {
                        thisRoom.memory.safeZones = [zone];
                        zone.memory.unsafe = false;
                    }
                    else
                    {
                        thisRoom.memory.safeZones.push[zone];
                        zone.memory.unsafe = false;
                    }
                    
                }
                else
                {
                    thisRoom.memory.safeZones.pop[zone];
                    zone.memory.unsafe = true;
                }
            }
            //console.log("safe zones:" + safeZones)
            
            if(safeZones != undefined && safeZones.length > 0)
            {
                var zPos = safeZones[0].pos;
                var xPos = zPos.x;
                var yPos = zPos.y;
            
                utilPanel.createpanel(thisRoom, "ZC Assigned",xPos+1,yPos+2,1,1,[safeZones[0].name], false);
                return safeZones[0];
            }
            else{
                return 0;
            }
           
            //console.log(JSON.stringify(zones[0]));
            
        }
        return 0;
        
    },
    checkZoneEnemies:function(thisRoom, zone){
      var hostiles =  thisRoom.find(FIND_HOSTILE_CREEPS);
      if(hostiles != undefined && hostiles.length > 0)
      {
          for(var i in hostiles)
          {
              var hostile = hostiles[i];
              var zoneX = zone.pos.x;
              var xRange = 10;
              
              if(hostile.pos.inRangeTo(zone, 3))
              {
                  return false;
              }
              else{
                  return true;
              }
          }
      }
      else{
          return true;
      }
    }
};

module.exports = zoneController;

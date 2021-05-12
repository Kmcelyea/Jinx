var utilMemory = require('util.Memory');
var utilPanel = require('util.Panel');
var utilAutoConstructor = {

    run:function(room, usageReport)
    {
        var thisRoom = Game.rooms[room];
        var roomSpawns = thisRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}});
        if(roomSpawns != undefined && roomSpawns.length > 0)
        {
            if(usageReport)
            {
                console.log("AUTO CONSTRUCTOR :" + room + " Q " + Game.time);
            }


            this.getQuotaForRoom(thisRoom, roomSpawns[0]);
            this.buildRoadToAllSources(thisRoom, roomSpawns[0]);

        }


    },
    getQuotaForRoom:function(thisRoom, spawn){
        if(thisRoom.memory.techLevel != undefined){
            //console.log(rc);

            var qContainers = 1;
            var qExtensions = 5;
            var qTowers = 0;

            if(thisRoom.memory.techLevel == 1)
            {
                //console.log("set rc 1");
                qContainers = 5;
                qExtensions = 0;

            }
            if(thisRoom.memory.techLevel == 2)
            {
                //console.log("set rc 2");
                qContainers = 10;
                qExtensions = 5;
            }
            if(thisRoom.memory.techLevel == 3)
            {
                //console.log("set rc 3");
                qContainers = 15;
                qExtensions = 10;
                qTowers = 1;
            }
            if(thisRoom.memory.techLevel == 4)
            {
                //console.log("set rc 4");
                qContainers = 20;
                qExtensions = 15;
                qTowers = 2;
            }
            if(thisRoom.memory.techLevel == 5)
            {
                //console.log("set rc 4");
                qContainers = 25;
                qExtensions = 20;
                qTowers = 3;
            }
            if(thisRoom.memory.techLevel == 6)
            {
                //console.log("set rc 4");
                qContainers = 30;
                qExtensions = 25;
                qTowers = 4;
            }
            if(thisRoom.memory.techLevel == 7)
            {
                //console.log("set rc 4");
                qContainers = 35;
                qExtensions = 30;
                qTowers = 5;
            }
            if(thisRoom.memory.techLevel == 8)
            {
                //console.log("set rc 4");
                qContainers = 40;
                qExtensions = 35;
                qTowers =6;
            }

            var containersPanelC = "QContainers:"+qContainers;
            var extensionsPanelC = "QExtensions:"+qExtensions;
            var towersPanelC = "QTowers:"+qTowers;
            utilPanel.createpanel(thisRoom, "AUTOC",thisRoom.memory.utilACX,thisRoom.memory.utilACY,4,4,[containersPanelC, extensionsPanelC, towersPanelC], false);

            //console.log(qContainers);
            //console.log(qExtensions);

            var shouldMemCheck = (thisRoom.memory.lastCreepCheck + 25) < Game.time;
            if(!thisRoom.memory.isSetup || shouldMemCheck)
            {
                if(shouldMemCheck)
                {
                   console.log("AC: Should mem check");
                }
                console.log("AC: Calling U.M > Update ROOM MEMORY");
                utilMemory.updateRoomMemory(thisRoom);
            }
            else
            {
                if(thisRoom.memory.containers == undefined || thisRoom.memory.extensions == undefined)
                {
                    console.log("False Memory - Rebuild Room Log");
                    thisRoom.memory.isSetup = false;
                }
                else
                {
                    var containers = thisRoom.memory.containers;
                    var extensions = thisRoom.memory.extensions;
                    var towers = thisRoom.memory.towers;

                    if(extensions != undefined && qExtensions > extensions.length && thisRoom.memory.techLevel >= 2)
                    {
                        var x = spawn.pos.x - 2;
                        var y = spawn.pos.y - 2;
                        var extensionType = "extension";
                        if(extensions.length != qExtensions && extensions.length == 0)
                        {
                            if(thisRoom.memory.e1 == undefined || !thisRoom.memory.e1)
                            {
                                console.log("AC - CREATE EXTENSION 1");
                                thisRoom.memory.e1 = true;
                                var pos = new RoomPosition(x, y, thisRoom.name);
                                this.createSite(thisRoom, pos, extensionType);

                            }

                        }
                        if(extensions.length != qExtensions && extensions.length > 0 && extensions.length == 1)
                        {
                            if(thisRoom.memory.e2 == undefined || !thisRoom.memory.e2)
                            {
                              console.log("AC - CREATE EXTENSION 2");
                              thisRoom.memory.e2 = true;
                              var pos = new RoomPosition(x+1, y+1, thisRoom.name);
                              this.createSite(thisRoom, pos, extensionType);

                            }

                        }
                        if(extensions.length != qExtensions && extensions.length > 1)
                        {
                            if(thisRoom.memory.e3 == undefined || !thisRoom.memory.e3)
                            {
                                console.log("AC - CREATE EXTENSION 3");
                                thisRoom.memory.e3 = true;
                                var pos = new RoomPosition(x+2, y+2, thisRoom.name);
                                this.createSite(thisRoom, pos, extensionType);

                            }

                        }
                        if(extensions.length != qExtensions && extensions.length > 2)
                        {
                            if(thisRoom.memory.e4 == undefined || !thisRoom.memory.e4)
                            {
                                console.log("AC - CREATE EXTENSION 4");
                                thisRoom.memory.e4 = true;
                                var pos = new RoomPosition(x+3, y+3, thisRoom.name);
                                this.createSite(thisRoom, pos, extensionType);

                            }

                        }
                        if(extensions.length != qExtensions && extensions.length > 3)
                        {
                            if(thisRoom.memory.e5 == undefined || !thisRoom.memory.e5)
                            {
                                console.log("AC - CREATE EXTENSION 5");
                                var pos = new RoomPosition(x+4, y+4, thisRoom.name);
                                this.createSite(thisRoom, pos, extensionType);
                                thisRoom.memory.e5 = true;
                            }

                        }
                        if(extensions.length != qExtensions && extensions.length > 4 && thisRoom.memory.techLevel > 2)
                        {
                            if(thisRoom.memory.e6 == undefined || !thisRoom.memory.e6)
                            {
                                console.log("AC - CREATE EXTENSION 6");
                                var pos = new RoomPosition(x+5, y+5, thisRoom.name);
                                this.createSite(thisRoom, pos, extensionType);
                                thisRoom.memory.e6 = true;
                            }
                        }
                    }

                    if(containers != undefined && qContainers > containers.length)
                    {

                        var containerType = "container";
                        var x = spawn.pos.x;
                        var y = spawn.pos.y;

                        if(containers.length < qContainers && containers.length == 0)
                        {


                            if(thisRoom.memory.c1 == undefined || !thisRoom.memory.c1)
                            {
                                console.log("AC - CREATE CONTAINER 1");
                                var pos = new RoomPosition(x-5, y+1, thisRoom.name);
                                this.createSite(thisRoom, pos, containerType);
                                thisRoom.memory.c1 = true;
                            }

                        }
                        if(containers.length != qContainers && containers.length > 0)
                        {
                            if(thisRoom.memory.c2 == undefined || !thisRoom.memory.c2)
                            {
                                console.log("AC - CREATE CONTAINER 2");
                                var pos = new RoomPosition(x-6, y+1, thisRoom.name);
                                this.createSite(thisRoom, pos, containerType);
                                thisRoom.memory.c2 = true;
                            }
                        }
                        if(containers.length != qContainers && containers.length == 2)
                        {
                            if(thisRoom.memory.c3 == undefined || !thisRoom.memory.c3)
                            {
                                console.log("AC - CREATE CONTAINER 3");
                                var pos = new RoomPosition(x-7, y+1, thisRoom.name);
                                this.createSite(thisRoom, pos, containerType);
                                thisRoom.memory.c3 = true;
                            }
                        }
                        if(containers.length != qContainers && containers.length == 3)
                        {
                            if(thisRoom.memory.c4 == undefined || !thisRoom.memory.c4)
                            {
                                console.log("AC - CREATE CONTAINER 4");
                                var pos = new RoomPosition(x-8, y+1, thisRoom.name);
                                this.createSite(thisRoom, pos, containerType);
                                thisRoom.memory.c4 = true;
                            }
                        }
                        if(containers.length != qContainers && containers.length == 5 && rc.level > 2)
                        {
                            if(thisRoom.memory.c5 == undefined || !thisRoom.memory.c5)
                            {
                                console.log("AC - CREATE CONTAINER 5");
                                var pos = new RoomPosition(x-9, y+1, thisRoom.name);
                                this.createSite(thisRoom, pos, containerType);
                                thisRoom.memory.c5 = true;
                            }
                        }
                        if(containers.length != qContainers && containers.length == 6)
                        {
                            if(thisRoom.memory.c6 == undefined || !thisRoom.memory.c6)
                            {
                                console.log("AC - CREATE CONTAINER 6");
                                var pos = new RoomPosition(x-5, y+2, thisRoom.name);
                                this.createSite(thisRoom, pos, containerType);
                                thisRoom.memory.c5 = true;
                            }
                        }


                    }

                    if(towers != undefined && qTowers > towers.length)
                    {
                        if(towers.length < qTowers && towers.length == 0)
                        {
                            if(thisRoom.memory.t1 == undefined || !thisRoom.memory.t1)
                            {
                                console.log("AC - CREATE Tower 1");
                                thisRoom.createConstructionSite(thisRoom.memory.rdTower1x, thisRoom.memory.rdTower1y, STRUCTURE_TOWER);
                                thisRoom.memory.t1 = true;
                            }
                        }
                    }
                }
            }
        }
    },
    /**
     * @param {Number} x
     * @param {Number} y
     */
    requestWall:function(thisRoom, newPosition){
        var flagName = newPosition.x+"x"+newPosition.y+"y"+thisRoom.name;
        //console.log(flagName);
        var found = thisRoom.lookForAt(LOOK_CONSTRUCTION_SITES, newPosition.x, newPosition.y)
        if(found.length && found[0].structureType == STRUCTURE_WALL)
        {
            if(Game.flags[flagName] != undefined)
            {
               Game.flags[flagName].remove(flagName);
            }
        }
        else{
            if(Game.flags[flagName] == undefined)
            {
                thisRoom.createFlag(newPosition.x, newPosition.y, flagName);
            }
            else{
                var zone = Game.flags[flagName];
                if(zone.pos.createConstructionSite(STRUCTURE_WALL) == ERR_INVALID_TARGET)
                {
                    console.log("ZC has an invalid target at x:" +zone.pos.x+ " y:"+zone.pos.y)
                };
                if(zone.pos.createConstructionSite(STRUCTURE_WALL) == ERR_INVALID_ARGS)
                {
                    console.log("ZC has an invalid args at x:" +zone.pos.x+ " y:"+zone.pos.y)
                };
                if(zone.pos.createConstructionSite(STRUCTURE_WALL) == OK)
                {
                    console.log("ZC has an scheduled wall construction at x:" +zone.pos.x+ " y:"+zone.pos.y)
                };
                if(zone.pos.createConstructionSite(STRUCTURE_WALL) == ERR_FULL)
                {
                    console.log("ZC cant scheduled wall construction at x:" +zone.pos.x+ " y:"+zone.pos.y + " construction Queue is full");
                };
                 if(zone.pos.createConstructionSite(STRUCTURE_WALL) == ERR_RCL_NOT_ENOUGH)
                {
                    console.log("ZC cant scheduled wall construction at x:" +zone.pos.x+ " y:"+zone.pos.y + " room level is too low");
                };
            }
        }






    },
    buildRoads:function(thisRoom, from, to)
    {
        var room = Game.rooms[thisRoom.name];
        var path = room.findPath(from, to, { ignoreCreeps: true });
    		for(var i in path)
    		{
    			var result = room.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
    		}
    },
    buildRoadToAllSources: function(thisRoom, spawn)
  	{
  	    if(thisRoom.memory.isSetup)
  	    {
  	        var sources = thisRoom.find(FIND_SOURCES);
        		for(var i in sources)
        		{
        			this.buildRoads(thisRoom, spawn.pos, sources[i].pos);
        		}
  	    }

  	},
    checklocation:function(position)
    {

    },

    /**
     * @param {Number} xcord
     * @param {Number} ycord
     */
    createSite:function(thisRoom, pos, typeOfBuilding)
    {
        if(typeOfBuilding != undefined)
        {
            console.log('AC: create site');
            if(typeOfBuilding == "container")
            {
                thisRoom.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER);
            }
            if(typeOfBuilding == "extension")
            {
                thisRoom.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION);
            }
        }


    }
};

module.exports = utilAutoConstructor;

var utilMain = require('util.Main')
var utilMemory = require('util.Memory');

module.exports.loop = function () {
    
    utilMain.jobs(false);
    utilMain.main(false);
    utilMemory.clean();
}
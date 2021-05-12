var utilPanel = {
    run:function(){
        
    },
    createpanel:function(thisRoom, title, x, y, pHeight, pWidth, panelData, drawBack)
    {
        if(drawBack)
        {
            var pRect = thisRoom.visual.rect(x, y, pWidth, pHeight, {fill: '#000', opacity: 0.5, stroke:'#000'});
        }
        var titleY = y;
        var titleX = x+pWidth/2;
        if(title != "")
        {
            thisRoom.visual.text(title, titleX, titleY, {color: 'orange', font: .9}); 
        }
        
        if(panelData != undefined && panelData.length > 1)
        {
            var xInt = titleX;
            var yInt = titleY+1;
            for(var i in panelData)
            {
                var title = panelData[i];
                thisRoom.visual.text(title, xInt, yInt, {color: 'white', font: 0.6}); 
                
                yInt = yInt + 0.8;
            }
        }
        if(panelData != undefined && panelData.length == 1)
        {
             thisRoom.visual.text(panelData[0], titleX, titleY+0.8, {color: 'white', font: 0.7}); 
        }
        
    }
};

module.exports = utilPanel;

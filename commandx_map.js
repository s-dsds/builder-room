
COMMAND_REGISTRY.add("fx", ["!fx effect1 effect2: adds fx to the current map, applying a random effect or the effect provided, 6 effects can be chained", fxDoc], (player, ...fx) => {
    let fxs = [];
    if (typeof fx=='object') {
        let big=false;
        fxs = fx.map(
            function(e) {	
                let trimmed=e.split("#").shift().trim().toLowerCase();
                if (effectList.indexOf(trimmed) >= 0 && (trimmed!="bigger" || big==false)) { // filtering bigger since it actually breaks when chained
                    if (trimmed == "bigger") {
                        big=true;
                    }
                    return e.toLowerCase();
              }
            }
        ).filter(x => x).slice(0, 6);
    }
    if (fxs.length==0) {
        fxs.push(Math.floor(Math.random() * effectList.length));
    }  
    UNDO_HISTORY.pushStep()
    loadEffects(fxs);
    return false;
},  COMMAND.ADMIN_ONLY);

function loadEffects(fxs, data) {
    console.log("loading effects", JSON.stringify(fxs));
    announce("fx: "+fxs.join(" "), null, COLORS.WARNING, "bold")
    (async () => {
        if (!data) {
            data = getCurrentLevelCopy();
        }        
        if (null==data) {
            return
        }        
        try {
            for (var idx in fxs) {
                let all = fxs[idx].split("#")
                let fx = all.shift()
                console.log(fx);
                data = effects[fx](data, ...all);
            }
            loadLev(data);            
        } catch(e) {
            console.log("error while applying effects", e)
        }
    })();
}
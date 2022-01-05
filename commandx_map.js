
COMMAND_REGISTRY.add("fx", [()=>"!fx "+JSON.stringify(effectList)+": adds fx to the current map, applying a random effect or the effect provided"], (player, ...fx) => {
    let fxs = [];
    if (typeof fx=='object') {
        let big=false;
        fxs = fx.map(
            function(e) {	
                let trimmed=e.split("#").shift().trim();
                if (effectList.indexOf(trimmed) >= 0 && (trimmed!="bigger" || big==false)) { // filtering bigger since it actually breaks when chained
                    if (trimmed == "bigger") {
                        big=true;
                    }
                    return e;
              }
            }
        ).filter(x => x).slice(0, 5);
    }
    if (fxs.length==0) {
        fxs.push(Math.floor(Math.random() * effectList.length));
    }  
    loadEffects(fxs);
    return false;
}, true);

function loadEffects(fxs, data) {
    console.log("loading effects", JSON.stringify(fxs));
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
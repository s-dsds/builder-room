COMMAND_REGISTRY.add(["copy","keep","k"], ["!copy x y zx zy: copies in memory everything or between points x.y & zx.zy"], (player, x, y, zx, zy) => {
    if (typeof __commitLevel != "function" || typeof window.REF_ROOM_STATE == "undefined") {
        announce("copy doesn't work at the moment, please ask an admin", player, COLORS.ERROR);
        return false;
    }
    if (!isBuild()) {
        announce("you can only copy while in build mode", player, COLORS.WARNING);
        return false;
    }
    
    let lev = getCurrentLevelCopy()
    if (lev == null) {
        announce("copy failed: getting current level failed", player, COLORS.ERROR);
    }
    
    let pa = auth.get(player.id)
    if (pa!=null) {
        if (typeof copies[pa]=='undefined') {
            copies[pa] = []
        }
        if (copies[pa].length>=maxCopies) {         
            copies[pa] = copies[pa].slice(1, maxCopies-1)
        }
        if (typeof x != 'undefined') {
            lev = effects.crop(lev, x, y, zx, zy)
        }
        copies[pa].push(new Copy(lev))
        announce(`copy added as copy number ${copies[pa].length-1}`, player, COLORS.INFO);
    }

    return false;
}, false);

COMMAND_REGISTRY.add(["copylist","cl"], ["!copylist: lists all the copies you have in memory"], (player, x, y) => {
    let pa = auth.get(player.id)
    if (pa!=null) {
        if (typeof copies[pa]=='undefined' || copies[pa].length==0) {
            announce("you don't have any copies at the moment", player, COLORS.ERROR);
            return false;
        }
        for (let idx in copies[pa]) {
            announce(`${idx} : x ${copies[pa][idx].lev.width} y ${copies[pa][idx].lev.height} recorded on ${copies[pa][idx].time}`, player, COLORS.INFO, "small");
        }        
    }

    return false;
}, false);

COMMAND_REGISTRY.add(["paste","p"], ["!paste z [left|right|top|bottom|x y]: paste memory buffer index z at point x.y or left/right/top/bottom of the map"], (player, z, x, y) => {
    if (typeof __commitLevel != "function" || typeof window.REF_ROOM_STATE == "undefined") {
        announce("paste doesn't work at the moment, please ask an admin", player, COLORS.ERROR);
        return false;
    }
    if (!isBuild()) {
        announce("you can only paste while in build mode", player, COLORS.WARNING);
        return false;
    }
    const allowedPos = ['left','right','top','bottom']
    
    let pa = auth.get(player.id)
    if (pa!=null) {
        if (typeof copies[pa]=='undefined' || copies[pa].length==0) {
            announce("you don't have any copies at the moment", player, COLORS.ERROR);
            return false;
        }
        let idx = 0;
        if (typeof z == 'undefined' || isNaN(z) 
             || (typeof x != 'undefined' && !isNaN(x) && (typeof y == 'undefined' || isNaN(y)))
             ) { 
                
            idx = copies[pa].length-1

        } else {
            idx = parseInt(z)
            if (typeof copies[pa][idx] == 'undefined') {
                idx = copies[pa].length-1
            }
        }

        let position = 'right'

        if (allowedPos.includes(z)) {
            position = z
        } else if (allowedPos.includes(x)) {
            position = x
        } else if (!isNaN(x) && !isNaN(y)) {
            position = {"x":parseInt(x),"y":parseInt(y)}
        } else if (!isNaN(z) && !isNaN(x)) {
            position = {"x":parseInt(z),"y":parseInt(x)}
        }
        let lev = getCurrentLevelCopy()
        if (lev == null) {
            announce("copy failed: getting current level failed", player, COLORS.ERROR);
            return false
        }
        let copyLev = copies[pa][idx].lev

        if (typeof position=='string' && allowedPos.includes(position)) {
            switch (position) {
                case 'left':
                    position = {y:0,x:0-copyLev.width}
                    break
                case 'right':
                    position = {y:0,x:lev.width}
                    break
                case 'top':
                    position = {x:0,y:0-copyLev.height}
                    break
                case 'bottom':
                    position = {x:0,y:lev.height}
                    break
            }
        }

        let data = mergeMaps(lev, copyLev, position)
        loadLev(data);
    }

    return false;
}, false);

COMMAND_REGISTRY.add(["pastemat","pm"], ["!pastemat z [rock|undef|dirt|bg] x y: paste 1 material only (default rock) buffer index z at point x.y (default 0 0)"], (player, z, mat, x, y) => {
    if (typeof __commitLevel != "function" || typeof window.REF_ROOM_STATE == "undefined") {
        announce("paste doesn't work at the moment, please ask an admin", player, COLORS.ERROR);
        return false;
    }
    if (!isBuild()) {
        announce("you can only paste while in build mode", player, COLORS.WARNING);
        return false;
    }
    const allowedMaterial = ['rock', 'undef', 'dirt', 'bg']    

    let pa = auth.get(player.id)
    if (pa!=null) {
        if (typeof copies[pa]=='undefined' || copies[pa].length==0) {
            announce("you don't have any copies at the moment", player, COLORS.ERROR);
            return false;
        }
        let idx = 0;
        if (typeof z == 'undefined' || (isNaN(z) && (typeof mat =='undefined' || isNaN(mat)))) {                 
            idx = copies[pa].length-1

        } else {
            idx = parseInt(z)
            if (typeof copies[pa][idx] == 'undefined') {
                idx = copies[pa].length-1
            }
        }

        let material = 'rock'
        if (typeof z != 'undefined' && allowedMaterial.includes(z)) {
            material = z
        } else if (typeof mat != 'undefined' && allowedMaterial.includes(mat)) {
            material = mat
        }
        
        let position = {"x":0,"y":0}
        if (!isNaN(z) && !isNaN(mat)) {
            position = {"x":parseInt(z),"y":parseInt(mat)}
        } else if  (!isNaN(mat) && !isNaN(x)) {
            position = {"x":parseInt(mat),"y":parseInt(x)}
        } else if (!isNaN(x) && !isNaN(y)) {
            position = {"x":parseInt(x),"y":parseInt(y)}
        }
        let lev = getCurrentLevelCopy()
        if (lev == null) {
            announce("copy failed: getting current level failed", player, COLORS.ERROR);
            return false
        }
        let copyLev = copies[pa][idx].lev
        
        let data = mergeMaps(lev, copyLev, position, material);
        loadLev(data);
    }

    return false;
}, false);

function mergeMaps(map, mapIn, position, mat = false) {
    let maxOut = (wh, nwh, pos) => {
        let ret = wh
        if (pos>=wh) {
            ret = wh + pos-1-wh + nwh
        } else if (pos<0) {
            ret = wh + Math.abs(pos)
            if (nwh>ret) {
                ret = nwh
            }
        }
        if (ret>maxMaxWidthHeight) {
            return maxMaxWidthHeight
        }
        return ret
    }
    // if (position.x>=map.width) {
    //     newWidth = map.width + position.x-1-map.width + mapIn.width
    // } else if (position.x<0) {
    //     newWidth = map.width + 0-position.x
    //     if (mapIn.width>newWidth) {
    //         newWidth = mapIn.width
    //     }
    // }
    let newWidth = maxOut(map.width, mapIn.width, position.x)
    
    let newHeight = maxOut(map.height, mapIn.height, position.y)

    let startX = position.x<0?position.x:0    
    let startY = position.y<0?position.y:0
    console.log(newWidth, newHeight, startX, startY)
    let ret = []
    for (let j = startY; j < (newHeight+startY); j++ ) {
        for (let i = startX; i<(newWidth+startX); i++) {
            if (j>=position.y&&i>=position.x&& j<(position.y+mapIn.height) && i<(position.x+mapIn.width)) {
                let ny= Math.abs(Math.abs(j)-Math.abs(position.y)) 
                let nx= Math.abs(Math.abs(i)-Math.abs(position.x))
                let d = mapIn.data[(ny*mapIn.width)+nx]
                if (!mat || isColorIdxMatString(d, mat)) {
                    ret.push(d);  
                } else {
                    if (j>=0&&i>=0&&j<map.height&&i<map.width) {
                        ret.push(map.data[(j*map.width)+i]);   
                    } else {
                        ret.push(randomBG())
                    }       
                }
            } else if (j>=0&&i>=0&&j<map.height&&i<map.width) {
                ret.push(map.data[(j*map.width)+i]);   
            } else {
                ret.push(randomBG())
            }               
        }
    } 
    
    return { 
        name: map.name,
        width:newWidth,
        height:newHeight,
        data:ret
    }
}


// let lastUpload = null
// COMMAND_REGISTRY.add("uploadpatterns", ["!uploadpatterns: uploads all your current patterns to gitlab"], (player)=> {
//     // if (typeof __commitLevel != "function" || typeof window.REF_ROOM_STATE == "undefined") {
//     //     announce("saving patterns doesn't work at the moment, please ask an admin", player, COLORS.ERROR);
//     // }
//     // if (!isBuild()) {
//     //     announce("you can only save a pattern while in build mode", player, COLORS.WARNING);
//     //     return false;
//     // }
//     // const now =  new Date();

//     // const minSaveFrequency = 3 //in minutes
//     // const allow = (now-lastKeep)/1000/60>minSaveFrequency

//     // if (lastKeep==null || allow) {        
//     //     lastKeep = now
//     //     let patterns = getPatterns(player)
//     //     if (!patterns.length) {
//     //         announce("you have no patterns kept in memory", player, COLORS.ERROR);
//     //     }
//     //     lev.name = encodeURIComponent(name)
//     //     try {
//     //         let prom = __commitLevel(player.name, name, Array.from(lev.data), lev.width, lev.height)
//     //         prom.then((savedName) => {
//     //             announce(`map saved as ${savedName} you can find it at https://gitlab.com/sylvodsds/webliero-builder-maps/-/tree/master/maps/`, null, COLORS.INFO, "small");
//     //         })
            
//     //     } catch (e) {
//     //         console.log("error trying saving current map", e);
//     //         announce("saving failed: commit failed", player, COLORS.ERROR);
//     //     }
//     //     return false
//     // } 
//     // if (!allow) {
//     //     announce("you just can't save maps all the time, please wait a bit", player, COLORS.WARNING);        
//     // }
//     return false;
// }, false);


//clear x y
//snap
//save
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
        return false;
    }
    
    let pa = auth.get(player.id)
    if (pa!=null) {
        if (typeof copies[pa]=='undefined') {
            copies[pa] = []
        }

        if (typeof x != 'undefined') {            
            lev = effects.crop(lev, x, y, zx, zy)
        }

        if (copies[pa].length>=maxCopies) {         
            copies[pa] = copies[pa].slice(1, maxCopies)
        }
        copies[pa].push(new Copy(lev))
        announce(`copy added as copy number ${copies[pa].length-1}`, player, COLORS.INFO);
    }

    return false;
},  COMMAND.FOR_ALL);

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
},  COMMAND.FOR_ALL);

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
},  COMMAND.FOR_ALL);

COMMAND_REGISTRY.add(["pastenew","pn"], ["!pastenew z]: paste memory buffer index z in full"], (player, z) => {
    if (typeof __commitLevel != "function" || typeof window.REF_ROOM_STATE == "undefined") {
        announce("paste doesn't work at the moment, please ask an admin", player, COLORS.ERROR);
        return false;
    }
    if (!isBuild() && !isPalette()) {
        announce("you can only paste while in build mode", player, COLORS.WARNING);
        return false;
    }

    let pa = auth.get(player.id)
    if (pa!=null) {
        if (typeof copies[pa]=='undefined' || copies[pa].length==0) {
            announce("you don't have any copies at the moment", player, COLORS.ERROR);
            return false;
        }
        if (isPalette()) {
            setBuildMod()
        }
        let idx = 0;
        if (typeof z == 'undefined' || isNaN(z)) {                 
            idx = copies[pa].length-1
        } else {
            idx = parseInt(z)
            if (typeof copies[pa][idx] == 'undefined') {
                idx = copies[pa].length-1
            }
        }

        loadLev(copies[pa][idx].lev);
    }

    return false;
},  COMMAND.FOR_ALL);

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
        if (typeof z == 'undefined' || (!isNaN(z) && !isNaN(mat) && isNaN(x)) || (!isNaN(z) && isNaN(mat) && isNaN(x))) {                 
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
        if (!isNaN(z) && !isNaN(mat) && isNaN(x)) {
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
        console.log(idx, JSON.stringify(position), material)
        let data = mergeMaps(lev, copyLev, position, material);
        loadLev(data);
    }

    return false;
},  COMMAND.FOR_ALL);

COMMAND_REGISTRY.add(["paste2weapon","pw"], ["!paste2weapon z n t: paste memory buffer index z to a new weapon of type t with name n","available weapontypes: bigfiller (bf), brick (b), dirtymissile (dm), girder(gr), paintbrush (pb), pencil (p)"], (player, z, n, t) => {
    if (typeof __commitLevel != "function" || typeof window.REF_ROOM_STATE == "undefined") {
        announce("paste doesn't work at the moment, please ask an admin", player, COLORS.ERROR);
        return false;
    }
    if (!isBuild() && !isPalette()) {
        announce("you can only paste while in build mode", player, COLORS.WARNING);
        return false;
    }

    let pa = auth.get(player.id)
    if (pa!=null) {
        if (typeof copies[pa]=='undefined' || copies[pa].length==0) {
            announce("you don't have any copies at the moment", player, COLORS.ERROR);
            return false;
        }
        let idx = 0;
        (async () => {
            let name = await window.__getRandomName()
            name = name.split("_").reduce((p,t) => ((t.length==1)?p:((p.indexOf('_')>0?p:p.substring(0,3))+'_'+t.substring(0,3)))).replaceAll('_','').toUpperCase()
            let type = 'brick';            

            if (typeof z == 'undefined' || isNaN(z)) {                 
                idx = copies[pa].length-1
                if (typeof z != 'undefined' && weaponTypes.includes(z.toLowerCase())) {
                    type = z.toLowerCase()
                }
            } else {
                idx = parseInt(z)
                if (typeof copies[pa][idx] == 'undefined') {
                    idx = copies[pa].length-1
                }
            }

            if (typeof n !='undefined' && !weaponTypes.includes(n.toLowerCase())) {
                name = n;
            } else if (typeof n !='undefined' && weaponTypes.includes(n.toLowerCase())) {
                type = n.toLowerCase()
            }

            if (typeof t !='undefined' && !weaponTypes.includes(t.toLowerCase())) {
                announce(`weapon type ${t} is invalid`, player, COLORS.WARNING);
                return false
            } else if (typeof t !='undefined' && weaponTypes.includes(t.toLowerCase())) {
                type = t.toLowerCase()
            }

            let copy = copies[pa][idx].lev;
            copy =  effects.autocrop(copy)
            const maxW = 80
            const maxH = 80
            while (copy.width>maxW || copy.height>maxH) {
                copy = effects.reduce(copy)
            }        

            copy = effects.autocrop(copy)
            copy = effects.bg2dirt(copy , 0)
        
      
            await builderfactory.add(type, name, copy);
            announce(`weapon ${name} of type ${type} added`, null, COLORS.ANNOUNCE_BRIGHT);
            setBuildMod()
        })()
        
    }

    return false;
},  COMMAND.ADMIN_ONLY);

COMMAND_REGISTRY.add(["paintbrush","pb"], ["!paintbrush c w h]: creates a paint brush of color c, width w and height h"], (player, c, w, h) => {
    if (!isBuild() && !isPalette()) {
        announce("you can only paste while in build mode", player, COLORS.WARNING);
        return false;
    }

    let pa = auth.get(player.id)
    if (typeof c == 'undefined' || isNaN(c) || c<0 || c>256) {
        announce("you need to choose a color between 0 and 256 for the paint brush", player, COLORS.WARNING);
        return false;
    }
    if (pa!=null) {
    
        (async () => {
            c = parseInt(c)

            if (typeof w == 'undefined' || isNaN(w)) {                 
                w = '16'
            }
            if (typeof h == 'undefined' || isNaN(h)) {                 
                h = w
            }
             
            await builderfactory.add('paintbrush', null, {color:parseInt(c), width: parseInt(w), height: parseInt(h)});
            announce(`new paint brush added with color ${c}, width ${w}, and height ${h}`, null, COLORS.ANNOUNCE_BRIGHT);
            setBuildMod()
        })()
        
    }

    return false;
},  COMMAND.ADMIN_ONLY);

COMMAND_REGISTRY.add(["pencil","pe"], ["!pencil c d]: creates a pencil of color c, diameter d, you can chain multiple color separated by # 1#2#3"], (player, c, d) => {
    if (!isBuild() && !isPalette()) {
        announce("you can only create pencils while in build mode", player, COLORS.WARNING);
        return false;
    }

    let pa = auth.get(player.id)
    if (typeof c == 'undefined' || !/^((?<!\d)(?:1\d{2}|2[0-4]\d|[1-9]?\d|25[0-5])(?!\d)#)*(?<!\d)(?:1\d{2}|2[0-4]\d|[1-9]?\d|25[0-5])(?!\d)$/g.test(c)) {
        announce("you need to choose a color between 0 and 256 for the pencil", player, COLORS.WARNING);
        return false;
    }
    if (pa!=null) {
    
        (async () => {
           // c = parseInt(c)

            if (typeof d == 'undefined' || isNaN(d)) {                 
                d = '16'
            }
             
            await builderfactory.add('pencil', null, {color:c, width: parseInt(d), height: parseInt(d)});
            announce(`new pencil added with color ${c}, diameter ${d}`, null, COLORS.ANNOUNCE_BRIGHT);
            setBuildMod()
        })()
        
    }

    return false;
},  COMMAND.ADMIN_ONLY);

COMMAND_REGISTRY.add(["girder","gr"], ["!girder c d]: creates a girder of color c, diameter d, you can chain multiple color separated by # 1#2#3"], (player, c, d) => {
    if (!isBuild() && !isPalette()) {
        announce("you can only create girders while in build mode", player, COLORS.WARNING);
        return false;
    }

    let pa = auth.get(player.id)
    if (typeof c == 'undefined' || !BuilderGirderRock.areAllowed(c)) {
        announce("you need to choose at leaste one dirt or rock color for the girder", player, COLORS.WARNING);
        return false;
    }
    if (pa!=null) {
    
        (async () => {
           // c = parseInt(c)

            if (typeof d == 'undefined' || isNaN(d)) {                 
                d = '16'
            }
             
            const ok = await builderfactory.add('girder', null, {colors:c, width: parseInt(d), height: parseInt(d)});
            if (ok) {
                announce(`new girder added with color ${c}, diameter ${d}`, null, COLORS.ANNOUNCE_BRIGHT);
                setBuildMod()
            } else {
                announce(`an error happened while adding girder with color ${c}, diameter ${d}`, player, COLORS.ERROR);
            }
 
        })()
        
    }

    return false;
},  COMMAND.ADMIN_ONLY);

COMMAND_REGISTRY.add(["dirtymissile","dm"], ["!dirtymissile c d]: creates a dirty missile of color c, diameter d, you can chain multiple color separated by # 1#2#3"], (player, c, d) => {
    if (!isBuild() && !isPalette()) {
        announce("you can only create dirtymissiles while in build mode", player, COLORS.WARNING);
        return false;
    }

    let pa = auth.get(player.id)
    // if (typeof c == 'undefined' || isNaN(c) || c<0 || c>256) {
    //     announce("you need to choose a color between 0 and 256 for the paint brush", player, COLORS.WARNING);
    //     return false;
    // }
    if (pa!=null) {
    
        (async () => {
            if (typeof c == 'undefined') {
                announce(`you need to pass at least one valid dirt color`, player, COLORS.ERROR);
                return
            }
            let colors = c.split('#')
            let rc = []
            for (let cs of colors) {
                if (isNaN(cs) || ![MATERIAL.DIRT, MATERIAL.DIRT_GREEN, MATERIAL.BG_DIRT, MATERIAL.DIRT_2].includes(defaultMaterials[cs])) {
                    announce(`${cs} isn't a dirt color`, player, COLORS.WARNING);
                    continue;
                }
                rc.push(parseInt(cs))
            }

            if (!rc.length) {
                announce(`you need to pass at least one valid dirt color`, player, COLORS.ERROR);
                return ;
            }

            if (typeof d == 'undefined' || isNaN(d)) {                 
                d = 16
            }

             
            await builderfactory.add('dm', null, {colors:rc, width: parseInt(d), height: parseInt(d)});
            announce(`new dirtymissile added with color ${JSON.stringify(rc)}, diameter ${d}`, null, COLORS.ANNOUNCE_BRIGHT);
            setBuildMod()
        })()
        
    }

    return false;
},  COMMAND.ADMIN_ONLY);
COMMAND_REGISTRY.add(["bigfiller","bf"], ["!bigfiller c]: creates a big filler of color c, you can chain multiple color separated by # 1#2#3"], (player, c) => {
    if (!isBuild() && !isPalette()) {
        announce("you can only create bigfiller while in build mode", player, COLORS.WARNING);
        return false;
    }

    let pa = auth.get(player.id)
    // if (typeof c == 'undefined' || isNaN(c) || c<0 || c>256) {
    //     announce("you need to choose a color between 0 and 256 for the paint brush", player, COLORS.WARNING);
    //     return false;
    // }
    if (pa!=null) {
    
        (async () => {
            if (typeof c == 'undefined') {
                announce(`you need to pass at least one valid color btw 0 and 255`, player, COLORS.ERROR);
                return
            }
            let colors = c.split('#')
            let rc = []
            for (let cs of colors) {
                if (isNaN(cs) || cs<0 || cs>255/* || ![MATERIAL.DIRT, MATERIAL.DIRT_GREEN, MATERIAL.BG_DIRT, MATERIAL.DIRT_2].includes(defaultMaterials[cs])*/) {
                    announce(`${cs} isn't a color`, player, COLORS.WARNING);
                    continue;
                }
                rc.push(parseInt(cs))
            }

            if (!rc.length) {
                announce(`you need to pass at least one valid color btw 0 and 255`, player, COLORS.ERROR);
                return ;
            }

            if (typeof d == 'undefined' || isNaN(d)) {                 
                d = 16
            }

             
            await builderfactory.add('bf', null, {colors:rc, width: parseInt(d), height: parseInt(d)});
            announce(`new bigfiller added with color ${JSON.stringify(rc)}`, null, COLORS.ANNOUNCE_BRIGHT);
            setBuildMod()
        })()
        
    }

    return false;
}, COMMAND.ADMIN_ONLY);
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
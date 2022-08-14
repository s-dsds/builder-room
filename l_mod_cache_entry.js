
class ModCache_Entry {
    constructor(zip, mod) {
        this.zip=zip
        this.wlk=mod
        this.name=this.wlk.config.name
    }
    static fromZip(zip, soundpack) {
        let mod = new WLK_Mod(zip) 
        console.log("fromZip", typeof mod)
        if (typeof mod.config =='undefined') {
            mod.config = {name:"", version:"", author:""}
        }
        if (soundpack) {
            mod.config.soundpack=soundpack
            return ModCache_Entry.fromWlk(mod)
        }
        return new ModCache_Entry(zip, mod)
    }
    static fromJsonAndSprites(json, sprites, soundpack) {
        let mod = new WLK_Mod()
        mod.import_json5(json)
        mod.import_wlsprt(sprites)        
        if (typeof mod.config =='undefined') {
            mod.config = {name:"", version:"", author:""}
        }
        if(soundpack) {
             mod.config.soundpack =soundpack
        }        
        console.log("eh",typeof mod)
        return ModCache_Entry.fromWlk(mod)
    }
    static fromWlk(mod) {
        console.log("fromwlk",typeof mod)
        console.log(typeof mod.write_zip)
        if (typeof mod.config =='undefined') {
            mod.config = {name:"", version:"", author:""}
        }
        let zip = mod.write_zip({type:"arraybuffer",files:{json:1,wlsprt:1}})
        return new ModCache_Entry(zip, mod)
    }
}
async function fetchZip(url) {   
    console.log("fetchzip "+url)
    try {
        return (await fetch(url)).arrayBuffer();
    } catch (e) {
        console.log('error fetchzip',e)
    }    
}
async function fetchJson(url) {   
    console.log("fetchzip "+url)
    try {
        return (await fetch(url)).json();
    } catch (e) {
        console.log('error fetchJson',e)
    }    
}

async function fetchPng(url) {   
    console.log("fetchPng "+url)
    try {
        let buf = await (await fetch(url)).arrayBuffer();
        return window.__ReadPNG(buf)
    } catch (e) {
        console.log('error fetchPng',e)
    }    
}
var mods = new Map();
var currMod = "0";

function loadMod(mod) {
    console.log("loading mod "+mod.name);
    if (typeof mod.zip == "undefined") {
        console.log("make zip");
        mod.zip= makeModZip(mod.json, base_sprites);
    }
    window.WLROOM.loadMod(mod.zip);
}

function makeModZip(basemod, sprites) {
    console.log("building zip");
    var mdzip = new JSZip();
    if (typeof basemod.soundpack == "undefined") {        
        basemod = JSON.stringify(basemod);
    }
    mdzip.file('mod.json5', basemod);

    mdzip.file('sprites.wlsprt', sprites, {binary:true});
    return mdzip.generate({type:"arraybuffer"});
}

function addMod(id, json) {
    mods.set(id, {
            id: id,
            name: json.name,
            version: json.version,
            json: json.data,
            author: json.author
    });
}

function getCurrentMod() {
    return mods.get(currMod);
}
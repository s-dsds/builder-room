var mods = new Map();
var currMod = "0";

function loadMod(mod) {
    console.log("loading mod "+mod);
    if (typeof mod.data!=undefined) {
        mod = makeModZip(mod.data);
    }
    window.WLROOM.loadMod(mod);
}

function makeModZip(basemod, sprites) {
    console.log("building zip");
    var mdzip = new JSZip();
    mdzip.file('mod.json5',basemod);

    mdzip.file('sprites.wlsprt', sprites, {binary:true});
    return mdzip.generate({type:"arraybuffer"});
}

function stripLeds(modstring) {
    let mod = JSON5.parse(modstring);
    mod.colorAnim = [];
    return JSON.stringify(mod);
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
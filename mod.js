var modCache = new Map();
var modpool = [];
var modpoolrand = []
var currMod = 0;
var randomizeFightMod = false;

let modBaseUrl = 'https://webliero.gitlab.io/webliero-mods'

async function getModData(modUrl) {    
    let obj = modCache.get(modUrl)
    if (obj) {
      return obj;
    }
    try {
        obj = await (await fetch(modUrl)).arrayBuffer();        
    }catch(e) {
        return null;
    }

    
    modCache.set(modUrl, obj)
    return obj;
}

async function loadMod(modname) {
    const mod = await getModData(getModUrl(modname))
    window.WLROOM.loadMod(mod);
}

function getModUrl(name) {
    if (name.substring(0,8)=='https://') {
        return name;
    }
    return modBaseUrl + '/' +  name;
}


async function actualizeModList(clearcache = false) {
    if (clearcache) {
        modCache = new Map();
    }
    
    console.log("-------refreshing mod list")

    let data = await (await fetch(`${modBaseUrl}/zips.json`)).json();                          
    modpool = data.filter((v) => v!="kangaroo+dsds/buildingame.zip");
    
    modpoolrand = Array.from(modpool)
    shuffleArray(modpoolrand);

    console.log("- mod list refreshed -")
    if (typeof notifyAdmins == 'function') notifyAdmins("- mod list refreshed -", true)
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getCurrentMod() {
    return modpoolrand[currMod];
}

async function printCurrentMod(msg, player=null, color= COLORS.ANNOUNCE) {
    let filename = modpoolrand[currMod]
    let d = await getModData(getModUrl(filename))
    let wm  = new WLK_Mod(d)
    let str = "name '"
    str += (wm.name && wm.name.trim()!="" && wm.name!="MERGED MOD")?wm.name.trim():filename.substring(filename.lastIndexOf("/")+1).replace(/\.zip/gi,"")
    str +="'"
    if (wm.author && wm.author.trim()!="") {
        str += ` author '${wm.author}'`
    }
    if (wm.version && wm.version.trim()!="") {
        str += ` version '${wm.version}'`
    }
    announce(msg+str, player, color);
}

function setNextRandomMod() {
    currMod=currMod+1<modpoolrand.length?currMod+1:0;    
}

function setRandomFightMod(off=false) {
    randomizeFightMod=(!off);
}

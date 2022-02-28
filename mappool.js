let mapList = [];
let mapCache = new Map();

let baseBaseUrl = 'https://sylvodsds.gitlab.io/webliero-builder-maps'
let baseUrl = `${baseBaseUrl}/maps`


function getMapUrl(name) {
    if (name.substring(0,8)=='https://') {
        return name;
    }
    return baseUrl + '/' +  name;
}

async function getMapData(mapUrl) {    
    let obj = mapCache.get(mapUrl)
    if (obj) {
      return obj;
    }
    try {
        obj = await (await fetch(mapUrl)).arrayBuffer();        
    }catch(e) {
        return null;
    }

    
    mapCache.set(mapUrl, obj)
    return obj;
}

function loadMapByName(name) {
    console.log(`loading map ${name}`);
    (async () => {     
        try {   
            let data = await getMapData(getMapUrl(name));
            if (data == null) {
                notifyAdmins(`map ${name} could not be loaded`)
                window.WLROOM.restartGame();
                return;
            }

            if (name.split('.').pop().toLowerCase()=="png") {        
                window.WLROOM.loadPNGLevel(name, data);
                return;
            }

            window.WLROOM.loadLev(name, data);
            
          
        } catch (e) {
            console.log("map could not be changed", JSON.stringify(e))
            notifyAdmins(`error loading map ${name} ${JSON.stringify(e)}`)
        }
    })();
}


// expects {data:Uint8Array, height:int,width:int, name:int}
function loadLev(lev) {
    console.log("load lev "+lev.name);
    window.WLROOM.loadRawLevel(lev.name, lev.data, lev.width, lev.height);
}

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}


function cleanMap() {
    loadMapByName("bg/bg❤.png");
    announce("cleaning the playfield", null, COLORS.ANNOUNCE);
    votes.reset("clear");
}

async function actualizeMapList() {
        console.log("-------synching map list with gallery")

        let data = await (await fetch(`${baseBaseUrl}/index.json`)).json();                          
        let logs = await (await fetch(`${baseBaseUrl}/logs.json`)).json();

        var metas = new Map()
    
        for (const l of logs ) {
            if (l.subject && l.date) {
                const sub =  [...l.subject.matchAll(/^adds\s(.*\.png)\sby\s(.*)$/gi)][0]                                                       
                if (sub && sub.length==3) {
                    metas.set(sub[1], {author:sub[2], date:Date.parse(l.date)})
                }
                
            }                        
        } 
        let d = data.map((e)=>{
            const a = e.split("/")
            const folder = a.length>2?a[1]:''   
            const filename = a[a.length-1]
            const fullfilename = folder+(folder?'/':'')+filename
            const name = filename.replace(/\.png$/i,'').replace(/^([A-Z]+)_s_/i, "$1's ").replace('_', ' ')
            const author = metas.has(fullfilename)? metas.get(fullfilename).author : null
            const dd   = metas.has(fullfilename)? metas.get(fullfilename).date??0 : 0
            let tags = []
            if (folder) tags.push(folder)
            if (author) tags.push(author.replaceAll(' ','_'))
            let description = ''
            if (author) description+=`by ${author}`
            if (dd) description+=((description.length)?' ':'')+`on ${(new Date(dd).toUTCString())}`

            if (filename=="test.png") {
                console.log(JSON.stringify({
                    src: [folder,filename].join('/'),
                    sort: dd}))
            }

            return {
                    src: [folder,filename].join('/'),
                    sort: dd,
                 /*   customData: {filename:filename,},
                    title: name+(folder?` [${folder}]`:''),
                    sort: dd,
                    description: description,
                    tags: tags.join(' ') */
            }
        })
        d.sort((a,b) => (a.sort > b.sort) ? -1 : ((b.sort > a.sort) ? 1 : 0)).reverse()
        if (d.length==0) {
            console.log("-- error synching map list with gallery --")
            return
        }
        console.log("- map list synched with gallery -")
        mapList = d;
}

function addTmpMapIdxAndRefresh(savedName) {
    mapList.push({src:savedName})
    setTimeout(actualizeMapList, 60*1000*3)
}

COMMAND_REGISTRY.add("mapi", ["!mapi #index#: load map by pool index"], (player, idx) => {    
    if (typeof idx=="undefined" || idx=="" || isNaN(idx) || idx>=mapList.length) {
        announce("wrong index, choose any index from 0 to "+(mapList.length-1),player, COLORS.ERROR);
        return false;
    }

    loadMapByName(mapList[idx].src);
    return false;
}, true);

COMMAND_REGISTRY.add("clearcache", ["!clearcache: clears local map cache"], (player) => {
    mapCache = new Map();
    return false;
}, true);

COMMAND_REGISTRY.add("map", ["!map #mapname#: load lev map from gitlab webliero.gitlab.io"], (player, name) => {    
    if (!name) {
        announce("map name is empty ",player, COLORS.ERROR);
    }

    loadMapByName(name);
    return false;
}, true);

actualizeMapList();
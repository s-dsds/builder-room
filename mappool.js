let mypool = new Map();
let mypoolnames = new Set();

function addMap(name, data) {
    if (!mypoolnames.has(name)) {
        mypoolnames.add(name);
    }
    mypool.set(name, {
        name: name,
        data:_base64ToArrayBuffer(data)
    });
}


function loadMap(name) {
    console.log("name "+name);
    if (mypool.has(name)) {
        const map = mypool.get(name);
        window.WLROOM.loadPNGLevel(map.name, map.data);
        return;
    }
    notifyAdmins("trying to load invalid map name "+name);
    notifyAdmins("available maps: "+JSON.stringify(Array.from(mypoolnames)));

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
    loadMap("heart");
    announce("cleaning the playfield", null, 0x0010D0);
    votes.reset("clear");
}
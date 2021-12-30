//window.REF_ROOM_STATE
var propPaths = {
    level: ""
 }

function isHacked() {
    return typeof window.EVIL != 'undefined' && window.EVIL==true;
}


function resolveLevelParentPath() {
    if (propPaths.level=="" && typeof window.REF_ROOM_STATE != "undefined") {  
        for (let k in window.REF_ROOM_STATE) {
            if (typeof window.REF_ROOM_STATE[k].level != "undefined" && typeof window.REF_ROOM_STATE[k].level.height != "undefined") {
                propPaths.level=k;
            }
        }
    }
}

function getCurrentLevelCopy() {
    if (typeof window.REF_ROOM_STATE == "undefined") {
        console.log("reference room state is undefined")
        return null;
    }
    resolveLevelParentPath();
    
    let shallow = window.REF_ROOM_STATE[propPaths.level];
    if (typeof shallow == 'undefined' || shallow == null || typeof shallow.level == 'undefined' || typeof shallow.level.data == 'undefined' || typeof shallow.level.width == 'undefined' || typeof shallow.level.height == 'undefined' || typeof shallow.level.name == 'undefined') {
        console.log("could read level info")
        return null;
    }

    return {
        name: shallow.level.name,
        data: shallow.level.data.slice(0),
        height: shallow.level.height,
        width: shallow.level.width
    };
}

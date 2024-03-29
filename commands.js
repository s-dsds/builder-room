COMMAND_REGISTRY.init(window.WLROOM, {motd_color: COLORS.ANNOUNCE_BRIGHT, error_color: COLORS.ERROR, help_color: COLORS.NORMAL});


/*
var valueVotes = (() => {
    this.mod = [];
    this.modValues = [];
    this.currentVoteMsg = () => {};
    return {
        
        add: (name, player, value) => { 
            let a = auth.get(player.id);
            if (-1 != this[name].indexOf(a)) { return; }
            this[name].push(a);
            this[name+"Values"].push(value);
        },
        reset: (name) => { 
            this[name]= [];
            this[name+"Values"] = [];
            this.currentVoteMsg = () => {};
        },
        count: (name, value) => this[name].length,
        accepted: (name) => getActivePlayers().length==1 || this[name].length>=requiredVoteCount(),
        printCurrVoteMsg: this.currentVoteMsg,
        setCurrVoteMsg: (funk) =>  { this.currentVoteMsg = funk; },
    }
})();
*/

//------ clear
COMMAND_REGISTRY.add(["clear", "c"], ["!clear or !c: reload a clean map / submit to voting if more than one player are active"], (player)=>{
    if (isFight()) {
        announce("cannot clean during a fight", player, COLORS.WARNING);
        return false;
    }
    if (player.team==0) {
        announce("you need to join the game to be allowed to vote", player, COLORS.WARNING, "bold")
        return false;
    }
    if (getActivePlayers().length>1) {
        votes.add("clear", player);
    }
    if (!votes.accepted("clear")) {
        announce("player `"+player.name+"`requested clearing of the playfield, please type !clear to vote if you agree with him", null, COLORS.ANNOUNCE_BRIGHT);
        announce("current required vote count is: `"+requiredVoteCount() + "` current votes: `"+votes.count("clear")+"`", null, COLORS.INFO, "italic");
        return false;
    }
    UNDO_HISTORY.pushStep()
    cleanMap();
    return false;
}, false);

COMMAND_REGISTRY.add(["forceclear","fc"], ["!forceclear x y options or !fc x y fxs : reload a clean map, if passed x && y params it will change the size of the map, fxs only when passing x y"], (player, x, y, ...options)=> {
    UNDO_HISTORY.pushStep()
    if (x && y) {
        x = x >=maxMaxWidthHeight?maxMaxWidthHeight:parseInt(x);
        y = y >=maxMaxWidthHeight?maxMaxWidthHeight:parseInt(y);
        let fxs = options??[]
        fxs.unshift("fillbg")
        loadEffects(fxs, {
            name: `empty map of ${x} per ${y}`,
            data: [], 
            width: x,
            height: y
        })
    } else {
        cleanMap();
    }    
    return false;
},  COMMAND.ADMIN_ONLY);

//----- fight
COMMAND_REGISTRY.add(["fight", "f"], ["!fight: starts the fight! / submit to voting if more than one player are active"], (player) => {
    if (isFight()) {
        announce("you're already in a fight", player, COLORS.WARNING);
        return false;
    }
    if (player.team==0) {
        announce("you need to join the game to be allowed to vote", player, COLORS.WARNING, "bold")
        return false;
    }
    if (getActivePlayers().length>1) {
        votes.add("fight", player);
    }
    if (!votes.accepted("fight")) {
        announce("player `"+player.name+"`requested for a fight, please type !fight to vote if you agree with him", null, COLORS.ANNOUNCE_BRIGHT);
        announce("current required vote count is: `"+requiredVoteCount() + "` current votes: `"+votes.count("fight")+"`", null, COLORS.INFO, "italic");
        return false;
    }
    setFight();
    return false;
}, false);

COMMAND_REGISTRY.add(["forcefight","ff"], ["!forcefight: starts the fight!"], (player)=> {
    setFight();
    return false;
},  COMMAND.ADMIN_ONLY);
//----- build
COMMAND_REGISTRY.add(["build","b"], ["!build or !b: start building the map / submit to voting if more than one player are active"], (player) => {
    if (isBuild()) {
        announce("you're already building, if you want to clear the map type !clear", player, COLORS.WARNING);
        return false;
    }
    if (player.team==0) {
        announce("you need to join the game to be allowed to vote", player, COLORS.WARNING, "bold")
        return false;
    }
    if (getActivePlayers().length>1) {
        votes.add("build", player);
    }
    if (!votes.accepted("build")) {
        announce("player `"+player.name+"`requested to go back to building, please type !build to vote if you agree with him", null, COLORS.ANNOUNCE_BRIGHT);
        announce("current required vote count is: `"+requiredVoteCount() + "` current votes: `"+votes.count("build")+"`", null, COLORS.INFO, "italic");
        return false;
    }
    setBuildMod();
    return false;
}, false);

COMMAND_REGISTRY.add(["forcebuild","fb"], ["!forcebuild or !fb: start building the map"], (player)=> {
    setBuildMod();
    return false;
},  COMMAND.ADMIN_ONLY);

COMMAND_REGISTRY.add(["mapinfo","mf"], ["!mapinfo or !mf: information on the map"], (player)=> {
    let lev = getCurrentLevelCopy();
    announce(`${lev.name} \ width ${lev.width}px \ height ${lev.height}px`, player, COLORS.INFO)
    return false;
}, false);

COMMAND_REGISTRY.add("mod", ["!mod xxx: sets current fighting mod, lists mods if invalid or empty"], (player, modidx) => {
    if (""==modidx || "building"==modidx || typeof modpool[modidx] == "undefined") {
        announce(`invalid mod, choose between 0 and ${modpool.length-1}`, player, COLORS.WARNING);
        announce(`you can find the mod list here: https://webliero.gitlab.io/webliero-mods/zips.json`, player, COLORS.INFO, "small");
        
        return false;
    }
    if (randomizeFightMod) {
        announce(`random mod off`, player, COLORS.ANNOUNCE_BRIGHT, "small");
        randomizeFightMod=false

    }
    let mod = modpool[modidx]
    currMod = modpoolrand.indexOf(mod);
   
    printCurrentMod('current fight mod set to ', null, COLORS.ANNOUNCE_BRIGHT)    
    return false;
},  COMMAND.ADMIN_ONLY);

function moveToGame(player) {
    window.WLROOM.setPlayerTeam(player.id, 1);
}

function moveToSpec(player) {
    window.WLROOM.setPlayerTeam(player.id, 0);
}

COMMAND_REGISTRY.add("admin", ["!admin: if you're entitled to it, you get admin"], (player) => {
    let a = auth.get(player.id);
    if (admins.has(a) ) {
		window.WLROOM.setPlayerAdmin(player.id, true);
	}
    return false;
}, false);

COMMAND_REGISTRY.add(["quit","q"], ["!quit or !q: spectate if in game"], (player)=> {
    moveToSpec(player);
    return false;
}, false);


COMMAND_REGISTRY.add(["join","j"], ["!join or !j: joins the game if spectating"], (player)=> {
    if (!window.WLROOM.getSettings().teamsLocked || player.admin) {
        moveToGame(player);
    }
    return false;
}, false);

COMMAND_REGISTRY.add(["joinquit","jq", "quitjoin", "qj"], ["!joinquit or jq or quitjoin or qj: move out and back in the game"], (player)=> {
    moveToSpec(player)
    moveToGame(player)
    return false;
}, false);

COMMAND_REGISTRY.add(["randommod","rm"], ["!randommod or !rm: switches to random fight mod, use '!randommod off' to switch off"], (player, off)=> {
    let isOff=(off=="off");
    setRandomFightMod(isOff);
    if (isOff) {
        printCurrentMod(`fight mod is set to mod: `);        
    } else {
        announce("fight mod is set to be randomized each game", null, COLORS.ANNOUNCE);
    }
    
    return false;
},  COMMAND.ADMIN_ONLY);


COMMAND_REGISTRY.add(["forceundo","fu"], ["!forceundo #num or !fu #num: forces undo, use #num (not required) like `!fu 3` to go further back (num is from 1 to 24)"], (player, num)=> {
    if (!isBuild()) {
        announce("you can only undo while in build mode", player, COLORS.WARNING);
        return false;
    }
    let iNum = (""==num || isNaN(num))? 1 : parseInt(num);
    var undo = UNDO_HISTORY.getStep(iNum);
    if (undo == null) {
        announce("undo failed", player, COLORS.ERROR);
    } else {
        loadLev(undo.level);
        announce(`undoing force to undo recorded on ${undo.time}`, null, COLORS.ANNOUNCE);
    }
    votes.reset("undo");
    return false;
},  COMMAND.ADMIN_ONLY);

var undoAsked = null;
var startUndoTimeMS = null;
var undoTimeout = null;

function getRemainingTime(timerStep, startTimeMS){
    return  Math.round((timerStep - ( (new Date()).getTime() - startTimeMS ))/1000);
}

COMMAND_REGISTRY.add(["undo","u"], ["!undo #num or !u #num: forces undo, use #num (not required) like `!u 3` to go further back (num is from 1 to 24), the voting will be stopped after 1 minute"], (player, num)=> {
    if (!isBuild()) {
        announce("you can only undo while in build mode", player, COLORS.WARNING);
        return false;
    }
    if (player.team==0) {
        announce("you need to join the game to be allowed to vote", player, COLORS.WARNING, "bold")
        return false;
    }
    const voterCount = getActivePlayers().length
    if (voterCount>1) {
        votes.add("undo", player);
    }
    let timerStep = 60000;
    if (votes.isFirstVote("undo") || voterCount==1) {
        console.log("is first undo vote")
        let iNum = (""==num || isNaN(num))? 1 : parseInt(num);
        undoAsked =  UNDO_HISTORY.getStep(iNum);
         // resets the vote after a minute
        if (voterCount>1) {
            startUndoTimeMS = (new Date()).getTime();
            undoTimeout = setTimeout(() => {
                console.log("resetting undo vote")
                votes.reset("undo");         
              }, timerStep);
        }           
    }
    if (!votes.accepted("undo")) {
        announce(`player "${player.name}" requested for an undo recorded on ${undoAsked.time}, please type !undo to vote if you agree with him before the remaining ${getRemainingTime(timerStep, startUndoTimeMS)}s elapse`, null, COLORS.ANNOUNCE_BRIGHT);
        announce("current required vote count is: `"+requiredVoteCount() + "` current votes: `"+votes.count("undo")+"`", null, COLORS.INFO, "italic");
        return false;
    }
    if (undoAsked == null) {
        announce("undo failed")        
    } else {
        loadLev(undoAsked.level);
    }    
    votes.reset("undo");
    return false;
},  COMMAND.FOR_ALL);

COMMAND_REGISTRY.add(["undolist","ul"], ["!undolist or !ul: lists currently available undos"], (player)=> {
    
    if (UNDO_HISTORY.isRunning()) {
        announce("undo history currently recording", player, COLORS.INFO, "small");
    } else {
        announce("undo history is stopped", player, COLORS.WARNING, "small");
    }
    const l = UNDO_HISTORY.list()
    for (const k in l) {
        let idx = l.length-k
        announce(`${idx} : ${l[k].time}`, player, COLORS.INFO, "small");
    }
    return false;
},  COMMAND.FOR_ALL);

let lastSave = null
COMMAND_REGISTRY.add("save", ["!save #name: saves current map with #name (omit #)"], (player, name)=> {
    if (typeof __commitLevel != "function" || typeof window.REF_ROOM_STATE == "undefined") {
        announce("saving doesn't work at the moment, please ask an admin", player, COLORS.ERROR);
    }
    if (!isBuild()) {
        announce("you can only save while in build mode", player, COLORS.WARNING);
        return false;
    }
    const now =  new Date();

    const minSaveFrequency = 3 //in minutes
    const allow = (now-lastSave)/1000/60>minSaveFrequency

    if (lastSave==null || allow) {        
        lastSave = now
        let lev = getCurrentLevelCopy()
        if (lev == null) {
            announce("saving failed: getting current level failed", player, COLORS.ERROR);
        }
        lev.name = encodeURIComponent(name)
        try {
            let prom = __commitLevel(player.name, name, Array.from(lev.data), lev.width, lev.height)
            prom.then((savedName) => {
                announce(`map saved as ${savedName} you can find it at https://gitlab.com/sylvodsds/webliero-builder-maps/-/tree/master/maps/`, null, COLORS.INFO, "small");
                addTmpMapIdxAndRefresh(savedName);
            })            
        } catch (e) {
            console.log("error trying saving current map", e);
            announce("saving failed: commit failed", player, COLORS.ERROR);
        }
        return false
    } 
    if (!allow) {
        announce("you just can't save maps all the time, please wait a bit", player, COLORS.WARNING);        
    }
    return false;
},  COMMAND.FOR_ALL);

COMMAND_REGISTRY.add(["sync"], ["!sync: synchronizes map list"], (player, reset)=> {
    actualizeMapList()
    return false;
},  COMMAND.SUPER_ADMIN_ONLY);

COMMAND_REGISTRY.add(["reloadbuildercache","rbc"], ["!reloadbuildercache #clear: reloads builder mod, if clear is provided, clears the custom elements too"], (player, reset)=> {
    builderfactory.buildBuilderMod('default', true, typeof reset != 'undefined');
    return false;
},  COMMAND.SUPER_ADMIN_ONLY);

COMMAND_REGISTRY.add(["reloadmodlist","rml"], ["!reloadmodlist #clearcache: reloads mod list, if clearcache == 'clearcache' or 'cc' or 'true' also clears the cache for all mods"], (player, clearcache)=> {
    actualizeModList(clearcache=="true"||clearcache=="clearcache"||clearcache=="cc");
    return false;
},  COMMAND.SUPER_ADMIN_ONLY);

COMMAND_REGISTRY.add(["addadmin","aa"], ["!addadmin #id: adds an admin"], (player, pid ="")=> {
    pid = pid.replace("#","")
    let p = window.WLROOM.getPlayer(parseInt(pid))
    if (!p) {
        announce(`player id ${pid} not found`)
        return false
    }
    addAdmin(p)
    window.WLROOM.setPlayerAdmin(parseInt(pid), true)
    announce(`player ${p.name} as been added to the perm admin list`, null, COLORS.ANNOUNCE_BRIGHT)
    return false;
},  COMMAND.SUPER_ADMIN_ONLY);


COMMAND_REGISTRY.add(["listadmins","la"], ["!listadmins: list all admins"], (player)=> {
    for (const a of admins.values()) {
        announce(`${a.name} ${a.auth} ${a.super?'(super admin)':''}`, player.id, COLORS.ANNOUNCE_BRIGHT)
    }
    return false;
},  COMMAND.SUPER_ADMIN_ONLY);

COMMAND_REGISTRY.add(["deladmin","da"], ["!deladmin #auth: removes an admin"], (player, a="")=> {
    if (!isNaN(a.replace("#",""))) {
        let pid = parseInt(a.replace("#",""))
        let p = window.WLROOM.getPlayer(pid)
        if (p) {
            a = auth.get(p.id)        
        }
    }
    if (!admins.get(a)) {
        announce(`${a} is not perm admin`)
        return false
    }
  
    try {
        const name = removeAdmin(a)
        announce(`${name} as been removed from the perm admin list`, null, COLORS.ANNOUNCE_BRIGHT)
    } catch(error) {
        announce(`error removing ${a} from admin list`, player, COLORS.ERROR)
        console.log(`------- error removing admin ${a} : ${error}`)
    }    
    
    return false;
},  COMMAND.SUPER_ADMIN_ONLY);


COMMAND_REGISTRY.add(["palette","pal"], ["!palette or !pal: shows palette if in building mod"], (player)=> {
    if (!isBuild()) {
        announce("you can only undo while in build mode", player, COLORS.WARNING);
        return false;
    }
    setPalettedMod();
    return false;
},  COMMAND.ADMIN_ONLY);
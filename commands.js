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
    cleanMap();
    return false;
}, false);

COMMAND_REGISTRY.add(["forceclear","fc"], ["!forceclear x y or !fc x y: reload a clean map, if passed x && y params it will change the size of the map"], (player, x, y)=> {
    if (x && y) {
        x = x >=maxMaxWidthHeight?maxMaxWidthHeight:parseInt(x);
        y = y >=maxMaxWidthHeight?maxMaxWidthHeight:parseInt(y);
        loadEffects(["fillbg", "border"], {
            name: `empty map of ${x} per ${y}`,
            data: [], 
            width: x,
            height: y
        })
    } else {
        cleanMap();
    }    
    return false;
}, true);

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
}, true);
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
}, true);

COMMAND_REGISTRY.add(["mapinfo","mf"], ["!mapinfo or !mf: information on the map"], (player)=> {
    let lev = getCurrentLevelCopy();
    announce(`${lev.name} \ width ${lev.width}px \ height ${lev.height}px`, player, COLORS.INFO)
    return false;
}, false);

COMMAND_REGISTRY.add("mod", ["!mod xxx: sets current fighting mod, lists mods if invalid or empty"], (player, modidx) => {
    if (""==modidx || "building"==modidx || typeof mods.get(modidx) == "undefined") {
        announce("invalid mod", player, COLORS.WARNING);
        for (const  [key, lmod] of mods) {
            announce(`${key} : "${lmod.name}" "${lmod.version}" by "${lmod.author}"`, player, COLORS.INFO, "small");
        }
        return false;
    }
    if (randomizeFightMod) {
        announce(`random mod off`, player, COLORS.ANNOUNCE_BRIGHT, "small");
        randomizeFightMod=false

    }
    currMod = modidx;
    let mod = mods.get(modidx);
    announce(`current fight mod set to "${mod.name}" "${mod.version}" by "${mod.author}"`, null, COLORS.ANNOUNCE_BRIGHT);
    return false;
}, true);

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
        let m = getCurrentMod()
        announce(`fight mod is set to mod: ${m.name} v ${m.version} by ${m.author}`, null, COLORS.ANNOUNCE);
    } else {
        announce("fight mod is set to be randomized each game", null, COLORS.ANNOUNCE);
    }
    
    return false;
}, true);


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
}, true);

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
}, false);

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
}, false);

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
}, false);


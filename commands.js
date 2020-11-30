COMMAND_REGISTRY.init(window.WLROOM, {});

var votes = (() => {
    this.clear = [];
    this.fight = [];
    this.build = [];
    return {
        add: (name, player) => { 
            let a = auth.get(player.id);
            if (-1 != this[name].indexOf(a)) { return; }
            this[name].push(a);
        },
        reset: (name) => { this[name] = []; },
        count: (name) => this[name].length,
        accepted: (name) => getActivePlayers().length==1 || this[name].length>=requiredVoteCount(),
    }
})();
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
function requiredVoteCount() { return Math.floor(getActivePlayers().length/2)+1; }
//------ clear
COMMAND_REGISTRY.add("clear", ["!clear: reload a clean map / submit to voting if more than one player are active"], (player)=>{
    if (isFight()) {
        announce("cannot clean during a fight", player, 0xf02020);
        return false;
    }
    if (player.team==0) {
        announce("you need to join the game to be allowed to vote", player, 0xFF2020, "bold")
        return false;
    }
    if (getActivePlayers().length>1) {
        votes.add("clear", player);
    }
    if (!votes.accepted("clear")) {
        announce("player `"+player.name+"`requested clearing of the playfield, please type !clear to vote if you agree with him", null, 0x0010D0);
        announce("current required vote count is: `"+requiredVoteCount() + "` current votes: `"+votes.count("clear")+"`", null, 0x0010D0);
        return false;
    }
    cleanMap();
    return false;
}, false);

COMMAND_REGISTRY.add("forceclear", ["!forceclear: reload a clean map"], (player)=> {
    cleanMap();
    return false;
}, true);

//----- fight
COMMAND_REGISTRY.add("fight", ["!fight: starts the fight! / submit to voting if more than one player are active"], (player) => {
    if (isFight()) {
        announce("you're already in a fight", player, 0xf02020);
        return false;
    }
    if (player.team==0) {
        announce("you need to join the game to be allowed to vote", player, 0xFF2020, "bold")
        return false;
    }
    if (getActivePlayers().length>1) {
        votes.add("fight", player);
    }
    if (!votes.accepted("fight")) {
        announce("player `"+player.name+"`requested for a fight, please type !fight to vote if you agree with him", null, 0x0010D0);
        announce("current required vote count is: `"+requiredVoteCount() + "` current votes: `"+votes.count("fight")+"`", null, 0x0010D0);
        return false;
    }
    setFight();
    return false;
}, false);

COMMAND_REGISTRY.add("forcefight", ["!forcefight: starts the fight!"], (player)=> {
    setFight();
    return false;
}, true);

//----- build
COMMAND_REGISTRY.add("build", ["!build: start building the map / submit to voting if more than one player are active"], (player) => {
    if (isBuild()) {
        announce("you're already building, if you want to clear the map type !clear", player, 0xf02020);
        return false;
    }
    if (player.team==0) {
        announce("you need to join the game to be allowed to vote", player, 0xFF2020, "bold")
        return false;
    }
    if (getActivePlayers().length>1) {
        votes.add("build", player);
    }
    if (!votes.accepted("build")) {
        announce("player `"+player.name+"`requested to go back to building, please type !build to vote if you agree with him", null, 0x0010D0);
        announce("current required vote count is: `"+requiredVoteCount() + "` current votes: `"+votes.count("build")+"`", null, 0x0010D0);
        return false;
    }
    setBuildMod();
    return false;
}, false);

COMMAND_REGISTRY.add("forcebuild", ["!forcebuild: start building the map"], (player)=> {
    setBuildMod();
    return false;
}, true);

COMMAND_REGISTRY.add("mod", ["!mod xxx: sets current fighting mod, lists mods if invalid or empty"], (player, modidx) => {
    if (""==modidx || "building"==modidx || typeof mods.get(modidx) == "undefined") {
        announce("invalid mod", player, 0x0010D0);
        announce("avail mods:"+listMods(), player, 0x0010D0);
        return false;
    }
    currMod = modidx;
    let mod = mods.get(modidx);
    announce("current fight mod set to `"+mod.name+"` `"+mod.version+"`", null, 0x0010D0);
    return false;
}, true);

/*
COMMAND_REGISTRY.add("mod", ["!mod xxx: sets current fighting mod, lists mods if invalid or empty"], (player, modidx) => {
    if (""==modidx || "building"==modidx || typeof mods.get(modidx) == "undefined") {
        announce("avail mods:"+listMods(), player.id, 0x0010D0);
        return false;
    }

    if (player.team==0) {
        announce("you need to join the game to be allowed to vote", player, 0xFF2020, "bold")
        return false;
    }

    if (votes.count("mod")>0) {
        announce("vote already started for mod change !yes to agree or !no to reject the proposal", player, 0xFF2020);    
        votes.printCurrVoteMsg(player);
    }

    if (getActivePlayers().length>1) {
        votes.add("mod", player, true);
    }

    if (!votes.accepted("mod")) {
        votes.setCurrVoteMsg((voter) => {        
            announce("player `"+player.name+"`requested mod "+mod.name+"` version `"+mod.version+"` by `"+mod.author+"`", voter, 0x0010D0);     
            announce("current required vote count is: `"+requiredVoteCount() +"` votes [!yes: "+votes.count("mod", true)+" / !no: "+votes.count("mod", false)+"]", voter, 0x0010D0);
        });
        votes.printCurrVoteMsg(null);
        announce("please type !yes to agree or !no to reject the proposal", null, 0x0010D0);        
        return false;
    }
    changeFightingMod(modidx);
    return false;
}, false);

function changeFightingMod(modidx) {
    currMod = modidx;
    let mod = mods.get(modidx);
    announce("current fight mod set to "+mod.name+"` version `"+mod.version+"` by `"+mod.author+"`", null, 0x0010D0);
    votes.reset("mod");
}
*/
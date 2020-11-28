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
        accepted: (name) => this.count(name)>=requiredVoteCount(),
    }
})();

function requiredVoteCount() { return Math.floor(getActivePlayers.length/2)+1; }
//------ clear
COMMAND_REGISTRY.add("clear", ["!clear: reload a clean map / submit to voting if more than one player are active"], (player)=>{
    if (isFight()) {
        this.room.sendAnnouncement("cannot clean during a fight", player.id, 0xf02020);
        return false;
    }
    if (getActivePlayers().length>1) {
        votes.add("clear", player);
    }
    if (!votes.accepted("clear")) {
        this.room.sendAnnouncement("player `"+player.name+"`requested cleaning of the playfield, please type !clean to vote if you agree with him", null, 0x0010D0);
        this.room.sendAnnouncement("current required vote count is: `"+requiredVoteCount() + "` current votes: `"+votes.count("clear")+"`", null, 0x0010D0);
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
        this.room.sendAnnouncement("you're already in a fight", player.id, 0xf02020);
        return false;
    }
    if (getActivePlayers().length>1) {
        votes.add("fight", player);
    }
    if (!votes.accepted("fight")) {
        this.room.sendAnnouncement("player `"+player.name+"`requested for a fight, please type !fight to vote if you agree with him", null, 0x0010D0);
        this.room.sendAnnouncement("current required vote count is: `"+requiredVoteCount() + "` current votes: `"+votes.count("fight")+"`", null, 0x0010D0);
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
        this.room.sendAnnouncement("you're already building, if you want to clear the map type !clear", player.id, 0xf02020);
        return false;
    }
    if (getActivePlayers().length>1) {
        votes.add("build", player);
    }
    if (!votes.accepted("build")) {
        this.room.sendAnnouncement("player `"+player.name+"`requested to go back to building, please type !build to vote if you agree with him", null, 0x0010D0);
        this.room.sendAnnouncement("current required vote count is: `"+requiredVoteCount() + "` current votes: `"+votes.count("build")+"`", null, 0x0010D0);
        return false;
    }
    setBuildMod();
    return false;
}, false);

COMMAND_REGISTRY.add("forcebuild", ["!forcebuild: start building the map"], (player)=> {
    setBuildMod();
    return false;
}, true);

COMMAND_REGISTRY.add("mod", ["!mod xxx: sets current fighting mod, lists mods if invalid or empty"], (player, modidx)=> {
    if (""==modidx || "building"==modidx || typeof mods.get(modidx) == "undefined") {
        this.room.sendAnnouncement("invalid mod", player.id, 0x0010D0);
        this.room.sendAnnouncement("avail mods:"+listMods(), player.id, 0x0010D0);
        return false;
    }
    currMod = modidx;
    let mod = mods.get(modidx);
    this.room.sendAnnouncement("current fight mod set to `"+mod.name+"` `"+mod.version+"`", player.id, 0x0010D0);
    return false;
}, true);

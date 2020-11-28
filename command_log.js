window.WLROOM.onPlayerChat = function (p, m) {
	console.log(p.name+" "+m);
	writeLog(p,m);
}

window.WLROOM.onPlayerJoin = (player) => {
	if (admins.has(player.auth) ) {
		window.WLROOM.setPlayerAdmin(player.id, true);
	}
	auth.set(player.id, player.auth);
	writeLogins(player);
	let mod = getCurrentMod();
	let bmod = mods.get("build");
	announce("Welcome to the Liero Builder room!", player, 0xFF2222, "bold");
	announce("current fighting mod is `"+mod.name+"` version `"+mod.version+"` by `"+mod.author+"`", player, 0xDD2222);
    announce("current building mod is version `"+bmod.version+"`", player, 0xDD2222);
    announce("This is currently an early Beta version, so it might break, please tell dsds if you encounter any errors or if you have any comments", player, 0xFF22FF, "italic");

	if (isFight()) {
		announce("game is running in fighting mod", player, 0xDD2222);
	} else if(isBuild()) {
		announce("game is running in build mod, you can join and help making this map!", player, 0xDD2222);
	}
	
	announce("please join us on discord if you're not there yet! "+CONFIG.discord_invite, player, 0xDD00DD, "italic");
	if (player.auth){		
		auth.set(player.id, player.auth);
	}
}

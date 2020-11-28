const GAME_RUNNING_STATE = 1;
const BUILDING_SATE = 2;

var currState = BUILDING_SATE;

function hasActivePlayers() {
    console.log('act',getActivePlayers().length != 0);
	return getActivePlayers().length != 0;
}

function getActivePlayers() {
	return window.WLROOM.getPlayerList().filter(p => p.team !=0);
}

function isFight() { return currState==GAME_RUNNING_STATE; }
function isBuild() { return currState==BUILDING_SATE;}
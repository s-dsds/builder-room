const GAME_RUNNING_STATE = 1;
const BUILDING_STATE = 2;
const PALETTE_STATE = 3;

var currState = BUILDING_STATE;

function hasActivePlayers() {
    console.log('act',getActivePlayers().length != 0);
	return getActivePlayers().length != 0;
}

function getActivePlayers() {
	return window.WLROOM.getPlayerList().filter(p => p.team !=0);
}

function isFight() { return currState==GAME_RUNNING_STATE; }
function isBuild() { return currState==BUILDING_STATE;}
function isPalette() { return currState==PALETTE_STATE;}
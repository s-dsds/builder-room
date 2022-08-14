var UNDO_HISTORY = (function () {
    // Undo history plugin
    // example usage:
    //  #init registry by passing to it the room and eventual config
    //  UNDO_HISTORY.init(window.WLROOM, pluginConfig);
    //
    const chainFunction = (object, attribute, func) => {
        const original = object[attribute]
        if (original) {
            object[attribute] = (...arguments) => {
                let or = original.apply(object, arguments)
                let r = func.apply(object, arguments)
                if (false == r || false == or) {
                    return false;
                }
            }
        } else {
            object[attribute] = func
        }
    }

    const log = (...arguments) => {
        console.log(...arguments.map(x => JSON.stringify(x)))
    }
    let room = null
    let settings = {
        maxSteps: 24,
        frequency: 10 // in seconds
    } //default settings

    const loadSettings = (confArgs) => {
        settings = {
            ...settings,
            ...confArgs
        }
    }

    let steps = [];

    let intervalID = null;
    const stop = () => {
        console.log("stopping undo history recording");
        clearInterval(intervalID);
        intervalID = null;
    }
    const pushStep = () => {
        //console.log("pushing undo step")
        if (steps.length>=settings.maxSteps) {
            steps = steps.slice(1, settings.maxSteps)
        }
        steps.push({level:getCurrentLevelCopy(), time:new Date()});         
    }
    const start = () => {
        if (intervalID!=null) {
            return;
        }
        console.log("starting undo history recording");
        pushStep();
        intervalID = setInterval(pushStep, settings.frequency*1000);
    }
    
    const onStart = () => {
        if (isBuild() && hasActivePlayers()) {
            if (intervalID==null) {
                start();    
            }            
        } else {
            stop();
        }
    }

    const onEnd = () => {
        console.log('============---endgame-------------------')
        if ((!hasActivePlayers() || !isBuild()) && intervalID!=null) {
            if (isBuild()) {
                pushStep();
            }
            stop();
        }
    }

    const onTeamChange = (player) => {
        if (isBuild() && player.team!=0) {
            start();
        }
    }
    
    const getSteps = () => steps;

    const getStep = (num) => {
        if (steps.length == 0) {
            console.log("no undo steps available")
            return null;
        }
        if (num < 0) { num = 0 }
        if (num > (steps.length )) { num = steps.length }
        console.log("getting step", num, steps.length-num)
        return steps[steps.length-num];
    }


    const init = (argRoom, confArgs) => {
        if (window.UHPLUGIN) {
            log('undo history is already loaded, you can change settings use UNDO_HISTORY.loadSettings()', settings)
            return
        }
        room = argRoom
        loadSettings(confArgs)
        log('loading undo history', settings)
        window.UHPLUGIN = true

        chainFunction(room, 'onGameStart', onStart)
        chainFunction(room, 'onPlayerLeave', onEnd)
        chainFunction(room, 'onPlayerTeamChange', onTeamChange)
        chainFunction(room, 'onGameEnd', onEnd)
    }

    return {
        init: init,
        loadSettings: loadSettings,        
        getStep: getStep,
        isRunning: () => (intervalID!=null),
        list: getSteps,
        pushStep:pushStep
    }
})()

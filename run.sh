#!/bin/bash
trap ' ' INT
if [[ -f "../src/dist/cli.js" ]]
then
    WLEXEC="../src/dist/cli.js"
else
    WLEXEC="wlhl"
fi
echo $WLEXEC

if [[ $3 == "reload" ]]; then
    wget https://www.vgm-quiz.com/dev/webliero/wledit/wlkit.js -O _wlkit.js
    wget https://www.vgm-quiz.com/dev/webliero/wledit/hjson.min.js -O _hjson.js
fi

$WLEXEC stop $1
$WLEXEC launch --id $1 --token $2
$WLEXEC run $1 *.js

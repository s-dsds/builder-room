#!/bin/bash
trap ' ' INT
if [[ -f "../src/dist/cli.js" ]]
then
    WLEXEC="../src/dist/cli.js"
else
    WLEXEC="wlhl"
fi
echo $WLEXEC
$WLEXEC stop $1
$WLEXEC launch --id $1 --token $2
$WLEXEC run $1 *.js

#!/bin/sh

PID=`cat $1.lock`

pkill -9 $PID
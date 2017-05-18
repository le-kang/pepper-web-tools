#!/bin/bash

source /home/nao/.bash_profile

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

nohup /home/nao/ros/ros_web/lib/web_video_server/web_video_server &> /home/nao/web-tools/log &
echo $! > /home/nao/web-tools/video_server.pid
nohup python simple_auth_server.py &> /home/nao/web-tools/log &
echo $! > /home/nao/web-tools/web_server.pid
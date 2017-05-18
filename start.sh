#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

nohup /home/nao/ros/ros_web/lib/web_video_server/web_video_server &> /home/nao/web-tools/log &
nohup python -m SimpleHTTPServer 8888 &> /home/nao/web-tools/log &
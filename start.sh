#!/tmp/gentoo/bin/bash

source /home/nao/.bash_profile

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

nohup /home/nao/ros/ros_web/lib/web_video_server/web_video_server &> /home/nao/web_tools/video_server.log &
echo $! > /home/nao/web_tools/video_server.pid
nohup python simple_auth_server.py &> /home/nao/web_tools/web_server.log &
echo $! > /home/nao/web_tools/web_server.pid

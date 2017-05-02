#!/usr/bin/python

import SimpleHTTPServer
import SocketServer

HOST_NAME = "pepper.local"
PORT_NUMBER = 8888

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer((HOST_NAME, PORT_NUMBER), Handler)

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
httpd.server_close()
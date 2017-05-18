#! /usr/bin/env python
# -*- encoding: UTF-8 -*-

import SocketServer
from SimpleHTTPServer import SimpleHTTPRequestHandler
import sys
import base64


class AuthHandler(SimpleHTTPRequestHandler):
    def do_HEAD(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_AUTHHEAD(self):
        self.send_response(401)
        self.send_header('WWW-Authenticate', 'Basic realm=\"Pepper Web Tools\"')
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        global key
        if self.headers.getheader('Authorization') is None:
            self.do_AUTHHEAD()
            self.wfile.write('no auth header received')
            pass
        elif self.headers.getheader('Authorization') == 'Basic ' + key:
            SimpleHTTPRequestHandler.do_GET(self)
            pass
        else:
            self.do_AUTHHEAD()
            self.wfile.write(self.headers.getheader('Authorization'))
            self.wfile.write('not authenticated')
            pass


if __name__ == '__main__':
    key = base64.b64encode('nao:Habanero1')
    httpd = SocketServer.TCPServer(('', 8888), AuthHandler)
    httpd.serve_forever()

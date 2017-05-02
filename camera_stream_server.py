#!/usr/bin/env python

from naoqi import ALProxy
import uuid
from PIL import Image
import StringIO
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
from SocketServer import ThreadingMixIn
import time

HOST_NAME = "pepper.local"
PORT_NUMBER = 9000


class StreamHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "multipart/x-mixed-replace; boundary=--jpgboundary")
        self.end_headers()
        video_device = ALProxy("ALVideoDevice", "pepper.local", 9559)
        handle = video_device.subscribeCamera(str(uuid.uuid4()), 0, 2, 11, 30)
        while True:
            try:
                image_container = video_device.getImageRemote(handle)
                if image_container is None:
                    continue
                image = Image.frombytes("RGB", (image_container[0], image_container[1]), image_container[6])
                tmp_file = StringIO.StringIO()
                image.save(tmp_file, "JPEG")
                try:
                    self.wfile.write("--jpgboundary")
                    self.send_header("Content-type", "image/jpeg")
                    self.send_header("Content-length", str(tmp_file.len))
                    self.end_headers()
                    image.save(self.wfile, "JPEG", quality=80, optimize=True)
                except IOError:
                    pass
                time.sleep(0.05)
            except KeyboardInterrupt:
                break


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""


if __name__ == "__main__":
    httpd = ThreadedHTTPServer((HOST_NAME, PORT_NUMBER), StreamHandler)
    print time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)

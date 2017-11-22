#
# Python 3.5+
#
# *** This might even work
#

import json
import logging
import socket
import threading
import sys
import subprocess
import os
import configparser
from Command_Queue import *


class Command:
    def __init__(self, host, port, data: str):
        r"""

        For a given command, loads data into object

        :param data: the `stringified` JS object

        """
        self.__in_data = json.loads(data)
        logging.debug('Incoming data: {} from host {} on port {}'.format(self.__in_data, host, port))
        del data

    def create_file(self, fname='tmp'):
        r"""

        Writes incoming code to a file if necessary.
        Decide on a default loc eg `~./codechat/`

        :param fname: Name of file to be written.

        :return: File path

        """
        cwd = os.getcwd()
        path = os.path.join(cwd, fname)
        with open(path) as file:
            file.writelines(self.__in_data["code"])
        logging.DEBUG("File {} created at {}".format(fname, path))
        return path

    def process(self):
        r"""

        Will process whatever information is held within `__in_data`
        Calls create_file.

        :return: Code output as a string.

        """
        # tbc
        # subprocess.call()
        return subprocess.check_out('python', [file])
        
    def __del__(self):
    	pass
# end Command

class CommandThread(threading.Thread):

    # This class is passed a new connection to receive commands on.
    # Need a timeout

    def __init__(self, conn: socket.socket):
        r"""

        Sets the connection and inits data obj.

        :param conn: a `socket` connection

        """
        super(CommandThread , self).__init__()
        self.__conn = conn
        self.__in_queue = Command_Queue('inqueue')
        self.__out_queue = Command_Queue('outqueue')

    def listen(self):
        r"""

        Will wait for data incoming from the chat client and instantiate anon `Command` class.

        :return: None

        """
        while True:
            data = self.__conn.recv(1024)
            if data:
            	self.__out_queue.enqueue(Command(data).process())
            self.reply()
			
    def reply(self, response):
        r"""

        Will send the response message to the requesting chat instance given a processed command.

        :param response: Code output

        :return: None

        """
        if not self.__command_queue.is_empty():
        	self.__conn.send(self.__command_queue.dequeue())
        # self.close()

	def __del__(self):
		while not self.__command_queue.is_empty():
			self.__conn.send(self.__command_queue.dequeue())
		self.__con.close()

# end class server


class Server(threading.Thread):

    def __init__(self, host=socket.gethostname(), port=3001, whitelist:list):
        r"""

        Init threading for a given chat to process commands.

        :param host: Whichever host is processing requests (self).

        :param port: Whichever port we're accepting sockets on.

        """
        super(Server, self).__init__()
        try:
            self.__s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.__s.bind((host, port))
        except socket.error:
            logging.DEBUG('Failed to create connection with {} on port {}'.format(host, port))
            sys.exit()
        
        #empty queue
        
        self.__host, self.__port, self.__whitelist = host, port, whitelist

    def run(self):
        r"""

        Start listening on a given socket.

        :return: 

        """
        self.__s.listen(5)
        while True:
            conn, address = self.__s.accept()
            if address in whitelist:
				CommandThread(conn).listen()
				logging.DEBUG('Command processed for host {}'.format(address[0]))
            
	def close(self):
		try:
			self.__s.close()
		except socket.error:
			logging.DEBUG('Failed to close connection for main server socket for host: {}, port: {}!'.format(self.__host. self.__port))

# end CommandThread


def main():
    config = configparser.ConfigParser()
    config.read('server-settings.ini')
    g_host = socket.gethostname()
    g_port = config['DEFAULT']['port']
    my_socket_stuff = Server(g_host, g_port, config['DEFAULT']['allowed'])
    my_socket_stuff.run()

if __name__ == '__main__':
    main()

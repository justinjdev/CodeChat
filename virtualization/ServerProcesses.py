#
# Python 3.5+
#
# *** I'm probably spawning too many threads
#

import json
import logging
import socket
import threading
import sys
import subprocess
import os


class Command:
    def __init__(self, data: str):
        r"""

        For a given command, loads data into object

        :param data: the `stringified` JS object

        """
        global host
        global port
        self.__in_data = json.loads(data)
        logging.debug('Incoming data: {} from host {} on port {}'.format(self.__in_data, host, port))
        del data

    def create_file(self, fname='tmp'):
        r"""

        Writes incoming code to a file if necessary.
        Currently only within the cwd which is stupid.
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

        :return: Code output as a string.

        """
        # tbc
        # subprocess.call()
        return "JUICE"
# end Command

class Server(threading.Thread):

    # Decide where socket closing should be

    def __init__(self, conn: socket.socket):
        r"""

        Sets the connection and inits data obj.

        :param conn: a `socket` connection

        """
        super(Server, self).__init__()
        self.__conn = conn
        self.__data = str()  # although '' is technically faster

    def listen(self):
        r"""

        Will wait for data incoming from the chat client and instantiate anon `Command` class.

        :return: None

        """
        while True:
            self.__data = self.__conn.recv(1024)
            Command(self.__data)

    def reply(self, response):
        r"""

        Will send the response message to the requesting chat instance given a processed command.

        :param response: Code output

        :return: None

        """
        self.__conn.send(response)
        # self.close()

    # def close(self):
    #     r"""
    #
    #     Will close the socket connection upon response.
    #
    #     :return: None
    #
    #     """
    #     self.__conn.close()
# end class server


class CommandThread(threading.Thread):

    def __init__(self, host, port=1999):
        r"""

        Init threading for a given chat to process commands.

        :param host: Whichever host is requesting processing.

        :param port: Whichever port we're accepting sockets on.

        """
        super(CommandThread, self).__init__()
        # these are not private -
        # they aren't used again once they would become accessible
        # and I want to reference them from a scope class :)
        self.host = host
        self.port = port
        try:
            self.__s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.__s.bind((host, port))
            # connection backlog
            # so we can handle 6 total requests - 1 currently processing and 5 waiting
            # self.__s.listen(5)
        except socket.error:
            logging.DEBUG('Failed to create connection with {} on port {}'.format(host, port))
            sys.exit()

    def run(self):
        r"""

        Start listening on a given socket.

        :return:

        """
        self.__s.listen(5)
        while True:
            conn, address = self.__s.accept()
            srv = Server(conn)
            srv.listen()
            logging.DEBUG('Command processed for host {}'.format(address[0]))
        # I probably need a clean way to end this

# end CommandThread


def main():
    # need to decide on a port
    # default set to 1999
    g_host = socket.gethostname()
    g_port = 1999
    get_conns = CommandThread(g_host, g_port)
    get_conns.run()

    # I'm going to loop through periodically to send responses
    while True:
        try:
            pass
        except KeyboardInterrupt:
            logging.DEBUG('Exiting via KBI')
            sys.exit()

if __name__ == '__main__':
    main()
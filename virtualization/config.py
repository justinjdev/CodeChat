import configparser
import socket

config = configparser.ConfigParser()

config['DEFAULT'] = {'port': '3001',
					 'accept': ['127.0.0.1'],
					 'host': socket.gethostname()}

with open('server-settings.ini', 'w+') as cfile:
	config.write(cfile)
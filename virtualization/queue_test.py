'''
	A file demonstrating the usage of the command queue.
'''

import json
from Command_Queue import *

def main():
	my_queue = Command_Queue('queue1')
	my_queue.enqueue(json.dumps(['foo', {'bar': ('baz', None, 1.0, 2)}]))
	print(json.loads(my_queue.dequeue().get_item()))
	
if __name__ == '__main__':
	main()

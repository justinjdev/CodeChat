from Command_Item import *

class Error(Exception):
	pass

class QueueError(Error):
	def __init__(self, message):
		self.message = message

class Command_Queue:

	queues = 0

	def __init__(self, name='unnamed'):
		self.__length = 0
		self.__head = None
		self.__name = name
		Command_Queue.queues += 1

	def is_empty(self):
		return self.__length == 0
        
	def enqueue(self, data):
		node = Command_Item(data)
		if self.__head is None:
			self.__head = node
		else:
			last = self.__head
			while last.get_next() is not None:
				last = last.get_next()
			last.set_next(node)
		self.__length += 1

	def dequeue(self):
		data = None
		if not self.is_empty():
			data = self.__head
			self.__head = self.__head.get_next()
			self.__length -= 1
			return data
		else:
			# this shouldn't happen - check is_empty() on dequeue
			raise QueueError('Dequeue attempt for empty queue `{}`!'.format(self.__name))
		
	def get_head(self):
		return self.__head
		
	def __del__(self):
		Command_Queue.queues -= 1
		

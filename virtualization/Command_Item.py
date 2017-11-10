class Command_Item:
    def __init__(self, item=None):
        self.__item = item
        self.__next = None

    def get_next(self):
        return self.__next

    def set_next(self, next_node):
        self.__next = next_node

    def get_item(self):
        return self.__item

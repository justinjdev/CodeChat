#!/usr/bin/env python3.6
"""
    Author: Justin Jones
    Date: 11/27/2017

    File: Server.py
    Version: 0.4

    Written for use with CodeChat.
    This file handles the websockets connection and code directing.
    Group: The Kernel
    COSC 4319.01 Fall 2017
"""

import asyncio
import websockets
from Processing import Processor
import json
import logging
from datetime import datetime
import sys

async def command_handler(websocket, path):
    global logger
    my_processor = Processor()
    supported_langs = my_processor.get_languages()
    lang_funcs = my_processor.get_funcs()
    lang_handler = {'python': my_processor.process_python}
    #for num, lang in enumerate(supported_langs, 0):
        #lang_handler[lang] = getattr(Processor, lang_funcs[num])
    while True:
        try:
            command_obj = await websocket.recv()
            logger.info('command received')
            command_obj = json.loads(command_obj)
            language = command_obj['language']
            if language in lang_handler.keys():
                logger.info('command is valid, executing...')
                handler = lang_handler[command_obj['language']]
                output = handler(my_processor, command_obj['text'])
                #output = my_processor.process_python(command_obj['text'])

            else:
                logger.info('Command not in supported languages')
                output = "Language is not supported at this time."
            command_obj['output'] = output
            logger.info("response sent")
            command_obj = json.dumps(command_obj)
            await websocket.send(command_obj)

        except KeyboardInterrupt:
            print("Process quit via KBI\nBye...")
            websocket.close()

        except websockets.exceptions.ConnectionClosed:
            print("Connection lost!")
            sys.exit()

logger = logging.getLogger('websockets')
def main():
    global logger
    logger.setLevel(logging.INFO)
    logger.addHandler(logging.StreamHandler())
    start_server = websockets.serve(command_handler, '0.0.0.0', 3003)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    main()

import asyncio
import websockets
import json


async def hello():
    async with websockets.connect('ws://104.131.129.223:3003') as websocket:
        test = {'language': 'pony',
                'text': 'actor Main\nnew create(env:Env)=>\nenv.out.print("test")\n',
                'output': ""}
        test = json.dumps(test)
        await websocket.send(test)
        print("> stuff has been stuffed")

        response = await websocket.recv()
        response = json.loads(response)
        print(response['output'])

asyncio.get_event_loop().run_until_complete(hello())




import asyncio
import websockets
import json

async def hello():
    async with websockets.connect('ws://104.131.129.223:3003') as websocket:
        stuff = getinput()
        await websocket.send(stuff)
        print("> stuff has been stuffed to the dill")

        response = await websocket.recv()
        response = response.split("\n")
        for line in response:
        	print("<< {}".format(line))
        

def getinput():
	print("Enter some code, m'lord.\ntype `DONE` to finish")
	user_text = input(">> ")
	text_lines = ""
	while user_text != "DONE":
		text_lines += (user_text + "\n")
		user_text = input(">> ")
	
	return text_lines
	

asyncio.get_event_loop().run_until_complete(hello())
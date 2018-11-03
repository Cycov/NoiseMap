from threading import Thread
from time import sleep

import paho.mqtt.client as mqtt
from random import randint

GUIDs = [
    'b03a7679-49cc-4339-b157-a026ab1e3f4e',
    '881fddd7-0fe7-4fc8-9d2d-d2cbbef08fec',
    '5f5e460a-3f0d-495f-9069-643f6ed35570',
    'e47a0cd5-f2fb-4ce2-8c0d-3723e80afbe2',
    '7fa8440c-3621-4ffb-9e50-d41c9396afb8',
    '5fac838e-51c5-4d13-b016-668f85a4f6a7',
    '090a8838-d573-43c3-8432-7c01834c7425',
    '152a953b-4afc-4cf0-957c-7433459cd543',
    '4d58a3a8-dbf3-46d5-8c37-f38fc8deaa89',
    '6a581e8c-acf5-4a56-9804-9ed414616e3d',
    'a56bcbad-4831-40f2-8e32-4d513a3379e3',
    '5ab8b5b0-1cfa-414c-aa30-59fdc14b5e49',
    '0c389d43-b99e-49ae-8484-dca04cca4d83',
    '64e709fc-bb21-4770-9684-43ff754bec4b',
    'b1f97466-a09c-4ad1-908a-55b8788448e8',
    'e99cb13a-40f6-4404-833e-1388102a5b67',
    '3425bc97-08d6-449c-b702-6af42cb04102',
    '2dea74f7-3067-4a6e-b2fd-96e2cbf3271b',
    '71e319a8-4d70-41a9-81a7-461d5008a734',
    'cb45b50a-f50f-4327-be21-19a74bcb4b64',
    '849ddfa1-8c02-4bd8-83be-8cd62618c32b',
]

Locations = [
    [45.7967816, 24.1496387],  # Piata Mare
    [45.7908419, 24.1464407],  # Giratoriu Facultate
    [45.7965659, 24.1566906],  # Giratoriu PK Tineretului
    [45.7824219, 24.1630384],  # Milea
    [45.7824305, 24.146083],  # SuperMama Dumbravii
    [45.7933915, 24.1309754],  # Giratoriu Kaufland
    [45.7937181, 24.1190933],  # Giraotoriu AlbaIulia
    [45.8044677, 24.1502479],  # Giratoriu Libertatea
    [45.7881876, 24.1736601],  # Giratoriu V. Aron
    [45.8081563, 24.1721783],  # Gusterita-Autostrada
    [45.7994175, 24.1626566],  # Podu Garii
    [45.7884394, 24.1390026],  # Bld Victoriei
    [45.7780752, 24.1501665],  # Scoala 6
    [45.7931844, 24.1549382],  # Medicina
    [45.8051146, 24.1264296],  # Drumu Hotiilor
    [45.7729898, 24.1255517],  # Giratoriu V. Aurie
    [45.7705098, 24.1357834],  # Giratoriu Cimitir
    [45.7748147, 24.1461156],  # Giratoriu Calea Cisnadiei
    [45.7922428, 24.1255153],  # Graului
    [45.7846076, 24.1493644],  # Oituz
]

Hours = [
    # 01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
    [50, 20, 13, 15, 15, 18, 20, 30, 35, 40, 40, 45, 50, 60, 50, 45, 45, 40, 60, 70, 100, 100, 85, 60],
    [30, 30, 25, 35, 25, 35, 40, 45, 50, 45, 40, 60, 45, 40, 35, 55, 65, 50, 35, 35, 25, 30, 35, 30],
    [25, 25, 30, 25, 30, 30, 35, 50, 45, 35, 45, 55, 50, 45, 35, 50, 55, 55, 30, 35, 30, 25, 25, 25],
    [30, 30, 25, 30, 35, 35, 40, 65, 55, 45, 40, 55, 40, 40, 40, 55, 60, 50, 35, 30, 25, 30, 25, 30],
    [20, 30, 30, 25, 30, 25, 30, 60, 50, 35, 45, 50, 50, 45, 40, 50, 55, 55, 30, 35, 30, 25, 30, 30],
    [30, 35, 35, 30, 30, 30, 40, 55, 50, 40, 40, 55, 45, 40, 35, 50, 55, 50, 35, 30, 30, 30, 30, 25],
    [25, 30, 30, 30, 30, 30, 35, 50, 55, 40, 45, 60, 45, 40, 40, 60, 50, 55, 35, 35, 25, 30, 25, 25],
    [20, 20, 20, 25, 35, 35, 30, 55, 50, 35, 40, 55, 50, 45, 35, 55, 55, 55, 35, 35, 30, 25, 25, 25],
    [35, 25, 25, 20, 25, 25, 40, 60, 45, 35, 40, 50, 40, 45, 35, 50, 60, 50, 30, 30, 25, 25, 30, 30],
    [30, 20, 20, 20, 30, 35, 40, 55, 50, 45, 45, 50, 45, 40, 35, 55, 60, 50, 35, 35, 25, 30, 35, 30],
    [33, 35, 35, 30, 30, 35, 35, 60, 55, 40, 45, 60, 55, 45, 35, 50, 65, 55, 30, 35, 30, 25, 25, 25],
    [30, 25, 25, 30, 25, 30, 35, 50, 45, 40, 40, 55, 40, 40, 40, 55, 55, 50, 35, 30, 25, 30, 25, 30],
    [20, 30, 30, 35, 25, 25, 35, 45, 45, 45, 45, 55, 40, 45, 40, 50, 55, 55, 30, 35, 30, 25, 30, 30],
    [25, 25, 25, 25, 35, 30, 35, 60, 50, 45, 40, 60, 50, 40, 35, 50, 65, 50, 35, 30, 30, 30, 30, 25],
    [20, 30, 30, 20, 35, 30, 35, 50, 55, 40, 40, 55, 45, 40, 40, 60, 50, 55, 35, 35, 25, 30, 25, 25],
    [35, 25, 25, 35, 25, 25, 30, 65, 50, 35, 45, 50, 50, 45, 35, 55, 50, 55, 35, 35, 30, 25, 25, 25],
    [25, 20, 20, 35, 25, 30, 40, 45, 50, 40, 45, 55, 45, 45, 35, 50, 65, 50, 30, 30, 25, 25, 30, 30],
    [30, 25, 25, 30, 35, 30, 35, 55, 55, 40, 40, 60, 45, 40, 35, 55, 60, 50, 35, 35, 25, 30, 35, 30],
    [25, 30, 30, 25, 35, 35, 30, 60, 50, 35, 45, 55, 50, 45, 35, 50, 60, 55, 30, 35, 30, 25, 25, 25],
    [30, 35, 35, 25, 30, 25, 40, 65, 45, 35, 40, 50, 45, 40, 40, 55, 50, 50, 35, 30, 25, 30, 25, 30],

]


# The callback for when a PUBLISH message is received fr`om the server.
def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))


client = mqtt.Client()
client.on_message = on_message

client.connect("m2m.eclipse.org", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
# client.loop_forever()

i = 0
print("Starting loop")
while True:
    sleep(1)
    i = i % 24
    client.publish("hacktmsibiu", str(i))
    print("time is:" + str(i))
    for index in range(19):
        client.publish("hacktmsibiu/"+GUIDs[index]+"/coord", str(Locations[index][0])+";"+str(Locations[index][1]))
        chance=randint(0,100)
        client.publish("hacktmsibiu/"+GUIDs[index]+"/value",Hours[index][i] if chance >10 else -1 )
    i += 1

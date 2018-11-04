import gc
import threading
from threading import Thread
from time import sleep

import paho.mqtt.client as mqtt
from random import randint
import random

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
    # [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    [50, 20, 13, 15, 15, 18, 20, 30, 35, 40, 40, 45, 50, 60, 50, 45, 45, 40, 60, 70, 100, 100, 85, 60],
    [30, 30, 25, 35, 25, 35, 40, 75, 50, 45, 40, 60, 45, 40, 35, 75, 65, 50, 35, 35, 25, 30, 35, 30],
    [25, 25, 30, 25, 30, 30, 35, 70, 45, 35, 45, 55, 50, 45, 35, 70, 55, 55, 30, 35, 30, 25, 25, 25],
    [30, 30, 25, 30, 35, 35, 40, 75, 55, 45, 40, 55, 40, 40, 40, 75, 68, 50, 35, 30, 25, 30, 25, 30],
    [20, 30, 30, 25, 30, 25, 30, 60, 50, 35, 45, 50, 50, 45, 40, 70, 55, 55, 30, 35, 30, 25, 30, 30],
    [30, 35, 35, 30, 30, 30, 40, 75, 50, 40, 40, 55, 45, 40, 35, 70, 66, 50, 35, 30, 30, 30, 30, 25],
    [25, 30, 30, 30, 30, 30, 35, 70, 55, 40, 45, 60, 45, 40, 40, 70, 50, 55, 35, 35, 25, 30, 25, 25],
    [20, 20, 20, 25, 35, 35, 30, 55, 50, 35, 40, 55, 50, 45, 35, 75, 66, 55, 35, 35, 30, 25, 25, 25],
    [35, 25, 25, 20, 25, 25, 40, 60, 45, 35, 40, 50, 40, 45, 35, 70, 60, 50, 30, 30, 25, 25, 30, 30],
    [30, 20, 20, 20, 30, 35, 40, 55, 50, 45, 45, 50, 45, 40, 35, 75, 66, 50, 35, 35, 25, 30, 35, 30],
    [33, 35, 35, 30, 30, 35, 35, 60, 55, 40, 45, 60, 55, 45, 35, 70, 66, 55, 30, 35, 30, 25, 25, 25],
    [30, 25, 25, 30, 25, 30, 35, 68, 45, 40, 40, 55, 40, 40, 40, 75, 55, 50, 35, 30, 25, 30, 25, 30],
    [20, 30, 30, 35, 25, 25, 35, 75, 45, 45, 45, 55, 40, 45, 40, 70, 55, 55, 30, 35, 30, 25, 30, 30],
    [25, 25, 25, 25, 35, 30, 35, 80, 50, 45, 40, 60, 50, 40, 35, 70, 66, 50, 35, 30, 30, 30, 30, 25],
    [20, 30, 30, 20, 35, 30, 35, 70, 55, 40, 40, 55, 45, 40, 40, 70, 50, 55, 35, 35, 25, 30, 25, 25],
    [35, 25, 25, 35, 25, 25, 30, 65, 50, 35, 45, 50, 50, 45, 35, 75, 50, 55, 35, 35, 30, 25, 25, 25],
    [25, 20, 20, 35, 25, 30, 40, 55, 50, 40, 45, 55, 45, 45, 35, 70, 66, 50, 30, 30, 25, 25, 30, 30],
    [30, 25, 25, 30, 35, 30, 35, 75, 55, 40, 40, 60, 45, 40, 35, 75, 60, 50, 35, 35, 25, 30, 35, 30],
    [25, 30, 30, 25, 35, 35, 30, 70, 50, 35, 45, 55, 50, 45, 35, 70, 67, 55, 30, 35, 30, 25, 25, 25],
    [30, 35, 35, 25, 30, 25, 40, 50, 45, 35, 40, 50, 45, 40, 40, 75, 50, 50, 35, 30, 25, 30, 25, 30],

]

Killed = [
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
    False,
]


# The callback for when a PUBLISH message is received fr`om the server.
def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))




# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
# client.loop_forever()

i = 0

Dummy_Locations = [
    '71EFF100-A255-4472-8D8E-BF6B807DFB1F',
    'F7D78948-BB7A-4D3E-80CE-116251BC4C61',
    '946B725F-03DF-4B45-BCAE-44C687B3311E',
    '2A48F700-CB07-4C9C-B65D-9C39D78A92BA',
    'FEF69594-642F-40E0-BF26-654B469FBA3A',
    'F28FDF1D-53EA-4D13-9DEA-F200DA65F2A1',
    '9A833D0F-14B4-47BB-9A1A-5336083B2B38',
    '2D293839-23E7-493C-9AAC-4D8DC977581A',
    'FCF1F3E5-3985-4B55-8AED-06E18BF63BC0',
    '3EF362D1-B764-4733-80B6-C14D3F3CF911',
    '641CC884-0EC7-456C-8CC9-69A467BC902E',
    '8101840C-1BD6-4805-94BC-AB4D803AAD0D',
    'CF37D9C0-3BFB-42BE-90FF-C348144786DE',
    'D62FE479-59B6-4C0D-BFE2-843F627CAFF1',
    '5771DFB5-F63E-4C3E-9E79-6CB53C792111',
    'D0F17A5B-5716-4881-8A7C-304F62BD8B09',
    '441BCFC6-C22A-4767-A7FC-702DF83BA70D',
    'C3D53AF9-ECEE-4FC2-B347-E9878936821F',
    'EC3A9FE6-E3C2-4D6A-B2CA-C459063A3463',
    '32690543-4AC1-4F98-9A0F-46254A15505F',
    'E5C97ACC-CC96-4306-BEF8-63189BA5BB47',
    'FF95EE43-C8EE-4E29-A934-F8A085639C8B',
    '778D42C0-E80E-4D6F-B8E0-4041421783D9',
    '45C65EAC-CACD-412A-9890-D76DB8E9106B',
    '3EB2A919-C98F-44F1-B34B-56227CC102A9',
    'A7445BB3-C150-4054-8917-70F18B050C8C',
    '3275B534-2445-40A4-9B45-3891A67E7A90',
    '0574A43E-212C-4204-9DC2-B4F800C73942',
    '1AC0E41C-53FC-4437-A11F-6B8C9B3ECC1D',
    'BE591906-3197-4339-8DE9-1A7F8FC7F3D5',
    '0EA1A4CE-AB3A-4C27-9E20-8869BD57622C',
    '4EE07592-7CD9-4960-BD66-B6C59B8A826E',
    '7E4AB703-5A60-4847-A96D-C64D7CFE80EB',
    'CB01B72D-8CD8-4A88-ADF0-D4716350AC5F',
    '0022C514-99F3-4105-9A5B-34250F649625',
    '39F1FAB3-6F90-4306-97A4-388E6025C78E',
    '232A98C9-0763-4895-A3AD-C81B0C399B72',
    '5EC51147-5488-49E2-8D4B-45B1495BC17C',
    'F8F35372-FC29-403E-A0B7-C304C04C2531',
    '23A93D83-213D-4443-91BE-B02646D87FFB',
    'B54E5A1A-F070-4A3C-984D-6D318F9BD296',
    '86761CC0-AC84-408E-821D-F1EE7185B8FD',
    'FA3D96A2-2870-4F22-86F8-E1391D508AD1',
    '7830770B-E705-42DC-B3A3-EFF9E940F670',
    '13892D73-869E-4B4E-B42D-A89B7110DCD1',
    '0963A96E-87C2-4409-9D39-D2F758BAC1E3',
    '1DD2B4CF-DBF4-44A9-B356-6E2C02AF626D',
    '64C7B708-5CF9-45C2-8C48-23AA0542D396',
    '469F372A-8370-4F03-B6B4-C58A2B9F3A62',
    'C8578097-3F7B-418E-B576-ED5AC2116A98',

]


def option1():
    try:
        node = input("Select node to kill (" + str(len(Locations)) + " available):")
        node =int(node)
        if node > len(Killed):
            print("Node exceeds length limit")
            return
        Killed[node] = True
    except e:
        pass


global ind
ind =0

def option2():
    global ind
    no = input("How many nodes would you like to add (max 5):")
    try:
        no=int(no)
        if no > 5:
            print("Value exceeded maximum amount")
            pass
        for i in range(ind, ind + no):
            GUIDs.append(Dummy_Locations[i])
            lst = []
            for hr in range(24):
                lst.append(randint(0,101))
            Hours.append(lst)
            latitude=random.uniform(45.764973,45.804206)
            longitude=random.uniform(24.129704,24.19118869)
            print(str(latitude)+" "+str(longitude))
            coord=[]
            coord.append(latitude)
            coord.append(longitude)
            Locations.append(coord)
            Killed.append(False)
    except e:
        pass
    ind += no



def Thread():
    while True:
        option = input("1)KILL NODE \n2) ADD NODE\n3)Kill ALL")
        option =int (option)
        if option == 1:
            option1()
        elif option==2:
            option2()
        elif option==3:
            print("Killed all nodes")
            for i in range(len(Killed)-1):
                Killed[i]=True


print("Starting loop")
t1 = threading.Thread(target=Thread, args=[])
t1.start()
client = mqtt.Client()
# client.on_message = on_message

while True:
    sleep(1)
    i = i % 24
    if i==0:
        client.connect("m2m.eclipse.org", 1883, 60)
    client.publish("hacktmsibiu", str(i))
    for index in range(len(Locations)-1):
        client.publish("hacktmsibiu/" + GUIDs[index] + "/coord",
                       str(Locations[index][0]) + ";" + str(Locations[index][1]))
        chance = randint(0, 100)
        client.publish("hacktmsibiu/" + GUIDs[index] + "/value", Hours[index][i] if Killed[index]==False else -1)
    i += 1
    if i==24:
        client.disconnect()

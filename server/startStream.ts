import * as dgram from "dgram";

const SEND_COMMAND_PORT = 8889;
const DRONE_IP_ADDRESS = "192.168.10.1";

const udpServer = dgram.createSocket("udp4");
udpServer.send("command", SEND_COMMAND_PORT, DRONE_IP_ADDRESS);
udpServer.send("streamon", SEND_COMMAND_PORT, DRONE_IP_ADDRESS);

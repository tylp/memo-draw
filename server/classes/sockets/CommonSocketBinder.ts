import Application from "../Application";
import SocketBinder from "./SocketBinder";

export default class CommonSocketBinder extends SocketBinder {
    static bindSocket(socket): void {
        console.log("nègreo")
        this.onStartSession(socket);

    }
    
    private static onStartSession(socket) {
        console.log("i guess")
        socket.on("start-session", (ack) => {
            console.log("ack")
            console.log("goooo")
            ack(Application.getInstance().sessionStore.getNewSession());
        })
    }
}
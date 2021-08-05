import Application from "../Application";
import SocketBinder from "./SocketBinder";

export default class CommonSocketBinder extends SocketBinder {
    static bindSocket(socket): void {
        if(!this.socketHasSession(socket)) {
            this.sendSessionToSocket(socket);
        }

        this.onGetSessionContent(socket);
        this.onUpdateProfile(socket);
    }

    private static socketHasSession(socket) {
        return !!socket.handshake.auth.sessionID
    }

    private static sendSessionToSocket(socket) {
        const session = Application.getInstance().sessionStore.getNewSession();
        socket.emit("session", session)
        socket.handshake.auth.sessionID = session.sessionID;
    }

    private static onGetSessionContent(socket) {
        socket.on("get-session-content", (ack) => {
            ack(Application.getInstance().getSocketSession(socket));
        })
    }

    private static onUpdateProfile(socket) {
        socket.on("update-profile", (profile, ack) => {
            console.log(profile, ack);
            ack();
            Application.getSessionStorage().updateProfile(socket.handshake.auth.id, profile);
        })
    }
}
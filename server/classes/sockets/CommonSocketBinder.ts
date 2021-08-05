import SocketIdentifierService from "../../services/SocketIdentifierService";
import Application from "../Application";
import SocketBinder from "./SocketBinder";

export default class CommonSocketBinder extends SocketBinder {
    static bindSocket(socket): void {
        if (!this.socketHasSession(socket)) {
            this.sendSessionToSocket(socket);
        }

        this.onUpdateProfile(socket);
    }

    private static socketHasSession(socket) {
        return !!socket.handshake.auth.sessionId
    }

    private static sendSessionToSocket(socket) {
        const session = Application.getInstance().sessionStore.getNewSession();
        socket.emit("session", session)
        socket.handshake.auth.sessionId = session.sessionId;
        socket.handshake.auth.playerId = session.playerId;
    }

    private static onUpdateProfile(socket) {
        socket.on("update-profile", (profile, ack) => {
            ack();
            Application.getSessionStorage().updateProfile(SocketIdentifierService.getSessionIdentifier(socket), profile);
        })
    }
}
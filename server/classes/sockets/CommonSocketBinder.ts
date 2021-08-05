import { Socket } from 'socket.io';
import SocketIdentifierService from "../../services/SocketIdentifierService";
import Application from "../Application";
import SocketBinder from "./SocketBinder";

export default class CommonSocketBinder extends SocketBinder {
    static bindSocket(socket: Socket): void {
        if (!this.socketHasSession(socket)) {
            this.sendSessionToSocket(socket);
        }

        this.onUpdateProfile(socket);
    }

    private static socketHasSession(socket: Socket) {
        const sessionId = SocketIdentifierService.getSessionIdentifier(socket);
        return !!sessionId && Application.getSessionStorage().exists(sessionId)
    }

    private static sendSessionToSocket(socket: Socket) {
        const session = Application.getInstance().sessionStore.getNewSession();
        socket.emit("new-session", session)
        socket.handshake.auth.sessionId = session.sessionId;
        socket.handshake.auth.playerId = session.playerId;
    }

    private static onUpdateProfile(socket: Socket) {
        socket.on("update-profile", (profile, ack) => {
            ack();
            Application.getSessionStorage().updateProfile(SocketIdentifierService.getSessionIdentifier(socket), profile);
        })
    }
}
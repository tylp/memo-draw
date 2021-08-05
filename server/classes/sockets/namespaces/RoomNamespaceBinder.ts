import { Server } from 'socket.io';
import CommonSocketBinder from '../CommonSocketBinder';
import RoomSocketBinder from '../RoomSocketBinder';
import AbstractNamespaceBinder from './AbstractNamespaceBinder';

export default class RoomNamespaceBinder extends AbstractNamespaceBinder {
    protected static applyEvents(): void {
        this.io.of("/room").on("connection", (socket) => {
            CommonSocketBinder.bindSocket(socket);
            RoomSocketBinder.bindSocket(socket);
        });
    }
}
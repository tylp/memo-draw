import CommonSocketBinder from '../CommonSocketBinder';
import GameSocketBinder from '../GameSocketBinder';
import RoomSocketBinder from '../RoomSocketBinder';
import AbstractNamespaceBinder from './AbstractNamespaceBinder';

export default class RoomNamespaceBinder extends AbstractNamespaceBinder {
    protected static applyEvents(): void {
        this.io.of("/room").on("connection", (socket) => {
            CommonSocketBinder.bindSocket(socket);
            RoomSocketBinder.bindSocket(socket);
            GameSocketBinder.bindSocket(socket);
        });
    }
}
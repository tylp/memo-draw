import { Server } from 'socket.io';
import IdGeneratorService from '../../../services/IdGeneratorService';
import Application from '../../Application';

import CommonSocketBinder from '../CommonSocketBinder';
import IndexSocketBinder from '../IndexSocketBinder';
import RoomSocketBinder from '../RoomSocketBinder';
import AbstractNamespaceBinder from './AbstractNamespaceBinder';

export default class RoomNamespaceBinder extends AbstractNamespaceBinder {
    protected static applyMiddlewares(): void {
        this.io.use((socket, next) => {
            const sessionID = socket.handshake.auth.sessionID;

            if (!sessionID) {
                return next(new Error("User was never logged-in."));
            }

            next();
        });
    }

    protected static applyEvents(): void {
        this.io.on("connection", (socket) => {
            CommonSocketBinder.bindSocket(socket);
            RoomSocketBinder.bindSocket(socket);
        });
    }
}
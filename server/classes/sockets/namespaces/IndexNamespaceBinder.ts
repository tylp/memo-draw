import CommonSocketBinder from '../CommonSocketBinder';
import IndexSocketBinder from '../IndexSocketBinder';
import AbstractNamespaceBinder from './AbstractNamespaceBinder';

export default class IndexNamespaceBinder extends AbstractNamespaceBinder {
    protected static applyMiddlewares(): void {
        // this.io.use((socket, next) => {
        //     const sessionID = socket.handshake.auth.sessionID;

        //     if (!sessionID) {
        //         return next(new Error("User was never logged-in."));
        //     }

        //     next();
        // });
    }

    protected static applyEvents(): void {
        console.log("satqdqs")
        this.io.on("connection", (socket) => {
            console.log("connection")
            CommonSocketBinder.bindSocket(socket);
            IndexSocketBinder.bindSocket(socket);
        });
    }
}
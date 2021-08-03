import { Server } from 'socket.io';
export default abstract class AbstractNamespaceBinder {
    protected static io: Server;

    public static bindServer(io: Server): Server {
        this.io = io;

        this.applyMiddlewares();
        this.applyEvents();
        
        return this.io;
    }

    protected static applyMiddlewares(): void {
        //
    }

    protected static applyEvents(): void {
        //
    }
}
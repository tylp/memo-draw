import Application from '../../Application';
import CommonSocketBinder from '../CommonSocketBinder';
import IndexSocketBinder from '../IndexSocketBinder';
import AbstractNamespaceBinder from './AbstractNamespaceBinder';

export default class IndexNamespaceBinder extends AbstractNamespaceBinder {
    protected static applyEvents(): void {
        this.io.on("connection", (socket) => {
            CommonSocketBinder.bindSocket(socket);
            IndexSocketBinder.bindSocket(socket);
        });
    }
}
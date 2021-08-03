export default abstract class SocketBinder {
    static bindSocket(socket) {
        throw new Error("Missing method: bindSocket in " + this.constructor.name);
    }
}
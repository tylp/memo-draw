export default class RoomService {
    public static getRoomIdFromUrl(url) {
        const split = url.toString().split("/");
        return split[split.length-1];
    }
}
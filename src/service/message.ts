export class MessageService {

    post(msg) {
        window.parent.postMessage(msg, '*');
    }

}
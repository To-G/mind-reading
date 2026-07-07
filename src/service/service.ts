import { useStore } from './store';
import { FileService } from './file';
import { Singleton } from './singleton';
import { TrackService } from './track';
import { MessageService } from './message';
import { GlobalService } from './global';

export class S {

    static get File() {
        return Singleton.make('File', FileService)
    }

    static get Track() {
        return Singleton.make('Track', TrackService)
    }

    static get Global() {
        return Singleton.make('Global', GlobalService)
    }

    static get Msg() {
        return Singleton.make('Msg', MessageService)
    }

    static get Store() {
        return useStore()
    }
}
import { useStore } from './store';
import { FileService } from './file';
import { Singleton } from './singleton';
import { TrackService } from './track';
import { MessageService } from './message';

export class S {

    static get File() {
        return Singleton.make('File', FileService)
    }

    static get Track() {
        return Singleton.make('Track', TrackService)
    }


    static get Msg() {
        return Singleton.make('Msg', MessageService)
    }

    static get Store() {
        return useStore()
    }
}

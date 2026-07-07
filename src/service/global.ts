import { Singleton } from './singleton';

declare global {
    interface Window {
        MzoneGlobal: {
            default: {
                Global: any;
                DeviceMedia: any;
            };
        };
    }
}

export class GlobalService {

    instance: any;
    trackKey = 'learning_class_gene_msg_h5';
    private initialized = false;

    constructor() {
        this.ensureInstance();
    }

    private ensureInstance() {
        if (this.initialized) return;

        const MzoneGlobal = window.MzoneGlobal;
        if (MzoneGlobal && MzoneGlobal.default) {
            const { Global } = MzoneGlobal.default;
            this.instance = new Global(this.trackKey);
            this.initialized = true;
            console.log('[MzoneGlobal] 初始化成功');
        } else {
            console.warn('[MzoneGlobal] SDK 尚未挂载，稍后重试...');
            this.instance = null;
        }
    }

    get available() {
        this.ensureInstance();
        return !!this.instance;
    }

    get userInfo() {
        this.ensureInstance();
        return this.instance?.userInfo || {};
    }

    get scale() {
        this.ensureInstance();
        return this.instance?.scale || 1;
    }

    get isTeacher() {
        this.ensureInstance();
        return this.instance?.isTeacher || false;
    }

    resize(width: number, height: number) {
        this.ensureInstance();
        this.instance?.resize(width, height);
    }

    ide(system: 'morton' | 'ide', completed: (config?: any, userInfo?: any) => void) {
        this.ensureInstance();
        if (this.instance) {
            this.instance.ide(system, completed);
        } else {
            completed({}, {});
        }
    }

    init(system: 'morton' | 'ide', option: { images?: string[]; fonts?: string[] }, completed: () => void) {
        this.ensureInstance();
        if (this.instance) {
            this.instance.init(system, option, completed);
        } else {
            completed();
        }
    }

    trackComplete() {
        this.ensureInstance();
        this.instance?.trackComplete();
    }

    track(key: string, context: object = {}) {
        this.ensureInstance();
        if (this.instance && this.instance.track) {
            this.instance.track(key, context);
        } else {
            console.log('[Mock Track]', key, context);
        }
    }

    trackWithUser(key: string, context: object = {}) {
        this.ensureInstance();
        const userInfo = this.userInfo;
        this.track(key, {
            userId: userInfo.userId,
            classId: userInfo.classId,
            questionId: userInfo.questionId,
            unitId: userInfo.unitId,
            subjectId: userInfo.subjectId,
            ...context
        });
    }

    loading(open: boolean) {
        this.ensureInstance();
        this.instance?.loading(open);
    }

    query(key: string) {
        this.ensureInstance();
        return this.instance?.query(key) || null;
    }

    destroy() {
        this.ensureInstance();
        this.instance?.destroy();
    }
}

export const useGlobal = () => {
    return Singleton.make('Global', GlobalService);
};
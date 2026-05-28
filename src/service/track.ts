// Mock 版本的分析 SDK（用于本地开发）
const analysisSdk = {
    init: (config: any) => {
        console.log('[Mock SDK] 初始化分析服务:', config)
    },
    track: (key: string, data: any) => {
        console.log('[Mock SDK] 埋点:', key, data)
    }
}

import { Config } from "./config";
import { Request } from "./request";
import { useStore } from "./store";

export class TrackService {

    store
    req: Request;

    constructor() {
        this.store = useStore()
        this.req = Request.Load();
    }

    init() {
        // 使用 mock SDK
        analysisSdk.init({
            env: "production",
            version:"0.0.1",
            product: "coding", 
            sensors: true,
            inside: false,
            appoint: 'window', 
            logs: false,
            geolocation: { 
                latitude: "",
                longitude: ""
            },
            onFilterTrackingData: (trackingData: any) => {
                const { data, basic } = trackingData
                basic.uuid = 'custimized from basic field'
                return trackingData
            },
            testing: "https://datacenter.testing.hetao101.com/app/eventdata/transfer/v1",
        })
    }

    track(key: string, context: object) {
        analysisSdk.track(key, {
            context: context
        });
    }

    trackWithUser(key: string, context: object = {}) {
        key = key.replace(/-/g, '_')
        console.log("SDK Track::", key)
        analysisSdk.track(key, {
            context: {
                userId: this.store.user.id,
                classId: this.store.user.classId,
                questionId: this.store.user.questionId,
                unitId: this.store.user.unitId,
                subjectId: this.store.user.subjectId,
                ...context
            }
        })
    }

    trackForExp(key: string, content: object = {}) {
        // 本地开发时跳过网络请求
        console.log('[Mock TrackForExp]', key, content)
        // this.req.post(Config.domainExp + '/experience-class-service/tracks', {
        //     userId: this.store.user.id,
        //     classId: this.store.user.classId,
        //     questionId: this.store.user.questionId,
        //     unitId: this.store.user.unitId,
        //     subjectId: this.store.user.subjectId,
        //     key: key,
        //     content: content
        // })
    }

}
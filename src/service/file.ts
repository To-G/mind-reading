import promiseFinally from 'promise.prototype.finally'; // 必须要用，老的安卓pad上没有这接口
import OSS from 'ali-oss'; // 需要锁定版本，新版本在pad上有坑。
import { useStore } from "./store";


export class FileService {

    store: ReturnType<typeof useStore> = useStore();

    upload(file: File, fileName: string) {

        const uploadUrl = `https://api.hetao101.com/einstein-logic/v1/oss/uptoken?userId=${this.store.user.id}`;

        return fetch(uploadUrl).then(r => r.json()).catch((e) => {
            return Promise.reject(e)
        }).then((r) => {

            const {accessKeyId, accessKeySecret, securityToken} = r.data.aliyun;

            const client = new OSS({
                region: 'oss-accelerate',
                accessKeyId: accessKeyId,
                accessKeySecret: accessKeySecret,
                stsToken: securityToken,
                refreshSTSTokenInterval: 300000,
                bucket: 'ppt-hetao'
            });

            const objectKey = `cpp-h5/${this.store.user.id}-${new Date().getTime()}-${fileName}`;

            return client.put(objectKey, file).then(() => {
                return `https://ppt-hetao.oss-accelerate.aliyuncs.com/${objectKey}`
            })

        })

    }   

    get(url: string) {
        return fetch(url).then(r => r.json())
    }

}

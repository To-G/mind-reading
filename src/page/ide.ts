import { useRoute, useRouter } from "vue-router";
import { useStore } from "../service/store";
import { onMounted } from "vue";
import { S } from "../service/service";
import WebFont from 'webfontloader'

export enum PageType {
    EDITOR,
    SHARE
}

export const useIDE = (classKey: string, completed: (content?) => void) => {

    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const type = {"editor": PageType.EDITOR, "share": PageType.SHARE}[String(route.query.type)] || PageType.EDITOR;
    const channel = Number(route.query.channel || 0)
    
    let url = String(route.query.content)

    onMounted(() => {

        if (type == PageType.SHARE) {

            if (url.indexOf("http") != 0) {
                url = "https://ppt-hetao.oss-accelerate.aliyuncs.com/b2c-h5/" + url
            }

            S.File.get(url).then((r) => {

                store.user = r.user || {
                    id: Number(url.split('/').pop()?.split('-')[0])
                }

                operationStart()

                completed(r)
                store.pageLoaded()
            }).catch(() => {
                router.replace('/page/error')
            })

            
        }
        else {
            console.log("发送Ready消息")
            S.Msg.post({
                source: 'h5',
                cmd: 'ready',
            })
            completed()
        }        
    })

    const operationStart = () => {
        const trackKey = `learning-${type == PageType.SHARE ? 'report' : 'class'}-cpp2-h5-view`
        S.Track.trackWithUser(trackKey)
        S.Track.trackForExp(trackKey + '-' + classKey)

        if (type == PageType.SHARE) {
            S.Track.trackWithUser(trackKey + '-channel-' + channel)
            S.Track.trackForExp(trackKey + '-' + classKey + '-channel-' + channel)
        }
    }

    const operationEnd = () => {
        const trackKey = `learning-${type == PageType.SHARE ? 'report' : 'class'}-cpp2-h5-complete-operation`
        S.Track.trackWithUser(trackKey)
        S.Track.trackForExp(trackKey + '-' + classKey)

        if (type == PageType.SHARE) {
            S.Track.trackWithUser(trackKey + '-channel-' + channel)
            S.Track.trackForExp(trackKey + '-' + classKey + '-channel-' + channel)
        }
    }

    const operationClose = () => {
        const trackKey = `learning-${type == PageType.SHARE ? 'report' : 'class'}-cpp2-h5-close`
        S.Track.trackWithUser(trackKey)
        S.Track.trackForExp(trackKey + '-' + classKey)
    }

    return { store: store, type, url, operationStart, operationEnd, operationClose }
}

export const preload = (fonts: string[], completed: () => void) => {

    console.log('preload')
   
    WebFont.load({
        custom: {
            families: fonts
        },
        active: () => {
            console.log('active')
            completed()
        },
        inactive: () => {
            completed()
            console.log('inactive')
        }
    });
}

export const saveResult = (name, content, completed) => {

    const store = useStore();
    const { token, ...rest } = store.user;

    const c = JSON.stringify({
        ...content,
        user: rest,
    });
    const fileName = name + ".json";
    const blob = new Blob([c], { type: 'text/plain' });
    const file = new File([blob], fileName, { type: blob.type });

    S.File.upload(file, fileName).then((url) => {

        S.Msg.post({
            cmd: 'updateSnapshot',
            content: url
        })

        completed(url)
    })
}

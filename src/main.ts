import { createApp, h } from "vue";
import { RouterView } from "vue-router";
import { Router } from "./page/router";
import { createPinia } from 'pinia'
import Page from './component/Page.vue';
import 'animate.css';
import './style.less'
import "amfe-flexible"
import { S } from "./service/service";

const p = createPinia()

const app = createApp({

    setup() {

        const isTouch = ("ontouchstart" in window) ? true : false;
        document.body.classList.add(isTouch ? 'touch-screen' : 'pc-screen');

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isSafari) {
            document.body.classList.add('safari');
        }

        const resize = () => {

            const width = document.documentElement.clientWidth
            const height = document.documentElement.clientHeight

            console.log("width / height ::", width, height)

            if (width < height * 0.7) {
                document.body.classList.add('vertical-screen');
                S.Store.page.type = 1
                if (location.href.indexOf('type=share') == -1) {
                    document.body.classList.remove('pc-modal');
                }

                ['mind-reading'].forEach(v => {
                    if (location.href.indexOf('c2/' + v) > 0) {
                        document.querySelector('html').style.fontSize = width / 3.9 + 'px';
                    }
                })

            }
            else {
                document.body.classList.remove('vertical-screen');

                if (location.href.indexOf('type=share') == -1) {
                    document.body.classList.add('pc-modal');

                    if (location.href.indexOf('enable_frame=1') > 0) {
                        
                    }
                    else {
                        document.body.classList.add('pc-frame'); 
                    }

                    let size = 160;
                    if (width < 1100) {
                        size = width / 7;
                    }

                    if (width / height > 1.5) {
                        size = height / 4.8;
                    }

                    console.log("size ::", size)

                    document.querySelector('html').style.fontSize = size + 'px';
                }
            }
        
        }

        resize()
        window.addEventListener('resize', resize);

        return () => h(RouterView)
    },
}).use(Router).use(p);

// 初始化埋点
S.Track.init()

// 监听事件
console.log("初始化事件监听")

const IDE_CMDS = new Set(['mind-reading', 'onClickClose'])

window.addEventListener('message', (event) => {
    const data = event.data
    if (!data || typeof data !== 'object' || !data.cmd) {
        return
    }

    // 忽略 H5 自己 post 的 ready，避免空转
    if (data.cmd === 'ready' && data.source === 'h5') {
        return
    }

    console.log("接收到消息::", event)

    if (data.cmd === 'userInfo') {
        const { userId, token, classId, questionId, unitId, subjectId } = data.content

        S.Store.user.id = Number(userId)
        S.Store.user.token = token
        S.Store.user.classId = Number(classId)
        S.Store.user.questionId = Number(questionId)
        S.Store.user.unitId = Number(unitId)
        S.Store.user.subjectId = Number(subjectId)
    } else if (IDE_CMDS.has(data.cmd)) {
        S.Store.event = data
    }
})

app.component('page', Page);
app.mount("#app");

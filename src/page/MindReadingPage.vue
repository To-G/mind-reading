<template lang="pug">
page.mind-reading-page(
    :closeTip='p.closeTip'
    :logs='logs'
    )
    div.preload(v-if='store.page.loading')
        img(src="../asset/mind-reading/tips-bg.png")
        img(src="../asset/mind-reading/result-bg.png")
    div.panel(ref='panelRef' v-else)
        div.step.step-0(v-if='p.step == 0')
            span.title
            button.btn-next(@click='p.step = 1') 开始
        div.step.step-1(v-if='p.step == 1')
            span 欢迎来到我的世界
            button.btn-next(@click='p.step = 2') 继续
        div.step.step-2(v-if='p.step == 2')
            span 从
                b 10-99
                | 之间任选一个数，
                br
                | 默默记在心中!
            button.btn-next(@click='p.step = 3') 继续
        div.step.step-3(v-if='p.step == 3' :class='{"show-tips": p.tips}')
            span 把你心中的两位数, 
                br
                b 减去个位
                | 的数字
                em(@click='p.tips = true') 怎么算？
            button.btn-next(@click='next(4)') 继续
            div.tips(v-if='p.tips')
                label 例如：如果你选的是 25，
                    br
                    | 那就用 2
                    b 5
                    |-
                    b 5
                    | =20
                button.btn-next(@click='p.tips = false') 明白了
        div.step.step-4(v-if='p.step == 4' :class='{"show-tips": p.tips}')
            span 再
                b 减去十位的数字，
                br
                | 记住你算的结果！
                em(@click='p.tips = true') 怎么算？
            button.btn-next(:style='{visibility: p.showContinue4 ? "visible" : "hidden"}' @click='next(5)') 继续
            div.tips(v-if='p.tips')
                label 例如：20的十位数是2
                    br
                    | 就要用 
                    b 2
                    | 0-
                    b 2
                    br
                button.btn-next(@click='onStep4TipsClose') 明白了
        div.step.step-5(v-if='p.step == 5')
            span 找到结果
                i 数字对应的图案，
                br
                | 牢记在心中！
            button.btn-next(@click='p.step = 6') 继续
        div.step.step-6(v-if='p.step == 6')
            div.items(ref='itemsRef')
                div.item(v-for='item in p.icons') 
                    label {{ item.index < 10 ? '0' + item.index : item.index }}
                    img(:src='`${AssetURL(`mind-reading/${item.icon}.png`)}`')
            div.scroll-bar
                em(:style='{marginTop: `calc(var(--size-1) * 26 * ${p.scrollTop})`}')
            button.btn-next(@click='timeout()' v-if='content.mode == 1') 记住了
        div.step.step-result(v-if='p.step == 7')
            div.title 注视水晶球
            div.timeout(:class='`timeout-${p.timeout}`')
        div.step.step-result(v-if='p.step == 8')
            div.title 你心中所想的是
            div.result-icon
                img(:src='`${AssetURL(`mind-reading/${p.resultIndex}.png`)}`')
            button.btn-next(@click='p.step = 0' v-if='content.restartBtn == "1"') 再试一次
        
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick } from 'vue';
import { useIDE, PageType, preload, saveResult } from './ide';
import { S } from '../service/service';
import Voice1MP3 from '../asset/mind-reading/voice/1.mp3'
import Voice2MP3 from '../asset/mind-reading/voice/2.mp3'
import Voice3MP3 from '../asset/mind-reading/voice/3.mp3'
import Voice4MP3 from '../asset/mind-reading/voice/4.mp3'
import Voice4_1MP3 from '../asset/mind-reading/voice/4-1.mp3'
import Voice4_1_1MP3 from '../asset/mind-reading/voice/4-1-1.mp3'
import Voice4_2MP3 from '../asset/mind-reading/voice/4-2.mp3'
import Voice5MP3 from '../asset/mind-reading/voice/5.mp3'
import Voice7MP3 from '../asset/mind-reading/voice/7.mp3'
import Voice8MP3 from '../asset/mind-reading/voice/8.mp3'
import BgmMP3 from '../asset/mind-reading/bgm.mp3'
import { useRoute } from 'vue-router';
import { AssetURL } from '../helper/asset';
const final = String(useRoute().query.final) == '1'

const itemsRef = ref(null)
const logs = ref<any[]>([])

const voices = {
    1: Voice1MP3,
    2: Voice2MP3,
    3: Voice3MP3,
    4: Voice4MP3,
    5: Voice5MP3,
    7: Voice7MP3,
    8: Voice8MP3,
}

const p = reactive({
    step: 0,
    tips: false,
    showContinue4: false,
    timeout: 3,
    resultIndex: 0,
    icons: Array.from({ length: 99 }, (_, index) => {
        return {
            index: index + 1,
            icon: index,
        }
    }),
    closeTip: false,
    scrollTop: 0,
})

const content = reactive({
    icon: [],
    mode: 0,
    icon9: 0,
    restartBtn: '0'
})

const { store, type, operationStart, operationEnd, operationClose } = useIDE('1', (c) => {

    if (type == PageType.SHARE) {
        init(c)
    }
})

watch(() => store.event, (event) => {

    if (type == PageType.SHARE) {
        return
    }

    if (event.cmd == "onClickClose") {
        S.Msg.post({
            cmd: 'onCloseAndPassed',
        })

        operationClose()
        return
    }

    if (event.cmd != 'mind-reading') {
        return
    }

    event.content.icon = String(event.content.icon).split(',').filter((item, index, arr) => {
        return item.length > 0 && arr.indexOf(item) == index
    })

    init(event.content)

    operationStart()

    saveResult('c2-mind-reading', content, (url) => {

    })
})

const init = (c) => {

    content.icon = typeof c.icon === 'string' 
        ? c.icon.split(',').filter((item, index, arr) => item.length > 0 && arr.indexOf(item) == index)
        : c.icon
    content.mode = Number(c.mode) || 0
    content.icon9 = Number(c.icon9) || 0
    content.restartBtn = c.restartBtn

    preload(['AliFont'], () => {
        
        store.pageLoaded()

        store.page.bgmAudio.src = BgmMP3
        store.page.bgmAudio.volume = 0.1
    })
}

// 开发环境下直接在浏览器打开时，自动 mock 一次 mind-reading 事件
if (import.meta.env.DEV && type == PageType.EDITOR) {
    init({
        icon: '1,2,3,4,5,6,7,8,9,10',
        mode: '1',
        icon9: '0',
        restartBtn: '1',
    })
}

const create = () => {

    if (content.icon.length < 2) {
        p.resultIndex = 0
    }

    const icons = content.icon.filter(i => Number(i) != p.resultIndex)
    p.resultIndex = Number(icons[Math.floor(Math.random() * icons.length)])

    let last = p.resultIndex

    p.icons.forEach((item) => {

        if (content.icon9 > 0 && item.index == 9) {
            item.icon = content.icon9
            return
        }
    
        if (content.icon9 == 0 && item.index % 9 == 0 && item.index < 82) {
            item.icon = p.resultIndex
        }
        else {
            const indexs = Array.from({ length: 10 }, (_, i) => i + 1).filter(i => {
                return i !== last && i !== p.resultIndex && i != content.icon9
            })
            item.icon = indexs[Math.floor(Math.random() * indexs.length)]
        }

        last = item.icon
    })
}

const next = (step: number) => {
    p.step = step
    p.tips = false  
}

const onStep4TipsClose = () => {
    p.tips = false
    // 播放 4-2.mp3，结束后显示"继续"按钮
    store.page.actAudio.src = Voice4_2MP3
    store.page.actAudio.play()
    store.page.actAudio.onended = () => {
        store.page.actAudio.onended = null
        p.showContinue4 = true
    }
}

const timeout = () => {
    p.step = 7
    p.timeout = 3

    const timer = setInterval(() => {
        p.timeout--
        if (p.timeout == 0) {
            p.step = 8
            clearInterval(timer)
        }
    }, 1000)

}

const scroll = () => {
    if (itemsRef.value) {
        const rect = itemsRef.value.getBoundingClientRect()
        p.scrollTop = itemsRef.value.scrollTop/(itemsRef.value.scrollHeight-rect.height)
    }
}


watch(() => p.step, (step) => {

    if (itemsRef.value) {
        itemsRef.value.removeEventListener('scroll', scroll);
    }

    if (step == 1) {
        store.page.bgmAudio.play()
    }

    if ([1, 2, 3, 5, 7, 8].includes(step)) {
        store.page.actAudio.src = voices[step]
        store.page.actAudio.play()
    }

    if (step == 4) {
        p.showContinue4 = false
        p.tips = false
        // 播放 4-1.mp3，结束后播放 4-1-1.mp3 并展示 tips 窗口
        store.page.actAudio.src = Voice4_1MP3
        store.page.actAudio.play()
        store.page.actAudio.onended = () => {
            store.page.actAudio.onended = null
            store.page.actAudio.src = Voice4_1_1MP3
            store.page.actAudio.play()
            p.tips = true
        }
    }

    if (step == 6) {
        create()
        nextTick(() => {
            itemsRef.value.addEventListener('scroll', scroll);
        })
    }

    if (step == 8) {
        p.closeTip = true

        if (final) {
            S.Track.trackForExp('cpp_h5_c2_1_end', {})
        }

        operationEnd()
    }

    if (content.mode == 0 && step == 6) {
        p.closeTip = true
    }
})

</script>

<style lang="less">
.mind-reading-page {
    width: 1200px;
    height: 700px;
    position: absolute;
    top: calc(50% - 350px);
    left: calc(50% - 600px);

    .panel {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        position: relative;
        background: url(../asset/mind-reading/bg.png) no-repeat;
        background-size: cover;
        background-position: center;
        user-select: none;

        .step {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding-top: 80px;
            background: url(../asset/mind-reading/center-bg.png) no-repeat;
            background-size: auto 542px;
            background-position: center 80px;

            &.step-0 {
                background: none;
                button.btn-next {
                    margin-top: 182px;
                }
            }

            &.step-1 {
                background: none;
                span {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            &.step-3 {
                span {
                    position: relative;
                    em {
                        display: block;
                        width: 107px;
                        height: 44px;
                        background: url(../asset/mind-reading/text-tips-bg.png) no-repeat;
                        background-size: cover;
                        background-position: center;
                        position: absolute;
                        top: 86px;
                        left: -80px;
                        font-size: 20px;
                        line-height: 44px;
                        color: #FFF;
                        font-style: normal;
                        font-weight: 600;
                        cursor: pointer;
                        animation: shake 3s ease-in-out 0.8s;
                    }
                }
            }

            &.step-4 {
                span {
                    position: relative;
                    em {
                        display: block;
                        width: 107px;
                        height: 44px;
                        position: absolute;
                        top: 0px;
                        right: -70px;
                        font-size: 20px;
                        line-height: 44px;
                        color: #FFF;
                        font-style: normal;
                        font-weight: 600;
                        text-align: right;
                        cursor: pointer;
                        animation: shake 3s ease-in-out 0.8s;

                        &::after {
                            content: '';
                            display: block;
                            width: 100%;
                            height: 100%;
                            background: url(../asset/mind-reading/text-tips-bg.png) no-repeat;
                            background-size: cover;
                            background-position: center center;
                            transform: scaleX(-1);
                            position: absolute;
                            top: 0;
                            left: 0;
                        }
                    }
                }
            }

            &.step-6 {

                padding-top: 10px;
                background: none;

                div.items {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    width: 100%;
                    height: 100%;
                    padding: 0 0;
                    box-sizing: border-box;

                    .item {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 92px;
                        height: 46px;
                        margin: 11px 7px;
                        border-radius: 2px;
                        border: 1px solid #FFF;
                        background: rgba(3, 3, 3, 0.90);
                        box-sizing: border-box;

                        img {
                            width: 40px;
                            height: 40px;
                        }

                        label {
                            display: block;
                            font-size: 24px;
                            color: #FFF;
                            font-weight: 600;
                            width: 33.209px;
                            height: 29.027px;
                        }
                    }
                }

                button.btn-next {
                    margin-top: 10px;
                    margin-bottom: 10px;
                    width: 154px;
                    height: 45px;
                    font-size: 24px;
                    animation: none;
                }

                .scroll-bar {
                    display: none;
                }
            }

            &.step-result {

                padding: 0;
                width: 100%;
                height: 100%;
                justify-content: start;

                background-image: url(../asset/mind-reading/result-bg.png);
                background-size: cover;
                background-position: center;
            
                div.title {
                    width: 100%;
                    height: 120px;
                    color: #FFF;
                    text-align: center;
                    font-size: 56px;
                    font-weight: 700;
                    text-align: center;
                    margin-top: 68px;
                }

                div.timeout {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 152px;
                    height: 346px;
                    background-size: 100% auto;
                    background-position: center;
                    background-repeat: no-repeat;

                    &.timeout-3 {
                        background-image: url(../asset/mind-reading/timeout-3.png);
                    }

                    &.timeout-2 {
                        background-image: url(../asset/mind-reading/timeout-2.png);
                    }

                    &.timeout-1 {
                        background-image: url(../asset/mind-reading/timeout-1.png);
                    }
                }

                .result-icon {
                    width: 200px;
                    height: 200px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 100px;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                button.btn-next {
                    margin-top: 100px;
                }
            }

            span {
                display: block;
                height: 134px;
                color: #FDF8FF;
                text-align: center;
                font-size: 60px;
                font-weight: 700;

                b {
                    color: #FFE356;
                }

                i {
                    font-style: normal;
                }
            }

            span.title {
                width: 500px;
                height: 120px;
                background: url(../asset/mind-reading/title.png) no-repeat;
                background-size: cover;
                background-position: center;
                display: block;
            }

            button.btn-next {
                width: 286px;
                height: 90px;
                background: url(../asset/mind-reading/btn-bg.png) no-repeat;
                background-size: cover;
                background-position: center;
                display: block;
                color: #FFF;
                text-align: center;
                font-size: 44px;
                font-weight: 600;
                margin-top: 168px;
                user-select: none;
                animation: fade-in 1s;
                white-space: nowrap;
            }

            div.tips {
                width: 810px;
                height: 512px;
                position: absolute;
                top: calc(50% - 256px);
                left: calc(50% - 405px);
                background: url(../asset/mind-reading/tips-bg.png) no-repeat;
                background-size: cover;
                background-position: center;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;

                label {
                    color: #1D0056;
                    width: 700px;
                    text-align: center;
                    font-size: 56px;
                    font-weight: 700;
                    display: block;

                    b {
                        color: #FE801E;
                    }

                    i {
                        font-style: normal;
                    }
                }

                button.btn-next {
                    margin-top: 82px;
                    animation: none;
                }

                
            }
        }
    }
}

.pc-modal {

    background: #000;

    &.pc-frame {

        background: rgba(0, 0, 0, 0.1);

        .mind-reading-page {
            
            border-radius: 0 0 15px 15px;
            box-shadow: 0px 0px 60px 0px rgba(0, 0, 0, 0.5);
            transform: scale(1);

            &::before {
                content: '';
                display: block;
                width: 100%;
                height: 32px;
                position: absolute;
                top: -32px;
                left: 0;
                background: rgb(236, 236, 236);
                border-radius: 15px 15px 0 0;
                content: 'Program Window';
                font-size: 18px;
                line-height: 32px;
                font-family: Arial, Helvetica, sans-serif;
                color: #111;
                text-align: center;
            }
            
        }

    }

    
}


.vertical-screen {

    .mind-reading-page {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        
        .panel {
            background-image: url(../asset/mind-reading/m-bg.png);

            .step {

                padding-top: 190px;
                width: 100%;
                height: 790px;
                background: url(../asset/mind-reading/m-center-bg.png) no-repeat center;
                background-size: 1200px 790px;

                &.show-tips {
                    background: none;
                }

                &.step-0 {
                    background: none;
                    padding-top: 100px;
                    button.btn-next {
                        margin-top: 330px;
                    }
                }

                &.step-1 {

                    background: none;
                    padding-top: 100px;
                    span {
                        font-size: 56px;
                    }
                    button.btn-next {
                        margin-top: 330px;
                    }
                }

                &.step-3 {
                    span {
                        em {
                            top: 70px;
                            left: -90px;
                        }
                    }
                }

                &.step-4 {
                    span {
                        em {
                           
                            right: -80px;
                        }
                    }

                    div.tips {
                        label {
                            margin-top: 128px;
                        }

                        button.btn-next {
                            margin-top: 200px;
                        }
                    }
                }

                &.step-5 {
                    span {
                        br {
                            display: none;
                        }
                    }
                }

                &.step-6 {

                    padding-top: 10px;
                    background: none;
                    height: 100%;

                    div.items {
                        justify-content: flex-start;
                        height: calc(100% - 260px);
                        overflow-y: scroll;
                        padding-left: 6px;

                        .item {
                            margin: 25px 46px;
                        }
                    }

                    button.btn-next {
                        margin-top: 60px;
                        margin-bottom: 10px;
                        width: 286px;
                        height: 90px;
                        font-size: 48px;
                    }

                    .scroll-bar {
                        position: absolute;
                        width: 14px;
                        height: 462px;
                        top: calc(50% - 331px);
                        right: 15px;
                        background: #FFF;
                        border-radius: 7px;
                        transform: scale(0.5);
                        display: block;
                        
                        em {
                            display: block;
                            width: 14px;
                            height: 332px;
                            border-radius: 7px;
                            background: #BAB5BB;
                        }
                    }
                }

                &.step-result {

                    padding: 0;
                    width: 100%;
                    height: 100%;
                    justify-content: center;

                    background-image: url(../asset/mind-reading/m-result-bg.png);
                    background-size: 100% auto;
                    background-position: center;

                    div.title {
                        margin-top: -190px;
                    }

                    div.timeout {
                       margin-top: 140px;
                       margin-bottom: 230px;
                    }

                    .result-icon {
                        margin-top: 220px;

                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    button.btn-next {
                        margin-top: 210px;
                    }

                }

                span {
                    font-size: 52px;

                    i {
                        display: block;
                    }
                }

                span.title {
                    width: 500px;
                    height: 120px;
                }

                button.btn-next {
                    width: 286px;
                    height: 90px;
                    margin-top: 247px;
                }

                div.tips {
                    width: 716px;
                    height: 670px;
                    top: calc(50% - 314px);
                    left: calc(50% - 358px);
                    background: url(../asset/mind-reading/tips-bg.png) no-repeat;
                    background-size: 716px 416px;
                    background-position: center 40px;

                    label {
                        margin-top: 160px;

                        i {
                            display: block;
                        }
                    }

                    button.btn-next {
                        margin-top: 236px;
                        animation: none;
                    }

                }
            }
        }
    }
    
}

@keyframes fade-in {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes shake {
    0% { transform: translateX(0); }
    15% { transform: translateX(-10px); }
    33% { transform: translateX(10px); }
    48% { transform: translateX(-10px); }
    66% { transform: translateX(10px); }
    84% { transform: translateX(-10px); }
    100% { transform: translateX(0); }
}

</style>
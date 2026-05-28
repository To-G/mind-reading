<template lang="pug">

.page
    slot
    div.share-tips(v-if='openShare' @click="shareClose")
        .share-tips-inner
    Teleport(to="body")
        .close-hand(v-if='store.event.content?.closeTip && props.closeTip')
        .devtools(v-if='store.event.content?.showDev == "1"')
            span {{ store.event }}
            span(v-for='l in props.logs') {{ l }}
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { useStore } from "../service/store";

const store = useStore()

const props = defineProps({
    closeTip: {
        type: Boolean,
        default: false
    },
    openShare: {
        type: Boolean,
        default: false
    },
    logs: {
        type: Array,
        default: []
    }
})

const emits = defineEmits([
    'update:openShare',
])

const openShare = ref(props.openShare)

watch(() => props.openShare, (open) => {
    openShare.value = open
})

const shareClose = () => {
    openShare.value = false
    emits('update:openShare', false)
}

</script>


<style lang="less" scoped>
.close-hand {
    width: 374px;
    height: 80px;
    background: url(../asset/point.gif) right center no-repeat;
    background-size: 110px 50px;
    position: fixed;
    right: 120px;
    top: 40px;
    z-index: 1;
    display: fixed;
    justify-content: center;
    animation: fade-in 4s;
    &::before {
        content: "点击这里关闭程序";
        width: 240px;
        height: 80px;
        font-size: 20px;
        text-align: center;
        line-height: 80px;
        border-radius: 8px;
        background: #FFF;
        box-shadow: 0px 20px 24px -10px rgba(0, 0, 0, 0.32);
        display: block;
    }
}
.share-tips {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,.7);

    .share-tips-inner {
        width: 1400px;
        height: 1180px;
        background-image: url(../asset/fx.png);
        background-size: 100% 100%;
        position: absolute;
        top: 30px;
        right: 85px;
        z-index: 999;
    }
    
}

.devtools {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 9999;
    font-size: 12px;
    color: #000;
    background: #FFF;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
    width: 300px;
    overflow: auto;
    max-height: 200px;
    overflow-y: scroll;
}

.page {
    user-select: none;
}

@keyframes fade-in {
    0% {
        opacity: 0;
    }
    80% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

</style>

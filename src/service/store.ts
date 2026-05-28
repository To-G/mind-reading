import { defineStore } from "pinia";

export const useStore = defineStore("store", {
    state: () => ({
        user: {
            id: 0,
            token: "",
            classId: 0,
            questionId: 0,
            unitId: 0,
            subjectId: 0,
        },
        page: {
            loading: true,
            loadingElm: document.querySelector(".page-loading"),
            bgmAudio: document.querySelector("#BgmAudio") as HTMLAudioElement,
            actAudio: document.querySelector("#ActAudio") as HTMLAudioElement,
            shareGuide: 0,
            type: 0,
        },
        event: {
            source: "h5",
            cmd: "ready",
            content: <any>{},
        },
        alert: {
            title: "",
            content: "",
            btnText: "好的",
            hidden: true,
        }
    }),
    actions: {
        pageLoading() {
            this.page.loading = true;
            this.page.loadingElm.hidden = false;
        },
        pageLoaded() {
            this.page.loading = false;
            this.page.loadingElm.hidden = true;
        },
        alertOpen(title: string, content: string) {
            this.alert.title = title;
            this.alert.content = content;
            this.alert.hidden = false;
        },
        alertClose() {
            this.alert.hidden = true;
        },
        changeEvent() {
            this.event = {"A": new Date().getTime()}
        }
    }
})
import { snakeNameWithObject } from "../helper/object";
import { useStore } from "./store";

export class Request {

    private static _instance: Request;

    static Load() {
        this._instance || (this._instance = new Request());
        return this._instance;
    }

    store: ReturnType<typeof useStore> = useStore();

    req(uri, method, body = {}, headers = {}) {

        const _headers = {
            'Authorization': this.store.user.token,
            ...headers,
        }

        const request = {
            method: method,
            headers: new Headers({
                "Content-Type": "application/json",
                ..._headers,
            }),
        } as RequestInit;

        if (Object.values(body).length) {
            request.body = JSON.stringify(body);
        }

        const url = uri

        return fetch(url, request)
            .then((r) => {
                if (r.ok) { 
                    return r.json()
                } 
                else {
                    console.log("Request parse", r);

                    if (r.status == 400) {
                        return r.json().then((_r) => {
                            return Promise.reject(_r);
                        });
                    }

                    if (r.status == 401) {
                        return
                    }

                    return Promise.reject({
                        message: "服务器错误，请联系管理员",
                    });
                }
            })
            .then((r) => {
                return snakeNameWithObject(r);
            })
            .catch((err) => {
                // 解析错误信息
                if (err && err.message) {
                    return Promise.reject(err);
                } else {
                    return Promise.reject({ message: "请检查网络" });
                }
            });
    }

    post(uri, body, headers = {}) {
        return this.req(uri, "POST", body, headers);
    }
}

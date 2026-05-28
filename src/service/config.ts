export class Config {

    static get isProd() {
        return window.location.origin.indexOf('testing.hetao101') === -1 && window.location.origin.indexOf('localhost') === -1
    }

    static get wechatAppId() {
        return Config.isProd ? 'wxb34fd7ac49bab1d4' : 'wxa0db2f4daa3a82a5'
    }

    static get domainLogic() {
        return Config.isProd ? '//api.pipacoding.com' : `//api.testing.pipacoding.com`
    }

    static get domainExp() {
        return Config.isProd ? 'https://surveyh5.hetao101.com/' : `https://surveyh5.testing.hetao101.com/`
    }
}
import {BodyParam, Get, JsonController, Post} from "routing-controllers"

import Axios, {AxiosPromise, AxiosResponse} from "axios"

import seniverseConfig from '../config/seniverse'

@JsonController()
export class HomeController {
    // 小程序首页显示天气控制器
    // 返回天气数据
    @Post('/home/weather')
    async getLocationCityWeather(@BodyParam('longitude', {required: true}) longitude: number,
                                 @BodyParam('latitude', {required: true}) latitude: number): Promise<{ text: string, code: string }> {
        const res = await Axios.get(`https://api.seniverse.com/v3/weather/now.json?key=${seniverseConfig.apiKey}&location=${latitude}:${longitude}&language=zh-Hans&unit=c`)

        return {
            text: res.data.results[0].now.text,
            code: res.data.results[0].now.code
        }
    }

    // 小程序首页显示每日一句控制器
    // 返回一句话
    // 目前是mock的
    // TODO 逻辑拉取每日一句
    @Get('/home/word')
    async getDayWords() {
        return (async function f() {
            const res = await Axios.get<{hitokoto: string}>('https://v1.hitokoto.cn/?c=d')
            if (res.data.hitokoto.length > 25) {
                return await f()
            } else {
                return {
                    text: res.data.hitokoto
                }
            }
        })();

    }
}
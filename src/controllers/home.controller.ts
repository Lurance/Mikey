import {BodyParam, Get, JsonController, Post} from "routing-controllers"

import Axios from "axios"

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
    getDayWords(): { text: string } {
        const mockWords: {text: string}[] = [
            {
                text: '谦虚使人进步'
            },
            {
                text: '失败乃成功之母'
            },
            {
                text: '小荷才露尖尖角，早有蜻蜓立上头'
            }
        ];

        return mockWords[Math.floor(Math.random() * mockWords.length)]
    }
}
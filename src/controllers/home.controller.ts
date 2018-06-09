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
        const words = [
            {
                text: '真正优秀的人不是方方面面都超过别人，而是时时刻刻都能够努力。'
            },
            {
                text: '成功是优点的发挥，失败是缺点的累积。'
            },
            {
                text: '每一段不努力的时光，都是对生命的辜负。'
            },
            {
                text: '我从不惧怕未来，因为时光会将我变得更加美好。'
            },
            {
                text: '请相信，那些偷偷溜走的时光，催老了我们的容颜，却丰盈了我们的人生。'
            },
            {
                text: '每一张照片，都是时光的标本。'
            },
            {
                text: '他强由他强，清风拂山冈；他横任他横，明月照大江。'
            },
            {
                text: '世事洞明皆学问，人情练达即文章。'
            },
            {
                text: 'Our greatest freedom is the freedom to choose our attitude.'
            },
            {
                text: '人该省事，不该怕事。人该脱俗，不可矫俗。不该顺时，不可趋时。'
            },
            {
                text: '孤独养成傲慢。'
            },
            {
                text: '胜固欣然，败亦可喜。'
            },
            {
                text: '一个人有两个我,一个在黑暗中醒着,一个在光明中睡着。'
            },
            {
                text: '不要努力成为一个成功者，要努力成为一个有价值的人。'
            }
        ]
        return words[Math.floor(Math.random() * words.length)]
        // return (async function f() {
        //     const words = [
        //         {
        //             text: '真正优秀的人不是方方面面都超过别人，而是时时刻刻都能够努力。'
        //         }
        //     ]
        //     const res = await Axios.get<{hitokoto: string}>('https://v1.hitokoto.cn/?c=d')
        //     if (res.data.hitokoto.length > 25) {
        //         return await f()
        //     } else {
        //         return {
        //             text: res.data.hitokoto
        //         }
        //     }
        // })();
    }
}
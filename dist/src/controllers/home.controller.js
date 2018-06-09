"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const axios_1 = require("axios");
const seniverse_1 = require("../config/seniverse");
let HomeController = class HomeController {
    async getLocationCityWeather(longitude, latitude) {
        const res = await axios_1.default.get(`https://api.seniverse.com/v3/weather/now.json?key=${seniverse_1.default.apiKey}&location=${latitude}:${longitude}&language=zh-Hans&unit=c`);
        return {
            text: res.data.results[0].now.text,
            code: res.data.results[0].now.code
        };
    }
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
        ];
        return words[Math.floor(Math.random() * words.length)];
    }
};
__decorate([
    routing_controllers_1.Post('/home/weather'),
    __param(0, routing_controllers_1.BodyParam('longitude', { required: true })),
    __param(1, routing_controllers_1.BodyParam('latitude', { required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "getLocationCityWeather", null);
__decorate([
    routing_controllers_1.Get('/home/word'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "getDayWords", null);
HomeController = __decorate([
    routing_controllers_1.JsonController()
], HomeController);
exports.HomeController = HomeController;
//# sourceMappingURL=home.controller.js.map
import axios from "axios"

export const CONST = {
  WEATHER_URL: 'https://pb3fbxwcuk.re.qweatherapi.com/',
  highlightOptions: [
    { text: '高亮天气', value: '' },
    { text: '雨', value: '雨' },
    { text: '雪', value: '雪' },
  ],
  overlookOptions: [
    { text: '忽略天气', value: '' },
    { text: '晴', value: '晴' },
    { text: '多云', value: '多音' },
  ]
};

export const INIT_DATA = {
  selectedCityIdList: ["101010700"],
  selectedCityMap: {
    "101010700": {
      "name": "昌平",
      "fxLink": "https://www.qweather.com/weather/changping-101010700.html"
    }
  },
  queryCityList: [{
    "name": "昌平",
    "id": "101010700",
    "lat": "40.21809",
    "lon": "116.23591",
    "adm2": "北京",
    "adm1": "北京市",
    "country": "中国",
    "tz": "Asia/Shanghai",
    "utcOffset": "+08:00",
    "isDst": "0",
    "type": "city",
    "rank": "23",
    "fxLink": "https://www.qweather.com/weather/changping-101010700.html"
  }]
}

export const API = axios.create({
  baseURL: 'https://oms-api.adsdesk.cn/openapi/tq/call',
  headers: {
    'authCode': '7oVHfjE7XQJh+G+ML2u7Uqx6sunH'
  }
});
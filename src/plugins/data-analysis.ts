// 数据统计插件
import { version } from '@/../package.json'
import { logger } from '@/utils'

interface TalkingDataEventParams {
  EventId: string
  Label?: string
  MapKv?: Object
}

const queue: TalkingDataEventParams[] = []

function emitDataAnalysisEvent(
  EventId: string,
  Label?: string,
  MapKv?: Object
) {
  queue.push({ EventId, Label, MapKv })
}

export { emitDataAnalysisEvent }

export default {
  name: 'data-analysis',
  pathname: true,
  task() {
    if (window.TDAPP && queue.length) {
      const e = queue.shift()
      if (e) {
        window.TDAPP.onEvent(e.EventId, e.Label, e.MapKv)
      }
    }
  },
  init() {
    const APP_ID = '36482C98B3E94A4D93A0C66E43702C77'
    const versionName = `${version} (${
      process.env.NODE_ENV === 'development' ? 'dev' : 'stable'
    })`
    const script = document.createElement('script')
    const src = `https://jic.talkingdata.com/app/h5/v1?appid=${APP_ID}&vn=${versionName}&vc=${version}`
    script.setAttribute('src', src)
    document.getElementsByTagName('head')[0].appendChild(script)
    script.onload = () => {
      logger.info(`Data Analysis Plugin Loaded Successfully: ${versionName}`)
    }
  }
} as SUAPlugin

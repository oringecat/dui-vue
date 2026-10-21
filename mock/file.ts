import type { MockMethod } from 'vite-plugin-mock'
import { mockResponse, serviceConfig, randomInt } from './mock-utils'

export default [
    {
        url: serviceConfig.apiUrl + '/file/upload',
        method: 'post',
        rawResponse: (req, res) => {
            const name = `image-${Date.now()}.png`
            mockResponse(res, {
                code: 200,
                message: 'ok',
                data: {
                    name,
                    // 模拟支持尺寸后缀的图片服务：组件会在末尾追加 /32、/800
                    url: `https://picsum.photos/id/${randomInt(1, 200)}`,
                    width: randomInt(600, 1200),
                    height: randomInt(600, 1200)
                },
                total: 0
            })
        }
    }
] as MockMethod[]
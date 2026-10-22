import type { MockMethod } from 'vite-plugin-mock'
import { mockResponse, serviceConfig, randomInt } from './mock-utils'

export default [
    {
        url: serviceConfig.apiUrl + '/file/upload',
        method: 'post',
        rawResponse: (req, res) => {
            const stamp = `${Date.now()}${randomInt(1000, 9999)}`
            mockResponse(res, {
                code: 200,
                message: 'ok',
                data: {
                    name: `image-${stamp}.jpg`,
                    url: `https://picsum.photos/seed/${stamp}`,
                    width: randomInt(600, 1200),
                    height: randomInt(600, 1200)
                },
                total: 0
            })
        }
    }
] as MockMethod[]
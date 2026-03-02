import { createResponse } from './response'

describe('createResponse', () => {
  it('指定したステータスコードとボディでレスポンスを作成できる', () => {
    const response = createResponse(200, { message: 'ok' })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({ message: 'ok' })
  })

  it('CORSヘッダーが含まれる', () => {
    const response = createResponse(200, {})
    expect(response.headers['Access-Control-Allow-Origin']).toBe('*')
  })
})

import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { handler } from './create'
import { ddbMock } from '../../test/setup'

describe('createPost handler', () => {
  it('投稿を作成して201を返す', async () => {
    ddbMock.on(PutCommand).resolves({})

    const response = await handler({
      body: JSON.stringify({
        content: '新しい投稿',
        authorName: 'テストユーザー',
      }),
    })

    expect(response.statusCode).toBe(201)
    expect(JSON.parse(response.body).content).toBe('新しい投稿')
  })

  it('bodyがない場合は400を返す', async () => {
    const response = await handler({ body: null })
    expect(response.statusCode).toBe(400)
  })

  it('エラー時は500を返す', async () => {
    ddbMock.on(PutCommand).rejects(new Error('DynamoDB error'))

    const response = await handler({
      body: JSON.stringify({
        content: '新しい投稿',
        authorName: 'テストユーザー',
      }),
    })

    expect(response.statusCode).toBe(500)
  })

  it('レスポンスにCORSヘッダーが含まれる', async () => {
    ddbMock.on(PutCommand).resolves({})

    const response = await handler({
      body: JSON.stringify({
        content: '新しい投稿',
        authorName: 'テストユーザー',
      }),
    })

    expect(response.headers['Access-Control-Allow-Origin']).toBe('*')
  })
})

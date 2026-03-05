import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { handler } from './create'
import { ddbMock } from '../../test/setup'

const mockEvent = (content: string, username = 'テストユーザー') => ({
  body: JSON.stringify({ content }),
  requestContext: {
    authorizer: {
      claims: {
        'cognito:username': username,
      },
    },
  },
})

describe('createPost handler', () => {
  it('投稿を作成して201を返す', async () => {
    ddbMock.on(PutCommand).resolves({})

    const response = await handler(mockEvent('新しい投稿'))

    expect(response.statusCode).toBe(201)
    expect(JSON.parse(response.body).content).toBe('新しい投稿')
  })

  it('bodyがない場合は400を返す', async () => {
    const response = await handler({ body: null })
    expect(response.statusCode).toBe(400)
  })

  it('エラー時は500を返す', async () => {
    ddbMock.on(PutCommand).rejects(new Error('DynamoDB error'))

    const response = await handler(mockEvent('新しい投稿'))

    expect(response.statusCode).toBe(500)
  })

  it('レスポンスにCORSヘッダーが含まれる', async () => {
    ddbMock.on(PutCommand).resolves({})

    const response = await handler(mockEvent('新しい投稿'))

    expect(response.headers['Access-Control-Allow-Origin']).toBe('*')
  })

  it('JWTトークンからauthorNameを取得して投稿を作成する', async () => {
    ddbMock.on(PutCommand).resolves({})

    const response = await handler(mockEvent('新しい投稿', 'yamada_taro'))

    expect(response.statusCode).toBe(201)
    const body = JSON.parse(response.body)
    expect(body.authorName).toBe('yamada_taro')
  })
})

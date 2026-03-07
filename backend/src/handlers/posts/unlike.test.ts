import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import { handler } from './unlike'
import { ddbMock } from '../../test/setup'

describe('unlikePost handler', () => {
  it('いいねを取り消して200を返す', async () => {
    ddbMock.on(TransactWriteCommand).resolves({})

    const response = await handler({
      pathParameters: { postId: '1' },
      requestContext: {
        authorizer: { claims: { 'cognito:username': 'user1' } },
      },
    })

    expect(response.statusCode).toBe(200)
  })

  it('postIdがない場合は400を返す', async () => {
    const response = await handler({ pathParameters: null })
    expect(response.statusCode).toBe(400)
  })

  it('エラー時は500を返す', async () => {
    ddbMock.on(TransactWriteCommand).rejects(new Error('DynamoDB error'))

    const response = await handler({
      pathParameters: { postId: '1' },
      requestContext: {
        authorizer: { claims: { 'cognito:username': 'user1' } },
      },
    })

    expect(response.statusCode).toBe(500)
  })

  it('レスポンスにCORSヘッダーが含まれる', async () => {
    ddbMock.on(TransactWriteCommand).resolves({})

    const response = await handler({
      pathParameters: { postId: '1' },
      requestContext: {
        authorizer: { claims: { 'cognito:username': 'user1' } },
      },
    })

    expect(response.headers['Access-Control-Allow-Origin']).toBe('*')
  })
})

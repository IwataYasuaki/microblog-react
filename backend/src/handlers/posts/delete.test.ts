import { DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { handler } from './delete'
import { ddbMock } from '../../test/setup'

describe('deletePost handler', () => {
  it('投稿を削除して204を返す', async () => {
    ddbMock.on(DeleteCommand).resolves({})

    const response = await handler({ pathParameters: { postId: '1' } })

    expect(response.statusCode).toBe(204)
  })

  it('postIdがない場合は400を返す', async () => {
    const response = await handler({ pathParameters: null })
    expect(response.statusCode).toBe(400)
  })

  it('エラー時は500を返す', async () => {
    ddbMock.on(DeleteCommand).rejects(new Error('DynamoDB error'))

    const response = await handler({ pathParameters: { postId: '1' } })

    expect(response.statusCode).toBe(500)
  })

  it('レスポンスにCORSヘッダーが含まれる', async () => {
    ddbMock.on(DeleteCommand).resolves({})

    const response = await handler({ pathParameters: { postId: '1' } })

    expect(response.headers['Access-Control-Allow-Origin']).toBe('*')
  })
})

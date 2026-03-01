import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { handler } from './unlike'
import { ddbMock } from '../../test/setup'

describe('unlikePost handler', () => {
  it('いいねを取り消して200を返す', async () => {
    ddbMock.on(UpdateCommand).resolves({
      Attributes: {
        id: '1',
        content: 'テスト投稿',
        authorName: 'テストユーザー',
        createdAt: '2024-01-01T00:00:00Z',
        likeCount: 0,
      },
    })

    const response = await handler({ pathParameters: { postId: '1' } })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body).likeCount).toBe(0)
  })

  it('postIdがない場合は400を返す', async () => {
    const response = await handler({ pathParameters: null })
    expect(response.statusCode).toBe(400)
  })

  it('エラー時は500を返す', async () => {
    ddbMock.on(UpdateCommand).rejects(new Error('DynamoDB error'))

    const response = await handler({ pathParameters: { postId: '1' } })

    expect(response.statusCode).toBe(500)
  })
})

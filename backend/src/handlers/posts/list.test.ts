import { ScanCommand } from '@aws-sdk/lib-dynamodb'
import { handler } from './list'
import { ddbMock } from '../../test/setup'

describe('listPosts handler', () => {
  it('投稿一覧を200で返す', async () => {
    ddbMock.on(ScanCommand).resolves({
      Items: [
        {
          id: '1',
          content: 'テスト投稿',
          authorName: 'テストユーザー',
          createdAt: '2024-01-01T00:00:00Z',
          likeCount: 0,
        },
      ],
    })

    const response = await handler()

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toHaveLength(1)
  })

  it('エラー時は500を返す', async () => {
    ddbMock.on(ScanCommand).rejects(new Error('DynamoDB error'))

    const response = await handler()

    expect(response.statusCode).toBe(500)
  })
})

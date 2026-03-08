import { ScanCommand, BatchGetCommand } from '@aws-sdk/lib-dynamodb'
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
    ddbMock.on(BatchGetCommand).resolves({ Responses: {} })

    const response = await handler({
      requestContext: {
        authorizer: { claims: { 'cognito:username': 'user1' } },
      },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toHaveLength(1)
  })

  it('likedByMeが正しく設定される', async () => {
    ddbMock.on(ScanCommand).resolves({
      Items: [
        {
          id: '1',
          content: 'テスト投稿',
          authorName: 'テストユーザー',
          createdAt: '2024-01-01T00:00:00Z',
          likeCount: 1,
        },
      ],
    })
    ddbMock.on(BatchGetCommand).resolves({
      Responses: {
        likes: [{ userId: 'user1', postId: '1' }],
      },
    })

    const response = await handler({
      requestContext: {
        authorizer: { claims: { 'cognito:username': 'user1' } },
      },
    })

    expect(response.statusCode).toBe(200)
    const posts = JSON.parse(response.body)
    expect(posts[0].likedByMe).toBe(true)
  })

  it('エラー時は500を返す', async () => {
    ddbMock.on(ScanCommand).rejects(new Error('DynamoDB error'))

    const response = await handler({
      requestContext: {
        authorizer: { claims: { 'cognito:username': 'user1' } },
      },
    })

    expect(response.statusCode).toBe(500)
  })

  it('レスポンスにCORSヘッダーが含まれる', async () => {
    ddbMock.on(ScanCommand).resolves({ Items: [] })
    ddbMock.on(BatchGetCommand).resolves({ Responses: {} })

    const response = await handler({
      requestContext: {
        authorizer: { claims: { 'cognito:username': 'user1' } },
      },
    })

    expect(response.headers['Access-Control-Allow-Origin']).toBe('*')
  })

  it('未ログイン時はlikedByMeがすべてfalseになる', async () => {
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

    const response = await handler({})

    expect(response.statusCode).toBe(200)
    const posts = JSON.parse(response.body)
    expect(posts[0].likedByMe).toBe(false)
  })
})

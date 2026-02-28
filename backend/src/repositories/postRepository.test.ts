import { PostRepository } from './postRepository'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'

const ddbMock = mockClient(DynamoDBDocumentClient)

describe('PostRepository', () => {
  beforeEach(() => {
    ddbMock.reset()
  })

  describe('listPosts', () => {
    it('投稿一覧を取得できる', async () => {
      ddbMock.on(QueryCommand).resolves({
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

      const repository = new PostRepository('test-table')
      const posts = await repository.listPosts()

      expect(posts).toHaveLength(1)
      expect(posts[0].content).toBe('テスト投稿')
    })

    it('投稿が0件の場合、空配列を返す', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: [] })

      const repository = new PostRepository('test-table')
      const posts = await repository.listPosts()

      expect(posts).toHaveLength(0)
    })
  })
})

import { PostRepository } from './postRepository'
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
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

  describe('createPost', () => {
    it('投稿を作成できる', async () => {
      ddbMock.on(PutCommand).resolves({})

      const repository = new PostRepository('test-table')
      const post = await repository.createPost({
        content: '新しい投稿',
        authorName: 'テストユーザー',
      })

      expect(post.content).toBe('新しい投稿')
      expect(post.authorName).toBe('テストユーザー')
      expect(post.id).toBeDefined()
      expect(post.createdAt).toBeDefined()
      expect(post.likeCount).toBe(0)
    })
  })

  describe('deletePost', () => {
    it('投稿を削除できる', async () => {
      ddbMock.on(DeleteCommand).resolves({})

      const repository = new PostRepository('test-table')
      await expect(repository.deletePost('1')).resolves.not.toThrow()
    })
  })

  describe('likePost', () => {
    it('いいね数を1増やせる', async () => {
      ddbMock.on(UpdateCommand).resolves({
        Attributes: {
          id: '1',
          content: 'テスト投稿',
          authorName: 'テストユーザー',
          createdAt: '2024-01-01T00:00:00Z',
          likeCount: 1,
        },
      })

      const repository = new PostRepository('test-table')
      const post = await repository.likePost('1')

      expect(post.likeCount).toBe(1)
    })
  })

  describe('unlikePost', () => {
    it('いいね数を1減らせる', async () => {
      ddbMock.on(UpdateCommand).resolves({
        Attributes: {
          id: '1',
          content: 'テスト投稿',
          authorName: 'テストユーザー',
          createdAt: '2024-01-01T00:00:00Z',
          likeCount: 0,
        },
      })

      const repository = new PostRepository('test-table')
      const post = await repository.unlikePost('1')

      expect(post.likeCount).toBe(0)
    })
  })
})

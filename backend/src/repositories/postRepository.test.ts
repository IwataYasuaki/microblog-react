import { PostRepository } from './postRepository'
import {
  ScanCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  BatchGetCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import { ddbMock } from '../test/setup'

describe('PostRepository', () => {
  describe('listPosts', () => {
    it('投稿一覧を取得できる', async () => {
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

      const repository = new PostRepository('test-table', 'test-likes-table')
      const posts = await repository.listPosts()

      expect(posts).toHaveLength(1)
      expect(posts[0].content).toBe('テスト投稿')
    })

    it('投稿が0件の場合、空配列を返す', async () => {
      ddbMock.on(ScanCommand).resolves({ Items: [] })

      const repository = new PostRepository('test-table', 'test-likes-table')
      const posts = await repository.listPosts()

      expect(posts).toHaveLength(0)
    })
  })

  describe('createPost', () => {
    it('投稿を作成できる', async () => {
      ddbMock.on(PutCommand).resolves({})

      const repository = new PostRepository('test-table', 'test-likes-table')
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

      const repository = new PostRepository('test-table', 'test-likes-table')
      await expect(repository.deletePost('1')).resolves.not.toThrow()
    })
  })

  describe('likePost', () => {
    it('いいね数を1増やしLikesテーブルに追加する', async () => {
      ddbMock.on(TransactWriteCommand).resolves({})

      const repository = new PostRepository('test-table', 'test-likes-table')
      await expect(repository.likePost('post1', 'user1')).resolves.not.toThrow()
    })
  })

  describe('unlikePost', () => {
    it('いいね数を1減らしLikesテーブルから削除する', async () => {
      ddbMock.on(TransactWriteCommand).resolves({})

      const repository = new PostRepository('test-table', 'test-likes-table')
      await expect(
        repository.unlikePost('post1', 'user1')
      ).resolves.not.toThrow()
    })
  })

  describe('getLikedPostIds', () => {
    it('いいねしている投稿IDを返す', async () => {
      ddbMock.on(BatchGetCommand).resolves({
        Responses: {
          'test-likes-table': [{ userId: 'user1', postId: 'post1' }],
        },
      })

      const repository = new PostRepository('test-table', 'test-likes-table')
      const likedPostIds = await repository.getLikedPostIds('user1', [
        'post1',
        'post2',
      ])

      expect(likedPostIds).toEqual(['post1'])
    })

    it('投稿IDが空の場合は空配列を返す', async () => {
      const repository = new PostRepository('test-table', 'test-likes-table')
      const likedPostIds = await repository.getLikedPostIds('user1', [])

      expect(likedPostIds).toEqual([])
    })
  })
})

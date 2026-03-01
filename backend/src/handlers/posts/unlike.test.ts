import { handler } from './unlike'
import { PostRepository } from '../../repositories/postRepository'

vi.mock('../../repositories/postRepository')

const mockUnlikePost = vi.fn()

beforeEach(() => {
  vi.mocked(PostRepository).mockImplementation(function () {
    return {
      listPosts: vi.fn(),
      createPost: vi.fn(),
      deletePost: vi.fn(),
      likePost: vi.fn(),
      unlikePost: mockUnlikePost,
    }
  })
})

describe('unlikePost handler', () => {
  it('いいねを取り消して200を返す', async () => {
    mockUnlikePost.mockResolvedValue({
      id: '1',
      content: 'テスト投稿',
      authorName: 'テストユーザー',
      createdAt: '2024-01-01T00:00:00Z',
      likeCount: 0,
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
    mockUnlikePost.mockRejectedValue(new Error('DynamoDB error'))

    const response = await handler({ pathParameters: { postId: '1' } })

    expect(response.statusCode).toBe(500)
  })
})

import { handler } from './like'
import { PostRepository } from '../../repositories/postRepository'

vi.mock('../../repositories/postRepository')

const mockLikePost = vi.fn()

beforeEach(() => {
  vi.mocked(PostRepository).mockImplementation(function () {
    return {
      listPosts: vi.fn(),
      createPost: vi.fn(),
      deletePost: vi.fn(),
      likePost: mockLikePost,
      unlikePost: vi.fn(),
    }
  })
})

describe('likePost handler', () => {
  it('いいねして200を返す', async () => {
    mockLikePost.mockResolvedValue({
      id: '1',
      content: 'テスト投稿',
      authorName: 'テストユーザー',
      createdAt: '2024-01-01T00:00:00Z',
      likeCount: 1,
    })

    const response = await handler({ pathParameters: { postId: '1' } })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body).likeCount).toBe(1)
  })

  it('postIdがない場合は400を返す', async () => {
    const response = await handler({ pathParameters: null })
    expect(response.statusCode).toBe(400)
  })

  it('エラー時は500を返す', async () => {
    mockLikePost.mockRejectedValue(new Error('DynamoDB error'))

    const response = await handler({ pathParameters: { postId: '1' } })

    expect(response.statusCode).toBe(500)
  })
})

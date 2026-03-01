import { handler } from './list'
import { PostRepository } from '../../repositories/postRepository'

vi.mock('../../repositories/postRepository')

const mockListPosts = vi.fn()

beforeEach(() => {
  vi.mocked(PostRepository).mockImplementation(function () {
    return {
      listPosts: mockListPosts,
      createPost: vi.fn(),
      deletePost: vi.fn(),
      likePost: vi.fn(),
      unlikePost: vi.fn(),
    }
  })
})

describe('listPosts handler', () => {
  it('投稿一覧を200で返す', async () => {
    mockListPosts.mockResolvedValue([
      {
        id: '1',
        content: 'テスト投稿',
        authorName: 'テストユーザー',
        createdAt: '2024-01-01T00:00:00Z',
        likeCount: 0,
      },
    ])

    const response = await handler()

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toHaveLength(1)
  })

  it('エラー時は500を返す', async () => {
    mockListPosts.mockRejectedValue(new Error('DynamoDB error'))

    const response = await handler()

    expect(response.statusCode).toBe(500)
  })
})

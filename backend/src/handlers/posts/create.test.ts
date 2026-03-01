import { handler } from './create'
import { PostRepository } from '../../repositories/postRepository'

vi.mock('../../repositories/postRepository')

const mockCreatePost = vi.fn()

beforeEach(() => {
  vi.mocked(PostRepository).mockImplementation(function () {
    return {
      listPosts: vi.fn(),
      createPost: mockCreatePost,
      deletePost: vi.fn(),
      likePost: vi.fn(),
      unlikePost: vi.fn(),
    }
  })
})

describe('createPost handler', () => {
  it('投稿を作成して201を返す', async () => {
    mockCreatePost.mockResolvedValue({
      id: '1',
      content: '新しい投稿',
      authorName: 'テストユーザー',
      createdAt: '2024-01-01T00:00:00Z',
      likeCount: 0,
    })

    const response = await handler({
      body: JSON.stringify({
        content: '新しい投稿',
        authorName: 'テストユーザー',
      }),
    })

    expect(response.statusCode).toBe(201)
    expect(JSON.parse(response.body).content).toBe('新しい投稿')
  })

  it('bodyがない場合は400を返す', async () => {
    const response = await handler({ body: null })
    expect(response.statusCode).toBe(400)
  })

  it('エラー時は500を返す', async () => {
    mockCreatePost.mockRejectedValue(new Error('DynamoDB error'))

    const response = await handler({
      body: JSON.stringify({
        content: '新しい投稿',
        authorName: 'テストユーザー',
      }),
    })

    expect(response.statusCode).toBe(500)
  })
})

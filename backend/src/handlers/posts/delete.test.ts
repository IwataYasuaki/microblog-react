import { handler } from './delete'
import { PostRepository } from '../../repositories/postRepository'

vi.mock('../../repositories/postRepository')

const mockDeletePost = vi.fn()

beforeEach(() => {
  vi.mocked(PostRepository).mockImplementation(function () {
    return {
      listPosts: vi.fn(),
      createPost: vi.fn(),
      deletePost: mockDeletePost,
      likePost: vi.fn(),
      unlikePost: vi.fn(),
    }
  })
})

describe('deletePost handler', () => {
  it('投稿を削除して204を返す', async () => {
    mockDeletePost.mockResolvedValue(undefined)

    const response = await handler({ pathParameters: { postId: '1' } })

    expect(response.statusCode).toBe(204)
  })

  it('postIdがない場合は400を返す', async () => {
    const response = await handler({ pathParameters: null })
    expect(response.statusCode).toBe(400)
  })

  it('エラー時は500を返す', async () => {
    mockDeletePost.mockRejectedValue(new Error('DynamoDB error'))

    const response = await handler({ pathParameters: { postId: '1' } })

    expect(response.statusCode).toBe(500)
  })
})

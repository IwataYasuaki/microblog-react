import { fetchPosts, createPost, likePost, unlikePost } from './posts'
import * as auth from './auth'

vi.mock('./auth')
const mockGetIdToken = vi.mocked(auth.getIdToken)

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
  mockGetIdToken.mockResolvedValue('test-token')
})

describe('posts API', () => {
  it('投稿一覧を取得できる', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: '1',
          content: 'テスト投稿',
          authorName: 'テストユーザー',
          createdAt: '2024-01-01T00:00:00Z',
          likeCount: 0,
        },
      ],
    })

    const posts = await fetchPosts()

    expect(posts).toHaveLength(1)
    expect(posts[0].content).toBe('テスト投稿')
  })

  it('投稿を作成できる', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: '1',
        content: '新しい投稿',
        authorName: 'テストユーザー',
        createdAt: '2024-01-01T00:00:00Z',
        likeCount: 0,
      }),
    })

    const post = await createPost({ content: '新しい投稿' })

    expect(post.content).toBe('新しい投稿')
  })

  it('投稿作成にAuthorizationヘッダーが含まれる', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: '1',
        content: '新しい投稿',
        authorName: 'テストユーザー',
        createdAt: '2024-01-01T00:00:00Z',
        likeCount: 0,
      }),
    })

    await createPost({ content: '新しい投稿' })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    )
  })

  it('いいねできる', async () => {
    mockFetch.mockResolvedValue({ ok: true })

    await likePost('1')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/posts/1/likes'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('いいねを取り消せる', async () => {
    mockFetch.mockResolvedValue({ ok: true })

    await unlikePost('1')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/posts/1/likes'),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('いいねにAuthorizationヘッダーが含まれる', async () => {
    mockFetch.mockResolvedValue({ ok: true })

    await likePost('1')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    )
  })

  it('いいね取り消しにAuthorizationヘッダーが含まれる', async () => {
    mockFetch.mockResolvedValue({ ok: true })

    await unlikePost('1')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    )
  })
})

import { fetchPosts, createPost, likePost, unlikePost } from './posts'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
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

  it('いいねできる', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: '1',
        content: 'テスト投稿',
        authorName: 'テストユーザー',
        createdAt: '2024-01-01T00:00:00Z',
        likeCount: 1,
      }),
    })

    const post = await likePost('1')

    expect(post.likeCount).toBe(1)
  })

  it('いいねを取り消せる', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: '1',
        content: 'テスト投稿',
        authorName: 'テストユーザー',
        createdAt: '2024-01-01T00:00:00Z',
        likeCount: 0,
      }),
    })

    const post = await unlikePost('1')

    expect(post.likeCount).toBe(0)
  })
})

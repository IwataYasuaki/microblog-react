import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Timeline } from './Timeline'
import * as postsApi from '../api/posts'
import type { Post } from '@microblog/shared'

vi.mock('../api/posts')

const mockFetchPosts = vi.mocked(postsApi.fetchPosts)
const mockCreatePost = vi.mocked(postsApi.createPost)
const mockLikePost = vi.mocked(postsApi.likePost)
const mockUnlikePost = vi.mocked(postsApi.unlikePost)

const mockPost = (overrides?: Partial<Post>): Post => ({
  id: '1',
  content: 'テスト投稿',
  authorName: 'テストユーザー',
  createdAt: '2024-01-01T00:00:00Z',
  likeCount: 0,
  likedByMe: false,
  ...overrides,
})

beforeEach(() => {
  mockFetchPosts.mockResolvedValue([])
  mockCreatePost.mockResolvedValue(mockPost())
  mockLikePost.mockResolvedValue(undefined)
  mockUnlikePost.mockResolvedValue(undefined)
})

describe('Timeline', () => {
  it('投稿フォームが表示される', async () => {
    render(<Timeline />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '投稿' })).toBeInTheDocument()
  })

  it('新しい投稿を追加するとタイムラインに表示される', async () => {
    render(<Timeline />)
    await userEvent.type(screen.getByRole('textbox'), 'テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: '投稿' }))
    expect(screen.getByText('テスト投稿')).toBeInTheDocument()
  })

  it('いいねボタンを押すといいね済みになる', async () => {
    mockFetchPosts.mockResolvedValue([mockPost()])
    render(<Timeline />)
    await screen.findByText('テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))
    expect(
      screen.getByRole('button', { name: 'いいね済み' })
    ).toBeInTheDocument()
  })

  it('いいね済みの状態でボタンを押すといいねが取り消される', async () => {
    mockFetchPosts.mockResolvedValue([mockPost()])
    render(<Timeline />)
    await screen.findByText('テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))
    await userEvent.click(screen.getByRole('button', { name: 'いいね済み' }))
    expect(screen.getByRole('button', { name: 'いいね' })).toBeInTheDocument()
  })

  it('いいねボタンを押すといいね数が1増える', async () => {
    mockFetchPosts.mockResolvedValue([mockPost()])
    render(<Timeline />)
    await screen.findByText('テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('いいね済みの状態でボタンを押すといいね数が1減る', async () => {
    mockFetchPosts.mockResolvedValue([mockPost()])
    render(<Timeline />)
    await screen.findByText('テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))
    await userEvent.click(screen.getByRole('button', { name: 'いいね済み' }))
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('いいねボタンを押すとAPIレスポンスを待たずに即座にいいね済みになる', async () => {
    // 永遠に解決しないPromiseを返すことで、APIレスポンスを待たずに画面が更新されることを確認する
    mockLikePost.mockReturnValue(new Promise(() => {}))
    mockFetchPosts.mockResolvedValue([mockPost()])

    render(<Timeline />)
    await screen.findByText('テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))

    // APIレスポンスを待たずに即座に更新されている
    expect(
      screen.getByRole('button', { name: 'いいね済み' })
    ).toBeInTheDocument()
  })

  it('いいね済みの状態でボタンを押すとAPIレスポンスを待たずに即座にいいねが取り消される', async () => {
    // 永遠に解決しないPromiseを返すことで、APIレスポンスを待たずに画面が更新されることを確認する
    mockUnlikePost.mockReturnValue(new Promise(() => {}))
    mockFetchPosts.mockResolvedValue([mockPost()])

    render(<Timeline />)
    await screen.findByText('テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))
    await userEvent.click(screen.getByRole('button', { name: 'いいね済み' }))

    expect(screen.getByRole('button', { name: 'いいね' })).toBeInTheDocument()
  })

  it('投稿するとAPIレスポンスを待たずに即座にタイムラインに表示される', async () => {
    // 永遠に解決しないPromiseを返すことで、APIレスポンスを待たずに画面が更新されることを確認する
    mockCreatePost.mockReturnValue(new Promise(() => {}))

    render(<Timeline currentUsername="yamada_taro" />)
    await userEvent.type(screen.getByRole('textbox'), '新しい投稿')
    await userEvent.click(screen.getByRole('button', { name: '投稿' }))

    expect(screen.getByText('新しい投稿')).toBeInTheDocument()
    expect(screen.getByText('yamada_taro')).toBeInTheDocument()
  })
})

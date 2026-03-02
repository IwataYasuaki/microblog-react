import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import * as postsApi from './api/posts'

vi.mock('./api/posts')

const mockFetchPosts = vi.mocked(postsApi.fetchPosts)
const mockCreatePost = vi.mocked(postsApi.createPost)
const mockLikePost = vi.mocked(postsApi.likePost)
const mockUnlikePost = vi.mocked(postsApi.unlikePost)

beforeEach(() => {
  mockFetchPosts.mockResolvedValue([])
  mockCreatePost.mockResolvedValue({
    id: '1',
    content: '新しい投稿',
    authorName: 'テストユーザー',
    createdAt: '2024-01-01T00:00:00Z',
    likeCount: 0,
  })
  mockLikePost.mockResolvedValue({
    id: '1',
    content: '新しい投稿',
    authorName: 'テストユーザー',
    createdAt: '2024-01-01T00:00:00Z',
    likeCount: 1,
  })
  mockUnlikePost.mockResolvedValue({
    id: '1',
    content: '新しい投稿',
    authorName: 'テストユーザー',
    createdAt: '2024-01-01T00:00:00Z',
    likeCount: 0,
  })
})

describe('App', () => {
  it('投稿フォームが表示される', () => {
    render(<App />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '投稿' })).toBeInTheDocument()
  })

  it('新しい投稿を追加するとタイムラインに表示される', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('textbox'), '新しい投稿')
    await userEvent.click(screen.getByRole('button', { name: '投稿' }))
    expect(screen.getByText('新しい投稿')).toBeInTheDocument()
  })

  it('いいねボタンを押すといいね済みになる', async () => {
    mockFetchPosts.mockResolvedValue([
      {
        id: '1',
        content: 'テスト投稿',
        authorName: 'テストユーザー',
        createdAt: '2024-01-01T00:00:00Z',
        likeCount: 0,
      },
    ])
    render(<App />)
    await screen.findByText('テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))
    expect(
      screen.getByRole('button', { name: 'いいね済み' })
    ).toBeInTheDocument()
  })

  it('いいね済みの状態でボタンを押すといいねが取り消される', async () => {
    mockFetchPosts.mockResolvedValue([
      {
        id: '1',
        content: 'テスト投稿',
        authorName: 'テストユーザー',
        createdAt: '2024-01-01T00:00:00Z',
        likeCount: 0,
      },
    ])
    render(<App />)
    await screen.findByText('テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))
    await userEvent.click(screen.getByRole('button', { name: 'いいね済み' }))
    expect(screen.getByRole('button', { name: 'いいね' })).toBeInTheDocument()
  })

  it('いいねボタンを押すといいね数が1増える', async () => {
    mockFetchPosts.mockResolvedValue([
      {
        id: '1',
        content: 'テスト投稿',
        authorName: 'テストユーザー',
        createdAt: '2024-01-01T00:00:00Z',
        likeCount: 0,
      },
    ])
    render(<App />)
    await screen.findByText('テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('いいね済みの状態でボタンを押すといいね数が1減る', async () => {
    mockFetchPosts.mockResolvedValue([
      {
        id: '1',
        content: 'テスト投稿',
        authorName: 'テストユーザー',
        createdAt: '2024-01-01T00:00:00Z',
        likeCount: 1,
      },
    ])
    render(<App />)
    await screen.findByText('テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))
    await userEvent.click(screen.getByRole('button', { name: 'いいね済み' }))
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Post } from './Post'
import type { Post as PostType } from '@microblog/shared'

const mockPost: PostType = {
  id: '1',
  content: 'はじめての投稿です',
  authorName: 'テストユーザー',
  createdAt: '2024-01-01T00:00:00Z',
  likeCount: 3,
}

describe('Post', () => {
  it('投稿の本文が表示される', () => {
    render(
      <Post post={mockPost} liked={false} onLike={vi.fn()} onUnlike={vi.fn()} />
    )
    expect(screen.getByText('はじめての投稿です')).toBeInTheDocument()
  })

  it('投稿者名が表示される', () => {
    render(
      <Post post={mockPost} liked={false} onLike={vi.fn()} onUnlike={vi.fn()} />
    )
    expect(screen.getByText('テストユーザー')).toBeInTheDocument()
  })

  it('いいね数が表示される', () => {
    render(
      <Post post={mockPost} liked={false} onLike={vi.fn()} onUnlike={vi.fn()} />
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('投稿日時が表示される', () => {
    render(
      <Post post={mockPost} liked={false} onLike={vi.fn()} onUnlike={vi.fn()} />
    )
    expect(screen.getByText('2024/1/1')).toBeInTheDocument()
  })

  it('いいねボタンが表示される', () => {
    render(
      <Post post={mockPost} liked={false} onLike={vi.fn()} onUnlike={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: 'いいね' })).toBeInTheDocument()
  })

  it('いいねボタンを押すとonLikeが呼ばれる', async () => {
    const onLike = vi.fn()
    render(
      <Post post={mockPost} liked={false} onLike={onLike} onUnlike={vi.fn()} />
    )
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))
    expect(onLike).toHaveBeenCalled()
  })

  it('いいね済みの場合、いいね済みボタンが表示される', () => {
    render(
      <Post post={mockPost} liked={true} onLike={vi.fn()} onUnlike={vi.fn()} />
    )
    expect(
      screen.getByRole('button', { name: 'いいね済み' })
    ).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LikeButton } from './LikeButton'

describe('LikeButton', () => {
  it('いいね数が表示される', () => {
    render(
      <LikeButton
        likeCount={3}
        liked={false}
        onLike={vi.fn()}
        onUnlike={vi.fn()}
      />
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('いいねボタンが表示される', () => {
    render(
      <LikeButton
        likeCount={0}
        liked={false}
        onLike={vi.fn()}
        onUnlike={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: 'いいね' })).toBeInTheDocument()
  })

  it('いいねボタンを押すとonLikeが呼ばれる', async () => {
    const onLike = vi.fn()
    render(
      <LikeButton
        likeCount={0}
        liked={false}
        onLike={onLike}
        onUnlike={vi.fn()}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))
    expect(onLike).toHaveBeenCalled()
  })

  it('いいね済みの場合、いいね済みボタンが表示される', () => {
    render(
      <LikeButton
        likeCount={1}
        liked={true}
        onLike={vi.fn()}
        onUnlike={vi.fn()}
      />
    )
    expect(
      screen.getByRole('button', { name: 'いいね済み' })
    ).toBeInTheDocument()
  })

  it('いいね済みの状態でボタンを押すとonUnlikeが呼ばれる', async () => {
    const onUnlike = vi.fn()
    render(
      <LikeButton
        likeCount={1}
        liked={true}
        onLike={vi.fn()}
        onUnlike={onUnlike}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'いいね済み' }))
    expect(onUnlike).toHaveBeenCalled()
  })
})

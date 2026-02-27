import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

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
    render(<App />)
    await userEvent.type(screen.getByRole('textbox'), 'テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: '投稿' }))
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))
    expect(
      screen.getByRole('button', { name: 'いいね済み' })
    ).toBeInTheDocument()
  })

  it('いいね済みの状態でボタンを押すといいねが取り消される', async () => {
    render(<App />)
    await userEvent.type(screen.getByRole('textbox'), 'テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: '投稿' }))
    await userEvent.click(screen.getByRole('button', { name: 'いいね' }))
    await userEvent.click(screen.getByRole('button', { name: 'いいね済み' }))
    expect(screen.getByRole('button', { name: 'いいね' })).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostForm } from './PostForm'

describe('PostForm', () => {
  it('テキストエリアに入力できる', async () => {
    render(<PostForm onSubmit={vi.fn()} />)
    const textarea = screen.getByRole('textbox')
    await userEvent.type(textarea, 'テスト投稿')
    expect(textarea).toHaveValue('テスト投稿')
  })

  it('投稿ボタンが表示される', () => {
    render(<PostForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('button', { name: '投稿' })).toBeInTheDocument()
  })

  it('内容を入力して投稿ボタンを押すと、入力内容が送信される', async () => {
    const onSubmit = vi.fn()
    render(<PostForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByRole('textbox'), 'テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: '投稿' }))
    expect(onSubmit).toHaveBeenCalledWith('テスト投稿')
  })

  it('投稿後にテキストエリアがクリアされる', async () => {
    render(<PostForm onSubmit={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox'), 'テスト投稿')
    await userEvent.click(screen.getByRole('button', { name: '投稿' }))
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('空の状態では投稿ボタンが無効になる', () => {
    render(<PostForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('button', { name: '投稿' })).toBeDisabled()
  })
})

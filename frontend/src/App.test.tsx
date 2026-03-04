import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('@aws-amplify/ui-react', () => ({
  Authenticator: ({
    children,
  }: {
    children: (props: { signOut: () => void }) => React.ReactNode
  }) => children({ signOut: vi.fn() }),
}))

vi.mock('./lib/amplify', () => ({}))

describe('App', () => {
  it('タイトルが表示される', () => {
    render(<App />)
    expect(screen.getByText('microblog')).toBeInTheDocument()
  })

  it('ログアウトボタンが表示される', () => {
    render(<App />)
    expect(
      screen.getByRole('button', { name: 'ログアウト' })
    ).toBeInTheDocument()
  })
})

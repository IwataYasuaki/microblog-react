import { useState } from 'react'

type Props = {
  onSubmit: (content: string) => void
}

export function PostForm({ onSubmit }: Props) {
  const [content, setContent] = useState('')

  const handleSubmit = () => {
    onSubmit(content)
    setContent('')
  }

  return (
    <div>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSubmit} disabled={content === ''}>
        投稿
      </button>
    </div>
  )
}

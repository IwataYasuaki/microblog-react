import { useState } from 'react'
import styles from './PostForm.module.css'

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
    <div className={styles.form}>
      <textarea
        className={styles.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="今何してる？"
      />
      <div className={styles.footer}>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={content === ''}
        >
          投稿
        </button>
      </div>
    </div>
  )
}

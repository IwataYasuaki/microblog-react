import { useState } from 'react'
import { PostList } from './components/PostList'
import { PostForm } from './components/PostForm'
import type { Post } from './types/post'

export default function App() {
  const [posts, setPosts] = useState<Post[]>([])

  const handleSubmit = (content: string) => {
    const newPost: Post = {
      id: crypto.randomUUID(),
      content,
      authorName: 'テストユーザー',
      createdAt: new Date().toISOString(),
      likeCount: 0,
    }
    setPosts([newPost, ...posts])
  }

  return (
    <div>
      <h1>microblog</h1>
      <PostForm onSubmit={handleSubmit} />
      <PostList posts={posts} />
    </div>
  )
}

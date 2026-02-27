import { useState } from 'react'
import { PostList } from './components/PostList'
import { PostForm } from './components/PostForm'
import type { Post } from './types/post'

export default function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [likedPostIds, setLikedPostIds] = useState<string[]>([])

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

  const handleLike = (postId: string) => {
    setLikedPostIds([...likedPostIds, postId])
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likeCount: post.likeCount + 1 } : post
      )
    )
  }

  const handleUnlike = (postId: string) => {
    setLikedPostIds(likedPostIds.filter((id) => id !== postId))
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likeCount: post.likeCount - 1 } : post
      )
    )
  }

  return (
    <div>
      <h1>microblog</h1>
      <PostForm onSubmit={handleSubmit} />
      <PostList
        posts={posts}
        likedPostIds={likedPostIds}
        onLike={handleLike}
        onUnlike={handleUnlike}
      />
    </div>
  )
}

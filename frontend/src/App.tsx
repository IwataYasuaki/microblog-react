import { useState, useEffect } from 'react'
import { PostList } from './components/PostList'
import { PostForm } from './components/PostForm'
import { fetchPosts, createPost, likePost, unlikePost } from './api/posts'
import type { Post } from '@microblog/shared'

export default function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [likedPostIds, setLikedPostIds] = useState<string[]>([])

  useEffect(() => {
    fetchPosts().then(setPosts)
  }, [])

  const handleSubmit = async (content: string) => {
    const newPost = await createPost({ content })
    setPosts([newPost, ...posts])
  }

  const handleLike = async (postId: string) => {
    const updatedPost = await likePost(postId)
    setLikedPostIds([...likedPostIds, postId])
    setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)))
  }

  const handleUnlike = async (postId: string) => {
    const updatedPost = await unlikePost(postId)
    setLikedPostIds(likedPostIds.filter((id) => id !== postId))
    setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)))
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

import { useState, useEffect } from 'react'
import { PostList } from './PostList'
import { PostForm } from './PostForm'
import { fetchPosts, createPost, likePost, unlikePost } from '../api/posts'
import type { Post } from '@microblog/shared'

export function Timeline() {
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
    <>
      <PostForm onSubmit={handleSubmit} />
      <PostList
        posts={posts}
        likedPostIds={likedPostIds}
        onLike={handleLike}
        onUnlike={handleUnlike}
      />
    </>
  )
}

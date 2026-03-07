import { useState, useEffect } from 'react'
import { PostList } from './PostList'
import { PostForm } from './PostForm'
import { fetchPosts, createPost, likePost, unlikePost } from '../api/posts'
import type { Post } from '@microblog/shared'

type Props = {
  currentUsername?: string
}

export function Timeline({ currentUsername = '' }: Props) {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetchPosts().then(setPosts)
  }, [])

  const handleSubmit = async (content: string) => {
    const tempPost: Post = {
      id: crypto.randomUUID(),
      content,
      authorName: currentUsername,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      likedByMe: false,
    }
    setPosts((prev) => [tempPost, ...prev])

    try {
      const newPost = await createPost({ content })
      setPosts((prev) =>
        prev.map((post) => (post.id === tempPost.id ? newPost : post))
      )
    } catch {
      setPosts((prev) => prev.filter((post) => post.id !== tempPost.id))
    }
  }

  const handleLike = async (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, likeCount: post.likeCount + 1, likedByMe: true }
          : post
      )
    )
    try {
      await likePost(postId)
    } catch {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, likeCount: post.likeCount - 1, likedByMe: false }
            : post
        )
      )
    }
  }

  const handleUnlike = async (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, likeCount: post.likeCount - 1, likedByMe: false }
          : post
      )
    )
    try {
      await unlikePost(postId)
    } catch {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, likeCount: post.likeCount + 1, likedByMe: true }
            : post
        )
      )
    }
  }

  return (
    <>
      <PostForm onSubmit={handleSubmit} />
      <PostList posts={posts} onLike={handleLike} onUnlike={handleUnlike} />
    </>
  )
}

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
    // 先に画面を更新
    const tempPost = {
      id: crypto.randomUUID(),
      content,
      authorName: '',
      createdAt: new Date().toISOString(),
      likeCount: 0,
    }
    setPosts([tempPost, ...posts])

    // その後APIを呼ぶ
    try {
      const newPost = await createPost({ content })
      setPosts((prev) =>
        prev.map((post) => (post.id === tempPost.id ? newPost : post))
      )
    } catch {
      // 失敗したら元に戻す
      setPosts((prev) => prev.filter((post) => post.id !== tempPost.id))
    }
  }

  const handleLike = async (postId: string) => {
    // 先に画面を更新
    setLikedPostIds([...likedPostIds, postId])
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likeCount: post.likeCount + 1 } : post
      )
    )
    // その後APIを呼ぶ
    try {
      const updatedPost = await likePost(postId)
      setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)))
    } catch {
      // 失敗したら元に戻す
      setLikedPostIds(likedPostIds.filter((id) => id !== postId))
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, likeCount: post.likeCount - 1 } : post
        )
      )
    }
  }

  const handleUnlike = async (postId: string) => {
    // 先に画面を更新
    setLikedPostIds(likedPostIds.filter((id) => id !== postId))
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likeCount: post.likeCount - 1 } : post
      )
    )
    // その後APIを呼ぶ
    try {
      const updatedPost = await unlikePost(postId)
      setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)))
    } catch {
      // 失敗したら元に戻す
      setLikedPostIds([...likedPostIds, postId])
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, likeCount: post.likeCount + 1 } : post
        )
      )
    }
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

import type { Post, CreatePostInput } from '@microblog/shared'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/posts`)
  if (!response.ok) {
    throw new Error('投稿一覧の取得に失敗しました')
  }
  return response.json()
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error('投稿の作成に失敗しました')
  }
  return response.json()
}

export async function likePost(postId: string): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts/${postId}/likes`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error('いいねに失敗しました')
  }
  return response.json()
}

export async function unlikePost(postId: string): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts/${postId}/likes`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('いいねの取り消しに失敗しました')
  }
  return response.json()
}

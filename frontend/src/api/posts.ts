import type { Post, CreatePostInput } from '@microblog/shared'
import { getIdToken } from './auth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

async function authHeaders() {
  const token = await getIdToken()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

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
    headers: await authHeaders(),
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
    headers: await authHeaders(),
  })
  if (!response.ok) {
    throw new Error('いいねに失敗しました')
  }
  return response.json()
}

export async function unlikePost(postId: string): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts/${postId}/likes`, {
    method: 'DELETE',
    headers: await authHeaders(),
  })
  if (!response.ok) {
    throw new Error('いいねの取り消しに失敗しました')
  }
  return response.json()
}

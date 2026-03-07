import { PostRepository } from '../../repositories/postRepository'
import { createResponse } from '../../utils/response'

export const handler = async (
  event: {
    requestContext?: {
      authorizer?: {
        claims?: { 'cognito:username'?: string }
      }
    }
  } = {}
) => {
  const userId =
    event.requestContext?.authorizer?.claims?.['cognito:username'] ?? ''
  const repository = new PostRepository(
    process.env.TABLE_NAME ?? 'posts',
    process.env.LIKES_TABLE_NAME ?? 'likes'
  )

  try {
    const posts = await repository.listPosts()
    const postIds = posts.map((post) => post.id)
    const likedPostIds = await repository.getLikedPostIds(userId, postIds)

    const postsWithLikedByMe = posts.map((post) => ({
      ...post,
      likedByMe: likedPostIds.includes(post.id),
    }))

    return createResponse(200, postsWithLikedByMe)
  } catch (error) {
    return createResponse(500, { message: 'Internal Server Error' })
  }
}

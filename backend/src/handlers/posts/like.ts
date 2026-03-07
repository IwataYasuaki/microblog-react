import { PostRepository } from '../../repositories/postRepository'
import { createResponse } from '../../utils/response'

export const handler = async (event: {
  pathParameters: { postId: string } | null
  requestContext?: {
    authorizer?: {
      claims?: { 'cognito:username'?: string }
    }
  }
}) => {
  if (!event.pathParameters?.postId) {
    return createResponse(400, { message: 'Bad Request' })
  }

  const { postId } = event.pathParameters
  const userId =
    event.requestContext?.authorizer?.claims?.['cognito:username'] ?? ''
  const repository = new PostRepository(
    process.env.TABLE_NAME ?? 'posts',
    process.env.LIKES_TABLE_NAME ?? 'likes'
  )

  try {
    await repository.likePost(postId, userId)
    return createResponse(200, { message: 'OK' })
  } catch (error) {
    return createResponse(500, { message: 'Internal Server Error' })
  }
}

import { PostRepository } from '../../repositories/postRepository'
import { createResponse } from '../../utils/response'

export const handler = async (event: {
  body: string | null
  requestContext?: {
    authorizer?: {
      claims?: {
        'cognito:username'?: string
      }
    }
  }
}) => {
  if (!event.body) {
    return createResponse(400, { message: 'Bad Request' })
  }

  const { content } = JSON.parse(event.body)
  const authorName =
    event.requestContext?.authorizer?.claims?.['cognito:username'] ?? '名無し'
  const repository = new PostRepository(
    process.env.TABLE_NAME ?? 'posts',
    process.env.LIKES_TABLE_NAME ?? 'likes'
  )

  try {
    const post = await repository.createPost({ content, authorName })
    return createResponse(201, post)
  } catch (error) {
    return createResponse(500, { message: 'Internal Server Error' })
  }
}

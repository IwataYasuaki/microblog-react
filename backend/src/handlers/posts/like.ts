import { PostRepository } from '../../repositories/postRepository'
import { createResponse } from '../../utils/response'

export const handler = async (event: {
  pathParameters: { postId: string } | null
}) => {
  if (!event.pathParameters?.postId) {
    return createResponse(400, { message: 'Bad Request' })
  }

  const { postId } = event.pathParameters
  const repository = new PostRepository(process.env.TABLE_NAME ?? 'posts')

  try {
    const post = await repository.likePost(postId)
    return createResponse(200, post)
  } catch (error) {
    return createResponse(500, { message: 'Internal Server Error' })
  }
}

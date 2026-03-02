import { PostRepository } from '../../repositories/postRepository'
import { createResponse } from '../../utils/response'

export const handler = async (event: { body: string | null }) => {
  if (!event.body) {
    return createResponse(400, { message: 'Bad Request' })
  }

  const { content, authorName } = JSON.parse(event.body)
  const repository = new PostRepository(process.env.TABLE_NAME ?? 'posts')

  try {
    const post = await repository.createPost({ content, authorName })
    return createResponse(201, post)
  } catch (error) {
    return createResponse(500, { message: 'Internal Server Error' })
  }
}

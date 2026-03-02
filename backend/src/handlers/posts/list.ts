import { PostRepository } from '../../repositories/postRepository'
import { createResponse } from '../../utils/response'

export const handler = async () => {
  const repository = new PostRepository(process.env.TABLE_NAME ?? 'posts')
  try {
    const posts = await repository.listPosts()
    return createResponse(200, posts)
  } catch (error) {
    return createResponse(500, { message: 'Internal Server Error' })
  }
}

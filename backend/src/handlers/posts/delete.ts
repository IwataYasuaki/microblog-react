import { PostRepository } from '../../repositories/postRepository'

export const handler = async (event: {
  pathParameters: { postId: string } | null
}) => {
  if (!event.pathParameters?.postId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' }),
    }
  }

  const { postId } = event.pathParameters
  const repository = new PostRepository(process.env.TABLE_NAME ?? 'posts')

  try {
    await repository.deletePost(postId)
    return {
      statusCode: 204,
      body: '',
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
}

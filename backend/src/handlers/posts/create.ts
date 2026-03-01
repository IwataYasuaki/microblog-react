import { PostRepository } from '../../repositories/postRepository'

export const handler = async (event: { body: string | null }) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request' }),
    }
  }

  const { content, authorName } = JSON.parse(event.body)
  const repository = new PostRepository(process.env.TABLE_NAME ?? 'posts')

  try {
    const post = await repository.createPost({ content, authorName })
    return {
      statusCode: 201,
      body: JSON.stringify(post),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
}

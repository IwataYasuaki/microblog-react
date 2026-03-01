import { PostRepository } from '../../repositories/postRepository'

export const handler = async () => {
  const repository = new PostRepository(process.env.TABLE_NAME ?? 'posts')
  try {
    const posts = await repository.listPosts()
    return {
      statusCode: 200,
      body: JSON.stringify(posts),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
}

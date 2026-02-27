import type { Post as PostType } from '../types/post'

type Props = {
  post: PostType
}

export function Post({ post }: Props) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('ja-JP')
  return (
    <div>
      <p>{post.authorName}</p>
      <p>{post.content}</p>
      <span>{post.likeCount}</span>
      <time>{formattedDate}</time>
    </div>
  )
}

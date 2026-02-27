import type { Post as PostType } from '../types/post'
import { LikeButton } from './LikeButton'

type Props = {
  post: PostType
  liked: boolean
  onLike: () => void
  onUnlike: () => void
}

export function Post({ post, liked, onLike, onUnlike }: Props) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('ja-JP')

  return (
    <div>
      <p>{post.authorName}</p>
      <p>{post.content}</p>
      <time>{formattedDate}</time>
      <LikeButton
        likeCount={post.likeCount}
        liked={liked}
        onLike={onLike}
        onUnlike={onUnlike}
      />
    </div>
  )
}

import type { Post as PostType } from '@microblog/shared'
import { LikeButton } from './LikeButton'
import styles from './Post.module.css'

type Props = {
  post: PostType
  liked: boolean
  onLike: () => void
  onUnlike: () => void
}

export function Post({ post, liked, onLike, onUnlike }: Props) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('ja-JP')

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.authorName}>{post.authorName}</span>
        <time className={styles.date}>{formattedDate}</time>
      </div>
      <p className={styles.content}>{post.content}</p>
      <div className={styles.footer}>
        <LikeButton
          likeCount={post.likeCount}
          liked={liked}
          onLike={onLike}
          onUnlike={onUnlike}
        />
      </div>
    </div>
  )
}

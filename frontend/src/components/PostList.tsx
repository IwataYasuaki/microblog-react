import type { Post } from '@microblog/shared'
import { Post as PostComponent } from './Post'
import styles from './PostList.module.css'

type Props = {
  posts: Post[]
  onLike: (postId: string) => void
  onUnlike: (postId: string) => void
}

export function PostList({ posts, onLike, onUnlike }: Props) {
  if (posts.length === 0) {
    return <p className={styles.empty}>投稿がありません</p>
  }

  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.id}>
          <PostComponent
            post={post}
            liked={post.likedByMe}
            onLike={() => onLike(post.id)}
            onUnlike={() => onUnlike(post.id)}
          />
        </li>
      ))}
    </ul>
  )
}

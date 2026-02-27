import type { Post } from '../types/post'
import { Post as PostComponent } from './Post'

type Props = {
  posts: Post[]
  likedPostIds: string[]
  onLike: (postId: string) => void
  onUnlike: (postId: string) => void
}

export function PostList({ posts, likedPostIds, onLike, onUnlike }: Props) {
  if (posts.length === 0) {
    return <p>投稿がありません</p>
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <PostComponent
            post={post}
            liked={likedPostIds.includes(post.id)}
            onLike={() => onLike(post.id)}
            onUnlike={() => onUnlike(post.id)}
          />
        </li>
      ))}
    </ul>
  )
}

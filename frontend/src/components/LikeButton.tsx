type Props = {
  likeCount: number
  liked: boolean
  onLike: () => void
  onUnlike: () => void
}

export function LikeButton({ likeCount, liked, onLike, onUnlike }: Props) {
  return (
    <div>
      <span>{likeCount}</span>
      <button onClick={liked ? onUnlike : onLike}>
        {liked ? 'いいね済み' : 'いいね'}
      </button>
    </div>
  )
}

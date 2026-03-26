import styles from './LikeButton.module.css'

type Props = {
  likeCount: number
  liked: boolean
  onLike: () => void
  onUnlike: () => void
}

export function LikeButton({ likeCount, liked, onLike, onUnlike }: Props) {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${liked ? styles.buttonLiked : ''}`}
        onClick={liked ? onUnlike : onLike}
        aria-label={liked ? 'いいね済み' : 'いいね'}
      >
        {liked ? '♥' : '♡'} {liked ? 'いいね済み' : 'いいね'}
      </button>
      <span className={`${styles.likeCount} ${liked ? styles.countLiked : ''}`}>
        {likeCount}
      </span>
    </div>
  )
}

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Toaster } from 'react-hot-toast'
import { Timeline } from './components/Timeline'
import './lib/amplify'
import styles from './App.module.css'

export default function App() {
  return (
    <Authenticator signUpAttributes={['email']}>
      {({ signOut, user }) => (
        <>
          <Toaster />
          <header className={styles.header}>
            <div className={styles.headerInner}>
              <h1 className={styles.title}>microblog</h1>
              <button className={styles.logoutButton} onClick={signOut}>
                ログアウト
              </button>
            </div>
          </header>
          <div className={styles.container}>
            <Timeline currentUsername={user?.username} />
          </div>
        </>
      )}
    </Authenticator>
  )
}

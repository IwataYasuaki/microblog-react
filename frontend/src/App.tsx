import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Toaster } from 'react-hot-toast'
import { Timeline } from './components/Timeline'
import './lib/amplify'

export default function App() {
  return (
    <Authenticator signUpAttributes={['email']}>
      {({ signOut, user }) => (
        <div>
          <Toaster />
          <h1>microblog</h1>
          <button onClick={signOut}>ログアウト</button>
          <Timeline currentUsername={user?.username} />
        </div>
      )}
    </Authenticator>
  )
}

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Timeline } from './components/Timeline'
import './lib/amplify'

export default function App() {
  return (
    <Authenticator>
      {({ signOut }) => (
        <div>
          <h1>microblog</h1>
          <button onClick={signOut}>ログアウト</button>
          <Timeline />
        </div>
      )}
    </Authenticator>
  )
}

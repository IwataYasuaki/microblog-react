import {
  signUp,
  signIn,
  signOut,
  getCurrentUser as amplifyGetCurrentUser,
  fetchAuthSession,
} from 'aws-amplify/auth'

export async function register(email: string, password: string) {
  return signUp({
    username: email,
    password,
    options: { userAttributes: { email } },
  })
}

export async function login(email: string, password: string) {
  return signIn({ username: email, password })
}

export async function logout() {
  return signOut()
}

export async function getCurrentUser() {
  return amplifyGetCurrentUser()
}

export async function getIdToken(): Promise<string | undefined> {
  const session = await fetchAuthSession()
  return session.tokens?.idToken?.toString()
}

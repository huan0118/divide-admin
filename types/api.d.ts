export interface UserInfo {
  accessToken: string
  userId: string | number
  username: string
  email: string
  avatar: string
  desc?: string
}

export interface ListInfo {
  id: string | number
  name: string
  url: string
  email: string
  address: string
  string: string
  number: number
  object?: object
  from: string
}

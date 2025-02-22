export interface Account {
  _id: string;
  username: string
  password: string
  role: 'user' | 'admin'
}

export interface FormData {
  username: Account['username']
  password: Account['password']
}

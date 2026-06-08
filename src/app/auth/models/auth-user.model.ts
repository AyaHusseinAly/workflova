export interface DemoUser {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface DemoSession {
  userId: string;
  email: string;
}

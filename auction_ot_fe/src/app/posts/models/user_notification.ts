class UserNotification {
  userId: string;
  username: string;
  email: string;
  constructor(id: string, username: string, email: string) {
    this.userId = id;
    this.username = username;
    this.email = email;
  }
}

export default UserNotification;
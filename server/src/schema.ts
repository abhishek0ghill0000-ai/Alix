generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String   @id @default(cuid())
  uniqueId       String   @unique // e.g. alix123
  username       String   @unique
  email          String?  @unique
  passwordHash   String?  // bcrypt
  profilePhoto   String?  // image URL/ID
  bio            String?
  location       String?  // encrypted
  totalCallTime  Int      @default(0)
  callCount      Int      @default(0)
  screenTime     Int      @default(0) // minutes
  createdAt      DateTime @default(now())
  friends        Friend[] @relation("UserFriends")
  posts          Post[]
  comments       Comment[]
  likes          Like[]
  accessGrants   AccessGrant[]
  messages       Message[]
}

model Friend {
  id          String   @id @default(cuid())
  userId      String
  friendId    String
  status      String   @default("pending") // pending/accepted/blocked
  createdAt   DateTime @default(now())
  user        User     @relation("UserFriends", fields: [userId], references: [id])
  friend      User     @relation("UserFriends", fields: [friendId], references: [id])
  @@unique([userId, friendId])
}

model Post {
  id        String   @id @default(cuid())
  content   String
  imageUrl  String?  // [file:2] style
  userId    String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  comments  Comment[]
  likes     Like[]
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  userId    String
  postId    String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  post      Post     @relation(fields: [postId], references: [id])
}

model Like {
  id     String @id @default(cuid())
  userId String
  postId String
  user   User   @relation(fields: [userId], references: [id])
  post   Post   @relation(fields: [postId], references: [id])
  @@unique([userId, postId])
}

model Message {
  id        String   @id @default(cuid())
  content   String
  userId    String
  friendId  String   // private chat
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  friend    User     @relation(fields: [friendId], references: [id])
}

model AccessGrant {
  id          String   @id @default(cuid())
  granterId   String   // profile owner
  granteeId   String   // viewer
  code        String   @unique // one-time
  linkToken   String   @unique // permanent
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  granter     User     @relation(fields: [granterId], references: [id])
  grantee     User     @relation(fields: [granteeId], references: [id])
}
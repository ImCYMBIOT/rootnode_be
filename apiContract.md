# API Contract for Live Coding Platform

---

## 🔐 Auth APIs

### 📌 `POST /auth/signup`

**Description:** Register a new user.  
**Body:**

```json
{
  "username": "dev123",
  "password": "securePassword"
}
```

**Response:**

```json
{
  "message": "User created",
  "user": {
    "_id": "userId",
    "username": "dev123"
  }
}
```

---

### 📌 `POST /auth/login`

**Description:** Login with credentials.  
**Body:**

```json
{
  "username": "dev123",
  "password": "securePassword"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "uuid": "user-uuid"
}
```

---

## 📡 Streaming APIs

### 📌 `POST /stream/start`

**Description:** Start a new live stream.  
**Body:**

```json
{
  "uuid": "user-uuid",
  "title": "My Live Coding Session",
  "description": "Building a project"
}
```

**Response:**

```json
{
  "message": "Stream started",
  "stream": {
    "_id": "...",
    "uuid": "user-uuid",
    "username": "dev123",
    "title": "...",
    "description": "...",
    "isLive": true
  }
}
```

---

### 📌 `POST /stream/stop`

**Description:** Stop the live stream.  
**Body:**

```json
{
  "uuid": "user-uuid"
}
```

**Response:**

```json
{
  "message": "Stream stopped",
  "stream": {
    "_id": "...",
    "isLive": false
  }
}
```

---

### 📌 `GET /stream/live`

**Description:** Get all currently live streams.  
**Response:**

```json
[
  {
    "_id": "...",
    "uuid": "user-uuid",
    "username": "dev123",
    "title": "...",
    "description": "...",
    "isLive": true
  }
]
```

---

## 📁 Repository APIs

### 📌 `POST /repo/create`

**Description:** Create a new repository for a user.  
**Body:**

```json
{
  "repoName": "my-repo",
  "uuid": "user-uuid"
}
```

**Response:**

```json
{
  "message": "Repository created",
  "repoName": "my-repo",
  "uuid": "user-uuid"
}
```

---

### 📌 `GET /repo/user/:uuid/repos`

**Description:** Get all repositories created by a user.  
**URL Params:**

- `:uuid` — the user's UUID

**Response:**

```json
[
  {
    "_id": "...",
    "uuid": "user-uuid",
    "name": "my-repo"
  }
]
```

---

### 📌 `POST /repo/commit`

**Description:** Commit all changes in a user’s repo.  
**Body:**

```json
{
  "uuid": "user-uuid",
  "repoName": "my-repo",
  "commitMessage": "Updated file"
}
```

**Response:**

```json
{
  "message": "Changes committed",
  "repoName": "my-repo",
  "commitMessage": "Updated file"
}
```

---

## 👥 Contributor APIs

### 📌 `POST /contribute/add`

**Description:** Add a contributor to a repository.  
**Body:**

```json
{
  "ownerUuid": "owner-uuid",
  "repoName": "my-repo",
  "contributorUsername": "contributor123"
}
```

**Response:**

```json
{
  "message": "Contributor added",
  "contributor": {
    "_id": "...",
    "repoId": "...",
    "contributorId": "...",
    "role": "contributor"
  }
}
```

---

### 📌 `GET /contribute/repo/:repoName/contributors`

**Description:** Get all contributors of a repository.  
**URL Params:**

- `:repoName` — name of the repository

**Query:**

- `ownerUuid=...` — the UUID of the repository owner

**Response:**

```json
[
  {
    "username": "contributor123",
    "role": "contributor"
  },
  {
    "username": "ownerUser",
    "role": "owner"
  }
]
```

---

### 📌 `DELETE /contribute/remove`

**Description:** Remove a contributor from a repository.  
**Body:**

```json
{
  "ownerUuid": "owner-uuid",
  "repoName": "my-repo",
  "contributorUsername": "contributor123"
}
```

**Response:**

```json
{
  "message": "Contributor removed"
}
```

---

## 📡 WebSocket (Real-Time)

**Connected at:** `ws://<your-host>:3000`  
**Sends data on:**

#### 📄 File changes:

```json
{
  "repoName": "my-repo",
  "changes": {
    "file": "index.js",
    "content": "<updated content>"
  }
}
```

#### ✅ Commits:

```json
{
  "repoName": "my-repo",
  "message": "Commit: Updated file"
}
```

---

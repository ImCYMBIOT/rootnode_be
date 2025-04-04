Here's a clean and detailed **API contract** for all the current APIs in your project, grouped by functionality. This will help frontend developers understand exactly how to interact with each API.

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

## 📡 WebSocket (Real-Time)

- **Connected at:** `ws://<your-host>:3000`
- **Sends data on:**
  - File changes:
    ```json
    {
      "repoName": "my-repo",
      "changes": {
        "file": "index.js",
        "content": "<updated content>"
      }
    }
    ```
  - Commits:
    ```json
    {
      "repoName": "my-repo",
      "message": "Commit: Updated file"
    }
    ```

---

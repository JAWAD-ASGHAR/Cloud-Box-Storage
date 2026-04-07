# Technical overview: `hamad` branch (current workspace)

This document describes the Cloud Box Storage app **as it exists on the `hamad` branch**: stack, structure, data flow, and what was intentionally removed compared to `main`. It is written for engineers who need to understand the **UI-preview / mock** codebase before re-attaching real backend services.

---

## 1. Purpose of this branch

The `hamad` branch is a **frontend-only preview**:

- **No** NextAuth / Google OAuth.
- **No** Firebase (Firestore) reads or writes.
- **No** Supabase client usage in application code.
- **No** `/api/upload` route or other API routes for persistence.

Folders, files, the sidebar layout, and storage widgets render using **static mock data** and **local React state**. The login screen is cosmetic: it redirects to `/` without establishing a session.

---

## 2. Technology stack

| Area | Choice |
|------|--------|
| Framework | Next.js **15.0.7** (App Router) |
| UI | React **18.3.1**, Tailwind CSS, DaisyUI |
| Icons | `react-icons`, `moment` for date formatting |
| Language | Mostly `.js` / `.jsx`; TypeScript in `devDependencies` only (no strict TS app layer) |

**Dependencies removed vs `main` (not installed on `hamad`):**

- `next-auth`
- `firebase`
- `@supabase/supabase-js`

---

## 3. Repository layout (relevant paths)

```
app/                    # App Router pages
  layout.js             # Root layout + provider stack (no SessionProvider)
  page.js               # Home: mock folders/files at root
  login/page.jsx        # “UI Preview” login → window.location to /
  files/page.js         # All files view (mock-driven)
  starred/page.js       # Starred files (mock)
  folder/[id]/page.js   # Folder detail (mock)
  folder/view-all/page.js
  help/page.js
  not-found.js          # Simple 404 (no auth redirect)

Components/             # Presentational + feature UI
  file/, folder/, storage/, SideNavBar, SearchBar, etc.

Context/                # React contexts (folder id, refresh flags, storage UI)
Providers/*ContextWrapper.js
Data/mockData.js        # mockFolders, mockFiles, mockUser (NEW on hamad)

next.config.mjs         # images.domains includes lh3.googleusercontent.com + ui-avatars.com
```

---

## 4. Root layout and providers

`app/layout.js` wraps the app with (in order):

1. `ParentFolderIdContextWrapper` — current folder scope for create/upload.
2. `FolderRefreshContextWrapper` / `FileRefreshContextWrapper` — boolean toggles to trigger list refreshes (on `hamad` these mostly flip state in child components that still call `setFolderRefresh` / `setFileRefresh`, but lists are mock-based).
3. `StorageContextWrapper` — holds `usedStorage` / `setUsedStorage` (still used by upload modal logic patterns; on `hamad`, storage stats are largely static).
4. `ChildrenProvider` — **always** renders `SideNavBar` + main column + `Storage` sidebar.

**Not present vs `main`:** `SessionWrapper` (`next-auth/react` `SessionProvider`) is omitted, so `useSession` is not available app-wide.

---

## 5. `ChildrenProvider` behavior (`hamad`)

Unlike `main`, the shell **does not** gate on authentication:

- `SideNavBar`, main content, and `Storage` render for every route.
- There is no “logged-out: render only `children` (e.g. login full-bleed)” branch.

---

## 6. Mock data (`Data/mockData.js`)

| Export | Role |
|--------|------|
| `mockFolders` | Tree via `parentFolderId` (numeric). `createdBy` is a fixed string. |
| `mockFiles` | Files with `parentFolderId`, `type`, `size` string, `imageUrl`, etc. |
| `mockUser` | `{ name, email, image }` for `UserInfo`; image uses ui-avatars.com |

Pages filter mock arrays by `parentFolderId` or other fields locally. There is **no** multi-user isolation on this branch.

---

## 7. Login page (`app/login/page.jsx`)

- Title copy indicates **“Cloud Box (UI Preview)”**.
- Button **“Enter Dashboard”** sets `window.location.href = '/'`.
- No `signIn`, no session, no redirect-away when already “logged in.”

---

## 8. Key UI components (simplified behavior on `hamad`)

### `Components/storage/UserInfo.js`

- Uses `mockUser` instead of `useSession()`.
- Logout control is **non-functional** (`cursor-default`, no `signOut`).

### `Components/storage/StorageInfo.js`

- **Hard-coded** totals and category breakdowns (no Firestore aggregation).
- No `useEffect` tied to `fileRefresh` / real file queries.

### `Components/folder/FolderList.js`, `InnerFolderList.js`

- Navigation to `/folder/[id]` and `/folder/view-all` may still exist, but persistence, delete recursion, and Supabase cleanup are **removed or stubbed** (mock lists).

### `Components/file/FileList.js`, `FileItem.js`

- Delete / star / download behaviors are adapted to **mock** data (no Firestore `deleteDoc`, no Supabase `storage.remove` / `download`).

### `Components/file/UploadFileModal.js`, `Components/folder/CreateFolderModal.js`

- No `setDoc` to Firestore, no `fetch('/api/upload')` to Supabase-backed API.

### `Components/SearchBar.js`

- On Enter, only `console.log`s the input value — **no** query to a backend or filtered search state wired through the app.

---

## 9. Next.js configuration

`next.config.mjs`:

- `reactStrictMode: false` (same idea as `main`).
- `images.domains`: `lh3.googleusercontent.com`, `ui-avatars.com` (the second supports mock avatar URLs without additional config).

---

## 10. Security and env on `hamad`

- No `.env` usage required for auth or database in the running UI preview.
- **Do not** commit real secrets; this branch simply does not consume them in code paths.

---

## 11. Comparison summary: `hamad` vs `main` (conceptual)

| Capability | `main` | `hamad` |
|------------|--------|---------|
| Google sign-in (NextAuth) | Yes | No |
| Route protection | Yes (redirect to `/login`) | No |
| Firestore `folders` / `files` | Yes | No |
| Supabase Storage uploads/downloads/deletes | Yes | No |
| Server route `POST /api/upload` | Yes | No |
| Per-user `createdBy` filtering | Yes | N/A (mock user string only) |
| Firebase Analytics init | Yes (client) | Config file removed |

---

## 12. Known quirks on `hamad`

- `StorageContextWrapper` initializes `usedStorage` to boolean `false` while upload-related code on `main` treats it as **bytes** (number). On `hamad` this matters less because limits are not enforced against real storage.
- Mock `id` types may differ from Firestore string document IDs used on `main`; any reintegration should align types with Firestore conventions.

---

## 13. Reference for “how it used to work”

See **`docs/REBUILD_BACKEND_AND_AUTH.md`** for the full description of the `main` branch architecture and a step-by-step plan to restore parity.

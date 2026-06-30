# Requirements Document

## Introduction

This document specifies the requirements for the **User Profile Page** feature of the VeoLMS frontend. The feature introduces a dedicated `/profile` route where authenticated learners can view and update their profile information (name and avatar). Updates are persisted via `PATCH /api/user/updateProfile` and the local Redux state is refreshed immediately after a successful update by calling the existing `handleGetMe` hook.

---

## Glossary

- **ProfilePage**: The React page component rendered at the `/profile` route
- **Profile_Service**: The service layer module (`profile.service.ts`) responsible for making HTTP calls related to profile updates
- **Profile_Hook**: The `useProfileUpdate` custom hook that orchestrates the update flow
- **Auth_Slice**: The Redux Toolkit slice at `src/features/auth/state/auth.slice.ts` managing `user`, `loading`, and `error` state
- **handleGetMe**: The function exposed by the `useAuth` hook that calls `GET /auth/get-me` and dispatches `setUser` to the Auth_Slice
- **Protected**: The existing route guard component that redirects unauthenticated users to `/login`
- **AppLayout**: The existing layout wrapper that renders the top `<Navbar minimal />` and an `<Outlet />`
- **UserDashboard**: The existing learner dashboard page at `/dashboard` whose sidebar navigation will be extended with a Profile link
- **Avatar_Preview**: A local object URL shown in the UI immediately after the user selects an image file, before the form is submitted
- **axiosInstance**: The pre-configured Axios instance at `src/lib/authInstance.ts` with `withCredentials`, base URL `/api`, and token-refresh interceptor

---

## Requirements

### Requirement 1: Profile Route and Page Rendering

**User Story:** As a learner, I want a dedicated profile page at `/profile`, so that I can view and manage my account information in one place.

#### Acceptance Criteria

1. THE ProfilePage SHALL be accessible at the `/profile` route within the `AppLayout` children in `app.routes.tsx`
2. THE `/profile` route SHALL be wrapped in the `<Protected>` guard so that unauthenticated users are redirected to `/login`
3. WHEN an authenticated user navigates to `/profile`, THE ProfilePage SHALL render displaying the user's current name, email, and avatar (or initials placeholder when no avatar URL is present)
4. THE ProfilePage SHALL read user data from the Redux Auth_Slice via `useSelector((state: any) => state.auth.user)` using the access pattern `reduxUser?.data?.name`, `reduxUser?.data?.email`, `reduxUser?.data?.avatarUrl`
5. THE ProfilePage SHALL apply the existing dark-theme design language: `bg-neutral-950` background, `text-white` text, `border-white/5` borders, and Tailwind CSS v4 utility classes consistent with `UserDashboard`

---

### Requirement 2: Profile Information Display

**User Story:** As a learner, I want to see my current profile details clearly displayed, so that I know what information is on file for my account.

#### Acceptance Criteria

1. WHEN the ProfilePage is rendered in view mode, THE ProfilePage SHALL display the user's full name as it exists in the Auth_Slice
2. WHEN the ProfilePage is rendered in view mode, THE ProfilePage SHALL display the user's email address (read-only, not editable)
3. WHEN `reduxUser?.data?.avatarUrl` is a non-empty string, THE ProfilePage SHALL display the avatar image in a circular container
4. WHEN `reduxUser?.data?.avatarUrl` is absent or empty, THE ProfilePage SHALL display the user's initials as a placeholder in the circular avatar container
5. THE ProfilePage SHALL display an "Edit Profile" button that switches the page to edit mode when clicked

---

### Requirement 3: Inline Edit Form

**User Story:** As a learner, I want to edit my name and avatar inline on the profile page, so that I can update my information without navigating to a separate settings page.

#### Acceptance Criteria

1. WHEN the user clicks "Edit Profile", THE ProfilePage SHALL switch to edit mode displaying an inline form with a name text input and an avatar upload control
2. WHEN edit mode is active, THE ProfilePage SHALL pre-populate the name input with the user's current name from the Auth_Slice
3. WHEN edit mode is active, THE ProfilePage SHALL display a "Cancel" button that returns the page to view mode without saving any changes
4. THE inline form SHALL use `react-hook-form` for form state management and field registration
5. THE inline form SHALL display a "Save" button that submits the form when clicked
6. WHILE the form submission is in progress, THE ProfilePage SHALL disable the "Save" button and show a loading indicator to prevent duplicate submissions

---

### Requirement 4: Avatar Selection and Preview

**User Story:** As a learner, I want to select a new avatar image and see a preview before saving, so that I can confirm my choice before committing the change.

#### Acceptance Criteria

1. WHEN the user interacts with the avatar upload control in edit mode, THE ProfilePage SHALL open a file picker restricted to image files (`accept="image/*"`)
2. WHEN the user selects a valid image file, THE ProfilePage SHALL immediately display an Avatar_Preview of the selected image in the avatar circle before form submission
3. WHEN the user selects a file whose MIME type does not start with `image/`, THE ProfilePage SHALL reject the file, display an error toast via `react-hot-toast`, and not update the Avatar_Preview
4. WHEN the user selects an image file larger than 5 MB, THE ProfilePage SHALL reject the file, display an error toast via `react-hot-toast`, and not update the Avatar_Preview
5. THE avatar field SHALL be optional — submitting the form without selecting a new file SHALL only update the name field

---

### Requirement 5: Profile Update Submission

**User Story:** As a learner, I want my profile changes to be saved to the server, so that my updated name and avatar are persisted across sessions and devices.

#### Acceptance Criteria

1. WHEN the user submits the edit form with a valid name, THE Profile_Service SHALL send a `PATCH` request to `/api/user/updateProfile` using `axiosInstance` with a `multipart/form-data` body containing the `name` field
2. WHEN the user has also selected a new avatar image, THE Profile_Service SHALL include the avatar `File` as the `avatar` field in the `multipart/form-data` body
3. WHEN the `name` field is empty or contains only whitespace characters, THE ProfilePage SHALL prevent form submission and display an inline validation error on the name input field
4. WHEN the backend returns a `200` response, THE Profile_Hook SHALL call `handleGetMe()` to refetch the user from `GET /auth/get-me` and dispatch `setUser` to the Auth_Slice
5. WHEN `handleGetMe()` completes successfully after a profile update, THE ProfilePage SHALL reflect the refreshed name and avatarUrl from the Auth_Slice without requiring a page reload
6. WHEN the profile update succeeds, THE ProfilePage SHALL display a success toast via `react-hot-toast` and return to view mode

---

### Requirement 6: Error Handling

**User Story:** As a learner, I want clear feedback when my profile update fails, so that I can understand what went wrong and retry if needed.

#### Acceptance Criteria

1. IF the `PATCH /api/user/updateProfile` request fails, THEN THE Profile_Hook SHALL catch the error and display an error toast via `react-hot-toast` with a descriptive message
2. IF the network request fails, THEN THE ProfilePage SHALL remain in edit mode so the user can retry without re-entering their data
3. IF `handleGetMe()` fails after a successful `PATCH`, THEN THE ProfilePage SHALL display a warning toast informing the user that their data may be stale and to refresh the page
4. IF the user is unauthenticated when accessing `/profile`, THEN THE `<Protected>` guard SHALL redirect the user to `/login` before the ProfilePage renders

---

### Requirement 7: Sidebar Navigation Link

**User Story:** As a learner, I want a "Profile" link in the dashboard sidebar, so that I can easily navigate to my profile page from the dashboard.

#### Acceptance Criteria

1. THE `UserDashboard` sidebar navigation SHALL include a "Profile" nav item with an appropriate icon
2. WHEN the user clicks the "Profile" nav item, THE UserDashboard SHALL navigate to the `/profile` route using `useNavigate`
3. THE "Profile" nav item SHALL follow the same visual style as the existing `SidebarButton` components (active/inactive states, icon, label)
4. WHEN the mobile navigation drawer is open, THE "Profile" nav item SHALL also be present and close the drawer on click

---

### Requirement 8: Feature Folder Structure

**User Story:** As a developer, I want the profile feature to follow the existing feature folder convention, so that the codebase remains consistent and maintainable.

#### Acceptance Criteria

1. THE Profile_Service SHALL be located at `src/features/user-profile/service/profile.service.ts`
2. THE Profile_Hook SHALL be located at `src/features/user-profile/hook/profile.hook.ts`
3. THE ProfilePage component SHALL be located at `src/features/user-profile/pages/ProfilePage.tsx`
4. WHEN transport mechanisms or UI implementations are changed in other features, THE Profile_Service, Profile_Hook, and ProfilePage SHALL remain independently maintainable by following the separation of concerns defined in this document

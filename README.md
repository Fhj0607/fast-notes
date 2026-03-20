Notes App – React Native (Expo)

Requirements

- Node.js
- npm
- Expo CLI
- Android Studio with an emulator OR Expo Go on a phone

Install dependencies

- npm install

Run the app (emulator must already be running)

- npm run start, then i pressed a to select the run option in the terminal menu

Then open the Android emulator or scan the QR code with Expo Go.

Requirements met:

- Camera | Permissions, Capture and Pick, and Preview (20%): Permissions are prompted before upload or using camera. I use dynamic pressables to allow user to navigate imagery. There is no title saying "staged" but there is a preview section before uploading.
- Storage & Validation | Client-side validation, supabase upload, and DB linking (25%): file size and type is validated client-side before upload. Each image is stored in bucket storage inside supabase with unique names, and they are linked to notes-table in the image-url column.
- UI/UX | Aspect ratio handling, and error Messaging (20%): Image ratio is controlled with style width and resizeMode, and file size and type is checked client-side before uploading with simple if-checks.
- Notifications | Permissions, Trigger, and Content injection: Permissions prompted at app launch. I use local trigger.

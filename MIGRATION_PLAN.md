# Migration Plan: Upgrading to React Native 0.80 with Expo Bare

## Rationale

Upgrading a legacy React Native app to the latest version (0.80) with Expo bare and TypeScript is a major change. The safest and most maintainable approach is to create a new project using the latest tooling, then incrementally migrate code and features. This avoids legacy config issues, allows for incremental testing, and leverages modern best practices.

---

## Step-by-Step Migration Plan

### 1. Scaffold a New Project

- Create a new folder in your repo, e.g., `new/`.
- Scaffold a new Expo bare project with TypeScript:
  ```sh
  npx create-expo-app new --template expo-template-blank-typescript
  # Or use the Expo CLI to initialize a bare workflow
  cd new
  npx expo eject
  ```
- Confirm the project runs on both iOS and Android with `npx expo run:ios` and `npx expo run:android`.

### 2. Prepare for Migration

- Keep both the old and new projects in the same repo for easy reference and diffing.
- Use the new project's config files (`tsconfig.json`, `babel.config.js`, etc.) as the base.

### 3. Migrate Code Incrementally

- **Copy the `app/` folder** from the old project to the new one.
- Copy over utility files, types, and services as needed.
- Only migrate files you actually use; leave behind unused or deprecated code.
- Update imports and paths to match the new structure.

### 4. Migrate and Update Dependencies

- Install only the dependencies you need, using the latest compatible versions.
- Prefer Expo-compatible packages for native modules.
- Use `npm install` or `yarn add` as appropriate.
- Remove unused or deprecated dependencies.

### 5. Update Project Configuration

- Adjust navigation, linking, and entry points to match Expo's structure.
- Update any platform-specific code (iOS/Android) as needed.
- Migrate assets, fonts, and images.

### 6. Refactor and Modernize

- As you migrate, refactor legacy code:
  - Convert class components to functional components with hooks.
  - Improve state management (consider Zustand or similar).
  - Add or improve TypeScript types.
  - Remove or replace deprecated APIs.

### 7. Test Early and Often

- After each migration step, run the app on both platforms.
- Use Expo's dev tools for fast feedback.
- Set up Jest and React Native Testing Library for unit and integration tests.

### 8. Migrate Native Code (If Needed)

- If you have custom native code, migrate it last.
- Use Expo's documentation for linking and configuration.
- Test native modules thoroughly.

### 9. Finalize and Clean Up

- Remove any unused files or code.
- Update documentation to reflect the new structure and setup.
- Ensure all features are working as expected.

---

## Additional Tips

- **Version Control:** Commit frequently and use branches for major migration steps.
- **Documentation:** Document any changes, refactors, or new patterns as you go.
- **Testing:** Prioritize setting up a robust test suite early in the migration.
- **Fallback:** Keep the old project intact until the new one is fully functional.

---

## Summary

This migration plan provides a safe, incremental path to modernizing your React Native app with Expo bare and TypeScript. By starting fresh and migrating code step-by-step, you minimize risk, leverage new tooling, and set your project up for long-term maintainability.

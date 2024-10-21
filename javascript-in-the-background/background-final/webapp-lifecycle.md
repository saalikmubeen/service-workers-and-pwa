
# Understanding the Web App Lifecycle

On mobile devices, apps operate under stricter resource management due to limited memory and battery constraints. Mobile operating systems handle app life cycles more efficiently to save resources:

- **Active State (Foreground)**: When an app is open and in focus, it's running normally. JavaScript for a web app (in a browser or PWA) behaves just like on a desktop. This is the only time when the app is fully active and using resources.

- **Paused/Suspended State**: When the user switches to another app or returns to the home screen, the current app is paused. The app is still in memory but not actively running code. JavaScript execution stops, and the app is essentially frozen. The operating system might capture a screenshot of the app at this point to show it in the app switcher. The app can remain in this state for a long time, consuming no CPU but staying in RAM.

- **Killed State**: If the system needs more memory for other apps or tasks, it may kill the app entirely. In this case, the app is removed from memory, but the screenshot may still appear in the app switcher. The user can still see the app in the task manager, but when they reopen it, the app restarts from scratch.

## Impact on Web Apps (PWAs & Browsers)

When developing web apps or Progressive Web Apps (PWAs), you need to account for these states:

- **Running (Foreground)**: The web app is in memory, and all JavaScript is running normally.

- **Background (Suspended/Paused)**: If the app goes into the background, its state is saved, but JavaScript execution is paused. The app won't perform any operations like syncing data or refreshing the UI until it's brought back into focus.

- **Killed (Disposed)**: The app is removed from memory if the system kills it. The next time the user opens the app, it will need to reload completely. This is a critical state for developers to handle gracefully.

## What Happens When the User Switches Between Apps or Tabs?

There are different states web apps can be in when the user switches away:

- **In Memory and Running**: On desktop, when the user switches tabs, the web app is still running in the background, and timers or network requests are still active.

- **In Memory but Paused**: On mobile, when a user switches to another app, the web app is paused. No code runs, but the app remains in memory. The app is not consuming resources, but if the user returns to it, it will resume from where it left off.

- **Not in Memory** : If the system needs more memory, the app may be killed. When the user returns to the app, they will see the app start from scratch, even though they might expect to pick up where they left off because the OS still shows the app in the multitasking view (with a screenshot of the previous state).

# Detailed Notes on Browser Background Tasks and Timers

## 1. Overview of Browser Behavior with Background Tabs

- When a website moves to the background (e.g., a different tab or minimized window), browsers manage resources by limiting tasks like animations and timers to save battery.
- This behavior varies by browser and OS, evolving to reduce unnecessary processing for background tasks.
- Previously, browsers ran all tasks at full speed even if a tab was hidden. Now, browsers optimize these processes depending on visibility.

## 2. Animations and Frame Rates

- **Request Animation Frame (RAF):**
  - Used to synchronize JavaScript execution with screen repaints for smoother animations.
  - When a website moves to the background, RAF stops entirely (goes to 0 FPS).
- **CSS Animations/Transitions:**
  - Similar behavior as RAF. They stop running when the tab or window is hidden, saving processing power.

## 3. Timers (SetTimeout & SetInterval)

- **Foreground Behavior:**
  - Timers run normally with the frequency you set (e.g., every 10ms or 10s).
- **Background Behavior:**
  - Timers slow down. For example, if your timer runs every 10ms, the browser will slow down the frequency to reduce resource usage.
  - After ~10 minutes of inactivity, Chrome reduces timer execution to once per 10 seconds.
  - The delay ensures that background tabs don’t waste power, prioritizing active tabs.
- **Behavior Across Browsers:**
  - Chrome limits timer frequency but doesn’t stop them completely, whereas Firefox and Safari may aggressively reduce timer execution.

## 4. Threads (Web Workers vs. Service Workers)

- **Web Workers:**
  - A separate thread that runs in the background but is tied to the current page.
  - Timers and tasks in a web worker continue to run at full speed, even if the page is hidden, because web workers are not attached to page navigation.
  - Main thread timers are throttled, but web workers are not.
- **Service Workers:**
  - Also run in the background but are independent of page navigation, primarily used for background sync, push notifications, and offline capabilities.
  - Safari aggressively stops service workers shortly after the page is hidden to save battery.
  - Brave (and some other Chromium-based browsers) suspend tabs entirely, including service workers, after some time to save power.

## 5. Browser-Specific Behavior

- **Chrome:**
  - Chrome limits timers and animations in background tabs but generally keeps web workers running.
  - After 10 minutes of inactivity, timers reduce significantly to one per 10 seconds.
- **Firefox:**
  - Firefox behaves similarly but may pause the page even when covered by another OS window.
  - Timers and animations are slowed down or stopped when the tab or window is hidden.
- **Safari:**
  - Safari is the most aggressive in conserving power. It stops timers, animations, web workers, and even service workers shortly after the page is hidden.
  - This aggressive behavior is one reason why Safari is often claimed to save more battery.
- **Brave:**
  - Brave modifies the default Chromium behavior, focusing on battery savings by suspending inactive tabs and reducing background activity.

## 6. Impact on User Experience

- When a user reopens a hidden or minimized tab, all tasks like animations and timers return to normal (100% speed).
- If a set interval was supposed to run every second but the tab was in the background for a while, it will only execute the pending code once, not 60 times.
- This ensures that backgrounded pages don’t cause a sudden surge in activity when brought back to the foreground.

## 7. Changes in Future Versions

- **Chrome 108+:**
  - Google is experimenting with more aggressive optimizations, potentially stopping background timers entirely, encouraging developers to avoid using timers for background tasks.
  - Future versions of Chrome may adopt these changes to further improve battery performance.

## 8. Key Concepts

- **Hidden Page:** A webpage in a tab or window that is not visible to the user.
- **Throttling:** Reducing the frequency of task execution (e.g., timers) to save resources when a page is hidden.
- **Suspension:** A more aggressive measure where a tab is kept in memory but loses execution rights (e.g., Brave's approach).
- **Service Worker Lifecycle:** Service workers are often unaffected by tab visibility, except for browsers like Safari, which actively stop them when a page is hidden.

## Key Points on Background Execution and Service Workers (iOS, PWAs, Android)

## 1. iOS (Safari & PWAs)

- **Service Worker Behavior:**
  When a web app (or PWA) is pushed to the background (either by opening a new tab or switching to a different app), the service worker is paused almost immediately. This means your app will no longer be able to perform background tasks like fetching or syncing data until it is brought back to the foreground.

- **App Suspension:**
  When you leave Safari or a PWA, the entire browser process (and JavaScript execution) is suspended after around three seconds. During this time, the app has a brief window (2-3 seconds) to perform critical tasks like saving data to IndexedDB. If the app is not brought back to the foreground, it remains suspended until reactivated.

- **Multiple PWAs:**
  If another PWA from a different origin is opened, your PWA may also wake up since iOS uses the same browser process for all PWAs. This can lead to unexpected behavior where one PWA "resurrects" another.

- **Lock Screen Behavior:**
  On iOS, if your app or PWA is on the lock screen or multitasking view, it may still appear as if it is running, but the UI is essentially a screenshot. The app is paused, and you can’t assume that it remains in memory or continues execution.

- **App Store PWAs:**
  PWAs installed from the App Store are treated differently. They are run in a separate process using a web view, so they don't share lifecycle behaviors with Safari or other installed PWAs. These PWAs follow a more typical native app lifecycle and aren't affected by the quirks of Safari's PWA handling.

## 2. Android (Chrome & PWAs)

- **Service Worker and Timers:**
  On Android with chrome, if a web app or PWA is pushed to the background (e.g., home button or switching apps), JavaScript continues to execute for a longer period, usually up to five minutes. Service workers will also continue running, but they may stop after about 30 seconds if there are no active network requests. On an Android with Firefox, the page is stopped immediately while service workers after 30 seconds and worker threads after 3 minutes of going to the background.

- **Throttling:**
  Standard timers like `setInterval` and `setTimeout` are throttled when the app is in the background. However, unlike iOS, Chrome on Android gives more leniency by allowing background code execution for a longer period before fully pausing the app.

- **UI and Memory:**
  Like iOS, backgrounded PWAs or web apps on Android show a screenshot of the UI when in the multitasking view or lock screen, and you can’t always predict if the app will still be in memory. However, compared to iOS, Android gives more freedom for background tasks, especially for up to five minutes after the app is minimized.

## 3. General Considerations

- **Inconsistent Behavior Across Browsers:**
  Browsers and operating systems (iOS, Android, desktop) handle background execution differently. This inconsistency requires careful planning to ensure your app behaves correctly when backgrounded, suspended, or brought back to the foreground.

- **Handling Suspensions:**
  When your app is suspended, especially on iOS, it’s important to save necessary state (e.g., to IndexedDB or local storage) quickly during that short 2-3 second window. If you need to resume operations later, plan to check whether your app is still visible or has been suspended.

- **Detecting Visibility:**
  Modern browsers provide the Page Visibility API (`document.hidden` and `visibilitychange` event), which allows you to check if your app is visible or not. This can be useful to optimize background behavior, pause updates, or sync data when the app is backgrounded.

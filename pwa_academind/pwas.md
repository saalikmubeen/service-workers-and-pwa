# State of PWAs (Progressive Web Apps) and Installability

## PWAs in Browsers

- All browsers support PWAs because they are just the web. However, installation support varies across platforms and browsers.
- A detailed list of where PWAs are installable can be found on: [firt.dev/notes/pwa](https://firt.dev/notes/pwa).
- PWA BOOK: [web.dev/learn/pwa](https://web.dev/learn/pwa)
- [firt.dev](https://firt.dev/)

## Android

- Most popular browsers on Android (e.g., Chrome, Edge, Firefox, Opera, Vivaldi, Brave) support PWA installations since most are Chromium-based.
- Firefox also supports PWA installation on Android.

## iOS and iPadOS

- PWAs can only be installed through **Safari**.
- Chrome, Firefox, and other browsers on iOS are essentially Safari in disguise due to Apple’s restrictions (all browsers use WebKit).
- In the European Union, browsers are now allowed to use their own engines, but installed PWAs still use Safari as the engine for the time being.

## Other Platforms

- **HarmonyOS** (Huawei): PWAs are installable via its native browser.
- **Meta Horizon OS** (Meta Quest 3, VR headsets): PWAs are installable, but via the Meta Store, with additional quality assurance for user health and safety.

## Desktop Platforms

- **macOS**: PWAs are installable from Safari, Chrome, and Edge (but not Brave).
- **Linux**: Chrome and Edge support PWA installation.
- **ChromeOS**: Only Chrome is supported for PWA installation.
- **Windows** (7, 8, 10, 11): PWAs are installable via Chrome and Edge.
  - **Notably missing**: Firefox does not support PWA installations on the desktop.

## Advantages for Enterprises

- PWAs offer a secure way to deploy applications in enterprise environments, such as banks and companies with older operating systems (e.g., Windows 7), without needing special installation permissions.
- PWAs work under the browser’s security umbrella, ensuring a secure experience.

## PWA Examples

- **Trivago**, **Starbucks**, **Tinder**, and **WhatsApp** are examples of well-known PWAs.
- Many of the best PWAs are used in corporate environments, even though they are not widely known.

## PWAs for Multi-platform Development

- PWAs offer multi-platform compatibility, running on Mac, Linux, Windows, Chromebooks, and even tablets, all from the same code base.

**[store.app](https://store.app)**, is an index of PWAs organized by category, acting like a modern Yahoo for PWAs.

# Summary

## Key Points

### 1. PWA Support Limitations

- Some platforms and browsers do not support Progressive Web Apps (PWAs).
  - **Firefox on Desktop**: Currently lacks PWA support.
  - **VisionOS**: Limited to browsing with Safari, but does not allow PWA installation.
  - **WatchOS and TVOS**: Allow web browsing but do not support PWA installation.

### 2. In-App Browsers

- Popular social media apps (e.g., Instagram, TikTok) use **in-app browsers** through **WebView**.
  - These in-app browsers do not support PWA installation.
  - Links clicked within these apps will not trigger the native installation dialog for PWAs, keeping users within the app ecosystem.

### 3. User Navigation Workarounds

- No methods exist to force social media platforms to open URLs in an external browser.
- Developers can guide users to manually open their browser:
  - Create a button that copies the PWA URL to the clipboard and instruct users to paste it into their browser to install the app.

### 4. Impact on User Experience

- The design choice to keep users within apps affects how links are shared and how users access web content.
- This limitation complicates the installation process for PWAs.
- Recent changes on platforms like **X** (formerly Twitter) have shifted link-opening behavior to retain users within the app, further complicating the PWA installation process.

# Creating a Progressive Web App (PWA)

## What is a PWA?

A Progressive Web App (PWA) is a type of application software delivered through the web. It uses standard web technologies like HTML, CSS, and JavaScript to provide a user experience similar to that of a native app. To create a PWA, you need a few essential components:

1. **A Web App or Website**: This can be any web application or even a simple website.
2. **Web App Manifest**: A JSON file that provides metadata about your web app.
3. **Service Worker** (optional): A script that runs in the background, allowing your app to work offline and improve performance. While once considered mandatory, having a service worker is now optional for basic functionality.

## Levels of PWA Implementation

The implementation of PWAs can vary in levels:

- **Basic Level**: If you do nothing special, users can still install your website as an app on desktop browsers. For example, in some browsers, you can install a page from any website as an app, even if it doesn't meet PWA standards.

- **Enhanced Level**: By providing additional metadata, customizing icons, and defining the installation criteria, you can signal to browsers that your app qualifies as a PWA. This allows browsers to display installation prompts or hints to users.

## Installability Criteria

To have your PWA recognized and installed, you must meet certain installability criteria, which vary by browser:

- **For Safari on iOS**:
  - Include metadata with the app’s name, icons, start URL, display mode, and orientation.
  - The user can install any website as a web app using the "Add to Home Screen" feature.

- **For Chrome and Chromium Browsers**:
  - The web app should not already be installed.
  - Must use HTTPS.
  - You should implement basic engagement heuristics, meaning users need to interact with the app to be prompted for installation.
  - Include necessary metadata, similar to Safari (Include metadata with the app’s name, icons, start URL, display mode, and orientation.)

- **For Firefox on Android**:
  - The web app should not already be installed.
  - Must be served over HTTPS.
  - Metadata is also required.

## Unique Features of PWAs on iOS

On iOS, each PWA installation is sandboxed, meaning each app instance is isolated from the others. This allows users to have multiple accounts for the same app, such as different accounts for personal and work purposes. In contrast, on Chrome and other platforms, only one instance of the app can be installed, and storage is shared between the browser and the installed app.

# Understanding the Viewport Meta Tag

The viewport meta tag is a crucial component for web development, especially when creating responsive designs for mobile devices. Here’s a breakdown of its purpose and functionality:

## What is the Viewport?

The viewport is the visible area of a web page on a device. Its size can vary significantly between devices, such as smartphones, tablets, and desktop computers.

## Purpose of the Viewport Meta Tag

The viewport meta tag is used to control the layout on mobile browsers. By default, many mobile browsers emulate a desktop experience, meaning they render pages as if they were being viewed on a desktop screen, often leading to poor user experiences on smaller devices.

## Common Usage

The most common syntax for the viewport meta tag is:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

# Understanding the Web App Manifest

## Overview

- The **web app manifest** is essential for a Progressive Web App (PWA); without it, the app cannot be considered a PWA.
- It is a **JSON file** that provides metadata to help browsers and operating systems install the app and integrate it into the system.

## Specifications

- The web app manifest follows a **W3C specification**, making it a widely adopted standard.
- The file is typically named `manifest.json`, but the recommended extension is `.webmanifest`.
- The correct MIME type for the manifest is `application/manifest+json`, though `application/json` is also accepted.

## Linking the Manifest

- The manifest file must be linked in the HTML of **all documents** in a multi-page application.
- Use the following syntax to link the manifest:

  ```html
  <link rel="manifest" href="manifest.webmanifest">
  ```

## Creating a Web App Manifest

- [Web Manifest (MDN)](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [web.dev/articles/add-manifest](https://web.dev/articles/add-manifest)
- [web.dev/articles/customize-install](https://web.dev/articles/customize-install)

The manifest is typically a JSON file, which means it uses a straightforward key-value pair structure. A basic example of a manifest file might look like this:

```json
{
    "name": "Codepad Masters, the best PWA in town",
    "short_name": "Codepad",
    "start_url": "./?utm_source=pwa",
    "theme_color": "#ffc252",
    "scope": "./",
    "display": "standalone",
    "icons": [
        {
            "src": "icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        },
        {
            "src": "icons/icon-1024.png",
            "sizes": "1024x1024",
            "type": "image/png"
        },
        {
            "src": "icons/icon-maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        }


    ],
    "description": "This app lets you add notes while you are coding",
    "screenshots": [
        {
            "src": "icons/screenshot.png",
            "sizes": "1170x2532",
            "type": "image/png"
        }
    ]
}
```

Each property plays a vital role in defining how your app interacts with the operating system and the user.

- **id**:
This property represents a unique identifier for your app within your origin. It’s critical because it helps the browser manage installations properly. Without this ID, if you change the start URL or any other parameter, the browser might mistakenly treat it as a different app. For example, if you have multiple soda machines represented by different IDs, each one can be uniquely identified within your application.

- **start_url**:
The start_url property defines the initial URL that the app should open when launched. Importantly, this is not necessarily the page the user was on when they installed the app. This ensures that when a user opens your PWA, they start from a defined location, not the last viewed page. If a user were ordering a drink on a menu page, you wouldn’t want that specific drink page to be the starting point. Instead, you would want them to start at the app’s home page.

- **scope**:
This property determines the navigation scope of your app. If the user navigates to URLs that fall within this scope, the app behaves like a single entity. Any links that go outside this scope will open in a regular browser tab, ensuring that users understand they are leaving your app. For instance, if your app has a scope of /, any link within the root directory (like /about or /contact) will stay in the app, but a link to an external site (like Spotify) will open in a new browser tab.

- **name and short_name**:
The name property is the full name of your app, which can be longer and is often displayed in places like the task switcher or in settings. The short_name is a more concise version meant for display on the app icon, where space is limited. As a rule of thumb, keeping the short name under 12 characters is safe to ensure it fits well on most devices.

- **display**:
This property dictates how your app is displayed to users. The standalone value makes your app look and behave like a native app, without the standard browser UI. Other options include fullscreen, which takes up the entire screen without any browser UI, and browser, which opens the app like a regular website in a browser window. Choosing the correct display type is crucial for user experience.

- **theme_color**:
This property sets the color of the tool bar, and it can also influence the splash screen background color on some platforms. It's a way to enhance the branding of your app by keeping the color palette consistent with your design.

- **background_color**:
Similar to theme_color, this defines the background color of the splash screen. This is what users see while your app is loading, so choose a color that aligns with your overall theme.

- **icons**:
This property defines an array of icon objects, each specifying a source image, size, and type. These icons are crucial for app installation and should be available in multiple sizes to accommodate various devices and display resolutions.

- **description**:
 This property provides a brief description of your app, which can be displayed during installation or in app stores. It’s a way to give users a quick overview of what your app does and why they should install it.

- **direction**:
This property specifies the text direction of your app, which is essential for languages that read from right to left. By setting this property, you ensure that your app displays text correctly for users in those regions.
e.g "direction": "rtl", for right-to-left languages like Arabic or Hebrew.
                  "ltr" for left-to-right languages like English or Spanish.

- **lang**:
This property defines the primary language of your app, which helps browsers and operating systems display the correct language settings. It’s especially important for multilingual apps to ensure that users see content in their preferred language.

- **orientation**:
This property specifies the default orientation of your app, ensuring that it displays correctly when launched. For example, if your app is designed for landscape mode, you can set this property to landscape-primary to ensure it opens in the correct orientation. options: "any", "landscape", "landscape-primary", , "portrait", "portrait-primary"

- **related_applications**:
This property allows you to link to other app stores or platforms where your app is available. If your app is also listed in the Apple App Store or Google Play Store, you can provide links to those locations to help users find and install your app on different platforms.
e.g:

```json
"related_applications": [
    {
      "platform": "play",
      "id": "com.example.app1",
      "url": "https://play.google.com/store/apps/details?id=com.example.app1"
    },
    {
      "platform": "itunes",
      "id": "12345",
      "url": "https://itunes.apple.com/app/example-app1/id12345"
    }
  ]
```

### Linking the Manifest to Your HTML

Once your manifest file is set up, it’s essential to link it in your HTML document. This tells the browser where to find your manifest. You typically include the following line within the <head> section of your HTML:

```html
<link rel="manifest" href="/app.web.manifest">
```

### Testing Your PWA

After linking your manifest, it’s time to test your PWA. Open your application in a browser like Chrome and use the Developer Tools. Navigate to the "Application" tab, where you can inspect your manifest file, view any errors or warnings, and see how the browser interprets your app. This testing phase is vital for ensuring that all properties are set correctly and that your PWA behaves as expected when installed.

# Multiple PWAs on the Same Origin

One common misconception is that a single origin domain can only host one PWA. In reality, you can have multiple installable PWAs under the same origin by pointing to different manifest files. This setup typically involves organizing your files into separate folders. By leveraging this capability, you can create unique experiences tailored to different user interactions or devices.

## Exploring Micro-Apps

The concept of **micro-apps** is gaining traction, particularly in business design patterns. This approach allows for the creation of small, specialized applications within a larger platform.

### Example: Starbucks

Consider a familiar example—**Starbucks**. Instead of a single app for all stores, imagine installing a separate app for each Starbucks location. When a user opens the app, it knows exactly which store they're visiting, streamlining the ordering process.

### Micro-Apps for Specific Devices

This concept extends even further. Picture a soda machine equipped with a QR code or NFC tag that links to its specific micro-app. Users could scan the code to install an app dedicated to that soda machine, facilitating direct interaction with the device.

## Benefits of Micro-Apps

This approach offers several advantages:

- **Infinite Scalability:** You can create numerous apps by merely changing the manifest arguments, free from the constraints of traditional app stores.
- **Tailored Experiences:** Each app can cater to specific devices or user needs, providing a customized experience.
- **Cost Efficiency:** Unlike traditional app development, where each new app may incur significant costs, micro-apps can be developed quickly and inexpensively.

### Example: Yelp

For instance, a service like **Yelp** could allow individual businesses to have their own micro-apps, enhancing their visibility and interaction with users without crowding a single app.

# Display Modes in PWAs

## Introduction to Display Modes

Display modes determine how a PWA appears to the user. The default display mode is browser, which allows for metadata (like theme color and icons) without functioning as a true PWA.

## Common Display Modes

- **Standalone**: This is the most common display mode for PWAs, allowing the app to look and feel like a native application.
- **Fullscreen**: Currently only supported on Android. It provides a truly immersive experience by utilizing the entire screen without any browser UI. If fullscreen is unavailable, it typically falls back to standalone.
- **Minimal UI**: Offers a basic UI with browser controls, such as a back button and refresh button. However, if not supported, it defaults back to browser mode.
- **Browser**: This mode simply displays the web application in a standard browser view without PWA features.

## Advanced Display Modes (Not available on android or iOS)

- **Tabbed Mode**: Available in desktop Chromium-based environments. This allows for multiple tabs within the same app, similar to a traditional browser experience.
- **Window Controls Overlay**: A feature that enables custom rendering of content in the title bar, allowing developers to utilize that space creatively.

## Fallback Mechanism

Due to compatibility issues (especially on mobile and iOS), modern APIs like tabbed and window-controls-overlay often fall back to the browser mode if not supported. The `display_override` property allows specifying a fallback array of display modes. The browser attempts to use these before defaulting to the display property. iOS ignores `display_override`, which means that developers must consider platform limitations.
The browser will start with the first mode in the display_override array and work its way down until it finds a supported mode. And if none of the modes are supported, it will default to the display property.

## Standalone Mode

Offers a window experience on various operating systems (macOS, Windows, Linux). iOS and iPadOS only support the standalone display mode.

## Android Display Modes

Android supports standalone, minimal UI, and fullscreen modes, offering flexibility and a native feel:

- **Standalone**: The app appears in the launcher with a themed status bar.
- **Minimal UI**: Similar to standalone but with a minimal browsing bar.
- **Fullscreen**: Provides 100% screen usage without the status bar.

## Device Detection

For installation instructions specific to devices (like iPhone), detection can be tricky. Use `window.standalone` to check if the app is running in standalone mode on iOS. This property is not standard but can indicate if the app is running as a PWA.

```js
    if (window.standalone) {
    console.log('The app is running in standalone mode on iOS.');
} else {
    console.log('The app is not running in standalone mode.');
}
```

### Key Differences Between `window.standalone` and `navigator.standalone`

- **Standardization**: `window.standalone` is more commonly recognized and documented in resources related to iOS web apps. In contrast, `navigator.standalone` is less frequently used and may not be as reliable across different contexts.

- **Implementation**: Some developers prefer using `window.standalone` because it is straightforward and directly related to the window context, making it clearer when checking the standalone status.

`navigator.standalone` will return false in the safari browser if the app is not running in standalone mode and true if it is running in standalone mode. In other browsers, it will return undefined.

## User Agent Detection for WebViews

To determine if the app is running within a WebView (e.g., in Facebook or TikTok):

- Use the user agent string to identify the context.
- Each WebView (e.g., TikTok, Instagram) has a unique identifier in its user agent.
- A tool like WURFL.js (<https://web.wurfl.io/>)  can provide a more robust solution for device detection across various platforms.

## Best Practices for Display Modes

- Ensure compatibility by understanding the fallback behavior of different display modes.
- Be mindful of the limitations on iOS and utilize the available features effectively to enhance user experience.
- Testing across different devices and browsers is essential to ensure the PWA behaves as intended.

# Testing Web Apps on the Emulator

Once your emulator is set up, you can begin testing your web applications. However, you may encounter an issue if your web app is running on localhost.

## Common Networking Issue

When you try to access `localhost:3000` on your Android emulator, you may receive an error. This happens because the emulator operates in its own environment, separate from your host computer. It looks for the server at port 3000 within its own system, not your local machine.

## Solution: Port Forwarding

To resolve this issue, you can use port forwarding:

1. **Open Chrome DevTools**: Launch Chrome and navigate to DevTools (chrome://inspect/#devices)
2. **Set Up Port Forwarding**: Locate the port forwarding section and map the emulator’s port (e.g., `3000`) to your local machine’s address (`localhost:3000`).
3. **Keep DevTools Open**: Ensure the Chrome DevTools window remains open to maintain the connection.

# Standalone User Experience in PWAs

## Icon Behavior Across Platforms

- **Desktop**: When you install a PWA on desktop, the icon will appear like any other system icon, regardless of whether it's Windows, Mac, or Linux.
- **Android**: There are two possibilities for PWAs:
  1. **Shortcut icons** (default method)
  2. **WebAPK icons** (for full app experience)

### Shortcut Icons (Android)

- A shortcut icon creates a shortcut to a browser engine only on the **home screen** (not in the launcher).
- **Home screen** vs. **Launcher**: On Android, the home screen and launcher are two different areas. The shortcut will only appear on the home screen and not in the apps list (launcher).
- All browsers use this method by default and, since Android 8, include a browser's badge (small icon indicating which browser was used, e.g., Edge, Samsung Internet, Firefox).

### WebAPK Icons (Android)

- A **WebAPK** is a full Android native package (APK) that contains metadata like the URL, app name, and icon. It does **not** include HTML, CSS, or JavaScript files.
- WebAPK (apk) installation is silent because the APK is signed by Google or the Play Store, making it trusted by the system.
- When installed, the WebAPK icon will appear both on the **home screen** and in the **launcher**.
- Requirements for WebAPK:
  - Use **Google Chrome** as your browser.
  - Device must have **Google Play Services** (most devices except Huawei).
  - Samsung devices can also use WebAPK if you use the **Samsung Internet Browser**.
  - Huawei devices use a similar system for PWAs.

## PWA Icons in the Manifest

- To meet PWA criteria, you need to add icons in the **web app manifest**.
- The manifest includes an array of icons with attributes such as:
  - **src**: The source path for the icon
  - **sizes**: The dimensions of the icon
  - **type**: The file type (e.g., PNG or SVG)

### Recommended Icon Sizes

- It’s recommended to provide PNG icons in the **sRGB color space**.
- Recommended sizes are:
  - 192x192
  - 512x512
  - 1024x1024
- **SVG files** can also be used for scalability. WebAPK and some desktop platforms will accept SVG.
-Deprecated sizes like 72x72, 152x152 and 384x384 are no longer necessary.

# Maskable PNG Icons for PWAs

## What is a Maskable PNG?

- **Maskable PNG** is used in **Android 8+**, which covers **90% of Android devices**.
- It helps adapt your icon to different shapes imposed by the launcher on various devices.
- Different Android manufacturers define various icon shapes (e.g., circles, squares), which may crop your icon. The maskable PNG ensures the icon fits correctly within these shapes.

## Adaptive Icons on Android 8+

- **Adaptive icons** allow the Android launcher to apply different masks (shapes) to icons.
  - For example, some phones use circular masks, while others use different shapes.
- Without a maskable icon, parts of the icon could be cut off.

## Safe Zone for Maskable Icons

- Icons should be designed with a **safe zone** in mind. This is typically a centrally positioned circle with a radius of **40% of the icon width**.
- The area outside this circle is **discardable padding**. This ensures the important parts of your icon remain visible, regardless of the mask applied.
- Thus the icon should be such that it fits between the centrally positioned circle and not span outside the circle.

### Example

- A calculator icon, when cropped by the mask, might lose important parts if it's not designed for the safe zone.
- By adding more padding to the icon, it can fit within the mask and maintain its appearance.

### Dual Icon Strategy

- Provide both a **maskable** and a **non-maskable** version of the icon.
  - **Maskable**: Ensures compatibility with different shapes on Android.
  - **Non-maskable**: Used on platforms like desktops where no mask is applied.
- The device selects the appropriate icon based on the provided **purpose** attribute in the manifest.

## Creating Maskable Icons

- You can use **[maskable.app](https://maskable.app/)**, a PWA tool, to create maskable icons without needing advanced software like Photoshop.
- **.app domains** (managed by Google) are popular among PWA developers. For example, maskable.app is itself a PWA.

## Manifest Configuration

- In the web app manifest, the **purpose** property is used to specify whether an icon is maskable or not:

  ```json
  {
    "src": "icon.png",
    "sizes": "192x192",
    "type": "image/png",
    "purpose": "maskable"
  }




## iOS and macOS Icon Behavior

- **iOS** and **macOS** will use the icon set in the **Web App Manifest** by default, just like other platforms.
- However, you can specify a separate icon specifically for Apple platforms using a **link** tag in your HTML. This overrides the manifest icon.

## Why Specify an Apple-Specific Icon?

- **Apple** was late in adopting PWAs and the **Web App Manifest**, even though they initially pioneered the concept of web apps.
- By the time Apple implemented the manifest, most PWA icons were optimized for **Android**, leading to issues on iOS.
  - **iOS** doesn’t support transparent icons, whereas Android does.
  - Apple noticed that many PWAs had transparency in their icons, which caused problems on iOS.

## Overriding the Default Manifest Icon on Apple Devices

- To provide an Apple-specific icon, use the following **HTML link** tag:

  ```html
  <link rel="apple-touch-icon" href="/path/to/icon.png">
  ```

- This tag will override the default manifest icon on **iOS** and **macOS** devices.
- This is added to your HTML, not the manifest.
- If you only want to provide one Apple-specific icon, 180x180 pixels is recommended, as it suits the largest resolution used by iPad Pro.
- You can also provide multiple icons for different device resolutions if desired, but it’s not mandatory.

# Splash Screens for PWAs on Android and iOS

## Key Points

### 1. Splash Screens on Android

- Automatically generated from the **Web App Manifest**.
- Uses the theme color, background color, app icon, and name from the manifest.

### 2. Splash Screens on iOS

- Do not use the **Web App Manifest** data.
- Requires custom images (called **Startup Images**) to be manually created and added via a `link` element in HTML.
- These images must match the exact screen size of the device, making it necessary to create multiple versions for different devices and orientations (Portrait and Landscape).
- **Problem**: For various iphones with different screen sizes, you may need more than 20 PNGs.
- Add the following code to your HTML:

  ```html
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link rel="apple-touch-startup-image" href="/path/to/image.png">
  ```

## Solutions

### 1. PWA Static Asset Generator

- An npm tool that helps create all necessary images automatically by providing an SVG, generating multiple PNGs for different device sizes, and the necessary `link` elements for the HTML.
- [Link to pwa-asset-generator](https://github.com/elegantapp/pwa-asset-generator)

### 2. PWACompat

- A client-side library that dynamically generates splash screens for iOS using JavaScript.
- It draws an image on a canvas based on the current device's dimensions and injects it as a base64 image into the HTML.
- It takes the app manifest and generates assets for other browsers.
- It emulates android splash screens for iOS.
- **Caution**: PWACompat also injects outdated or unnecessary meta tags, which can cause issues. [Link](https://medium.com/@firt/you-shouldnt-use-chrome-s-pwacompat-library-in-your-progressive-web-apps-6b3496faab62)
- [Link to PWACompat](https://github.com/GoogleChromeLabs/pwacompat)

- ```html
  <script async src="https://unpkg.com/pwacompat" crossorigin="anonymous"></script>
  ```

- Styling the generated splash screen is possible using CSS:

```html
    <style>

link[rel="manifest"] {
 --pwacompat-splash-font: 24px
 Verdana;
}</style>

```

## Do PWAs Still Need Offline Support?

Traditionally, one of the core aspects of a PWA was its ability to function offline, made possible by a service worker. Service workers enable your app to cache files, which allows users to access the app even when they’re not connected to the internet. As a result, many guides still suggest that offline capability is essential to pass the "PWA criteria."

However, offline support is no longer a mandatory requirement to qualify as a PWA. While the majority of articles and even some outdated official Google documentation still suggest that you need a service worker for offline access, that's not entirely true anymore.

## Making Your Progressive Web App (PWA) Offline Capable

### Is Offline Support Mandatory for PWAs?

We know that being offline capable is no longer a mandatory requirement to qualify as a PWA, but it’s still a good idea to understand how offline functionality works, especially if your users will need access without a stable internet connection.

### What Happens to a PWA When Offline?

If a PWA is offline and tries to access the web server, you might think it will display an error. However, on some platforms, like Android, users get a default offline page saying they’re offline. On desktop, though, this feature isn't fully implemented yet. Ideally, you should offer users a more graceful offline experience, like showing a custom page with your logo or theme, or even a game if the app is non-functional offline.

### Native Apps vs Web Apps

Native apps (or apps from the store) differ from web apps in terms of how they handle offline scenarios:

- **Native apps**: The app is installed on the client device, with the bundle (a zip file of the app code) stored locally. When offline, the app can still function with its stored code but cannot make API calls to the server.
- **Classic Web Apps**: These are typically browser-based and load resources like HTML, CSS, JavaScript, and images from a server. If offline, the app will fail to load and display an error page.

### How Progressive Web Apps Handle Offline Support

Progressive Web Apps (PWAs) follow a similar structure to web apps but come with an additional piece: the **Service Worker**. This is the key to enabling offline capability in a PWA.

1. **Service Worker Registration**: When a PWA is first loaded, it registers a service worker in the browser's runtime. This worker can act as an intermediary between the web runtime (the browser) and the server.

2. **Caching Files**: The service worker can cache HTML, CSS, JavaScript, and images on the client-side, allowing the app to still render content even if the device is offline.

3. **Handling API Calls**: API calls can also pass through the service worker, but typically these require connection to the server. If there’s no connection, the service worker can return an appropriate response, like an error message or a cached version of the API data (if implemented).

### How Offline PWAs Work

When your app has been cached via a service worker:

- **First load**: The web runtime (browser) downloads your HTML, CSS, and JavaScript from the server. These assets are cached by the service worker.
- **Subsequent loads**: When offline, the service worker can provide the cached assets instead of fetching them from the server.

If your app relies on API calls, those requests will still fail when offline unless you've built a caching strategy for API responses. Without a service worker, the app will not load anything offline, showing the default offline error page.

### Service Worker Definition

A JavaScript file running in its own thread that will act as a middleware offering a local installed web server or web proxy for your PWA, including resources and API calls

# Service Worker Overview

### Definition

A service worker is a JavaScript file that runs in its own thread, acting like a locally installed web server or proxy for your PWA (Progressive Web App). It handles resources and API calls locally.

### How It Works

- The service worker acts as a middleman between your app and the network, deciding whether to fetch from the server or serve a cached version of files.
- It's installed client-side (on the user's device) and operates even when the app is closed.

---

### Key Points

- **HTTPS Requirement**: Service workers require HTTPS, except for localhost (during development).
- **Service Worker Lifecycle**:
  - It’s registered by a web page through JavaScript.
  - It runs independently from the web page, allowing it to handle tasks even after the user closes the app.
- **Background Capabilities**:
  - The service worker can continue running in the background after the browser or app is closed. **(chrome://serviceworker-internals)**
  - It stops after a short period of inactivity (typically around 30-40 seconds) but can restart if triggered by a network request, a push notification, or other tasks like background sync.

---

### Testing Service Workers

- By visiting `chrome://serviceworker-internals` in Chrome, you can view a list of all active service workers.
- You’ll find service workers from websites you’ve visited, even if you never explicitly installed them.
- Service workers can run tasks in the background, such as handling API calls or delivering push notifications, even after the tab or app is closed.

---

### Push Notifications

Push notifications are built on top of service workers but are not exclusive to PWAs. They can be added to any web application that uses service workers.

# Enhancing the User Interface of Progressive Web Apps (PWAs)

Progressive Web Apps (PWAs) are designed to provide a seamless, app-like experience while using web technologies. As part of building a polished PWA, there are several key considerations when optimizing the user interface (UI) to enhance both usability and accessibility. This guide will walk you through some best practices, focusing on preventing unnecessary content selection and ensuring a smooth refresh mechanism.

## 1. Prevent Unnecessary Content Selection

### Problem

In a standard web app, by default, everything on the page is selectable. This includes content like logos, menu items, and titles. While this behavior might make sense on a website, it often feels awkward and unnecessary in a PWA that mimics a native app experience. For instance, selecting a title or image doesn't serve any real purpose and can degrade the user experience.

### Example

Imagine you're using a PWA, and you accidentally select a heading or image while swiping or clicking. It’s not a feature users expect in an app.

### Solution

You can disable content selection using CSS. The property `user-select: none;` prevents users from selecting unnecessary elements. However, there are a few things to keep in mind when using this technique.

#### Basic CSS to Disable Selection

```css
* {
  user-select: none;
  -webkit-user-select: none; /* for older WebKit-based browsers */
}
```

## 2. Handling Safe Areas and the Virtual Keyboard in PWAs

In Progressive Web Apps (PWAs), once your web application operates in standalone mode, you must manage safe areas and consider how UI elements interact with mobile device features like notches and virtual keyboards. In this post, we'll cover how to ensure your PWA is usable in these environments and how to handle issues like unclickable areas near the edges of the screen.

### Safe Areas: Understanding the Problem

On mobile devices, especially those with notches or rounded corners, parts of the screen become "unsafe" for interactive content. This can result in buttons or other elements being placed in areas where they are difficult or impossible to click, such as too close to the screen edges. This is particularly problematic for mobile gestures (e.g., swipe-up gestures on iPhones).

When you're developing a web app within the browser, you may not notice these issues because the browser's interface handles them. However, in standalone mode, you're responsible for making sure content stays out of these unsafe areas.

### Detecting and Adjusting Safe Areas

CSS environmental variables allow you to adjust the layout dynamically based on safe areas. Here's an example of how you can use these variables:

```css
body {
    margin-top: env(safe-area-inset-top);
    margin-right: env(safe-area-inset-right);
    margin-bottom: env(safe-area-inset-bottom);
    margin-left: env(safe-area-inset-left) !important;
}
```

These variables (safe-area-inset-*) adapt based on the device's screen and notch location, ensuring that your content is always visible and interactive.

### Handling the Safe Area on Landscape Mode

In landscape mode, many devices restrict the content to the safe area, and you may see background colors (defined in the manifest) occupying the rest of the space. You can solve this by using the viewport-fit=cover property in your HTML's viewport meta tag, which ensures your content fills the whole screen including the safe area and the top notch of the device say iPhone.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

With this, your PWA will take up 100% of the viewport, even if it overlaps the unsafe area. To ensure content is not hidden behind the notch, use the safe area insets again as margins to shift elements away from the notch:

```css
.container {
    margin-top: env(safe-area-inset-top);
    margin-right: env(safe-area-inset-right);
    margin-bottom: env(safe-area-inset-bottom);
    margin-left: env(safe-area-inset-left);
}
```

### Fallback for Non-Supporting Browsers

Older browsers or non-supporting browsers might not understand the env() function. To provide a fallback, declare a default margin before the env() values:

```css
.container {
    .container {
    margin: 20px; /* Fallback for older browsers */
    margin-top: env(safe-area-inset-top, 20px);
    margin-right: env(safe-area-inset-right, 20px);
    margin-bottom: env(safe-area-inset-bottom, 20px);
    margin-left: env(safe-area-inset-left, 20px);
}

}
```

If the browser doesn’t support safe areas, it will use the fallback margin.

## 3. Dealing with the Virtual Keyboard

Another challenge in mobile PWAs is handling the virtual keyboard. By default, when the virtual keyboard appears, it may overlap parts of your app. For a better user experience, you can use the Virtual Keyboard API, which allows you to detect when the keyboard is present and adjust your layout accordingly.

Virtual Keyboard API
The Virtual Keyboard API gives you access to events and CSS environment variables that help manage the keyboard's behavior. This is particularly useful on Android, where you can specify if elements should overlay the keyboard or shift above it when the keyboard is visible.

Here’s an example of the API:

```js
if ('virtualKeyboard' in navigator) {
    navigator.virtualKeyboard.overlaysContent = true;
}

window.visualViewport.addEventListener('resize', () => {
    // Handle the keyboard appearance/disappearance
});
```

CSS environment variables also allow you to apply styles based on the keyboard's presence:

  ```css
  input {
    margin-bottom: env(virtual-keyboard-inset-bottom, 10px);
}
```

### Limitations on iOS

On iOS, there is no control over how the virtual keyboard interacts with your PWA. The keyboard will always overlay the content, unlike Android, where you can control whether content should shift or overlay the keyboard.

## 4. Debugging Cache Issues During Development

When developing PWAs, caching can sometimes make it difficult to see updates immediately. If you’re using a cache-first service worker strategy, the CSS and other resources might not update even after refreshing. Here are some quick tips to handle this:

Force update the app: Sometimes, you'll need to delete and reinstall the app to load the new resources, especially if they are cached.
Refresh button: Adding a simple refresh button to your PWA UI can be useful during development, allowing you to reload the page manually without relying on the browser’s refresh mechanism.

```js
function reloadApp() {
    location.reload();
}
```

You can call this function via a button in your PWA's interface.

## 5. Full-Screen Mode on iOS

While iOS does not provide full-screen mode for PWAs, there is a workaround using the apple-mobile-web-app-status-bar-style meta tag. By setting the value to black-translucent, you can render content from the very top of the screen, allowing the status bar icons (clock, battery, etc.) to appear over your app's content.

```html
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

This is an old iOS hack, but it's still useful for simulating full-screen mode on iPhones.

## 6. Disabling the Browser's Pull to Refresh

On Android, users are accustomed to pulling down to refresh a page. However, this default behavior may conflict with a custom pull-to-refresh mechanism in your PWA. To avoid issues, you can disable the browser's default pull-to-refresh using CSS overscroll behavior:

```css
html, body {
  overscroll-behavior: none;
  /* overscroll-behavior-y: contain; */
}
```

This is useful when your app provides its own content refresh mechanism, giving you full control over the refresh behavior.

## 7. View Transition API for Smooth Page Animations

To make your PWA feel more like a native app, you can implement smooth transitions between pages using the `View Transition API`. This applies to both single-page and multi-page applications. Implementing these transitions makes the user experience more fluid, giving the impression of a native app.

For more details, you can explore the course on practical web app patterns that demonstrates this API in action.

## 7. Using System Fonts for a Native Feel

To mimic native app fonts across different platforms, you can use system fonts. By specifying the following font stack in your CSS, your app will adopt the native system font for each platform, increasing the sense of a native app experience:

````
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
````

This font stack will use:

- `-apple-system` for iOS/macOS,
- `BlinkMacSystemFont` for Chrome on macOS,
- `Segoe UI` for Windows,
- `Roboto` for Android,
- `Ubunt`u for Ubuntu systems.

You can apply this strategy selectively to specific components or the entire UI, depending on the needs of your PWA.

## 8. Native-Like Sharing with the Web Share API

In a browser, users can copy and paste the URL to share content, but in a standalone PWA, the URL bar may not be visible. To address this, you can implement your own share functionality using the Web Share API, which will trigger the native sharing dialog on supported platforms (Android, iOS, macOS).

Here's how to implement a share button:

```js
if (navigator.share) {
  document.querySelector('.share-button').addEventListener('click', async () => {
    try {
      await navigator.share({
        title: 'Your App Title',
        text: 'Check out this awesome content!',
        url: window.location.href,
      });
      console.log('Content shared successfully');
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  });
}
```

This will open the native share dialog on Android and iOS. You can also check whether sharing is supported on the current platform using navigator.canShare().

## 9. Disabling Touch Callouts on iOS

On iOS, long-pressing a link triggers a touch-callout that opens a menu (e.g., "Open in a New Tab"). If you're building a single-page application (SPA) where you handle links with JavaScript, this behavior may be undesirable. To disable it, you can apply the following CSS rule:

```css
a {
  -webkit-touch-callout: none;
}
```

This prevents the long-press menu from appearing, giving your app a more seamless, app-like experience.

## 10. Respecting Users' Reduced Motion Preferences

Some users prefer to disable animations for accessibility reasons. Native apps respect these settings automatically, but web apps require a manual check using the prefers-reduced-motion media query.

To handle this, you can disable animations for users who have enabled this preference in their system:

```css
@media (prefers-reduced-motion: reduce) {

  /* Disable animations and transitions here */

- {
    animation: none;
    transition: none;
  }
}
```

This ensures that users who have reduced motion preferences enabled won't be overwhelmed by unnecessary animations, improving accessibility.

## 11. Requesting Persistent Storage

By default, the browser may delete your PWA's cached assets when storage is low. However, you can request persistent storage to ensure that your data remains intact, even when the device is under storage pressure.

To request persistent storage, use the following JavaScript:

```js
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(persistent => {
    if (persistent) {
      console.log("Storage will not be cleared automatically.");
    } else {
      console.log("Storage may be cleared by the browser.");
    }
  });
}
```

Most PWA-capable browsers (Chrome, Firefox, Safari) will grant persistent storage automatically for installed PWAs, but Firefox prompts the user for permission. Ensuring persistent storage protects your assets and service worker from being deleted when the user is low on storage.

# Deploying a Progressive Web App (PWA): Best Practices and API Integration

When deploying a Progressive Web App (PWA), the process is quite simple: you deploy it like any other web application by hosting it on a server. However, there are specific optimizations you can implement to improve the user's installation experience. Below is a detailed breakdown of the deployment process and essential APIs for a better PWA experience.

## Installation API and User Experience

### Detecting Installation API Availability

The **Installation API** is used to display an installation button or prompt within your app’s user interface. This allows users to install your PWA directly from the UI. Unfortunately, this API is not universally available. Safari, for instance, does not support it. Currently, it's only implemented in **Chromium-based browsers** (e.g., Chrome).

You can utilize the `beforeinstallprompt` event to trigger the install option for the user. This event fires when the current URL meets the browser's PWA criteria and if the app is not already installed.

### How the Installation API Works

- **Event Trigger**: When a browser detects that the PWA can be installed, it fires the `beforeinstallprompt` event. This might trigger a banner, a menu button, or allow you to display a custom install button.
- **Cross-browser Support**: Currently, this event is only fired on Chromium browsers. Neither Firefox nor Safari support this event, which means users need to manually install the PWA through browser menus.

#### Example Use Cases

- Info bar or banner promotion on a mobile device.
- Custom install buttons on the website.

#### Typical Implementation

You can use the event as follows:

```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Prevent the default browser install prompt from showing
  deferredPrompt = e;
  // Show your custom install button here
  // Un-hide the custom install button after we are sure that we have met the criteria
  // of chrome to show the install prompt to the user and being able to install the PWA
  yourInstallButton.style.display = 'block';
});

yourInstallButton.addEventListener('click', (e) => {
   if (deferredPrompt) {
    deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    deferredPrompt = null;
  })
   } else {
    console.log('Sorry, do the manual installation of the PWA from the browser menu');
   }
});
```

Hide the install button if the app is already installed or running in standalone mode:

```css
  @media (display-mode: standalone) {
    #install-button {
      display: none;
    }
  }
```

## `appinstalled` Event

The `appinstalled` event is fired when a user successfully installs your PWA. You can use this event for analytics or to track installations.

```javascript
window.addEventListener('appinstalled', () => {
  console.log('PWA installed');
});
```

## Installation on Non-Chromium Browsers

On browsers like **Safari** or **Firefox**, there are no explicit events to handle installation. The user will need to add the app manually to their home screen, and you won't receive any events to track this. This makes it crucial to ensure that your PWA is optimized and that instructions for installation are clear.

## Enhancing the User Experience with Installation Prompts

### Custom Install Promotion Button

You can create a custom installation button or promotion section within your app. Here's how you can ensure the best experience:

1. **Hide the Button if Already Installed**: If the app is already installed or being viewed in standalone mode (the user is not in browser display mode), there's no need to show the install button.

2. **Check for Related Installed Apps**: On Android, use the **[Get Installed Related Apps API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getInstalledRelatedApps)** to avoid showing install prompts if a native Android app is already installed. This doesn't apply to Safari or iOS.

3. **Avoid UX Duplications**: Make sure not to display both the browser's native install prompt and your custom prompt at the same time. You can use `preventDefault()` to prevent the browser from showing its banner.

```javascript
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  yourCustomBanner.style.display = 'block';
});
```

## PWA Installation and Richer UI on Different Browsers

### Installation on Microsoft Edge

1. **Squoosh Installation on Edge**:
   - In Microsoft Edge, Squoosh installs with an installation dialog, which is slightly different from Chrome.
   - Edge offers a **tab mode**, allowing users to open the PWA in a tab window, providing a different experience compared to standalone apps.

2. **Inspecting the PWA Manifest**:
   - The PWA manifest, available publicly for every PWA, can be inspected using the browser's developer tools.
   - Important fields in the manifest include:
     - **name**
     - **short_name**
     - **start_url**
     - **theme_color**
     - **icons**
     - **description**
     - **categories**
     - **screenshots** (with **form_factor** specified as either `narrow` for mobile or `wide` for desktop).

3. **Enhancing the Installation UI**:
   - Adding a **description** and at least one **screenshot** for each form factor (narrow and wide) improves the installation experience, offering a richer UI on platforms like **Chrome**.
   - Example:

     ```json
     {
       "description": "The best notepad app for taking notes while doing Frontend Masters courses.",
       "screenshots": [
         {
           "src": "screenshot.png",
           "type": "image/png",
           "form_factor": "wide"
         }
       ]
     }
     ```

So if you want to see rich UI installation dialog, that right now works in chrome, on desktop and android, you need to add description and atleast one screenshot for each form factor.

### Taking Screenshots and Compression for PWAs

1. **Compressing Images**:
   - Tools like **Squoosh** can help compress images, reducing their size significantly. This is useful for improving load times and performance.

### Installing PWAs on Safari

1. **Add to Dock**:
   - On **Safari** (macOS and iOS), the installation process is referred to as **Add to Dock**, rather than "install."
   - Users can go to the **File** menu and select **Add to Dock**, which will install the PWA similarly to how it works on Chrome and Edge.
   - Safari's Add to Dock feature reads the **name** and **icons** from your manifest, allowing users to install the PWA directly from the browser.
   - [Link](https://webkit.org/blog/14445/webkit-features-in-safari-17-0/#:~:text=In%20Safari%2C%20go%20to%20File,icon%20appears%20in%20your%20Dock.)

2. **Multiple Versions of PWAs**:
   - On Safari, it's possible to install multiple versions of the same PWA by changing its **name** in the manifest.
   - Example:

     ```json
     {
       "name": "Frontend Pal"
     }
     ```

   - This allows users to install different instances with different names, enabling multiple versions of the PWA on the same device.

# Packaging PWAs for App Stores

## Key Points

### 1. **App Store Packaging for PWAs**

- Instead of distributing the app through the browser menu, developers can create packages that allow the PWA to be installed via app stores like Google Play, Apple's App Store, or the Microsoft Store.
- Unlike older hybrid frameworks like PhoneGap or Cordova, PWAs maintain their web-based advantages, such as no need to update the app through the store for content changes, only for metadata changes.

### 2. **Using PWA Builder**

- [PWA Builder](https://pwabuilder.com), an open-source tool by Microsoft that simplifies the process of packaging PWAs for different app stores.
- By entering the URL of the PWA, the tool checks the app’s manifest, service worker, and other requirements. It then provides suggestions to improve the PWA and allows you to generate store-ready packages (e.g., APK for Android).

### 3. **Customization**

- PWA Builder can generate not just the final package (such as an AAB for Android) but also the source code, allowing developers to modify the package using platforms like Android Studio if needed.

### 4. **Platform-Specific Considerations**

- While packaging for platforms like Android is well-supported, iOS packaging is still experimental. Developers should ensure that their app adheres to the specific platform’s rules and guidelines.

### 5. **Advantages of Store-Packaged PWAs**

- PWAs installed via app stores still benefit from features like updates being handled on the web (no need to push a new version through the store unless metadata is changed).
- Major apps like TikTok and Twitter use lite versions of PWAs for better performance on specific platforms, especially in regions with low bandwidth.

## Service Worker Insights

### Exception for iPhones and PWAs

- **iOS Limitation**: Unlike other platforms, **Safari on iOS** does not support web push notifications unless the PWA is installed.
- **PWA Installation**: After installing a PWA on iOS, the installed app can request permission for web push notifications. However, this is not possible directly through Safari.

### Service Worker Scope

- **Scope Definition**: The scope of a service worker defines which parts of the site it controls. It includes an **origin** (domain) and a **path**. This means that a service worker can manage the whole domain or just specific folders. e.g `https://example.com/` or `https://example.com/dashboard`. Scope is a folder or a domain within your server.
- **Scope Management**:
  - One service worker per scope is allowed.
  - If you try to install another service worker within the same scope, it will replace the previous one.
  - It's installed by any page in the scope
  - After installed, it can serve all files requested from the scope
  - Only one service worker is allowed

### WebKit's Partition Management

- **Partition Definition**: WebKit introduces partition management due to **privacy concerns**. A partition is defined by the combination of the domain and any iframes it contains. Each partition is combination of domain plus the doamin of the iframe. Each partition gets its own service worker instance. If you don't have iframes, partitions is same as domain. [Link](https://webkit.org/blog/8090/workers-at-your-service/)

### Security Concerns and History

- **Initial Resistance**: When service workers were first introduced, there was pushback from the **Safari** team due to concerns about security risks.
- **Security Measures**:
  - Service workers only act on their own domain and cannot interact with other websites or tabs.
  - They cannot execute tasks by themselves unless triggered by events like opening a document or receiving a push notification.
- **Current Status**: Despite early fears, no significant security vulnerabilities have been found in the years since service workers were introduced. Their ability to run in the background, however, does raise concerns about battery usage.

### Key Discussion Points

- **Push Notifications**: To use web push notifications on iOS, PWAs must be installed. Safari alone does not provide this capability.
- **Service Worker Limitations**: They can only control resources within their defined scope (domain/path).
- **Privacy and Security**: Although service workers are powerful, they are limited to prevent cross-origin access and have not led to major security breaches.

## Setting Up a Service Worker for Your PWA

A service worker is a JavaScript file that runs in the background of a web page, separate from the main thread.
To create a service worker, you write it as a plain JavaScript file (e.g., serviceWorker.js). For demonstration, the code logs I'm a service worker ready to serve when it's initialized.

```js
// serviceWorker.js

// service worker thread
console.log("I'm a service worker, ready to serve");
```

### Registering a Service Worker

You register the service worker within a script, typically in the root of your website (to ensure it has the correct scope). Avoid placing it in a subfolder unless you want the service worker's scope restricted to that folder.

```js
// registerServiceWorker.js


// main thread

if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('/serviceWorker.js');
}

```

You can also opt to treat your service worker as an ES module if necessary by adding type: "module" during registration:

```js
navigator.serviceWorker.register('/serviceWorker.js', { type: 'module' });
```

### Linking the Service Worker to Your Web Page

To link the service worker to your web page, you add the registration script to your HTML file.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My PWA</title>
     <link rel="manifest" href="app.webmanifest?1">
    <link rel="stylesheet" href="styles.css">
    <script src="app.js"></script>
    <script src="/registerServiceWorker.js"></script>
</head>
<body>
    <h1>Welcome to My PWA</h1>

</body>
</html>
```

### Can I unregister a Service Worker?

Yes, this is possible, the following code does the trick:

```js
navigator.serviceWorker.getRegistrations().then(function(registrations) {
 for(let registration of registrations) {
  registration.unregister()
} })
```

### Service Worker Lifecycle

The service worker does not automatically take effect once registered; it goes through an installation and activation phase.
If there are updates to the service worker file, the browser downloads the new version but waits until the current session is closed before activating it. This ensures the new service worker doesn't interfere with an ongoing session.
Updating the Service Worker: In development, using Chrome DevTools, you can force an update on reload by enabling "Update on reload" in the Application tab, allowing immediate activation of a new service worker.

To manually skip the waiting phase of the new/updated service worker, click the "skipWaiting" button in the DevTools Application/Service workers tab.

### Service Worker's  Scope

The scope of a service worker defines what network requests it will handle. By default, the scope is the directory where the service worker file is located, but this can be changed. For example, if the service worker is in the root directory, it will control all requests on the domain. If it's in a subfolder, it will only control requests within that folder. The scope is defined when registering the service worker:

  ```js
  navigator.serviceWorker.register('/serviceWorker.js', { scope: '/subfolder/' });
  ```

Thus to control all requests on the domain, the service worker should be in the root directory.
The scope of a service worker is limited to the folder in which it's defined. For instance, if you place the service worker in a subfolder like /scripts/, it will only control requests within that folder. To avoid this, service workers are usually placed at the root level (e.g., /serviceWorker.js).

### The Service Worker Lifecycle

The lifecycle of a service worker is more complex than most client-side scripts. Let’s break it down into key stages:

1. Installation: This is the first phase. After you register the service worker, the browser attempts to install it. This phase is perfect for pre-caching resources like HTML, CSS, and JavaScript that you want available offline.
2. Waiting: Once installed, the new service worker enters the "waiting" phase. It doesn't take control immediately, because the old service worker (if any) still controls open pages. The waiting phase prevents sudden disruptions for users who may still be interacting with your app. However, you can skip this waiting phase by calling self.skipWaiting().
3. Activation: After the old service worker is no longer in control (such as when all pages it controls are closed), the new service worker becomes active. During this phase, you can clean up old caches or perform any setup required for the new worker.
4. Running: Once activated, the service worker is running and can now intercept network requests, manage cache, and more.
5. Idle and Termination: When not handling events, a service worker is idle. The browser may terminate it to save memory, and restart it when needed (for example, when a new network request is intercepted). This is crucial because any state stored in memory (global variables) will be lost between restarts.

# Service Worker Update (Replacing an Existing One)

## Overview

When a new version of the service worker is available, it goes through a specific lifecycle that differs slightly from the initial installation.

### An Old Service Worker Already Exists

If there is already an active service worker controlling the page and a new one is detected (e.g., when the service worker file changes), the browser doesn’t immediately replace the old one. The new service worker goes through the following steps:

### Lifecycle Phases and Event Listeners

#### 1. `install` Event (again)

- When a new service worker is detected, the `install` event is triggered for the new version.
- During this phase, assets are typically cached, just like during the first installation.
- At this point, **the new service worker is not controlling the page yet**; it’s in the waiting phase.

#### 2. Waiting for Activation

- The new service worker stays in the **waiting phase** until all pages controlled by the old service worker are closed or refreshed.
- Only once the old service worker is no longer controlling any pages will the new service worker move to the next phase.

- To skip this waiting phase and allow the new service worker to take over immediately, you can call `self.skipWaiting()` inside the `install` event.

```javascript
self.addEventListener('install', event => {
  self.skipWaiting();
});
```

#### 3. `activate`  Event (for the updated service worker)

- When the new service worker is activated (after it replaces the old one), the activate event is fired again.
- This is a good time to delete old caches or resources that are no longer needed by the updated service worker.

Example of activating the updated service worker:

```javascript
self.addEventListener('activate', (event) => {
  console.log('Updated Service Worker Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== 'new-cache') {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
```

## Key Differences

### When installing for the first time

- The `install` and `activate` events run normally, and there’s no previous service worker to deal with.

### When updating an existing service worker

- The new service worker enters a waiting state after the `install` event, until the old service worker is no longer controlling any pages.
- You can force the new service worker to skip waiting with `self.skipWaiting()`.
- Once the old service worker is replaced, the `activate` event of the new service worker runs, and it starts handling network requests.

This lifecycle ensures that users don't face disruptions while browsing the web app, as the new service worker only takes control after all pages from the previous one are closed or refreshed.

### Responding to Network Requests

Service workers can intercept all network requests within their scope using the fetch event listener.
You can inspect and manipulate requests and responses, even serving custom responses for specific requests.

```js
self.addEventListener('fetch', (event) => {
    console.log(`HTTP Request: ${event.request.url}`);
});
```

### Offline Capability and Caching

The service worker can cache resources for offline access using the Cache Storage API.
You can pre-cache files during the installation phase and serve cached content when the network is unavailable.
Example of caching during installation:

```js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/index.html',
                '/styles.css',
                '/script.js'
            ]);
        })
    );
});
```

When offline, the service worker can serve cached assets, ensuring the app continues to function.

### Service Worker as a Proxy

The service worker acts as a proxy between the web app and the network. It can intercept requests and serve custom responses, acting like a mini server on the client side.

```js
self.addEventListener('fetch', (event) => {
    event.respondWith(new Response('Hello from the service worker!'));
});
```

This simple example serves the same response for every request.

### App Shell Pattern

The App Shell pattern is a design approach where the core, minimal user interface of a Progressive Web App (PWA) is loaded initially, and additional content is loaded dynamically. The app shell includes the static resources required to get the UI running, and once cached, it ensures fast loading and offline functionality.

Using a service worker, you can cache the app shell during the installation phase and serve it immediately on subsequent visits. This way, users experience fast load times and offline access to the app's structure (UI), even if the network is unavailable.

Example of caching the app shell:

```js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/index.html',
                '/styles.css',
                '/appShell.js'
            ]);
        })
    );
});
```

### Cache Strategy: Atomic Updates vs Incremental Updates

When managing caches, you have two primary strategies:

1. Atomic Updates: This strategy ensures that all resources (HTML, CSS, JS, etc.) are updated at once when a new version is available. This keeps everything in sync, but users may need to reload the entire site after a major update.

2. Incremental Updates: This approach allows resources to update gradually, meaning users may continue using older versions of some assets while new ones load in the background. This strategy might reduce bandwidth usage but risks users experiencing inconsistent versions of your app.
Which Strategy to Choose?

For small-to-medium-sized applications, atomic updates are often better because they ensure that everything remains in sync. However, for large-scale applications with hundreds or thousands of assets, incremental updates might make more sense to avoid large, monolithic downloads.

## Implementing Service Workers for PWAs

### 1. Register the Service Worker

First, you need to register the service worker in your JavaScript file, typically in index.js or app.js.

```js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    });
}
```

### 2. Cache Static Assets (Install Event and Caching Assets)

- In the service-worker.js file, you handle the install event, where you cache all the necessary files for your PWA to work offline. Use the Cache API to store the files.
- Upon installing the service worker, the Cache API is used to open or create a cache.
Files essential to the PWA (like index.html, app.js, and styles.css) are pre-fetched and stored in the cache. This process is known as pre-fetching.
- The service worker itself and files like the web manifest do not need to be cached manually, as the browser handles these automatically.

```js
const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/styles.css',
    '/logo.png',
    'sw-register.js',
    'https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
];


// When the service worker is installed, open the cache and add the files to it
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});
```

### 3. Fetch Event and Cache Strategy (Serve Cached Files)

- **Cache First**: In the fetch event, you define how to serve the cached files using a "cache-first" strategy. The service worker will look for the requested resource in the cache first. If it’s not there, it will fetch the resource from the network.

```js
// Cache first strategy
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)  // searching in the cache
            .then( response => {
                if (response) {
                   // Return the cached response if found
                    return response; // cache hit
                } else {
                     // If not, fetch the request from the network
                    return fetch(event.request);  // cache miss
                }
            }).catch(() => {
            return caches.match('/offline.html'); // Optional fallback for offline
        })
    );
});
```

- **Network First**: The service worker tries to fetch from the network first. If the network is unavailable, it falls back to the cache.

```js
// Network first strategy
self.addEventListener('fetch', event => {
    event.respondWith(
      fetch(event.request) // I go to the network ALWAYS
        .catch( error => {  // if the network is down, I go to the cache
            return caches.open("assets")
                    .then( cache => {
                         return cache.match(request);
                 });
        })
    );
  });
```

- **Stale While Revalidate**: The service worker serves cached content immediately but checks the network in the background to update the cache for the next request.

```js
// State while revalidate strategy
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then( response => {
                // Even if the response is in the cache, we fetch it
                // and update the cache for future usage
                const fetchPromise = fetch(event.request).then(
                     networkResponse => {
                        caches.open("assets").then( cache => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    });
                // We use the currently cached version if it's there
                return response || fetchPromise; // cached or a network fetch
            })
        );
    });
```

### 4. Activate Event and Cache Management

 You can manage the cache by updating the cache version and deleting old caches during the activate event.

```js
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
```

## Workbox JS

[Link](https://github.com/GoogleChrome/workbox)

A popular library created by the Chrome team that simplifies service worker implementations.
It offers higher-level APIs for precaching and caching strategies, allowing developers to avoid writing custom service worker code manually.

# Difference Between Web Worker and Service Worker

## 1. Purpose

- **Web Worker:** Designed to handle multi-threaded tasks in the background (e.g., computation-heavy tasks like data processing or number crunching) to avoid blocking the main UI thread. They are mostly used to offload tasks that are CPU-intensive, enabling better performance in web applications.

- **Service Worker:** Acts as a proxy between the web application and the network, providing more control over network requests (like caching, offline capabilities, and background synchronization). It is primarily used to intercept and manage network requests, making it ideal for building offline experiences (e.g., in Progressive Web Apps).

## 2. Lifecycle and Scope

- **Web Worker:**
  - **Lifecycle:** Tied directly to the web page or app that creates it. It starts when the page opens and terminates when the page is closed or reloaded.
  - **Scope:** Works in a single session, executing code in a separate thread but within the same page lifecycle.

- **Service Worker:**
  - **Lifecycle:** Operates independently of any web page. Once installed, it persists even if the web page is closed, making it able to handle tasks like push notifications or background synchronization.
  - **Scope:** Has a broader scope, operating globally across multiple pages or tabs for the same domain. It also continues to function in the background.

## 3. Interaction with Network Requests

- **Web Worker:** Does not interact with network requests directly. Its primary function is to handle computational tasks in parallel, reducing the load on the main thread.

- **Service Worker:** Designed to intercept and control all network requests. It can cache resources, intercept fetch requests, and serve content from the cache or network. This is why it's central to creating offline-first web applications.

## 4. Caching and Offline Capabilities

- **Web Worker:** Does not handle caching or offline capabilities. It's mainly for offloading computation-heavy tasks, such as processing large datasets.

- **Service Worker:** Provides fine-grained caching control through the Cache API, allowing developers to implement custom caching strategies and support offline functionality. This makes it ideal for building Progressive Web Apps (PWAs).

## 5. Event Handling

- **Web Worker:** Communicates with the main thread via messages. The web page sends tasks to the worker, and the worker responds when the task is completed using `postMessage()`.

- **Service Worker:** Operates with an event-driven model. It listens for specific events such as install, activate, and fetch. For example, the fetch event allows the service worker to intercept outgoing network requests and decide whether to serve cached data or fetch from the network.

## 6. Persistence

- **Web Worker:** Exists only for the duration of the web page session. When the page is closed or refreshed, the web worker is terminated.

- **Service Worker:** Remains active in the background even when the user closes the website. It is persistent across sessions, allowing it to handle background tasks, like syncing data, after the app is closed.

## 7. Security

- **Web Worker:** Runs in a sandboxed environment, ensuring that it has no access to the DOM or the global variables of the main thread. This enhances security by isolating the worker’s operations.

- **Service Worker:** Also runs in a sandboxed environment, but it operates with more sensitive permissions, like intercepting network requests, managing caches, and interacting with push notifications. Therefore, service workers are always served over HTTPS to ensure secure communication.

## Summary of Key Differences

| Feature                       | Web Worker                                     | Service Worker                                |
|-------------------------------|------------------------------------------------|----------------------------------------------|
| Primary Purpose               | Offload computation-heavy tasks                 | Intercept network requests, caching, offline functionality |
| Lifecycle                     | Tied to a webpage session                       | Independent of webpage, persists across sessions |
| Scope                         | Operates within a single page or session       | Global scope, works across multiple pages or tabs |
| Network Interaction           | No direct interaction with network requests     | Can intercept and control network requests   |
| Caching and Offline           | No caching or offline capabilities              | Built for caching and offline support (via Cache API) |
| Persistence                   | Ends when page is closed or refreshed          | Remains active in the background             |
| Event Handling                | Communicates with the main thread via messages  | Listens for install, fetch, and other events |
| Security                      | Sandboxed environment, no access to DOM        | Sandboxed, requires HTTPS for secure operations |

Both web workers and service workers provide important capabilities for modern web applications but serve different purposes. Web workers are more about improving performance via multi-threading, while service workers focus on managing network behavior and providing better user experiences with offline access and caching.

# Message Channel

A message channel is a mechanism that allows for the creation of two distinct communication channels (or ports) between two contexts, such as between a service worker and a web page. It enables bidirectional messaging where each end can send messages to the other without direct access to the other end's execution context.

## Ports

A port is one end of a message channel. When you create a message channel using the MessageChannel API, it provides two ports: `port1` and `port2`. Each port is an object that can send and receive messages. You can think of ports as dedicated pathways for communication.

## How it Works in the Context of Service Workers

### Creating a Message Channel

When you set up a message channel, both `port1` and `port2` are created. You can send one port to the service worker and keep the other for communication from the service worker back to the page.

```javascript
const messageChannel = new MessageChannel();
const port1 = messageChannel.port1;
const port2 = messageChannel.port2;
```

### Sending Messages

When you want to send a message from the web page to the service worker, you use one of the ports. For example, you might send port2 to the service worker.

```javascript
navigator.serviceWorker.controller.postMessage('Hello, Service Worker!', [port2]);
```

### Receiving Messages

In the service worker, you can listen for messages on the received port. When a message comes in on that port, you can use it to communicate back to the web page through the other port.

```javascript
port1.onmessage = (event) => {
    // Handle incoming message
    console.log('Received message from page:', event.data);
    port1.postMessage('Hello, Page!');
};
```

### Using Ports for Response

By using different ports for communication, you can keep the interactions clean and organized. The service worker can respond to the specific page that sent the request without confusion, as each page will have its own dedicated port.

### Why Use Ports?

1. Isolation: Each port operates independently, which means messages sent on one port won’t interfere with messages on another. This isolation is crucial when multiple pages might communicate with the same service worker simultaneously.

2. Efficiency: Using ports allows the service worker to manage multiple connections to different pages without the need to maintain multiple references or states.

### Summary

The use of message channels and ports in service worker communication provides a robust way to handle messaging in a clean and organized manner, especially when multiple pages are involved. It enables reliable and distinct communication paths, ensuring that messages can be sent and received without confusion or conflict.

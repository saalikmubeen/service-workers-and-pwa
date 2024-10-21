# Creating and Storing Subscriptions

In the previous lecture, a subscription was created and stored on the server. This subscription is a crucial part of the Push API, which allows servers to send notifications to web applications even when they're not actively running in the browser. A subscription represents an agreement between the user’s device/browser and the server to receive push messages.

### When a subscription is created

1. The browser sets up a connection between the user's device and the server via the Push Service (a third-party service, usually provided by the browser vendor like Google for Chrome, Mozilla for Firefox, etc.).
2. The subscription is then stored on the server, which maintains this subscription data for sending future push notifications to the client.

## 2. Push Messages from the Server

In the current lecture, the next step is preparing the server to actually send push messages to the client. Once the server has the subscription details, it can use this information to communicate with the Push Service, which will deliver messages to the browser.

- A push message is a small payload of data that can be sent by the server, which is delivered to the user's device even when the app isn't running or in the foreground.
- The service worker acts as an intermediary, listening for these messages and handling them (for example, displaying a notification to the user).

## 3. Subscriptions and the Service Worker

The key concept here is that the subscription is closely tied to the browser's service worker. A service worker is a script that runs in the background (separate from your web page) and handles background tasks, including receiving push notifications.

- When a subscription is created, it is associated with the service worker, which means the service worker is responsible for processing incoming push notifications.
- This subscription is specific to the user's device and browser, and it's stored on the server so that the server can send push notifications to that specific user/browser.

## 4. Clearing Site Data and Unregistering the Service Worker

When you go to the Application tab in the browser’s developer tools and choose to clear site data, two things can happen:

1. Site data is cleared, which includes cookies, local storage, and more.
2. If you check the option to unregister the service worker, you also remove the service worker from the browser. This means the subscription associated with that service worker becomes invalid.

### Unregistering a service worker has a significant impact

- The subscription stored on the server becomes useless because it is tied to that specific service worker on that device.
- If you try to send a push notification to this subscription, it will fail since the service worker no longer exists to handle the push message.

## 5. Updating vs. Unregistering a Service Worker

There’s an important distinction between updating and unregistering a service worker:

- **Updating the service worker:** When you make updates to the service worker (e.g., adding new code or reloading the page), the subscription remains valid because the service worker is still in place. The browser handles service worker updates smoothly without breaking existing subscriptions.

- **Unregistering the service worker:** If you manually unregister a service worker, all subscriptions associated with that service worker become invalid. Push messages will no longer reach the user's device, as there’s no service worker to handle them.

In short, updating doesn’t disrupt the existing subscriptions, but unregistering does, which is why it’s critical to handle service worker lifecycle events carefully.

Whenever you make changes to the service worker, the updated version has to be registered in the browser. However, you should not clear the site data because that would unregister the service worker, which makes the old push subscriptions invalid.

Once the page is refreshed, the new service worker is installed without affecting the existing push subscriptions.

## 6. Subscription Cleanup on the Server

Since the subscription becomes invalid when the service worker is unregistered, there is a discrepancy between what is stored on the server and what is happening on the client:

- The server still holds a record of the subscription, but it’s no longer useful since the corresponding service worker no longer exists on the client.

Therefore, it’s important to clean up these subscriptions on the server to avoid sending push messages to non-existent service workers. One way to handle this would be to periodically verify subscriptions on the server, ensuring that they are still valid and connected to active service workers. If a subscription is invalid (for example, if a push attempt fails), it should be removed from the server.

## 7. Best Practices for Service Workers and Subscriptions

The lecture emphasizes some key best practices:

- **Keep your service worker registered:** Avoid unnecessary unregistration of service workers unless it's absolutely required. Regular updates to the service worker won’t disrupt subscriptions.

- **Handle subscription cleanup:** If you do unregister the service worker (for instance, during development or debugging), make sure to also remove the corresponding subscriptions on the server.

- **Gracefully manage updates:** When you update the service worker, ensure it doesn’t disrupt existing functionality. This can be achieved by using versioning and carefully testing updates.

## 8. Next Steps: Sending Push Messages

After understanding the relationship between service workers and subscriptions, the next logical step is to actually send push messages from the server. The server will take the stored subscription data and use it to send a notification via the Push Service, which delivers it to the browser where the service worker will handle it and display it to the user.

## 9. Multiple Devices and Subscriptions

Each device or browser will have a separate subscription. If you register the service worker and subscription on multiple devices, each device will receive push notifications independently. When the server sends a push notification, any browser with a valid subscription will receive it.

### Summary

- Subscriptions are tied to a specific browser and service worker on a device.
- Clearing site data and unregistering the service worker invalidates the subscription.
- Push messages rely on the service worker to be active and registered.
- It’s important to keep the service worker registered to ensure push notifications continue working.
- If a service worker is unregistered, subscriptions on the server should be cleaned up to avoid trying to send notifications to inactive users.


# Lemmy Userdata Migration

This web application exports your user data (community follows, blocklists, profile settings) and (optionally) imports them to the target account while also allowing you to modify the exported data.

Hosted on GitHub: https://stablenarwhal.github.io/Lemmy-Userdata-Migration/

# Features:
- Don't trust me or GitHub? Clone the project and host it yourself or run it locally ([Example in Wiki](https://github.com/StableNarwhal/Lemmy-Userdata-Migration/wiki/How-to-run-Lemmy%E2%80%90Userdata%E2%80%90Migration-locally))
- Export user data from any Lemmy instance (>=v0.19)
- Download user data as a text file
- Modify user data, e.g. to add or remove followed users/communites ([Example in Wiki](https://github.com/StableNarwhal/Lemmy-Userdata-Migration/wiki/How-to-only-export-transfer-a-part-of-my-user-data,-e.g.-blocked-instances%3F))
  - "display_name"
​
  - "bio"
  ​
  - "avatar"
  ​
  - "banner"
  ​
  - "matrix_id"
  ​
  - "bot_account"
  ​
  - "settings"
  ​
  - "followed_communities"
  ​
  - "saved_posts"
  ​
  - "saved_comments"
  ​
  - "blocked_communities"
  ​
  - "blocked_users"
  ​
  - "blocked_instances"
- Transfer user data to the target account on the target instance

# Why?
Ease of use, mostly. Some instances also have technical problems, preventing the user from using the regular Export/Import Functions in the frontend. As long as the API is still functional, so is this web application. 


# How this works:

1. Input your instance(s), username(s), password(s) and optionally 2FA-Token(s)

2. The clientside JavaScript code processes your inputs locally and tries to grab a special token using your provided export instance, username and password.

3. If the export token can be grabbed, it gets used to authenticate a request to grab your user data from your export instance.

4. If the userdata export was successful, another special token is attempted to be grabbed, this time from your provided import instance.

5. If the import token can be grabbed, another request to upload your user data to your import instance is attempted.

**At this point, if the log is all green, the process is complete. You can safely close the window, your sensitive input and local user data gets deleted.**

![overview_compact](https://github.com/StableNarwhal/LemmyInstanceMover/assets/14216536/7f2fcf24-cd34-48d1-be74-5957b024962c)

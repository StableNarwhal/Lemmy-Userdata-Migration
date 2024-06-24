
# Lemmy Instance Mover

This little web application allows you to transfer your user data from one Lemmy instance to another. 


**What this actually does:**

1. Input your instances, usernames and passwords.

2. The clientside JavaScript code processes your inputs locally and tries to grab a special token using your provided export instance, username and password.

3. If the export token can be grabbed, it gets used to authenticate a request to grab your user data from your export instance.

4. If the userdata export was successful, another special token is attempted to be grabbed, this time from your provided import instance.

5. If the import token can be grabbed, another request to upload your user data to your import instance is attempted.

**At this point, if the log is all green, the process is complete. You can safely close the window, your sensitive input and local user data gets deleted.**


![overview](https://github.com/StableNarwhal/LemmyInstanceMover/assets/14216536/b92ca16f-d70c-43f3-81c3-9fd1553280fe)

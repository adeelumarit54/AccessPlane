/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global Office */
let mailboxItem;
Office.onReady(() => {
  // If needed, Office.js is ready to be called.
  mailboxItem = Office.context.mailbox.item;
});

/**
 * Shows a notification when the add-in command is executed.
 * @param event
 */
function action(event: Office.AddinCommands.Event) {
  const message: Office.NotificationMessageDetails = {
    type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
    message: "Performed action.",
    icon: "Icon.80x80",
    persistent: true,
  };

  // Show a notification message.
  Office.context.mailbox.item?.notificationMessages.replaceAsync(
    "ActionPerformanceNotification",
    message
  );

  // Be sure to indicate when the add-in command function is complete.
  event.completed();
}
function validateBody(event) {
  mailboxItem.body.getAsync("text", { asyncContext: event }, checkBodyAndCallAPI);
}

function checkBodyAndCallAPI(asyncResult) {
  const event = asyncResult.asyncContext;
  const bodyText = asyncResult.value;

  mailboxItem.to.getAsync({}, function (toResult) {
    if (toResult.status === Office.AsyncResultStatus.Succeeded) {
      const recipients = toResult.value.map(recipient => recipient.emailAddress);
      const tokken = window.localStorage.getItem("access_token");
      const User = window.localStorage.getItem("communicationUser");

      const communicationUser = JSON.parse(User);

      console.log("Access Token:", tokken);
      console.log("Communication User:", communicationUser);

      // ✅ Get subject asynchronously
      mailboxItem.subject.getAsync(function (subjectResult) {
        if (subjectResult.status === Office.AsyncResultStatus.Succeeded) {
          const subject = subjectResult.value;
          console.log("Subject:", subject);

          // Prepare API headers and payload
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", "Bearer " + tokken);

          const raw = JSON.stringify({
            MappedIDType: "User",
            MappedID: communicationUser.ID,
            CommunicationTypeID: "-1",
            Subject: subject || "No subject",
            Body: bodyText,
          });

          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
          };

          // Call the API
          fetch("https://outlookdemo.accessplanit.com/accessplansandbox/api/v2/communication", requestOptions)
            .then(response => response.json())
            .then(result => {
              console.log("API call succeeded:", result);
              event.completed({ allowEvent: true });
            })
            .catch(error => {
              console.error("API call failed:", error);
              event.completed({ allowEvent: false });
            });
        } else {
          console.error("Failed to get subject.");
          event.completed({ allowEvent: false });
        }
      });

    } else {
      console.error("Failed to get recipients.");
      event.completed({ allowEvent: false });
    }
  });
}


// Register the function with Office.
Office.actions.associate("action", action);
Office.actions.associate("validateBody", validateBody);


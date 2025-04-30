import * as React from "react";
import {
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  makeStyles,
  Image,
  Text
} from "@fluentui/react-components";
import { TextBulletListRtlFilled } from "@fluentui/react-icons";
import { getTokens } from "../utils/authUtils";

import { setCommunicationUser as storeCommunicationUser } from "../utils/userHelper";

import { GETUser } from "../services/users";


// import '@assets/styles.css';

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  navbar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#f3f2f1",
    marginBottom: "40px",
    borderRadius: "4px",
  },
  logoContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "100px",
  },
  logo: {
    maxWidth: "200px",
    height: "auto",
  },
  menuButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  menuIcon: {
    fontSize: "24px",
  },
  brandText: {
    fontSize: "18px",
    fontWeight: "600",
  }
});

const Home: React.FC = () => {
  const styles = useStyles();
  const [userInPlan, setUserInPlan] = React.useState("");
  const [CommunicationUser, setCommunicationUser] = React.useState("");

  // TRY AUTOLINK To check the user 

  Office.context.mailbox.item.addHandlerAsync(
    Office.EventType.RecipientsChanged,
    (eventArgs) => {
      console.log("Recipients changed!", eventArgs);
      TryAutoLink();
    },
    (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        console.log("Handler added for RecipientsChanged");
      } else {
        console.error("Failed to add handler:", result.error.message);
      }
    }
  );



  const TryAutoLink = async () => {
    const tokens = getTokens();
    if (!tokens) {
      console.error('No tokens available');
      return;
    }

    try {
      // 1. Get recipients from Outlook
      Office.context.mailbox.item.to.getAsync(async function (asyncResult) {
        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
          const recipients = asyncResult.value;
          const recipientEmails = recipients.map(r => r.emailAddress.toLowerCase());

          console.log("Recipient emails:", recipientEmails);

          // 2. Fetch user data from API
          const userData = await GETUser(tokens);
          const users = userData?.results || [];

          // 3. Find matching user
          const matchedUser = users.find(user =>
            recipientEmails.includes(user.Email.toLowerCase())
          );

          // 4. Log the matched user
          if (matchedUser) {
            setCommunicationUser(matchedUser)
            window.localStorage.setItem("communicationUser", JSON.stringify(matchedUser)); // local storage
            storeCommunicationUser(matchedUser); // global storage
            console.log("Matched User:", matchedUser);
            setUserInPlan("user exist in plan");
          } else {
            console.log("No user matched with recipients.");
          }
        } else {
          console.error("Failed to get recipients:", asyncResult.error);
        }
      });
    } catch (error) {
      console.error("Error in TryAutoLink:", error);
    }
  };



  const HandleUserSelection = () => {
    const tokens = getTokens();
    if (!tokens) {
      console.error('No tokens available');
      return;
    }

    const dialogUrl = `https://localhost:3000/assets/selectUser.html?token=${encodeURIComponent(tokens.access_token)}`;

    Office.context.ui.displayDialogAsync(dialogUrl, { height: 60, width: 70 }, function (asyncResult) {
      if (asyncResult.status === Office.AsyncResultStatus.Failed) {
        console.error('Failed to open dialog:', asyncResult.error);
        return;
      }

      console.log('Dialog opened successfully');
      const dialog = asyncResult.value;
      dialog.addEventHandler(Office.EventType.DialogMessageReceived, function (arg) {
        if ('message' in arg) {
          console.log('Dialog message received:', arg.message);
          const selectedUser = JSON.parse(arg.message);
          console.log("Selected user:", selectedUser);
          localStorage.setItem("communicationUser", JSON.stringify(selectedUser)); // local storage

          setCommunicationUser(selectedUser); // local state

          storeCommunicationUser(selectedUser); // global storage
          setUserInPlan("")
          dialog.close();
        }
      });

      dialog.addEventHandler(Office.EventType.DialogEventReceived, function (arg) {
        console.log('Dialog event received:', arg);
      });
    });
  }

  return (
    <div className={styles.root}>
      <div className={styles.navbar}>
        <div>
          <Text className={styles.brandText}>AccessPlan</Text>
        </div>

        <div className={styles.menuButton}>
          <Menu>
            <MenuTrigger>
              <Button appearance="transparent" icon={<TextBulletListRtlFilled className={styles.menuIcon} />} />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem>Settings</MenuItem>
                <MenuItem onClick={HandleUserSelection}>Select User</MenuItem>
                <MenuItem>Select Company</MenuItem>
                <MenuItem onClick={TryAutoLink}>Try AutoLink</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>


      </div>
      <div style={{ display: "contents" }}>
        {/* <Text className={styles.brandText}>Welcome to AccessPlan</Text> */}
        {/* <Text className={styles.brandText} style={{marginTop:"13px"}}>{userInPlan}</Text> */}
      </div>
      <div className={styles.logoContainer}>

        <Image
          className={styles.logo}

          src={`/assets/${userInPlan ? "AccessPlanChain.png" : "AccessPlan.png"}`}

          alt="Company Logo"
          style={{ maxWidth: "116px" }}
        />

      </div>
    </div>
  );
};

export default Home;

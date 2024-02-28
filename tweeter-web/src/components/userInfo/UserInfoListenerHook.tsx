import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";
import { AuthToken, User } from "tweeter-shared";

interface UserInfoListener {
  presentUser: User | null;
  presentedUser: User | null;
  currentAuthToken: AuthToken | null;
  updateUserInformation: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  clearUserInformation: () => void;
  setDisplayedUserInfo: (user: User) => void;
}

const useUserInfoListener = (): UserInfoListener => {
    const { currentUser, displayedUser, authToken, updateUserInfo, clearUserInfo, setDisplayedUser } = 
      useContext(UserInfoContext);

    return { presentUser: currentUser,
      presentedUser: displayedUser,
      currentAuthToken: authToken,
      updateUserInformation: updateUserInfo,
      clearUserInformation: clearUserInfo,
      setDisplayedUserInfo: setDisplayedUser
    };
}

export default useUserInfoListener;
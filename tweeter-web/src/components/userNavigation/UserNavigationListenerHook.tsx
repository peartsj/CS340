import { AuthToken, User } from "tweeter-shared";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenter/UserNavigationPresenter";

interface Props {
  event: React.MouseEvent;
  setDisplayedUserInfo: (user: User) => void;
  presentUser: User | null;
  currentAuthToken: AuthToken | null;
  displayErrorMessage: (message: string) => void;
}

const useUserNavigationListener = async (props: Props): Promise<void> => {
  const Listener: UserNavigationView = {
    currentUser: props.presentUser,
    authToken: props.currentAuthToken,
    setDisplayedUserInfo: props.setDisplayedUserInfo,
    displayErrorMessage: props.displayErrorMessage,
  };

  const presenter = new UserNavigationPresenter(Listener);

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    presenter.navigateToUser(event);
  };

  navigateToUser(props.event);
};

export default useUserNavigationListener;

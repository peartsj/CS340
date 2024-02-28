import { AuthToken, FakeData, User } from "tweeter-shared";

interface Props {
  event: React.MouseEvent;
  setDisplayedUserInfo: (user: User) => void;
  presentUser: User | null;
  currentAuthToken: AuthToken | null;
  displayErrorMessage: (message: string) => void;
}

const useUserNavigationListener = async (props: Props): Promise<void> => {
  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    props.event.preventDefault();

    try {
      let alias = extractAlias(props.event.target.toString());

      let user = await getUser(props.currentAuthToken!, alias);

      if (!!user) {
        if (props.presentUser!.equals(user)) {
          props.setDisplayedUserInfo(props.presentUser!);
        } else {
          props.setDisplayedUserInfo(user);
        }
      }
    } catch (error) {
      props.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  };

  const extractAlias = (value: string): string => {
    let index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  navigateToUser(props.event);
};

export default useUserNavigationListener;

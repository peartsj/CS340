import { Link } from "react-router-dom";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import Post from "./Post";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoListener from "../userInfo/UserInfoListenerHook";

interface Props {
  value: Status;
}

const StatusItem = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUserInfo, presentUser, currentAuthToken } =
    useUserInfoListener();

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      let alias = extractAlias(event.target.toString());

      let user = await getUser(currentAuthToken!, alias);

      if (!!user) {
        if (presentUser!.equals(user)) {
          setDisplayedUserInfo(presentUser!);
        } else {
          setDisplayedUserInfo(user);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
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

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.value.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.value.user.firstName} {props.value.user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={props.value.user.alias}
                onClick={(event) => navigateToUser(event)}
              >
                {props.value.user.alias}
              </Link>
            </h2>
            {props.value.formattedDate}
            <br />
            <Post status={props.value} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusItem;

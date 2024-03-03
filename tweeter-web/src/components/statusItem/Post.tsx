import { Status, Type } from "tweeter-shared";
import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoListener from "../userInfo/UserInfoListenerHook";
import useUserNavigationListener from "../userNavigation/UserNavigationListenerHook";

interface Props {
  status: Status;
}

const Post = (props: Props) => {
  const { setDisplayedUserInfo, presentUser, currentAuthToken } =
    useUserInfoListener();
  const { displayErrorMessage } = useToastListener();

  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <Link
            key={index}
            to={segment.text}
            onClick={(event) =>
              useUserNavigationListener({
                event,
                setDisplayedUserInfo,
                presentUser,
                currentAuthToken,
                displayErrorMessage,
              })
            }
          >
            {segment.text}
          </Link>
        ) : segment.type === Type.url ? (
          <a
            key={index}
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          segment.text
        )
      )}
    </>
  );
};

export default Post;

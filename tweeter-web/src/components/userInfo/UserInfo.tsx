import "./UserInfo.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoListener from "./UserInfoListenerHook";
import {
  UserInfoPresenter,
  UserInfoView,
} from "../../presenter/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeesCount, setFolloweesCount] = useState(-1);
  const [followersCount, setFollowersCount] = useState(-1);
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

  const { presentUser, currentAuthToken, presentedUser, setDisplayedUserInfo } =
    useUserInfoListener();

  if (!presentedUser) {
    setDisplayedUserInfo(presentUser!);
  }

  useEffect(() => {
    setIsFollowerStatus();
    setNumbFollowees(currentAuthToken!, presentedUser!);
    setNumbFollowers(currentAuthToken!, presentedUser!);
  });

  const Listener: UserInfoView = {
    setIsFollower: setIsFollower,
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    clearLastInfoMessage: clearLastInfoMessage,
    setFolloweesCount: setFolloweesCount,
    setFollowersCount: setFollowersCount,
  };

  const presenter = new UserInfoPresenter(Listener);

  const setIsFollowerStatus = async () => {
    await presenter.setIsFollowerStatus(
      currentAuthToken!,
      presentUser!,
      presentedUser!
    );
  };

  const setNumbFollowees = async (
    authToken: AuthToken,
    displayedUser: User
  ) => {
    await presenter.setNumbFollowees(authToken, displayedUser);
  };

  const setNumbFollowers = async (
    authToken: AuthToken,
    displayedUser: User
  ) => {
    await presenter.setNumbFollowers(authToken, displayedUser);
  };

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUserInfo(presentUser!);
  };

  const followDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    await presenter.followDisplayedUser(
      event,
      presentedUser!,
      currentAuthToken!
    );
  };

  const unfollowDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    await presenter.unfollowDisplayedUser(
      event,
      presentedUser!,
      currentAuthToken!
    );
  };

  return (
    <>
      {presentUser === null ||
      presentedUser === null ||
      currentAuthToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={presentedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {presentedUser !== presentUser && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={""}
                    onClick={(event) => switchToLoggedInUser(event)}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{presentedUser.name}</b>
              </h2>
              <h3>{presentedUser.alias}</h3>
              <br />
              {followeesCount > -1 && followersCount > -1 && (
                <div>
                  Following: {followeesCount} Followers: {followersCount}
                </div>
              )}
            </div>
            <form>
              {presentedUser !== presentUser && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      onClick={(event) => unfollowDisplayedUser(event)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      onClick={(event) => followDisplayedUser(event)}
                    >
                      Follow
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;

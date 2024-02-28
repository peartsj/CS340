import "./UserInfo.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoListener from "./UserInfoListenerHook";

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
    setIsFollowerStatus(currentAuthToken!, presentUser!, presentedUser!);
    setNumbFollowees(currentAuthToken!, presentedUser!);
    setNumbFollowers(currentAuthToken!, presentedUser!);
  });

  const setIsFollowerStatus = async (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) => {
    try {
      if (currentUser === displayedUser) {
        setIsFollower(false);
      } else {
        setIsFollower(
          await getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    } catch (error) {
      displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  };

  const getIsFollowerStatus = async (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

  const setNumbFollowees = async (
    authToken: AuthToken,
    displayedUser: User
  ) => {
    try {
      setFolloweesCount(await getFolloweesCount(authToken, displayedUser));
    } catch (error) {
      displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  };

  const getFolloweesCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweesCount(user);
  };

  const setNumbFollowers = async (
    authToken: AuthToken,
    displayedUser: User
  ) => {
    try {
      setFollowersCount(await getFollowersCount(authToken, displayedUser));
    } catch (error) {
      displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

  const getFollowersCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowersCount(user);
  };

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUserInfo(presentUser!);
  };

  const followDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      displayInfoMessage(`Adding ${presentedUser!.name} to followers...`, 0);

      let [followersCount, followeesCount] = await follow(
        currentAuthToken!,
        presentedUser!
      );

      clearLastInfoMessage();

      setIsFollower(true);
      setFollowersCount(followersCount);
      setFolloweesCount(followeesCount);
    } catch (error) {
      displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    }
  };

  const follow = async (
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followersCount: number, followeesCount: number]> => {
    // Pause so we can see the following message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    let followersCount = await getFollowersCount(authToken, userToFollow);
    let followeesCount = await getFolloweesCount(authToken, userToFollow);

    return [followersCount, followeesCount];
  };

  const unfollowDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      displayInfoMessage(
        `Removing ${presentedUser!.name} from followers...`,
        0
      );

      let [followersCount, followeesCount] = await unfollow(
        currentAuthToken!,
        presentedUser!
      );

      clearLastInfoMessage();

      setIsFollower(false);
      setFollowersCount(followersCount);
      setFolloweesCount(followeesCount);
    } catch (error) {
      displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    }
  };

  const unfollow = async (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followersCount: number, followeesCount: number]> => {
    // Pause so we can see the unfollowing message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    let followersCount = await getFollowersCount(authToken, userToUnfollow);
    let followeesCount = await getFolloweesCount(authToken, userToUnfollow);

    return [followersCount, followeesCount];
  };

  return (
    <>
      {presentUser === null || presentedUser === null || currentAuthToken === null ? (
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

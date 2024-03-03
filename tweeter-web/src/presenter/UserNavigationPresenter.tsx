import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
  currentUser: User | null;
  authToken: AuthToken | null;
  setDisplayedUserInfo: (user: User) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
  private view: UserNavigationView;
  private service = new UserService();

  public constructor(view: UserNavigationView) {
    this.view = view;
    this.service = new UserService();
  }

  public async navigateToUser(event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    try {
      let alias = this.extractAlias(event.target.toString());

      let user = await this.service.getUser(this.view.authToken!, alias);

      if (!!user) {
        if (this.view.currentUser!.equals(user)) {
          this.view.setDisplayedUserInfo(this.view.currentUser!);
        } else {
          this.view.setDisplayedUserInfo(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }

  extractAlias = (value: string): string => {
    let index = value.indexOf("@");
    return value.substring(index);
  };
}

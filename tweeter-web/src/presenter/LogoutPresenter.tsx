import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LogoutView {
  displayInfoMessage: (message: string, timeout: number) => void;
  displayErrorMessage: (message: string) => void;
  clearLastInfoMessage: () => void;
  clearUserInformation: () => void;
}

export class LogoutPresenter {
  private view: LogoutView;
  private service: UserService;

  public constructor(view: LogoutView) {
    this.view = view;
    this.service = new UserService();
  }

  public async logOut(authToken: AuthToken | null) {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInformation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}

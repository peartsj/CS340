import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
  setPost: (post: string) => void;
  displayInfoMessage(message: string, duration: number): void;
  displayErrorMessage(message: string): void;
  clearLastInfoMessage(): void;
}

export class PostStatusPresenter {
  private service: StatusService;
  private view: PostStatusView;

  public constructor(view: PostStatusView) {
    this.service = new StatusService();
    this.view = view;
  }

  public async submitPost(
    event: React.MouseEvent,
    post: string,
    presentUser: User | null,
    currentAuthToken: AuthToken | null
  ) {
    event.preventDefault();

    try {
      this.view.displayInfoMessage("Posting status...", 0);

      let status = new Status(post, presentUser!, Date.now());

      await this.service.postStatus(currentAuthToken!, status);

      this.view.clearLastInfoMessage();
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    }
  }

  public clearPost (event: React.MouseEvent) {
    event.preventDefault();
    this.view.setPost("");
  };
}
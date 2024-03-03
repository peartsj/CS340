import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";

export interface RegisterView {
  updateUserInformation: (
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  navigate: (url: string) => void;
  displayErrorMessage: (message: string) => void;
  setImageUrl: (value: React.SetStateAction<string>) => void;
  setImageBytes: (value: React.SetStateAction<Uint8Array>) => void;
}

export class RegisterPresenter {
  private view: RegisterView;
  private service: UserService;

  public constructor(view: RegisterView) {
    this.view = view;
    this.service = new UserService();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    rememberMeRefCurrent: boolean
  ) {
    try {
      let [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes
      );

      this.view.updateUserInformation(
        user,
        user,
        authToken,
        rememberMeRefCurrent
      );
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    }
  }

  public handleImageFile = (file: File | undefined) => {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  };
}

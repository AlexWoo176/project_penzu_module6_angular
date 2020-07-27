import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TokenStorageService} from '../../../services/token-storage.service';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../services/user/user.service';
import {PassForm} from '../../../services/user/passForm/pass-form';
import {UserForm} from '../../../services/user/userForm/user-form';
import {User} from '../../../models/User';
import {DataSharingService} from '../../../services/dataSharing/data-sharing.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  info: any;
  user: User;
  filePath: any;
  fileUpload: File;
  inputName = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(64)])
  });
  returnUrl: string;
  name: any;
  isError = false;
  error = '';
  isErrorUser = false;
  errorUser = '';
  passForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(36)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(36)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(36)])
  });
  processValue = 0;

  constructor(
    private token: TokenStorageService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private dataSharingService: DataSharingService
  ) {
  }

  ngOnInit(): void {
    this.info = {
      name: this.token.getName(),
      token: this.token.getToken(),
      username: this.token.getUsername(),
      role: this.token.getAuthorities(),
      userId: this.token.getUserId(),
      email: this.token.getEmail(),
      avatar: this.token.getAvatar(),
    };
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/login';
    this.getUser();
    this.authService.svShouldRefresh.subscribe(res => this.getUser());
  }

  getUser(): void {
/*    if (this.token) {
      this.userService.getUserById(+this.token.getUserId()).subscribe(
        result => {
          this.user = result;
          console.log('getUser', result);
        }, error1 => {
          console.log(error1);
        }
      );
    }*/
      this.userService.getUserById(+this.token.getUserId()).subscribe(user => this.user = user);
    }

  updatePassword(closeButton: HTMLInputElement): any{
    const {currentPassword, newPassword, confirmPassword} = this.passForm.value;
    if (newPassword !== confirmPassword) {
      this.isError = true;
      return this.error = 'Password confirm not match ';
    }

    const formPass = new PassForm(this.info.userId, this.info.username, currentPassword, newPassword);
    this.authService.updatePassword(formPass).subscribe(
      result => {
        console.log(result);
        closeButton.click();
        this.logout();
        this.router.navigateByUrl(this.returnUrl);
        alert('Change password successful!');
      }, error1 => {
        this.isError = true;
        this.error = 'Update password fail!';
        // return console.error(error);
      }
    );
  }

  updateUser(closeButton: HTMLInputElement): any {
    const {name} = this.inputName.value;

    if (name === '') {
      this.isErrorUser = true;
      return this.errorUser = 'Fail! Nothing Change.';
    }
    const userForm = new UserForm(this.info.userId, name);

    this.authService.updateUser(userForm).subscribe(
      result => {
        closeButton.click();
        // this.logout();
        alert('Update successful. Please ReLogin !');
        this.authService.svShouldRefresh.next(true);
        // this.router.navigateByUrl(this.returnUrl);
      }, error => {
        this.isErrorUser = true;
        return this.errorUser = 'Fail!.';
      }
    );
  }

  logout(): any {
    this.token.signOut();
    this.router.navigateByUrl(this.returnUrl);
  }

  handleFileChooser(files: FileList): void {
    this.fileUpload = files.item(0);
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.filePath = reader.result;
    };
  }

  saveAvatar(openProcessBar: HTMLButtonElement, closeProcess: HTMLButtonElement): any {
    if (this.token) {
      const count = setInterval(() => {
        this.processValue += 10;
        if (this.processValue === 90) {
          this.processValue += 9;
          clearInterval(count);
        }
      }, 1000);
      openProcessBar.click();
      const form = new FormData();
      form.append('file', this.fileUpload);
      this.userService.uploadUserAvatar(form, this.token.getUserId()).subscribe(
        result => {
          clearInterval(count);
          this.processValue = 100;
          this.getUser();
          closeProcess.click();
          this.processValue = 0;
          this.getUser().subscribe( user => {
            this.token.saveAvatar(user.avatar);
            closeProcess.click();
            this.processValue = 0;
          });
        }, error1 => {
          console.log(error1);
        }
      );
    }
  }
}

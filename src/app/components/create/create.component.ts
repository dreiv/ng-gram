import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { User } from 'firebase/app';

import { AuthService } from '../../services/auth/auth.service';
import { FEED } from '../../constants/routes.const';
import { MEDIA_STORAGE_PATH } from '../../constants/storage.const';
import { StorageService } from '../../services/storage/storage.service';
import { UtilService } from '../../services/util/util.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  form: FormGroup;
  fileToUpload!: File;
  kittyImagePreview!: string | ArrayBuffer | null;
  submitted = false;
  uploadProgress$!: Observable<number | undefined>;
  user!: User | null;

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly storageService: StorageService,
    private readonly utilService: UtilService
  ) {
    this.form = this.formBuilder.group({
      photo: [null, [Validators.required, this.image.bind(this)]],
      description: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => (this.user = user));

    this.form
      .get('photo')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((newValue) => {
        this.handleFileChange(newValue.files);
      });
  }

  handleFileChange([kittyImage]: File[]): void {
    this.fileToUpload = kittyImage;
    const reader = new FileReader();
    reader.onload = (loadEvent) => (
      this.kittyImagePreview = loadEvent?.target?.result ?? null
    );
    reader.readAsDataURL(kittyImage);
  }

  postKitty(): void {
    this.submitted = true;
    const mediaFolderPath = `${MEDIA_STORAGE_PATH}/${this.user?.email}/media/`;

    const { downloadUrl$, uploadProgress$ } = this.storageService.uploadFileAndGetMetadata(
      mediaFolderPath,
      this.fileToUpload,
    );

    this.uploadProgress$ = uploadProgress$;

    downloadUrl$
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((error) => {
          this.snackBar.open(`${error.message} 😢`, 'Close', {
            duration: 4000,
          });
          return EMPTY;
        }),
      )
      .subscribe((downloadUrl) => {
        this.submitted = false;
        this.router.navigate([`/${FEED}`]);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  private image(photoControl: AbstractControl): { [key: string]: boolean } | null {
    if (photoControl.value) {
      const [kittyImage] = photoControl.value.files;

      return this.utilService.validateFile(kittyImage)
        ? null
        : {
            image: true,
          };
    }

    return null;
  }

}

import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/FileSystem'
import { Preferences } from '@capacitor/preferences'
import { UserPhoto } from './UserPhoto';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: UserPhoto[] = [];
  private PHOTO_STORE: string = 'photos';

  constructor() { }

  /**
   * take a new photo
   */
  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })

    const savedImageFile = await this.savePicture(capturedPhoto)

    this.photos.unshift(savedImageFile)

    Preferences.set({
      key: this.PHOTO_STORE,
      value: JSON.stringify(this.photos)
    })
  }

  /**
   * save a photo
   */
  private async savePicture(photo: Photo) {

    const base64Data = await this.readAsBase64(photo);

    const fileName = Date.now() + '.jpeg';

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    })

    return {
      filepath: fileName,
      webviewPath: photo.webPath
    }
  }

  /**
   * Load photo saved
   */
  public async loadSaved() {
    const { value } = await Preferences.get({key: this.PHOTO_STORE})

    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];


    // Display the photo by reading into base64 format
    for (let photo of this.photos) {
      // Read each saved photo's data from the Filesystem
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });

      // Web platform only: Load the photo as base64 data
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }

  /**
   * made an http request for obtain a blob response
   */
  private async readAsBase64 (photo: Photo) {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string
  }

  /**
   * convert a blob file in base64
   */
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result)
    }

    reader.readAsDataURL(blob)
  })
}

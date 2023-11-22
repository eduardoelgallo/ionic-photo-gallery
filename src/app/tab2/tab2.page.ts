import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(public photoService: PhotoService ) {}

  async ngOnInit () {
    this.photoService.loadSaved()
  }

  /**
   * Method that start a take photo flow
   */
  addPhotoToGallery() {
    this.photoService.addNewToGallery()
  }
}

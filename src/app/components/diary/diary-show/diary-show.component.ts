import { Component, OnInit } from '@angular/core';
import {Diary} from '../../../models/Diary';
import {DiaryService} from '../../../services/diary/diary.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenStorageService} from '../../../services/token-storage.service';
import {Tag} from '../../../models/Tag';
import {TagService} from '../../../services/tag/tag.service';

@Component({
  selector: 'app-diary-show',
  templateUrl: './diary-show.component.html',
  styleUrls: ['./diary-show.component.scss']
})
export class DiaryShowComponent implements OnInit {
  currentUser: any;
  diary: Diary;
  page = 0;
  listDiary: Array<any>;
  pages: Array<number>;
  tagList: Tag[];
  p = 1;
  noDiary: boolean;

  constructor(private diaryService: DiaryService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private token: TokenStorageService,
              private tagService: TagService) {
  }

  setPage(i, event: any): void {
    event.preventDefault();
    this.page = i;
    this.getAllDiary();
  }

  ngOnInit(): void {
    this.noDiary = true;
    this.getAllDiary();
    this.getAllTag();
  }

  getAllDiary(): void {
    this.currentUser = this.token.getUserId();
    this.diaryService.getAllByUser(this.page, this.currentUser).subscribe(
      list => {
        if (list != null){
          this.noDiary = false;
        }
        this.listDiary = list['content'];
        this.pages = new Array(list['totalPages']);
      },
      error => {
        console.log(error);
      }
    );
  }

  getAllTag(): void  {
    this.tagService.getTagList().subscribe(
      result => {
        this.tagList = result;
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css'],
})
export class AllPostComponent implements OnInit {
  postArray: { data: DocumentData; id: string }[] = [];

  constructor(
    private postService: PostService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.postService.loadData().subscribe((post) => {
      (this.postArray = post),
        (error: any) => {
          console.error('Error while loading data:', error);
        };
    });
  }

  onDelete(postImgPath: string, id: string) {
    try {
      this.postService.deleteData(postImgPath, id);
      this.toastr.success('Data deleted successfully');
    } catch (error) {
      this.toastr.error('An error occured while deleting data');
    }
  }

  onFeatured(id: string, value: boolean) {
    try {
      const featuredData = {
        isFeatured: value,
      };
      this.postService.markFeatured(id, featuredData);
      this.toastr.info('Post marked successfully');
    } catch (error) {
      this.toastr.error('An error occured while marking post');
    }
  }
}

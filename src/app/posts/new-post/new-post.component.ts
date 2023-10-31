import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryArray } from 'src/app/models/category-array';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  permalink: string = '';
  imgSrc: any = './assets/placeholder-image.png';
  selectedImg!: File;
  categories: CategoryArray[] = [];
  postForm!: FormGroup;
  formStatus: string = 'Add New';
  postId: string = '';

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.route.queryParams.subscribe((val) => {
      if (val['id']) {
        this.postService.loadOneData(val['id']).subscribe((post) => {
          this.postForm = this.fb.group({
            title: [
              post['title'],
              [Validators.required, Validators.minLength(10)],
            ],
            permalink: new FormControl(
              { value: post['permalink'], disabled: true },
              Validators.required
            ),
            excerpt: [
              post['excerpt'],
              [Validators.required, Validators.minLength(50)],
            ],
            category: [
              `${post['category'].categoryId}-${post['category'].category}`,
              Validators.required,
            ],
            postImg: ['', Validators.required],
            content: [post['content'], Validators.required],
          });
          this.imgSrc = post['postImgPath'];
          this.formStatus = 'Edit';
          this.postId = val['id'];
        });
      } else {
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: new FormControl(
            { value: '', disabled: true },
            Validators.required
          ),
          excerpt: ['', [Validators.required, Validators.minLength(50)]],
          category: ['', Validators.required],
          postImg: ['', Validators.required],
          content: ['', Validators.required],
        });
      }
    });
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.toastr.error('An error occured while loading data');
      },
    });
  }

  onTitleChanged($event: any) {
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    };
    reader.readAsDataURL($event?.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }

  async onSubmit() {
    try {
      let splitted = this.postForm.value.category.split('-');
      const postData: Post = {
        title: this.postForm.value.title,
        permalink: this.permalink,
        category: {
          categoryId: splitted[0],
          category: splitted[1],
        },
        postImgPath: '',
        excerpt: this.postForm.value.excerpt,
        content: this.postForm.value.content,
        isFeatured: false,
        views: 0,
        status: 'new',
        createdAt: new Date(),
      };
      await this.postService.uploadImage(
        this.selectedImg,
        postData,
        this.formStatus,
        this.postId
      );
      this.toastr.success('Post saved successfully');
      this.postForm.reset();
      this.imgSrc = './assets/placeholder-image.png';
    } catch (error) {
      this.toastr.error(
        (error as any).message,
        'An error occured while submiting form'
      );
    }
  }

  get fc() {
    return this.postForm.controls;
  }
}

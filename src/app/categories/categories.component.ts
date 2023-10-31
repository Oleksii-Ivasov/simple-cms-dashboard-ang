import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';
import { CategoryArray } from '../models/category-array';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  constructor(
    private categoryService: CategoriesService,
    private toastr: ToastrService
  ) {}

  categoryArray: CategoryArray[] = [];
  formCategory: string = '';
  formStatus: string = 'Add';
  categoryId: string = '';

  ngOnInit(): void {
    this.categoryService.loadData().subscribe({
      next: (data) => {
        this.categoryArray = data;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.toastr.error('Error fetching data from the database');
      },
    });
  }

  async onSubmit(formData: NgForm) {
    try {
      let categoryData: Category = {
        category: formData.value.category,
      };
      if (this.formStatus === 'Add') {
        await this.categoryService.saveData(categoryData);
        this.toastr.success('Data saved successfully');
        formData.reset();
      } else if (this.formStatus === 'Edit') {
        await this.categoryService.updateData(this.categoryId, {
          ...categoryData,
        });
        this.toastr.success('Data updated successfully');
        formData.reset();
        this.formStatus = 'Add';
      }
    } catch (error) {
      this.toastr.error((error as any).message, 'Error');
    }
  }

  onEdit(category: string, id: string) {
    this.formCategory = category;
    this.formStatus = 'Edit';
    this.categoryId = id;
  }

  async onDelete(id: string) {
    try {
      await this.categoryService.deleteData(id);
      this.toastr.success('Data deleted successfully');
    } catch (error) {
      this.toastr.error('An error occured while deleting data');
    }
  }
}

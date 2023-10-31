import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Sub } from 'src/app/models/sub';
import { SubscribersService } from 'src/app/services/subscribers.service';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css'],
})
export class SubscribersComponent implements OnInit {
  constructor(
    private subService: SubscribersService,
    private toastr: ToastrService
  ) {}

  subscribers: Sub[] = [];

  ngOnInit(): void {
    this.subService.loadData().subscribe((val) => {
      this.subscribers = val;
    });
  }

  async onDelete(id: string) {
    try {
      await this.subService.deleteData(id);
      this.toastr.success('Subcsriber deleted successfully');
    } catch (error) {
      this.toastr.error('Failed to delete subscriber');
    }
  }
}

import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GatekepeperService } from '../../shared/services/gatekeeper.service';
import { Router } from '@angular/router';
import { gatekeeper, GatekeeperApiResponse, RespGatekeeper, user } from '../../shared/models/model';
import { Loader } from '../../shared/components/loader/loader';
import { constString } from '../../shared/constants/constStr';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-gatekeeper',
  imports: [FormsModule, NgIf, NgFor, CommonModule, Loader, ToastModule],
  templateUrl: './gatekeeper.html',
  styleUrl: './gatekeeper.css'
})
export class Gatekeeper implements OnInit {
  constString = constString
  showAddGatekeeperModal = false;

  isLoading = false;
  private gatekeeperservice = inject(GatekepeperService)
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router)
  newGatekeeper: gatekeeper = { username: '', email: '', password: '', address: '' };
  users: RespGatekeeper[] = [];
  ngOnInit(): void {
    this.showList()
  }

  openAddGatekeeperModal() {
    this.newGatekeeper = this.resetGatekeeperForm();
    this.showAddGatekeeperModal = true;

  }

  closeAddGatekeeperModal() {
    this.showAddGatekeeperModal = false;
  }

  submitGatekeeperForm() {
    this.isLoading = true;
    const subscription = this.gatekeeperservice.addGatekeeper(this.newGatekeeper).subscribe({
      next: () => {

        this.closeAddGatekeeperModal();


        this.showList();
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Gatekeeper Added',
          detail: 'Gatekeeper added successfully',

        });
      },
      error: (err: any) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add gatekeeper',

        });
      }
    });
    this.closeAddGatekeeperModal();


    this.destroyRef.onDestroy(() => {
      console.log('Destroy ref of gatekeeper component called');
      subscription.unsubscribe()


    })
  }

  showList() {
    this.isLoading = true;

    this.gatekeeperservice.listsGatekeeper().subscribe({
      next: (resp: GatekeeperApiResponse) => {
        this.users = (resp.gatekeepers || []).map(g => ({
          id: g.userid,
          name: g.username,
          email: g.email,
          address: g.address
        }));

        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Gatekeepers Loaded',
          detail: 'Gatekeeper list fetched successfully',

        });

      },
      error: (err: any) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load Gatekeepers',

        });
      }
    });
  }

  deleteGatekeeper(index: number) {
    this.isLoading = true;

    const useridToDelete = this.users[index].id;

    const subscription = this.gatekeeperservice.deletegatekeeper(useridToDelete)
      .subscribe({
        next: (res: any) => {
          console.log(res.message);

          this.users.splice(index, 1);
          this.isLoading = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Gatekeeper Deleted',
            detail: res.message || 'Gatekeeper deleted successfully',
          });
        },

        error: (err) => {
          console.error("Failed to delete Gatekeeper", err);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Delete Failed',
            detail: 'Failed to delete gatekeeper',
          });
        }
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  goBack(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/admin-dashboard']);
    }, 1000);
  }

  resetGatekeeperForm(): gatekeeper {
    return {
      username: '',
      email: '',
      password: '',
      address: ''
    };
  }
}

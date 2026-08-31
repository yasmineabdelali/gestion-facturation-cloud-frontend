import { Component, OnInit, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocietesService } from '../../../services/societes';
import { Societe } from '../../../models/societe.model';
import { SocieteFormComponent } from '../societe-form/societe-form';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-societe-list',
  imports: [RouterLink],
  templateUrl: './societe-list.html',
  styleUrl: './societe-list.scss'
})
export class SocieteList implements OnInit {
  societes = signal<Societe[]>([]);
  isLoading = signal(false);

  constructor(
    private societesService: SocietesService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadSocietes();
  }

  loadSocietes(): void {
    this.isLoading.set(true);
    this.societesService.findAll().subscribe({
      next: (societes) => {
        this.societes.set(societes);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    const modalRef = this.modalService.open(SocieteFormComponent);
    modalRef.componentInstance.mode = 'create';

    modalRef.closed.subscribe((result) => {
      if (result === 'saved') {
        this.loadSocietes();
      }
    });
  }

  openEditModal(societe: Societe): void {
    const modalRef = this.modalService.open(SocieteFormComponent);
    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.societeToEdit = societe;

    modalRef.closed.subscribe((result) => {
      if (result === 'saved') {
        this.loadSocietes();
      }
    });
  }

  deleteSociete(societe: Societe): void {
    if (!confirm(`Supprimer la société "${societe.nom}" ?`)) {
      return;
    }
    this.societesService.remove(societe.id).subscribe({
      next: () => this.loadSocietes()
    });
  }
}
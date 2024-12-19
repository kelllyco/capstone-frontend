import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectsHttpService } from '../services/projects.service';
import { AddProjectInputsAPI } from '../shared/models/api.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bid-creation',
  templateUrl: './bid-creation.component.html',
  styleUrl: './bid-creation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BidCreationComponent {

  constructor(private projectsHttpService: ProjectsHttpService, private router: Router) {}

  bidCreationForm = new FormGroup({
    projectName: new FormControl('', Validators.required),
    projectDescription: new FormControl(''),
    clientName: new FormControl('', Validators.required),
    clientEmail: new FormControl('', [Validators.required, Validators.email]),
    startDate: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9/]*')]),
    endDate: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9/]*')]),
    sqft: new FormControl('', [Validators.required, Validators.min(0), Validators.pattern('[0-9]*')]),
    complexity: new FormControl('', Validators.required),
    addrLine1: new FormControl('', Validators.required),
    addrLine2: new FormControl(''),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zip: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('[0-9]*')]),
    projectType: new FormControl('', Validators.required),
  })

  onSubmit() {
    const projectInputs: AddProjectInputsAPI = {
      sqft: Number(this.bidCreationForm.get('sqft')?.value) || 0,
      projectType: this.bidCreationForm.get('projectType')?.value || "",
      complexity: Number(this.bidCreationForm.get('complexity')?.value) || 0,
      clientName: this.bidCreationForm.get('clientName')?.value || "",
      clientEmail: this.bidCreationForm.get('clientEmail')?.value || "",
      startDate: this.bidCreationForm.get('startDate')?.value || "",
      addressLine1: this.bidCreationForm.get('addrLine1')?.value || "",
      addressLine2: this.bidCreationForm.get('addrLine2')?.value || "",
      city: this.bidCreationForm.get('city')?.value || "",
      state: this.bidCreationForm.get('state')?.value || "",
      zipcode: Number(this.bidCreationForm.get('zip')?.value) || 0,
      projectName: this.bidCreationForm.get('projectName')?.value || "",
      dateDue: this.bidCreationForm.get('endDate')?.value || "",
      projectDescription: this.bidCreationForm.get('projectDescription')?.value || "",
    };

    this.projectsHttpService.addProject(projectInputs).subscribe({
      next: (response) => {
        this.router.navigate([`/project/${response.projectNo}/modification`]);
      },
      error: (error) => {
        console.error("Error adding project:", error);
      }
    });
  }
  
}

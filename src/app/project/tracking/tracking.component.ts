import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectProject, selectProjectHistoryAndRisk } from '../redux/project.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { Project, ProjectOverview, ProjectStateItem } from '../../shared/models/project.model';
import * as Papa from 'papaparse';
import { HistoricalHttpService } from '../../services/historical.service';
import { ProjectRiskHistoryAPI, ProjectSpendingAPI } from '../../shared/models/api.models';
import { Chart, registerables } from 'chart.js';
import * as ProjectActions from '../redux/project.actions';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css'
})

export class TrackingComponent implements OnInit {

  projectDetails: Project = {} as Project;
  projectOverview: ProjectOverview = {} as ProjectOverview;
  startDate = "";

  historyAndRisk: ProjectRiskHistoryAPI = {} as ProjectRiskHistoryAPI;
  projectNo!: string;
  fileName = "";

  // historyAndRisk$: Observable<ProjectRiskHistoryAPI>;

  isExistingUser = true;

  file?: File;
  date?: Date;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router, private historicalHttp: HistoricalHttpService) {}

  ngOnInit() {
    this.projectNo = this.route.snapshot.params["id"];
    this.store.select(selectProject(this.projectNo)).pipe(
        take(1),
      ).subscribe(project => {
        this.projectDetails = project!.ProjectDetails ?? {};
        this.projectOverview = project!.ProjectOverview ?? {};
        this.startDate = this.formatDate(project!.ProjectOverview?.['Start Date']);
      });
    Chart.register(...registerables);

    this.store.select(selectProjectHistoryAndRisk(this.projectNo)).pipe(
      take(1),
    ).subscribe(historyAndRisk => {
      this.historyAndRisk = historyAndRisk;
      this.isExistingUser = this.determineIsExistingUser();
      if (this.isExistingUser) {
        this.createLineChart();
      }
      else {
        this.createLineChartNewUser();
      }
    });
  }

  navDashboard() {
    this.router.navigate(['/dashboard']);
  };

  formatDate(inputDate: string) {
    const [month, day, year] = inputDate.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  determineIsExistingUser() {
    const isExisting = Object.keys(this.historyAndRisk.userAvgsOverall).length > 1;
    return isExisting;
  }

  createLineChart() {
    const title = `Project Spending`;
    let data = {
      expected_percentage: Object.values(this.historyAndRisk.userAvgsOverall).map(data => data.avg_spending),
      spending_percentage: Object.values(this.historyAndRisk.postingsOverall).map(data => data.spending_percentage),
      labels_avg: Object.values(this.historyAndRisk.userAvgsOverall).map(data => data.percentage_complete),
      labels_exp: Object.values(this.historyAndRisk.postingsOverall).map(data => data.percentage_complete),
    };

    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    const lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        // labels: data.labels,
        datasets: [{
          label: 'Actual',
          data: data.labels_exp.map((x, i) => ({ x: data.labels_exp[i], y: data.spending_percentage[i] })),
          borderColor: '#0374ac',
          backgroundColor: '#0374ac',
        },
        {
          label: 'Expected',
          data: data.labels_avg.map((x, i) => ({ x: data.labels_avg[i], y: data.expected_percentage[i] })),
          borderColor: '#f1c231',
          backgroundColor: '#f1c231',
        }
      ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
            color: '#49454F',
            font: { 
              size: 20,
              weight: 'normal',
          }
          },
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            display: true,
            title: {
              display: true,
              text: 'Percent Complete'
            },
            min: 0,
            max: 100,
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Percent Spent'
            },
            min: 0,
            max: 120,
            ticks: {
              stepSize: 10,
            },
          }
        }
      }});

  }

  createLineChartNewUser() {
    const title = `Project Spending`;
    let data = {
      spending_percentage: Object.values(this.historyAndRisk.postingsOverall).map(data => data.spending_percentage),
      labels: Object.values(this.historyAndRisk.postingsOverall).map(data => data.percentage_complete),
    };

    if (! data.labels.includes(0)) {
      data = {
        spending_percentage: [0, ...data.spending_percentage],
        labels: [0, ...data.labels],
      };
    }

    if (! data.labels.includes(100)) {
      data = {
        spending_percentage: data.spending_percentage,
        labels: [...data.labels, 100],
      };
    }

    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    const lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Actual',
          data: data.labels.map((x, i) => ({ x, y: data.spending_percentage[i] })),
          borderColor: '#0374ac',
          backgroundColor: '#0374ac',
        },
      ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
            color: '#49454F',
            font: { 
              size: 20,
              weight: 'normal',
          }
          },
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            display: true,
            title: {
              display: true,
              text: 'Percent Complete'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Percent Spent'
            },
            min: 0,
            max: 120,
            ticks: {
              stepSize: 10,
            },
          }
        }
      }});
  }

  completeProject() {
    this.store.dispatch(ProjectActions.projectCompleted({ projectNo: this.projectNo }));
    this.router.navigate(['/dashboard']);
  }

  onFileSubmission() {
    if (this.file) {
      this.readFile(this.file);
    }
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  onDateInput(event: any) {
    this.date = event.target.value;
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = e.target?.result as string;
      this.convertCSVtoJSON(csvContent);
    };
    reader.readAsText(file);
  }

  convertCSVtoJSON(csvContent: string) {
    Papa.parse(csvContent, {
      header: true,
      complete: (result) => {
        if (this.date) {
          const dateAndJson = {date: this.date, JSON: result.data};
          this.historicalHttp.uploadHistoricalData(dateAndJson, this.projectNo).pipe(
            take(1),
          ).subscribe(() => {
            this.store.dispatch(ProjectActions.loadHistAndRiskData({ projectNo: this.projectNo }));
          });
        }
      },
      error: (error: Error) => {
        console.error("Error parsing CSV: ", error);
      }
    })
  }
}

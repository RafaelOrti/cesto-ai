import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from '../../services/state.service';

/**
 * Global loading component that shows loading indicators
 * Displays different loading states based on application state
 */
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;

  constructor(private stateService: StateService) {
    this.loading$ = this.stateService.loading$;
  }

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    // Component cleanup
  }
}

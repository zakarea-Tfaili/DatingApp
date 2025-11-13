import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  DetailCellRendererParams,
  GetRowIdParams
} from 'ag-grid-community';
import { DataService } from '../data.service';
import { GridRowData, SearchResult } from '../simulation.models';

@Component({
  selector: 'app-simulation-creation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    AgGridModule,
  ],
  templateUrl: './simulation-creation.component.html',
  styleUrls: ['./simulation-creation.component.css'],
})
export class SimulationCreationComponent {
  private dataService = inject(DataService);

  searchControl = new FormControl('');
  selectionControl = new FormControl([]);
  searchTerm = signal<string>('');
  searchResults = signal<SearchResult[]>([]);
  isSearching = signal(false);

  rowData = signal<GridRowData[]>([]);
  colDefs = signal<ColDef[]>(this.createColDefs());

  public detailCellRendererParams: any = {
    template: (params) => `
      <div class="p-4 pt-2 bg-gray-50 dark:bg-gray-800">
        <h4 class="text-lg font-semibold mb-2 text-indigo-700 dark:text-indigo-400">
          Instrument Details: ${params.data.issuer}
        </h4>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm">
          
          <div>
            <strong class="text-gray-500 dark:text-gray-400">Issuer:</strong>
            <span class="font-medium ml-2 text-gray-800 dark:text-gray-200">${params.data.issuer}</span>
          </div>
          <div>
            <strong class="text-gray-500 dark:text-gray-400">Principal:</strong>
            <span class="font-medium ml-2 text-gray-800 dark:text-gray-200">${params.data.principal}</span>
          </div>
          <div>
            <strong class="text-gray-500 dark:text-gray-400">Coupon:</strong>
            <span class="font-medium ml-2 text-gray-800 dark:text-gray-200">${params.data.coupon}%</span>
          </div>
          <div>
            <strong class="text-gray-500 dark:text-gray-400">Amort. Book Value:</strong>
            <span class="font-medium ml-2 text-gray-800 dark:text-gray-200">${params.data.amortizedbookvalue}</span>
          </div>
          <div>
            <strong class="text-gray-500 dark:text-gray-400">Maturity:</strong>
            <span class="font-medium ml-2 text-gray-800 dark:text-gray-200">${params.data.maturitydate}</span>
          </div>
          <div>
            <strong class="text-gray-500 dark:text-gray-400">Current Yield:</strong>
            <span class="font-medium ml-2 text-gray-800 dark:text-gray-200">${params.data.currentyield}%</span>
          </div>
          <div>
            <strong class="text-gray-500 dark:text-gray-400">First Call:</strong>
            <span class="font-medium ml-2 text-gray-800 dark:text-gray-200">${params.data.firstcall}</span>
          </div>
          <div>
            <strong class="text-gray-500 dark:text-gray-400">SPPI:</strong>
            <span class="font-medium ml-2 text-gray-800 dark:text-gray-200">${params.data.sppi}</span>
          </div>
          <div>
            <strong class="text-gray-500 dark:text-gray-400">Amortizing:</strong>
            <span class="font-medium ml-2 text-gray-800 dark:text-gray-200">${params.data.amortizing}</span>
          </div>
          <div>
            <strong class="text-gray-500 dark:text-gray-400">RC:</strong>
            <span class="font-medium ml-2 text-gray-800 dark:text-gray-200">${params.data.rc}</span>
          </div>

        </div>
      </div>
    `,
  } as DetailCellRendererParams;

  public getRowId = (params: GetRowIdParams) => params.data.isin;

  constructor() {
    this.searchControl.valueChanges.subscribe((value) => {
      this.searchTerm.set(value || '');
    });

    effect((onCleanup) => {
      const currentTerm = this.searchTerm();
      if (currentTerm.length < 1) {
        this.searchResults.set([]);
        return;
      }
      this.isSearching.set(true);
      const timerId = setTimeout(() => {
        this.dataService.searchApi(currentTerm)
          .then((results) => {
            if (currentTerm === this.searchTerm()) {
              this.searchResults.set(results);
            }
          })
          .catch((err) => {
            console.error('Search failed:', err);
            this.searchResults.set([]);
          })
          .finally(() => {
            if (currentTerm === this.searchTerm()) {
              this.isSearching.set(false);
            }
          });
      }, 1000);
      onCleanup(() => {
        clearTimeout(timerId);
        this.isSearching.set(false);
      });
    });
    
    this.selectionControl.valueChanges.subscribe(selectedItems => {
      this.handleSelection(selectedItems);
    });
  }

  private createColDefs(): ColDef[] {
    return [
      {
        field: 'isin',
        headerName: 'ISIN',
        filter: true,
        cellRenderer: 'agGroupCellRenderer',
        minWidth: 250,
      },
      {
        field: 'principalsimulated',
        headerName: 'Sim. Principal',
        editable: true,
        cellEditor: 'agNumberCellEditor',
        minWidth: 150,
      },
      {
        field: 'price',
        headerName: 'Price',
        editable: true,
        cellEditor: 'agNumberCellEditor',
        minWidth: 150,
      },
    ];
  }

  async handleSelection(selectedOptions: SearchResult[]) {
    if (!selectedOptions || selectedOptions.length === 0) {
      return;
    }
    
    const currentIsins = new Set(this.rowData().map(row => row.isin));
    
    for (const option of selectedOptions) {
      if (!currentIsins.has(option.id)) { 
        try {
          const details = await this.dataService.getDetailsApi(option.id);
          
          if (details && !currentIsins.has(details.isin)) {
            this.rowData.update((current) => [...current, details]);
            currentIsins.add(details.isin);
          } else if (!details) {
            alert(`Details not found for ${option.description}`);
          }
          
        } catch (error) {
           console.error('Failed to fetch item details:', error);
        }
      }
    }
  }

  displayFn(option: SearchResult): string {
    return option && option.description ? option.description : '';
  }
}

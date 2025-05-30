import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Business } from '@models/business/business.interface';
import { ResponseModel } from '@models/IResponseModel';
import { BusinessService } from '@services/business.service';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { COLUMNS_BUSINESS_MANAGEMENT, CONFIG_DELETE_DIALOG_BUSINESS } from 'app/shared/configs/business-management/business-management.config';
import { BUSINESS_MANAGEMENT_IMPORTS } from 'app/shared/imports/business-management/business-management.imports';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-business-management',
  standalone: true,
  imports: [...BUSINESS_MANAGEMENT_IMPORTS],
  templateUrl: './business-management.component.html',
  styleUrl: './business-management.component.scss'
})
export class BusinessManagementComponent {
	private readonly _router = inject(Router);

	private _businessService = inject(BusinessService);

	placeHolderSearch = signal<string>('Busca por nombre de empresa');
	addEnterprise = signal<string>('Agregar empresa');
	
    titleModule = signal<string>('Gestión de empresas');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTableBusiness = signal<Business[]>([]);
	iconsTable = signal<IconOption<Business>[]>([]);
	loadingTable = signal<boolean>(false);

	businessSearch = signal<string>('');
	pageIndexTable = signal<number>(1);

	totalPagesTable = signal<number>(1);
	
	ngOnInit(): void {
		this.headerTable.set(COLUMNS_BUSINESS_MANAGEMENT);
		this.iconsTable.set(this.defineIconsTable());
		this.searchBusiness();
	}

	searchBusiness(): void {
		this.loadingTable.set(true);
		const request = new RequestOption();
		request.queryParams = [
			{ key: 'pageIndex' , value: this.pageIndexTable() },
			{ key: 'pageSize' , value: PAGINATOR_PAGE_SIZE }
		];
		if(this.businessSearch()) 
			request.queryParams.push({ key: 'nameEnterprise', value: this.businessSearch() });
		this._businessService.getByPagination(request).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<Business>) => {
				if(response.isSuccess){
					const totalPages = Math.ceil(response.pagination.totalRows/PAGINATOR_PAGE_SIZE);
					this.totalPagesTable.set(totalPages > 0 ? totalPages : 1);
					this.dataTableBusiness.set(response.lstItem);
				} else this.dataTableBusiness.set([])
			}),
			error:(() => {
				this.totalPagesTable.set(1);
				this.dataTableBusiness.set([]);
			})
		})
	}

	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchBusiness();
	}

	searchByEnterprise(event: string): void {
		this.businessSearch.set(event);
		this.pageIndexTable.set(1);
		this.searchBusiness();
	}



	addCompany(): void {
		this._router.navigate(['gestion-empresas', 'registro']);
	}


	defineIconsTable(): IconOption<Business>[]{
        const iconEdit = new IconOption("create", "mat_outline", "Editar");

		iconEdit.actionIcono = (data: Business) => {
            this.editBussines(data);
        };

        return [iconEdit];
    }

	editBussines(data: Business): void {
		this._router.navigate([`/gestion-empresas/registro/${data.nIdEmpresa}`]);
	}

	returnInit(): void {
		this._router.navigate(['home']);
	}
}

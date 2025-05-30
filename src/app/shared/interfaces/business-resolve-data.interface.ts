import { UrlTree } from '@angular/router';
import { Business } from '@models/business/business.interface';
import { Constant } from '@models/business/constant.interface';
import { Department } from '@models/business/departament.interface';
import { District } from '@models/business/district.interface';
import { Ministry } from '@models/business/ministry.interface';
import { Province } from '@models/business/province.interface';
import { ResponseModel } from '@models/IResponseModel';

export interface BusinessResolveData {
  item: Business | null;
  ministries: ResponseModel<Ministry>;
  constants: ResponseModel<Constant>;
  departments: ResponseModel<Department>;
  provinces: ResponseModel<Province> | null;
  districts: ResponseModel<District> | null;
}

export type BusinessResolveResult = UrlTree | BusinessResolveData;
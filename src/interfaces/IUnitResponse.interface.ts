import { UnitStatus } from "../enums";

export interface IUnitResponse {
  floor_name?: string;
  floor_type?: string;
  floor_status?: string;
  _id?: string | unknown;
  unit_status: UnitStatus;
  mtr_price: number;
  outdoor_terrace: number;
  total_area: number;
  GSA_area: number;
  unit_segment: string;
  type_segment: string;
  final_price: number | undefined;
  createdAt?: Date;
  updatedAt?: Date;
}

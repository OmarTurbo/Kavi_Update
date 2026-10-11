import { Types, Document } from "mongoose";
import { UnitStatus, TypeSegment } from "../enums";

 
export interface IUnit extends Document {
  floor: Types.ObjectId;       
  unit_status: UnitStatus;  
  mtr_price: number; 
  total_area: number;
  outdoor_terrace: number;
  GSA_area: number;
  unit_segment: string;         
  type_segment: TypeSegment; 
  final_price?: number;
  progUnitKey: number;    
}
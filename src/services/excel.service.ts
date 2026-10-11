import ExcelJS from "exceljs";
import { Unit, Floor } from "../models";
import { IFloorPopulated, ImportRow } from "../interfaces";
import { makeExportFilePath } from "../utils/filePath";
import fs from "fs";

export const importExcelService = async (filePath: string) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  fs.unlink(filePath, (err) => {
    if (err) console.error(`Error deleting file: ${err}`);
  });

  const sheet = workbook.worksheets[0];
  const rows: ImportRow[] = [];

  sheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return;
    rows.push({
      floor_name: row.getCell(1).value?.toString() || "",
      floor_type: row.getCell(2).value?.toString() || "",
      floor_status: row.getCell(3).value?.toString() || "AVAILABLE",
      unit_segment: row.getCell(4).value?.toString() || "",
      type_segment: row.getCell(5).value?.toString() || "",
      unit_status: row.getCell(6).value?.toString() || "AVAILABLE",
      total_area: Number(row.getCell(7).value),
      GSA_area: Number(row.getCell(8).value),
      outdoor_terrace: Number(row.getCell(9).value),
      mtr_price: Number(row.getCell(10).value),
      final_price: Number(row.getCell(11).value),
      progUnitKey: Number(row.getCell(12).value),
    });
  });

  if (rows.length > 2000) throw new Error("Excel row limit exceeded: max is 2000 rows");

  // ✅ Use upsert instead of insertOne to avoid duplicate key errors
  const floorNames = Array.from(new Set(rows.map((r) => r.floor_name)));

  const floorOps = floorNames.map((floor_name) => {
    const row = rows.find((r) => r.floor_name === floor_name)!;
    return {
      updateOne: {
        filter: { floor_name },
        update: {
          $set: {
            floor_type: row.floor_type,
            floor_status: row.floor_status,
          },
        },
        upsert: true,
      },
    };
  });

  if (floorOps.length > 0) await Floor.bulkWrite(floorOps);

  // Reload floors for ID mapping
  const floors = await Floor.find({ floor_name: { $in: floorNames } });
  const floorMap = new Map(floors.map((f) => [f.floor_name, f._id]));

  // ✅ Use upsert for units too
  const unitOps = rows.map((row) => {
    const floorId = floorMap.get(row.floor_name);
    return {
      updateOne: {
        filter: { unit_segment: row.unit_segment },
        update: {
          $set: {
            floor: floorId,
            unit_segment: row.unit_segment,
            type_segment: row.type_segment,
            unit_status: row.unit_status,
            total_area: row.total_area,
            GSA_area: row.GSA_area,
            outdoor_terrace: row.outdoor_terrace,
            mtr_price: row.mtr_price,
            final_price: row.final_price,
            progUnitKey: row.progUnitKey,
          },
        },
        upsert: true,
      },
    };
  });

  if (unitOps.length > 0) await Unit.bulkWrite(unitOps);

  return { success: true, rowsProcessed: rows.length };
};



export const exportExcelService = async () => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Units");

  sheet.addRow([
    "floor_name",
    "floor_type",
    "floor_status",
    "unit_segment",
    "type_segment",
    "unit_status",
    "total_area",
    "GSA_area",
    "outdoor_terrace",
    "mtr_price",
    "final_price",
    "progUnitKey",
  ]);

  const units = await Unit.find().populate<{ floor: IFloorPopulated }>("floor");

  units.forEach((u) => {
    sheet.addRow([
      u.floor?.floor_name,
      u.floor?.floor_type,
      u.floor?.floor_status,
      u.unit_segment,
      u.type_segment,
      u.unit_status,
      u.total_area,
      u.GSA_area,
      u.outdoor_terrace,
      u.mtr_price,
      u.final_price,
      u.progUnitKey,
    ]);
  });

  const filePath = makeExportFilePath();
  await workbook.xlsx.writeFile(filePath);

  return filePath;
};

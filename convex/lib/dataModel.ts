/**
 * Tipos locais usados para manter o projeto compilável antes do primeiro `convex dev`.
 * O codegen oficial continuará sendo criado em `convex/_generated`.
 */
import type schema from "../schema";
import type {
  DataModelFromSchemaDefinition,
  DocumentByName,
  SystemTableNames,
  TableNamesInDataModel
} from "convex/server";
import type { GenericId } from "convex/values";

export type DataModel = DataModelFromSchemaDefinition<typeof schema>;
export type TableNames = TableNamesInDataModel<DataModel>;
export type Doc<TableName extends TableNames> = DocumentByName<DataModel, TableName>;
export type Id<TableName extends TableNames | SystemTableNames> = GenericId<TableName>;

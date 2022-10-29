export interface IStaticFiles {
  fileNames: String[];
}

// Define collection and schema
export class StaticFiles implements IStaticFiles {
  fileNames: String[];
}
export declare class FileService {
    uploadFile(file: Express.Multer.File): Promise<string>;
    deleteFile(filePath: string): Promise<void>;
    getFileUrl(filePath: string): Promise<string>;
}

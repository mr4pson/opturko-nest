import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { UploadTypesEnum } from './upload-types.enum';

/**
 * Multer utils
 *
 * @export
 * @class MulterUtils
 */
@Injectable()
export class MulterUtils {
  /**
   * Config for allowed files
   *
   * @static
   * @param {UploadTypeEnum} filesAllowed
   * @returns
   * @memberof MulterUtils
   */
  static getConfig(filesAllowed: UploadTypesEnum) {
    return {
      // Enable file size limits
      limits: {
        // fileSize: +process.env.MAX_FILE_SIZE * 1024 * 1024,
        fileSize: 5 * 1024 * 1024,
      },
      // Check the mimetypes to allow for upload
      fileFilter: (req: any, file: any, cb: any) => {
        console.log(file.mimetype);
        if (file.mimetype.match(`/(${filesAllowed})$`)) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
      // Storage properties
      storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
          // const uploadPath = process.env.UPLOAD_LOCATION;
          const uploadPath = './upload';
          // Create folder if doesnt exist
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
          }
          cb(null, uploadPath);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
          // Calling the callback passing the random name generated with
          // the original extension name
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    };
  }
}

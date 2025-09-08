export abstract class SessionKeys {
  public static colorScheme: string = 'colorScheme';
}

export abstract class ErrorCode {
  public static readonly OK: number = 200;
  public static readonly CREATED: number = 201;
  public static readonly ACCEPTED: number = 202;
  public static readonly NO_CONTENT: number = 202;

  public static readonly BAD_REQUEST: number = 400;
  public static readonly UNAUTHORIZED: number = 401;
  public static readonly FORBIDDEN: number = 403;
  public static readonly NOT_FOUND: number = 404;
  public static readonly METHOD_NOT_ALLOWED: number = 405;
  public static readonly REQUEST_TIME_OUT: number = 408;
  public static readonly CONFLICT: number = 409;

  public static readonly INTERNAL_SERVER_ERROR: number = 500;
  public static readonly METHOD_NOT_IMPLEMENTED: number = 501;
  public static readonly BAD_GATEWAY: number = 502;
  public static readonly SERVICE_UNAVAILABLE: number = 503;
  public static readonly GATEWAY_TIMEOUT: number = 504;
  public static readonly NETWORK_AUTH_REQUIRED: number = 511;
}

export abstract class ErrorMessage {
  public static readonly SERVER_ERROR: string = 'Internal Server Error';

}

export abstract class AlertType {
  public static readonly NO_RECORD: string = 'No Record!';
  public static readonly SUCCESS: string = 'Success!';
  public static readonly FAILED: string = 'Failed!';
  public static readonly WARNING: string = 'Warning!';
  public static readonly DUPLICATE: string = 'Already Exists!';
}

export abstract class AlertMessage {
  public static readonly NO_RECORD: string = 'No record Found';
  public static readonly FAILED: string = 'Oops! Something went wrong!';
  public static readonly PENDING_AMENDMENT: string =
    'An amendment is already awaiting for approval. Please complete that first!';
  public static readonly LOWEST_QUOTATION_EXISTS: string =
    'Sorry! You cannot bid more than current lowest rate!';
  public static readonly DUPLICATE_REFERENCE_NO: string =
    'Provided reference no already exists! Please provide a different one!';
  public static readonly DUPLICATE_FILE: string =
    'File Exists! Upload a different file';
}
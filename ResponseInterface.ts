import { ResponseType } from '@whitesourcesoftware/fatcache';

export interface IApiErrors {
	message: string;
	code: number;
	fields: string[];
}

export default interface GenericServerResponseStructure<T> {
	generalErrorCode: number;
	errors: IApiErrors[];
	additionalData: any;
	generalErrorMsg: string | null;
	retVal: T;
}

export type ApiResponse<T> = ResponseType<GenericServerResponseStructure<T>>;

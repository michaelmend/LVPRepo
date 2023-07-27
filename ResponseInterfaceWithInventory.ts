import { ResponseType } from '@whitesourcesoftware/fatcache';
import { IApiErrors } from './ResponseInterface';

export interface IReturnValueWithInventory<T> {
	inventory: T[];
}

export default interface ServerResponseStructureWithInventory<T> {
	generalErrorCode: number;
	errors: IApiErrors[];
	additionalData: any;
	generalErrorMsg: string | null;
	retVal: IReturnValueWithInventory<T>;
}

export type ApiResponseWithInventory<T> = ResponseType<ServerResponseStructureWithInventory<T>>;

import { ServerResponseStructure } from '../data/endpoints/common/types/serverResponse/ServerResponse';

export interface IAdminProduct {
	id: number;
	name: string;
	domainId: number;
	domainName: string;
	projects: [];
	creationTime: number;
	defaultProduct: boolean;
	productToken: string;
}

export type UserAdminProductInterface = ServerResponseStructure<IAdminProduct[]>;

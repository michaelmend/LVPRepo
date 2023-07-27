import { ServerResponseStructure } from '../../data/endpoints/common/types/serverResponse/ServerResponse';
import { IDomainBase } from './DomainApiInterface';

export interface IAccountBase {
	name: string;
	uuid?: string;
}

export interface IDomainVitals extends IDomainBase {
	products: number;
	projects: number;
	creationDate: Date;
}

export type GetAccountDomainsApiResponse = ServerResponseStructure<IDomainVitals[]>;

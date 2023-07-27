import { IUser } from './UserApiInterface';
import { ServerResponseStructure } from '../../data/endpoints/common/types/serverResponse/ServerResponse';

export interface ICopyrightReference {
	type: string;
	copyright: string;
	information: string;
	customDisclaimer: string;
	createdAt: string;
	textUrl: string;
	startYear: string;
	endYear: string;
	author: string;
	referenceInfo: string;
	assignedBy: IUser;
}

export interface IUserCopyrightReference {
	copyright: string;
	author: string;
	startYear?: string;
	endYear?: string;
	customDisclaimer: string;
}

export type UserCopyrightReferenceApi = ServerResponseStructure<IUserCopyrightReference>;

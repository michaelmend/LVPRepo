export interface IAuditLog {
	date: string;
	userEmail: string;
	userIp: string;
	service: string;
	category: string;
	scope: string;
	assetClass: string;
	endpoint: string;
	action: string;
	contextType: string;
	comment: string;
}

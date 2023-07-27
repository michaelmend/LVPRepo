export interface IAppMeta {
	build: {
		version: string;
		java: {
			target: string;
		};
		artifact: string;
		name: string;
		group: string;
		time: string;
	};
}

export interface IHealthStatus {
	status: string;
}

export type IAppMetaApi = IAppMeta;
export type IHealthStatusApi = IHealthStatus;

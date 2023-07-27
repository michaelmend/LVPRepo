import GenericServerResponseStructure from '../../ResponseInterface';
import { ServerResponseStructure } from '../../../data/endpoints/common/types/serverResponse/ServerResponse';
import { ISimpleProject } from '../ProjectApiInterface';

export interface ISastComment {
	body: string;
	createdBy: string;
	createdTime: string;
}

export interface ISastFilterType {
	code: number;
	name: string;
}

export interface ISastFilter {
	filterTypes: ISastFilterType[];
	isFiltered: boolean;
}

export interface ISastCallStackItem {
	file: string;
	line: string;
	name: string;
	snippet: string;
	startLine: number;
}

export interface ISastVulnerability {
	ageRating: string;
	azureIssue: {
		project: string;
		workItemId: number;
	};
	baselineFinding: boolean;
	comment: ISastComment;
	confidence: number;
	createdTime: string;
	description: string;
	expiration: string;
	falsepositive: boolean;
	filter: ISastFilter;
	functionCalls: ISastCallStackItem[];
	hasRemediation: boolean;
	id: string;
	inputFlow: ISastCallStackItem[];
	inputSource: string;
	jiraIssue: {
		issueId: string;
		project: string;
	};
	language: string;
	markedForDeletion: boolean;
	orgId: string;
	prUrl: string;
	rating: number;
	reviewed: boolean;
	risk: string;
	scanId: string;
	severityRating: number;
	signature: string;
	sink: string;
	sinkCall: string;
	sinkFile: string;
	suppressMessage: string;
	type: {
		id: number;
		name: string;
	};
}

export interface ISastVulnerabilityType {
	capec: {
		id: string;
		title: string;
		url: string;
	};
	cwe: {
		id: string;
		title: string;
		url: string;
	};
	description: string;
	hipaa: {
		control: string;
		title: string;
	};
	hitrust: {
		control: string;
		title: string;
	};
	id: number;
	name: string;
	nist: {
		control: string;
		priority: string;
		title: string;
		url: string;
	};
	order: number;
	owasp: {
		index: string;
		title: string;
		url: string;
	};
	owasp2021: {
		index: string;
		title: string;
		url: string;
	};
	pcidss: {
		section: string;
		title: string;
	};
	recommendation: string[];
	references: string[];
	risk: string;
	sarif: string;
	severityRating: number;
}

export interface ISastFinding {
	id: number;
	vulnerability: ISastVulnerability;
	type: ISastVulnerabilityType;
	project: ISimpleProject;
}

export interface ISastVulnerabilityFlowTraceScm {
	type: string;
	commitId: string;
	branch: string;
}

export interface ISastVulnerabilityTraceItem extends ISastCallStackItem {
	description: string;
	scmLink: string;
}

export interface ISastVulnerabilityFlowTrace {
	scm: ISastVulnerabilityFlowTraceScm;
	trace: ISastVulnerabilityTraceItem[];
}

export interface ISastBulkAction {
	items: string[];
	action: string;
	value: string;
	isValueBoolean: boolean;
	values: string[];
}

export type SastScanApi = GenericServerResponseStructure<ISastFinding[]>;
export type SastFindingsApi = ServerResponseStructure<ISastFinding[]>;
export type SastVulnerabilityFlowTraceApi = ServerResponseStructure<ISastVulnerabilityFlowTrace>;

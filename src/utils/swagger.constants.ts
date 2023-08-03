import { HttpStatus } from "@nestjs/common";

export const API = {
	CONTINUE: {
		status: HttpStatus.CONTINUE,
		description: "CONTINUE"
	},
	SWITCHING_PROTOCOLS: {
		status: HttpStatus.SWITCHING_PROTOCOLS,
		description: "SWITCHING_PROTOCOLS"
	},
	PROCESSING: {
		status: HttpStatus.PROCESSING,
		description: "PROCESSING"
	},
	EARLYHINTS: {
		status: HttpStatus.EARLYHINTS,
		description: "EARLYHINTS"
	},
	OK: {
		status: HttpStatus.OK,
		description: "OK"
	},
	CREATED: {
		status: HttpStatus.CREATED,
		description: "CREATED"
	},
	ACCEPTED: {
		status: HttpStatus.ACCEPTED,
		description: "ACCEPTED"
	},
	NON_AUTHORITATIVE_INFORMATION: {
		status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
		description: "NON_AUTHORITATIVE_INFORMATION"
	},
	NO_CONTENT: {
		status: HttpStatus.NO_CONTENT,
		description: "NO_CONTENT"
	},
	RESET_CONTENT: {
		status: HttpStatus.RESET_CONTENT,
		description: "RESET_CONTENT"
	},
	PARTIAL_CONTENT: {
		status: HttpStatus.PARTIAL_CONTENT,
		description: "PARTIAL_CONTENT"
	},
	AMBIGUOUS: {
		status: HttpStatus.AMBIGUOUS,
		description: "AMBIGUOUS"
	},
	MOVED_PERMANENTLY: {
		status: HttpStatus.MOVED_PERMANENTLY,
		description: "MOVED_PERMANENTLY"
	},
	FOUND: {
		status: HttpStatus.FOUND,
		description: "FOUND"
	},
	SEE_OTHER: {
		status: HttpStatus.SEE_OTHER,
		description: "SEE_OTHER"
	},
	NOT_MODIFIED: {
		status: HttpStatus.NOT_MODIFIED,
		description: "NOT_MODIFIED"
	},
	TEMPORARY_REDIRECT: {
		status: HttpStatus.TEMPORARY_REDIRECT,
		description: "TEMPORARY_REDIRECT"
	},
	PERMANENT_REDIRECT: {
		status: HttpStatus.PERMANENT_REDIRECT,
		description: "PERMANENT_REDIRECT"
	},
	BAD_REQUEST: {
		status: HttpStatus.BAD_REQUEST,
		description: "Bad Request"
	},
	UNAUTHORIZED: {
		status: HttpStatus.UNAUTHORIZED,
		description: "Unauthorized"
	},
	PAYMENT_REQUIRED: {
		status: HttpStatus.PAYMENT_REQUIRED,
		description: "PAYMENT_REQUIRED"
	},
	FORBIDDEN: {
		status: HttpStatus.FORBIDDEN,
		description: "FORBIDDEN"
	},
	NOT_FOUND: {
		status: HttpStatus.NOT_FOUND,
		description: "NOT_FOUND"
	},
	METHOD_NOT_ALLOWED: {
		status: HttpStatus.METHOD_NOT_ALLOWED,
		description: "METHOD_NOT_ALLOWED"
	},
	NOT_ACCEPTABLE: {
		status: HttpStatus.NOT_ACCEPTABLE,
		description: "NOT_ACCEPTABLE"
	},
	PROXY_AUTHENTICATION_REQUIRED: {
		status: HttpStatus.PROXY_AUTHENTICATION_REQUIRED,
		description: "PROXY_AUTHENTICATION_REQUIRED"
	},
	REQUEST_TIMEOUT: {
		status: HttpStatus.REQUEST_TIMEOUT,
		description: "REQUEST_TIMEOUT"
	},
	CONFLICT: {
		status: HttpStatus.CONFLICT,
		description: "CONFLICT"
	},
	GONE: {
		status: HttpStatus.GONE,
		description: "GONE"
	},
	LENGTH_REQUIRED: {
		status: HttpStatus.LENGTH_REQUIRED,
		description: "LENGTH_REQUIRED"
	},
	PRECONDITION_FAILED: {
		status: HttpStatus.PRECONDITION_FAILED,
		description: "PRECONDITION_FAILED"
	},
	PAYLOAD_TOO_LARGE: {
		status: HttpStatus.PAYLOAD_TOO_LARGE,
		description: "PAYLOAD_TOO_LARGE"
	},
	URI_TOO_LONG: {
		status: HttpStatus.URI_TOO_LONG,
		description: "URI_TOO_LONG"
	},
	UNSUPPORTED_MEDIA_TYPE: {
		status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
		description: "UNSUPPORTED_MEDIA_TYPE"
	},
	REQUESTED_RANGE_NOT_SATISFIABLE: {
		status: HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE,
		description: "REQUESTED_RANGE_NOT_SATISFIABLE"
	},
	EXPECTATION_FAILED: {
		status: HttpStatus.EXPECTATION_FAILED,
		description: "EXPECTATION_FAILED"
	},
	I_AM_A_TEAPOT: {
		status: HttpStatus.I_AM_A_TEAPOT,
		description: "I_AM_A_TEAPOT"
	},
	MISDIRECTED: {
		status: HttpStatus.MISDIRECTED,
		description: "MISDIRECTED"
	},
	UNPROCESSABLE_ENTITY: {
		status: HttpStatus.UNPROCESSABLE_ENTITY,
		description: "UNPROCESSABLE_ENTITY"
	},
	FAILED_DEPENDENCY: {
		status: HttpStatus.FAILED_DEPENDENCY,
		description: "FAILED_DEPENDENCY"
	},
	PRECONDITION_REQUIRED: {
		status: HttpStatus.PRECONDITION_REQUIRED,
		description: "PRECONDITION_REQUIRED"
	},
	TOO_MANY_REQUESTS: {
		status: HttpStatus.TOO_MANY_REQUESTS,
		description: "TOO_MANY_REQUESTS"
	},
	INTERNAL_SERVER_ERROR: {
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "INTERNAL_SERVER_ERROR"
	},
	NOT_IMPLEMENTED: {
		status: HttpStatus.NOT_IMPLEMENTED,
		description: "NOT_IMPLEMENTED"
	},
	BAD_GATEWAY: {
		status: HttpStatus.BAD_GATEWAY,
		description: "BAD_GATEWAY"
	},
	SERVICE_UNAVAILABLE: {
		status: HttpStatus.SERVICE_UNAVAILABLE,
		description: "SERVICE_UNAVAILABLE"
	},
	GATEWAY_TIMEOUT: {
		status: HttpStatus.GATEWAY_TIMEOUT,
		description: "GATEWAY_TIMEOUT"
	},
	HTTP_VERSION_NOT_SUPPORTED: {
		status: HttpStatus.HTTP_VERSION_NOT_SUPPORTED,
		description: "HTTP_VERSION_NOT_SUPPORTED"
	}
};

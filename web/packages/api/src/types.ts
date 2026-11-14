import type { components } from "./generated/openapi"

export type Schema<T extends keyof components["schemas"]> = components["schemas"][T]

export type AccessTokenResponse = Schema<"AccessTokenResponse">
export type AdminUserItemResponse = Schema<"AdminUserItemResponse">
export type CreateRoleRequest = Schema<"CreateRoleRequest">
export type LoginRequest = Schema<"LoginRequest">
export type MeResponse = Schema<"MeResponse">
export type PagedResponseOfAdminUserItemResponse = Schema<"PagedResponseOfAdminUserItemResponse">
export type PermissionItemResponse = Schema<"PermissionItemResponse">
export type RegisterRequest = Schema<"RegisterRequest">
export type RoleItemResponse = Schema<"RoleItemResponse">
export type UpdateRolePermissionsRequest = Schema<"UpdateRolePermissionsRequest">
export type UpdateUserRolesRequest = Schema<"UpdateUserRolesRequest">
export type UpdateUserStatusRequest = Schema<"UpdateUserStatusRequest">
export type UserSessionItemResponse = Schema<"UserSessionItemResponse">
export type RevokeOthersResponse = Schema<"RevokeOthersResponse">

export type UserSessionItem = UserSessionItemResponse

export type { components, paths, operations } from "./generated/openapi"

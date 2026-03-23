export class RbacService {
  hasPermissions(input: { grantedPermissions: string[]; requiredPermissions: string[] }): boolean {
    return input.requiredPermissions.every((permission) => input.grantedPermissions.includes(permission));
  }
}

export const rbacService = new RbacService();

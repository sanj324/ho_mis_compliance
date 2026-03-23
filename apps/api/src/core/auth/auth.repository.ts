import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AuthRepository {
  findUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  createRefreshToken(token: string, userId: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });
  }

  findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token }
    });
  }
}

export const authRepository = new AuthRepository();

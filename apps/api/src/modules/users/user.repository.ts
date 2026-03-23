import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
  findMany() {
    return prisma.user.findMany({
      include: {
        branch: true,
        userRoles: {
          include: {
            role: true
          }
        }
      },
      orderBy: {
        username: "asc"
      }
    });
  }

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        branch: true,
        userRoles: {
          include: {
            role: true
          }
        },
        _count: {
          select: {
            userRoles: true,
            refreshTokens: true,
            auditLogs: true,
            finalizedPayrollRuns: true,
            notifications: true,
            documents: true,
            vouchers: true,
            generatedReports: true,
            assignedApprovalTasks: true,
            approvalHistories: true
          }
        }
      }
    });
  }

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      include: {
        branch: true,
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      include: {
        branch: true,
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({
        where: { userId: id }
      });
      await tx.refreshToken.deleteMany({
        where: { userId: id }
      });

      return tx.user.delete({
        where: { id }
      });
    });
  }
}

export const userRepository = new UserRepository();

export const normalizePagination = (page?: number, pageSize?: number) => {
  const safePage = Number.isFinite(page) && page && page > 0 ? page : 1;
  const safePageSize = Number.isFinite(pageSize) && pageSize && pageSize > 0 ? pageSize : 10;

  return {
    page: safePage,
    pageSize: safePageSize,
    skip: (safePage - 1) * safePageSize,
    take: safePageSize
  };
};

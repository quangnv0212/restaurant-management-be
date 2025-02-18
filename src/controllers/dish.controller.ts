import prisma from '@/database'
import { CreateDishBodyType, UpdateDishBodyType } from '@/schemaValidations/dish.schema'

export const getDishList = () => {
  return prisma.dish.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const getDishListWithPagination = async (
  page: number,
  limit: number,
  sortBy: string,
  sortOrder: string,
  search: string,
  status: string[],
  fromPrice: number,
  toPrice: number
) => {
  const where: any = {
    price: {
      gte: fromPrice,
      lte: toPrice
    },
    name: {
      contains: search
    }
  }

  if (status && status.length > 0) {
    where.status = {
      in: status
    }
  }

  const data = await prisma.dish.findMany({
    orderBy: {
      [sortBy]: sortOrder
    },
    where,
    skip: (page - 1) * limit,
    take: limit
  })
  const totalItem = await prisma.dish.count()
  const totalPage = Math.ceil(totalItem / limit)
  return {
    items: data,
    totalItem,
    page,
    limit,
    totalPage
  }
}

export const getDishDetail = (id: number) => {
  return prisma.dish.findUniqueOrThrow({
    where: {
      id
    }
  })
}

export const createDish = (data: CreateDishBodyType) => {
  return prisma.dish.create({
    data
  })
}

export const updateDish = (id: number, data: UpdateDishBodyType) => {
  return prisma.dish.update({
    where: {
      id
    },
    data
  })
}

export const deleteDish = (id: number) => {
  return prisma.dish.delete({
    where: {
      id
    }
  })
}

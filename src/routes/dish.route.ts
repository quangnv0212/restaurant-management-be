import {
  createDish,
  deleteDish,
  getDishDetail,
  getDishListWithPagination,
  updateDish
} from '@/controllers/dish.controller'
import { pauseApiHook, requireEmployeeHook, requireLoginedHook, requireOwnerHook } from '@/hooks/auth.hooks'
import {
  CreateDishBody,
  CreateDishBodyType,
  DishListWithPaginationQuery,
  DishListWithPaginationQueryType,
  DishListWithPaginationRes,
  DishListWithPaginationResType,
  DishParams,
  DishParamsType,
  DishRes,
  DishResType,
  UpdateDishBody,
  UpdateDishBodyType
} from '@/schemaValidations/dish.schema'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function dishRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get<{
    Reply: DishListWithPaginationResType
    Querystring: DishListWithPaginationQueryType
  }>(
    '/',
    {
      schema: {
        response: {
          200: DishListWithPaginationRes
        },
        querystring: DishListWithPaginationQuery
      }
    },
    async (request, reply) => {
      const { page, limit, sortBy, sortOrder, search, status, fromPrice, toPrice } = request.query
      const statusArray = status ? (status.split(',') as string[]) : []
      const data = await getDishListWithPagination(
        page,
        limit,
        sortBy,
        sortOrder,
        search as string,
        statusArray,
        fromPrice as number,
        toPrice as number
      )
      reply.send({
        data: {
          items: data.items as DishListWithPaginationResType['data']['items'],
          totalItem: data.totalItem,
          totalPage: data.totalPage,
          page,
          limit
        },
        message: 'Get dish list successfully'
      })
    }
  )

  fastify.get<{
    Params: DishParamsType
    Reply: DishResType
  }>(
    '/:id',
    {
      schema: {
        params: DishParams,
        response: {
          200: DishRes
        }
      }
    },
    async (request, reply) => {
      const dish = await getDishDetail(request.params.id)
      reply.send({
        data: dish as DishResType['data'],
        message: 'Get dish detail successfully'
      })
    }
  )

  fastify.post<{
    Body: CreateDishBodyType
    Reply: DishResType
  }>(
    '',
    {
      schema: {
        body: CreateDishBody,
        response: {
          200: DishRes
        }
      },
      // Login AND (Owner OR Employee)
      preValidation: fastify.auth([requireLoginedHook, pauseApiHook, [requireOwnerHook, requireEmployeeHook]], {
        relation: 'and'
      })
    },
    async (request, reply) => {
      const dish = await createDish(request.body)
      reply.send({
        data: dish as DishResType['data'],
        message: 'Create dish successfully'
      })
    }
  )

  fastify.put<{
    Params: DishParamsType
    Body: UpdateDishBodyType
    Reply: DishResType
  }>(
    '/:id',
    {
      schema: {
        params: DishParams,
        body: UpdateDishBody,
        response: {
          200: DishRes
        }
      },
      preValidation: fastify.auth([requireLoginedHook, pauseApiHook, [requireOwnerHook, requireEmployeeHook]], {
        relation: 'and'
      })
    },
    async (request, reply) => {
      const dish = await updateDish(request.params.id, request.body)
      reply.send({
        data: dish as DishResType['data'],
        message: 'Update dish successfully'
      })
    }
  )

  fastify.delete<{
    Params: DishParamsType
    Reply: DishResType
  }>(
    '/:id',
    {
      schema: {
        params: DishParams,
        response: {
          200: DishRes
        }
      },
      preValidation: fastify.auth([requireLoginedHook, pauseApiHook, [requireOwnerHook, requireEmployeeHook]], {
        relation: 'and'
      })
    },
    async (request, reply) => {
      const result = await deleteDish(request.params.id)
      reply.send({
        message: 'Delete dish successfully',
        data: result as DishResType['data']
      })
    }
  )
}

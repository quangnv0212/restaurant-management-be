import envConfig from '@/config'
import { OrderStatus } from '@/constants/type'
import prisma from '@/database'
import { formatInTimeZone } from 'date-fns-tz'

export const dashboardIndicatorController = async ({ fromDate, toDate }: { fromDate: Date; toDate: Date }) => {
  const [orders, guests, dishes] = await Promise.all([
    prisma.order.findMany({
      include: {
        dishSnapshot: true,
        table: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate
        }
      }
    }),
    prisma.guest.findMany({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate
        },
        orders: {
          some: {
            status: OrderStatus.Paid
          }
        }
      }
    }),
    prisma.dish.findMany()
  ])

  // Revenue
  let revenue = 0
  // Number of guests who ordered successfully
  const guestCount = guests.length
  // Number of orders
  const orderCount = orders.length
  // Dish statistics
  const dishIndicatorObj: Record<
    number,
    {
      id: number
      name: string
      price: number
      description: string
      image: string
      status: string
      createdAt: Date
      updatedAt: Date
      successOrders: number // Number of orders successfully
    }
  > = dishes.reduce((acc, dish) => {
    acc[dish.id] = { ...dish, successOrders: 0 }
    return acc
  }, {} as any)
  // Revenue by date
  // Create revenueByDateObj with key as date from fromDate -> toDate and value as revenue
  const revenueByDateObj: { [key: string]: number } = {}

  // Loop from fromDate -> toDate
  for (let i = fromDate; i <= toDate; i.setDate(i.getDate() + 1)) {
    revenueByDateObj[formatInTimeZone(i, envConfig.SERVER_TIMEZONE, 'dd/MM/yyyy')] = 0
  }

  // Number of tables being used
  const tableNumberObj: { [key: number]: boolean } = {}
  orders.forEach((order) => {
    if (order.status === OrderStatus.Paid) {
      revenue += order.dishSnapshot.price * order.quantity
      if (order.dishSnapshot.dishId && dishIndicatorObj[order.dishSnapshot.dishId]) {
        dishIndicatorObj[order.dishSnapshot.dishId].successOrders++
      }
      const date = formatInTimeZone(order.createdAt, envConfig.SERVER_TIMEZONE, 'dd/MM/yyyy')
      revenueByDateObj[date] = (revenueByDateObj[date] ?? 0) + order.dishSnapshot.price * order.quantity
    }
    if (
      [OrderStatus.Processing, OrderStatus.Pending, OrderStatus.Delivered].includes(order.status as any) &&
      order.tableNumber !== null
    ) {
      tableNumberObj[order.tableNumber] = true
    }
  })
  // Number of tables being used
  const servingTableCount = Object.keys(tableNumberObj).length

  // Revenue by date
  const revenueByDate = Object.keys(revenueByDateObj).map((date) => {
    return {
      date,
      revenue: revenueByDateObj[date]
    }
  })
  const dishIndicator = Object.values(dishIndicatorObj)
  return {
    revenue,
    guestCount,
    orderCount,
    servingTableCount,
    dishIndicator,
    revenueByDate
  }
}

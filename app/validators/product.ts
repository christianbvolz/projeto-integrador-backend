import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

const productSchema = vine
  .object({
    name: vine.string(),
    barcode: vine.string(),
    description: vine.string(),
    quantity: vine.number().min(1).withoutDecimals(),
    category: vine.string(),
    expirationDate: vine
      .date()
      .nullable()
      .transform((value) => (value ? DateTime.fromJSDate(value) : null)),
    image: vine.file({
      size: '10mb',
      extnames: ['jpg', 'png', 'jpeg', 'svg'],
    }),
  })
  .allowUnknownProperties()

export const storeProductValidator = vine.compile(productSchema)

export const showOrDeleteProductValidator = vine.compile(
  vine.object({
    params: vine.object({
      productId: vine.number().min(1).withoutDecimals(),
    }),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    params: vine.object({
      productId: vine.number().min(1).withoutDecimals(),
    }),
    ...productSchema.getProperties(),
  })
)

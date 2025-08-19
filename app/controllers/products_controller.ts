import Product from '#models/product'
import {
  showOrDeleteProductValidator,
  storeProductValidator,
  updateProductValidator,
} from '#validators/product'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import fs from 'node:fs'
import { StatusCodes } from 'http-status-codes'

export default class ProductsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const products = await Product.all()

    if (!products)
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ errors: [{ message: 'Products not found' }] })

    return response.ok(products)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { name, barcode, description, quantity, category, expirationDate, image } =
      await request.validateUsing(storeProductValidator)

    const imageName = `${cuid()}.${image.extname}`

    const trx = await db.transaction()

    const product = await Product.create(
      {
        name,
        barcode,
        description,
        quantity,
        category,
        expirationDate,
        imageUrl: imageName,
      },
      { client: trx }
    )

    try {
      await image.move(app.makePath('public/images'), {
        name: imageName,
      })

      await product.save()

      await trx.commit()
    } catch (error) {
      await trx.rollback()

      fs.unlink(`./public/images/${imageName}`, (err) => {
        if (err) {
          console.error(err)
        } else {
          console.log('File is deleted.')
        }
      })
    }
    return response.created(product)
  }

  /**
   * Show individual record
   */
  async show({ request, response }: HttpContext) {
    const {
      params: { productId },
    } = await request.validateUsing(showOrDeleteProductValidator)

    const product = await Product.find(productId)

    if (!product)
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ errors: [{ message: 'Product not found' }] })

    return response.ok(product)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response }: HttpContext) {
    const {
      params: { productId },
      name,
      barcode,
      description,
      quantity,
      category,
      expirationDate,
      image,
    } = await request.validateUsing(updateProductValidator)

    const product = await Product.find(productId)

    if (!product)
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ errors: [{ message: 'Product not found' }] })

    const trx = await db.transaction()

    try {
      product.useTransaction(trx)

      await product.merge({ name, barcode, description, quantity, category, expirationDate }).save()

      if (image) {
        await image.move(app.makePath('public/images'), {
          name: product.$original.image,
        })
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      return response.internalServerError()
    }

    return response.ok({ message: 'Product updated' })
  }

  /**
   * Delete record
   */
  async destroy({ request, response }: HttpContext) {
    const {
      params: { productId },
    } = await request.validateUsing(showOrDeleteProductValidator)

    const product = await Product.find(productId)

    if (!product)
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ errors: [{ message: 'Product not found' }] })

    const trx = await db.transaction()

    try {
      product.useTransaction(trx)

      await product.delete()

      const { imageUrl } = product

      fs.unlink(`./public/images/${imageUrl}`, (err) => {
        if (err) {
          console.error(err)
        } else {
          console.log('File is deleted.')
        }
      })

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      return response.internalServerError()
    }

    return response.ok({ message: 'Product deleted' })
  }
}

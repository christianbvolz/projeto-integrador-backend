import Supplier from '#models/supplier'
import {
  showOrDeleteSupplierValidator,
  StoreSuppliersValidator,
  upadateSupplierValidator,
} from '#validators/supplier'
import { StatusCodes } from 'http-status-codes'
import type { HttpContext } from '@adonisjs/core/http'

export default class SuppliersController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const suppliers = await Supplier.all()

    return response.ok(suppliers)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { companyName, cnpj, address, phone, email, mainContact } =
      await request.validateUsing(StoreSuppliersValidator)

    const verifySupplier = await Supplier.findBy('cnpj', cnpj)

    if (verifySupplier)
      return response
        .status(StatusCodes.CONFLICT)
        .json({ errors: [{ message: 'Supplier already exists' }] })

    const newSupplier = await Supplier.create({
      companyName,
      cnpj,
      address,
      phone,
      email,
      mainContact,
    })

    return response.created(newSupplier)
  }

  /**
   * Show individual record
   */
  async show({ request, response }: HttpContext) {
    const {
      params: { supplierId },
    } = await request.validateUsing(showOrDeleteSupplierValidator)

    const supplier = await Supplier.find(supplierId)

    if (!supplier)
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ errors: [{ message: 'Supplier not found' }] })

    return response.ok(supplier)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response }: HttpContext) {
    const {
      params: { supplierId },
      companyName,
      cnpj,
      address,
      phone,
      email,
      mainContact,
    } = await request.validateUsing(upadateSupplierValidator)

    const supplier = await Supplier.find(supplierId)

    if (!supplier)
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ errors: [{ message: 'Supplier not found' }] })

    await supplier.merge({ companyName, cnpj, address, phone, email, mainContact }).save()

    return response.ok({ message: 'Product updated' })
  }

  /**
   * Delete record
   */
  async destroy({ request, response }: HttpContext) {
    const {
      params: { supplierId },
    } = await request.validateUsing(showOrDeleteSupplierValidator)

    const supplier = await Supplier.find(supplierId)

    if (!supplier)
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ errors: [{ message: 'Supplier not found' }] })

    await supplier.delete()

    return response.ok({ message: 'Supplier deleted' })
  }
}

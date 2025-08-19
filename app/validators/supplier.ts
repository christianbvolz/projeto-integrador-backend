import vine from '@vinejs/vine'

const supplierSchema = vine
  .object({
    companyName: vine.string(),
    cnpj: vine.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/), // 00.000.000/0000-00
    address: vine.string(),
    phone: vine
      .string()
      .regex(
        /^\((?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\) (?:[2-8]|9[0-9])[0-9]{3}\-[0-9]{4}$/
      ), // (00) 00000-0000 or (00) 0000-0000,
    email: vine.string().email(),
    mainContact: vine.string(),
  })
  .allowUnknownProperties()

export const StoreSuppliersValidator = vine.compile(supplierSchema)

export const showOrDeleteSupplierValidator = vine.compile(
  vine.object({
    params: vine.object({
      supplierId: vine.number().min(1).withoutDecimals(),
    }),
  })
)

export const upadateSupplierValidator = vine.compile(
  vine.object({
    params: vine.object({
      supplierId: vine.number().min(1).withoutDecimals(),
    }),
    ...supplierSchema.getProperties(),
  })
)

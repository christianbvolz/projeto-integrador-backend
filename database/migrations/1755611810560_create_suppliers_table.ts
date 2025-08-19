import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'suppliers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('company_name', 254).notNullable()
      table.string('cnpj', 18).notNullable().unique() // Formatado para 00.000.000/0000-00
      table.string('address', 254).notNullable()
      table.string('phone', 20).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('main_contact', 254).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

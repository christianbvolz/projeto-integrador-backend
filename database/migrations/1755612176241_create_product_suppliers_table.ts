import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_suppliers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
      table
        .integer('supplier_id')
        .unsigned()
        .references('id')
        .inTable('suppliers')
        .onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.unique(['product_id', 'supplier_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

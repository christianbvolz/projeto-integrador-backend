import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 254).notNullable()
      table.string('barcode', 254).notNullable().unique()
      table.text('description').notNullable()
      table.integer('quantity').notNullable().defaultTo(0)
      table.string('category', 254).notNullable()
      table.datetime('expiration_date').nullable()
      table.string('image_url').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

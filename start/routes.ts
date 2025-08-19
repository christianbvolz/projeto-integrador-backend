/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const SuppliersController = () => import('#controllers/suppliers_controller')

import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router
      .group(() => {
        router.post('/', [SuppliersController, 'store'])
        router.get('/', [SuppliersController, 'index'])
        router.get('/:supplierId', [SuppliersController, 'show'])
        router.put('/:supplierId', [SuppliersController, 'update'])
        router.delete('/:supplierId', [SuppliersController, 'destroy'])
      })
      .prefix('suppliers')
  })
  .prefix('/api')

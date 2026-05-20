package id.biz.sobatwarung

import id.biz.sobatwarung.data.*
import id.biz.sobatwarung.domain.*
import kotlinx.coroutines.flow.Flow

class IosDatabaseProvider : DatabaseProvider {
    override val database: SobatWarungDatabase
        get() = throw UnsupportedOperationException("iOS database not implemented in stub")

    override val productRepository: ProductRepository
        get() = throw UnsupportedOperationException("iOS database not implemented in stub")

    override val orderRepository: OrderRepository
        get() = throw UnsupportedOperationException("iOS database not implemented in stub")

    override val syncQueueRepository: SyncQueueRepository
        get() = throw UnsupportedOperationException("iOS database not implemented in stub")

    override val groupBuyingRepository: GroupBuyingRepository
        get() = throw UnsupportedOperationException("iOS database not implemented in stub")
}

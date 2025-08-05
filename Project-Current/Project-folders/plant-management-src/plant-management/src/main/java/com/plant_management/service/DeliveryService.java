package com.plant_management.service;

import com.plant_management.entity.Delivery;
import com.plant_management.entity.Order;
import com.plant_management.entity.OrdersProducts;
import com.plant_management.entity.ProductInventoryStorage;
import com.plant_management.entity.Products;
import com.plant_management.entity.Sale;
import com.plant_management.entity.Transaction;
import com.plant_management.repository.DeliveryRepository;
import com.plant_management.repository.OrderRepository;
import com.plant_management.repository.OrdersProductsRepository;
import com.plant_management.repository.ProductInventoryStorageRepository;
import com.plant_management.repository.ProductRepository;
import com.plant_management.repository.SaleRepository;
import com.plant_management.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private OrdersProductsRepository ordersProductsRepository;

    @Autowired
    private ProductInventoryStorageRepository productInventoryStorageRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public Optional<Delivery> getDeliveryById(Integer id) {
        return deliveryRepository.findById(id);
    }

    @Transactional
    public Delivery createDelivery(Delivery delivery) {
        Order order = delivery.getOrder();
        order.setStatus("in_delivery");
        orderRepository.save(order);

        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Delivery updateDelivery(Integer id, Delivery deliveryDetails) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        delivery.setVehicle(deliveryDetails.getVehicle());
        delivery.setDriver(deliveryDetails.getDriver());
        delivery.setDepartureTime(deliveryDetails.getDepartureTime());
        delivery.setDeliveryTime(deliveryDetails.getDeliveryTime());

        return deliveryRepository.save(delivery);
    }

    @Transactional
    public void markDeliveryAsCompleted(Integer deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        delivery.setDeliveryTime(LocalDateTime.now());
        deliveryRepository.save(delivery);

        Order order = delivery.getOrder();
        order.setStatus("delivered");
        orderRepository.save(order);
    }

    @Transactional
    public void cancelDelivery(Integer deliveryId) {
        try {
            Delivery delivery = deliveryRepository.findById(deliveryId)
                    .orElseThrow(() -> new RuntimeException("Delivery not found"));

            Order order = delivery.getOrder();
            order.setStatus("cancelled");
            orderRepository.save(order);

            List<Sale> sales = saleRepository.findByOrderId(order.getOrder_id());
            for (Sale sale : sales) {
                transactionRepository.deleteByTransactionId(sale.getTransaction_id());
            }

            saleRepository.deleteByOrderId(order.getOrder_id());


            List<OrdersProducts> orderProducts = ordersProductsRepository.findByOrderId(order.getOrder_id());
            for (OrdersProducts orderProduct : orderProducts) {
                int productId = orderProduct.getProduct_id();
                float quantityToRestore = orderProduct.getQuantity();

                Products product = productRepository.findById(productId)
                        .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

                List<ProductInventoryStorage> inventoryList = productInventoryStorageRepository.findByProducts(product);
                if (!inventoryList.isEmpty()) {
                    ProductInventoryStorage storage = inventoryList.get(0);
                    storage.setQuantity_stored(storage.getQuantity_stored() + quantityToRestore);
                    productInventoryStorageRepository.save(storage);
                }
            }
            deliveryRepository.delete(delivery);
        } catch (Exception e) {
            throw new RuntimeException("Error cancelling delivery: " + e.getMessage(), e);
        }
    }

    public List<Delivery> getPendingDeliveries() {
        List<Order> pendingOrders = orderRepository.findByStatus("pending");
        for (Order order : pendingOrders) {
            if (!deliveryRepository.existsByOrder(order)) {
                Delivery newDelivery = new Delivery();
                newDelivery.setOrder(order);
                deliveryRepository.save(newDelivery);
            }
        }
        return deliveryRepository.findByDeliveryTimeIsNull();
    }

    public List<Delivery> getCompletedDeliveries() {
        return deliveryRepository.findByDeliveryTimeIsNotNull();
    }
}
package com.plant_management.service;

import com.plant_management.dto.OrderProductDTO;
import com.plant_management.dto.OrderRequestDTO;
import com.plant_management.entity.*;
import com.plant_management.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductInventoryStorageRepository productInventoryStorageRepository;

    @Autowired
    private OrdersProductsRepository ordersProductsRepository;

    @Autowired
    private CustomerRepository customersRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountantRepository accountantRepository;

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(int orderId) {
        return orderRepository.findById(orderId);
    }

    public void deleteOrder(int orderId) {
        orderRepository.deleteById(orderId);
    }

    @Transactional
    public void createOrderWithProducts(OrderRequestDTO orderRequest) {
        try {
            Customer customer = customersRepository.findById(orderRequest.getCustomer_id())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            Integer nextOrderId = orderRepository.findMaxOrderId() + 1;

            Order order = new Order();
            order.setOrder_id(nextOrderId);
            order.setCustomer_id(orderRequest.getCustomer_id());
            order.setEmployee_id(orderRequest.getEmployee_id());
            order.setOrder_date(LocalDate.parse(orderRequest.getOrder_date()));
            order.setStatus("pending");
            order.setAddress(customer.getAddress());

            Order savedOrder = orderRepository.save(order);

            float totalUnits = 0;
            BigDecimal totalAmount = BigDecimal.ZERO;

            for (OrderProductDTO productDTO : orderRequest.getProducts()) {
                int productId = productDTO.getProduct_id();
                float quantityOrdered = productDTO.getQuantity();
                totalUnits += quantityOrdered;

                OrdersProducts op = new OrdersProducts();
                op.setOrder_id(savedOrder.getOrder_id());
                op.setProduct_id(productId);
                op.setQuantity(quantityOrdered);
                ordersProductsRepository.save(op);

                Products product = productRepository.findById(productId)
                        .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

                BigDecimal price = product.getPrice_per_unit();
                totalAmount = totalAmount.add(price.multiply(BigDecimal.valueOf(quantityOrdered)));

                List<ProductInventoryStorage> inventoryList = productInventoryStorageRepository.findByProducts(product);
                if (inventoryList.isEmpty()) {
                    throw new RuntimeException("No inventory found for product ID: " + productId);
                }

                float totalAvailable = 0f;
                for (ProductInventoryStorage inv : inventoryList) {
                    totalAvailable += inv.getQuantity_stored();
                }

                if (totalAvailable < quantityOrdered) {
                    throw new RuntimeException("Insufficient stock for product ID: " + productId +
                            ". Requested: " + quantityOrdered + ", Available: " + totalAvailable);
                }

                float remainingToDeduct = quantityOrdered;
                for (ProductInventoryStorage storage : inventoryList) {
                    float available = storage.getQuantity_stored();
                    if (available >= remainingToDeduct) {
                        storage.setQuantity_stored(available - remainingToDeduct);
                        productInventoryStorageRepository.save(storage);
                        break;
                    } else {
                        storage.setQuantity_stored(0f);
                        remainingToDeduct -= available;
                        productInventoryStorageRepository.save(storage);
                    }
                }
            }

            Transaction transaction = new Transaction();
            transaction.setAmount(totalAmount);
            transaction.setDate_of_transaction(new java.util.Date());
            transaction.setType(Transaction.TransactionType.deposit);
            transaction.setPayment_method("Cash on Delivery"); // You can pass this from DTO later

            Accountant accountant = accountantRepository.findById(orderRequest.getAccountant_id())
                    .orElseThrow(() -> new RuntimeException("Accountant not found with ID: " + orderRequest.getAccountant_id()));

            transaction.setAccountant(accountant);


            Transaction savedTransaction = transactionRepository.save(transaction);

            Sale sale = new Sale();
            sale.setTransaction_id(savedTransaction.getTransaction_id());
            sale.setOrder_id(savedOrder.getOrder_id());
            sale.setUnits_sold(totalUnits);
            sale.setStatus("completed");

            saleRepository.save(sale);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create order: " + e.getMessage());
        }
    }

    public List<Order> getPendingOrders() {
        return orderRepository.findByStatus("pending");
    }

    public List<Order> getInDeliveryOrders() {
        return orderRepository.findByStatus("in_delivery");
    }

    public List<Order> getDeliveredOrders() {
        return orderRepository.findByStatus("delivered");
    }

    public List<Order> getCancelledOrders() {
        return orderRepository.findByStatus("cancelled");
    }
}

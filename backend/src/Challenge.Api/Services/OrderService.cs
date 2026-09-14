using Challenge.Api.Data;
using Challenge.Api.Domain;
using Challenge.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Challenge.Api.Services;

public class OrderService
{
    private readonly AppDbContext _db;

    public OrderService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Order> CreateAsync(
        CreateOrderRequest request,
        int userId)
    {
        // 1. Validate request
        if (request.Items == null || request.Items.Count == 0)
            throw new ArgumentException(
                "Order must contain at least one item.");

        if (request.Items.Any(x => x.Quantity <= 0))
            throw new ArgumentException(
                "Quantity must be greater than zero.");

        if (request.Items
            .GroupBy(x => x.ProductId)
            .Any(g => g.Count() > 1))
        {
            throw new ArgumentException(
                "A product cannot appear more than once in an order.");
        }

        // 2. Validate customer
        var customer = await _db.Customers
            .FirstOrDefaultAsync(x =>
                x.Id == request.CustomerId &&
                x.IsActive);

        if (customer == null)
        {
            throw new KeyNotFoundException(
                "Customer not found or inactive.");
        }

        // 3. Load products
        var productIds = request.Items
            .Select(x => x.ProductId)
            .ToList();

        var products = await _db.Products
            .Where(x =>
                productIds.Contains(x.Id) &&
                x.IsActive)
            .ToListAsync();

        if (products.Count != productIds.Count)
        {
            throw new KeyNotFoundException(
                "One or more products were not found or are inactive.");
        }

        // 4. Start transaction
        await using var transaction =
            await _db.Database.BeginTransactionAsync();

        try
        {
            var now = DateTime.UtcNow;

            var order = new Order
            {
                OrderNumber = $"ORD-{Guid.NewGuid():N}"[..32],
                CustomerId = customer.Id,
                OrderDate = now,
                Status = OrderStatus.Confirmed,
                CreatedBy = userId,
                CreatedAt = now,
                UpdatedAt = now
            };

            // Sort products to reduce deadlock risk
            foreach (var itemRequest in request.Items
                         .OrderBy(x => x.ProductId))
            {
                var product = products
                    .First(x => x.Id == itemRequest.ProductId);

                // 5. Atomic stock update
                var affectedRows =
                    await _db.Database.ExecuteSqlInterpolatedAsync($"""
                        UPDATE Products
                        SET StockQuantity = StockQuantity - {itemRequest.Quantity},
                            UpdatedAt = {now}
                        WHERE Id = {product.Id}
                          AND IsActive = 1
                          AND StockQuantity >= {itemRequest.Quantity}
                        """);

                if (affectedRows == 0)
                {
                    throw new InvalidOperationException(
                        $"Insufficient stock for product '{product.Code}'.");
                }

                // 6. Snapshot current price
                var totalPrice =
                    product.Price * itemRequest.Quantity;

                var item = new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = itemRequest.Quantity,
                    UnitPrice = product.Price,
                    TotalPrice = totalPrice
                };

                order.Items.Add(item);
                order.TotalAmount += totalPrice;
            }

            // 7. Save order + items
            _db.Orders.Add(order);

            await _db.SaveChangesAsync();

            // 8. Commit transaction
            await transaction.CommitAsync();

            return order;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
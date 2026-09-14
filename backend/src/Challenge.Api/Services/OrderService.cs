namespace Challenge.Api.Services;

using Challenge.Api.Data;
using Challenge.Api.Domain;
using Challenge.Api.DTOs;
using Microsoft.EntityFrameworkCore;

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
        if (request.Items == null || request.Items.Count == 0)
            throw new ArgumentException("Order must contain at least one item.");

        if (request.Items.Any(x => x.Quantity <= 0))
            throw new ArgumentException("Quantity must be greater than zero.");

        var customer = await _db.Customers
            .FirstOrDefaultAsync(x =>
                x.Id == request.CustomerId &&
                x.IsActive);

        if (customer == null)
            throw new KeyNotFoundException("Customer not found or inactive.");

        var productIds = request.Items
            .Select(x => x.ProductId)
            .Distinct()
            .ToList();

        var products = await _db.Products
            .Where(x =>
                productIds.Contains(x.Id) &&
                x.IsActive)
            .ToListAsync();

        if (products.Count != productIds.Count)
            throw new KeyNotFoundException(
                "One or more products were not found or are inactive.");

        await using var transaction = await _db.Database.BeginTransactionAsync();

        try
        {
            var order = new Order
            {
                OrderNumber = GenerateOrderNumber(),
                CustomerId = customer.Id,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Confirmed,
                CreatedBy = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            foreach (var itemRequest in request.Items)
            {
                var product = products
                    .First(x => x.Id == itemRequest.ProductId);

                if (product.StockQuantity < itemRequest.Quantity)
                    throw new InvalidOperationException(
                        $"Insufficient stock for product '{product.Code}'.");

                var totalPrice =
                    product.Price * itemRequest.Quantity;

                var item = new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = itemRequest.Quantity,

                    // Historical price
                    UnitPrice = product.Price,
                    TotalPrice = totalPrice
                };

                order.Items.Add(item);

                product.StockQuantity -= itemRequest.Quantity;
                product.UpdatedAt = DateTime.UtcNow;

                order.TotalAmount += totalPrice;
            }

            _db.Orders.Add(order);

            await _db.SaveChangesAsync();
            await transaction.CommitAsync();

            return order;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private static string GenerateOrderNumber()
    {
        return $"ORD-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
    }
}
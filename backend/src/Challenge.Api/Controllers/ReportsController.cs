using Challenge.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Challenge.Api.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportsController(AppDbContext db) : ControllerBase
{
    private readonly AppDbContext _db = db;

    [HttpGet("top-products")]
    public async Task<IActionResult> TopProducts(
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate)
    {
        if (fromDate.HasValue &&
            toDate.HasValue &&
            fromDate > toDate)
        {
            throw new ArgumentException(
                "fromDate must be earlier than or equal to toDate.");
        }

        var query = _db.OrderItems
            .AsNoTracking()
            .Where(x => x.Order.Status == Domain.OrderStatus.Confirmed);

        if (fromDate.HasValue)
        {
            query = query.Where(x =>
                x.Order.OrderDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(x =>
                x.Order.OrderDate <= toDate.Value);
        }

        var result = await query
            .GroupBy(x => new
            {
                x.ProductId,
                x.Product.Code,
                x.Product.Name
            })
            .Select(g => new
            {
                productId = g.Key.ProductId,
                productCode = g.Key.Code,
                productName = g.Key.Name,
                totalQuantity = g.Sum(x => x.Quantity),
                totalRevenue = g.Sum(x => x.TotalPrice)
            })
            .OrderByDescending(x => x.totalQuantity)
            .ThenByDescending(x => x.totalRevenue)
            .ToListAsync();

        return Ok(result);
    }
}
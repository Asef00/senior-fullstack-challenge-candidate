using Challenge.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Challenge.Api.Controllers;

[ApiController]
[Route("api/products")]
[Authorize]
public class ProductsController(AppDbContext db) : ControllerBase
{
    private readonly AppDbContext _db = db;

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string? search,
        [FromQuery] bool? isActive,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1)
            page = 1;

        if (pageSize < 1)
            pageSize = 10;

        if (pageSize > 100)
            pageSize = 100;

        var query = _db.Products
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();

            query = query.Where(x =>
                x.Code.Contains(search) ||
                x.Name.Contains(search));
        }

        if (isActive.HasValue)
        {
            query = query.Where(x =>
                x.IsActive == isActive.Value);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(x => x.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new
            {
                x.Id,
                x.Code,
                x.Name,
                x.Price,
                x.StockQuantity,
                x.IsActive
            })
            .ToListAsync();

        var totalPages =
            (int)Math.Ceiling(totalCount / (double)pageSize);

        return Ok(new
        {
            items,
            page,
            pageSize,
            totalCount,
            totalPages
        });
    }
}
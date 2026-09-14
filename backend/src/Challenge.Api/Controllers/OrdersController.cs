using Challenge.Api.DTOs;
using Challenge.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Challenge.Api.Data;
using System.Security.Claims;

namespace Challenge.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orderService;
    private readonly AppDbContext _db;

    public OrdersController(
        OrderService orderService,
        AppDbContext db)
    {
        _orderService = orderService;
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateOrderRequest request)
    {
        var userIdClaim =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var order = await _orderService.CreateAsync(
            request,
            userId);

        return CreatedAtAction(
            nameof(GetById),
            new { id = order.Id },
            new
            {
                order.Id,
                order.OrderNumber,
                order.TotalAmount,
                order.Status
            });
    }

    [HttpGet]
    public async Task<IActionResult> GetList(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
    {
        if (page < 1)
            page = 1;

        if (pageSize < 1)
            pageSize = 10;

        if (pageSize > 100)
            pageSize = 100;

        var query = _db.Orders
            .AsNoTracking();

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(x => x.OrderDate)
            .ThenByDescending(x => x.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new
            {
                x.Id,
                x.OrderNumber,
                x.OrderDate,
                x.Status,
                x.TotalAmount,

                customer = new
                {
                    x.Customer.Id,
                    x.Customer.Code,
                    x.Customer.Name
                }
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

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _db.Orders
            .AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Items)
                .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (order == null)
            return NotFound(new
            {
                message = "Order not found."
            });

        return Ok(new
        {
            order.Id,
            order.OrderNumber,
            order.OrderDate,
            order.Status,
            order.TotalAmount,

            customer = new
            {
                order.Customer.Id,
                order.Customer.Code,
                order.Customer.Name
            },

            items = order.Items.Select(item => new
            {
                item.ProductId,
                productCode = item.Product.Code,
                productName = item.Product.Name,
                item.Quantity,
                item.UnitPrice,
                item.TotalPrice
            })
        });
    }
}
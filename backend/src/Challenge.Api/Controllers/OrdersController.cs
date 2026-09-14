using Microsoft.AspNetCore.Mvc;
using Challenge.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Challenge.Api.DTOs;
using System.Security.Claims;

namespace Challenge.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orderService;
    public OrdersController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateOrderRequest request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

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
    public IActionResult GetList()
    {
        throw new NotImplementedException("Implement GET /api/orders.");
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        _ = id;
        throw new NotImplementedException();
    }
}

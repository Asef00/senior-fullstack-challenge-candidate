using Microsoft.AspNetCore.Mvc;

namespace Challenge.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IActionResult Get(
        [FromQuery] string? search,
        [FromQuery] bool? isActive,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        _ = (search, isActive, page, pageSize);
        throw new NotImplementedException("Implement GET /api/products.");
    }
}

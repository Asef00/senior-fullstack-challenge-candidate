using Microsoft.AspNetCore.Mvc;

namespace Challenge.Api.Controllers;

[ApiController]
[Route("api/reports")]
public class ReportsController : ControllerBase
{
    [HttpGet("top-products")]
    public IActionResult TopProducts([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        _ = (fromDate, toDate);
        throw new NotImplementedException("Implement GET /api/reports/top-products.");
    }
}

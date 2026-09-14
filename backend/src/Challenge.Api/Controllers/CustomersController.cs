using Microsoft.AspNetCore.Mvc;

namespace Challenge.Api.Controllers;

[ApiController]
[Route("api/customers")]
public class CustomersController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        throw new NotImplementedException("Implement GET /api/customers if the create-order screen needs it.");
    }
}

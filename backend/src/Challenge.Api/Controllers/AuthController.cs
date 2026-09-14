using Microsoft.AspNetCore.Mvc;

namespace Challenge.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    public record LoginRequest(string Username, string Password);

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        _ = request;
        throw new NotImplementedException("Implement POST /api/auth/login.");
    }
}

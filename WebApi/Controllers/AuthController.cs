using Application.Common.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [Authorize]
    [HttpGet("me")]
    public IActionResult Me([FromServices] ICurrentUser currentUser)
    {
        return Ok(new
        {
            currentUser.UserId,
            currentUser.UserName,
            currentUser.Email,
            currentUser.Roles
        });
    }
}
using System.Security.Claims;
using Application.Common.Abstractions;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Middlewares;

public class CurrentUserMiddleware
{
    private readonly RequestDelegate _next;

    public CurrentUserMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, IAppDbContext db)
    {
        if (context.User?.Identity?.IsAuthenticated == true)
        {
            var sub = context.User.FindFirstValue("sub");
            if (!string.IsNullOrWhiteSpace(sub))
            {
                var user = await db.Users.FirstOrDefaultAsync(x => x.KeycloakSub == sub);
                if (user == null)
                {
                    var username = context.User.FindFirstValue("preferred_username") ?? "user";
                    var email = context.User.FindFirstValue("email") ?? string.Empty;

                    // role set
                    var roles = context.User.FindAll(ClaimTypes.Role).Select(x => x.Value).ToHashSet(StringComparer.OrdinalIgnoreCase);
                    var role = roles.Contains("admin") ? UserRole.Admin : UserRole.User;

                    user = new AppUser
                    {
                        Id = Guid.NewGuid(),
                        KeycloakSub = sub,
                        DisplayName = username,
                        Email = email,
                        Role = role
                    };

                    db.Users.Add(user);
                    await db.SaveChangesAsync();
                }

                context.Items["AppUserId"] = user.Id;
            }
        }

        await _next(context);
    }
}
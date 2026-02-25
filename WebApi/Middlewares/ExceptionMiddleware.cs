using System.Net;
using System.Text.Json;
using Application.Common.Exceptions;

namespace WebApi.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (NotFoundException ex)
        {
            await WriteError(context,HttpStatusCode.NotFound,ex.Message);
        }
        catch (ConflictException ex)
        {
            await WriteError(context,HttpStatusCode.Conflict,ex.Message);
        }
        catch (ValidationException ex)
        {
            await WriteError(context,HttpStatusCode.BadRequest,ex.Message);
        }
        catch (Exception ex)
        {
            await WriteError(context,HttpStatusCode.InternalServerError,ex.Message);
        }
    }

    private static async Task WriteError(HttpContext context,HttpStatusCode statusCode,string message)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var payload = new
        {
            status = (int)statusCode,
            error = message
        };
        await context.Response.WriteAsync(JsonSerializer.Serialize(payload));
    }
}
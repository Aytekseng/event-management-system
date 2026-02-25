using Application.Features.Events.Commands.RegisterToEvents;
using Application.Features.Events.Commands.UnRegisterFromEvent;
using Application.Features.Events.Queries.GetEventDetails;
using Application.Features.Events.Queries.GetEvents;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly IMediator _mediator;

    public EventsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var list = await _mediator.Send(new GetEventsQuery(), cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetDetails(Guid id, CancellationToken cancellationToken)
    {
        var dto = await _mediator.Send(new GetEventDetailQuery { Id = id }, cancellationToken);
        return Ok(dto);
    }

    [Authorize]
    [HttpPost("{eventId:guid}/register")]
    public async Task<IActionResult> Register(Guid eventId)
    {
        await _mediator.Send(new RegisterToEventCommand { EventId = eventId });
        return Ok();
    }

    [Authorize]
    [HttpDelete("{eventId:guid}/unregister")]
    public async Task<IActionResult> UnRegister(Guid eventId)
    {
        await _mediator.Send(new UnRegisterFromEventCommand { EventId = eventId });
        return Ok();
    }
}
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Features.Events.Commands.CreateEvent;
using Application.Features.Events.Commands.UpdateEvent;
using Application.Features.Events.Commands.DeleteEvent;
using Application.Features.Events.Queries.GetParticipants;

namespace WebApi.Controllers;

[ApiController]
[Route("api/admin/events")]
[Authorize(Roles = "admin")]
public class AdminEventsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminEventsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEventCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { id });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateEventCommand command)
    {
        command.EventId = id;
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteEventCommand { EventId = id });
        return NoContent();
    }

    [HttpGet("{eventId:guid}/participants")]
    public async Task<IActionResult> GetParticipants(Guid eventId, CancellationToken cancellationToken)
    {
        var list = await _mediator.Send(new GetParticipantsQuery { EventId = eventId }, cancellationToken);
        return Ok(list);
    }
}
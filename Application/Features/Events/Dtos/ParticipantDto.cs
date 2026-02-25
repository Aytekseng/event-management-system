namespace Application.Features.Events.Dtos;

public class ParticipantDto
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = default!;
    public string Email { get; set; } = default!;
}
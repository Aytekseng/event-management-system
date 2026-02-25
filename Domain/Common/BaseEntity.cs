namespace Domain.Common;

public class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime createdAt { get; set; } = DateTime.UtcNow;
}

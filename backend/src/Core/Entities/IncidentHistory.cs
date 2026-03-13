namespace SIMP.Core.Entities;

/// <summary>
/// Represents an audit trail entry for incident changes
/// </summary>
public class IncidentHistory : BaseEntity
{
    /// <summary>
    /// The incident this history entry belongs to
    /// </summary>
    public Guid IncidentId { get; set; }
    public virtual Incident Incident { get; set; } = null!;

    /// <summary>
    /// User who made the change
    /// </summary>
    public Guid? ChangedById { get; set; }
    public virtual User? ChangedBy { get; set; }

    /// <summary>
    /// Type of change (StatusChange, Assignment, Update, etc.)
    /// </summary>
    public string ChangeType { get; set; } = string.Empty;

    /// <summary>
    /// Field that was changed
    /// </summary>
    public string FieldName { get; set; } = string.Empty;

    /// <summary>
    /// Previous value (JSON serialized for complex types)
    /// </summary>
    public string? OldValue { get; set; }

    /// <summary>
    /// New value (JSON serialized for complex types)
    /// </summary>
    public string? NewValue { get; set; }

    /// <summary>
    /// Human-readable description of the change
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// IP address of the user who made the change
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent of the client
    /// </summary>
    public string? UserAgent { get; set; }
}

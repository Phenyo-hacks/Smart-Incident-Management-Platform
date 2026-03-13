namespace SIMP.Core.Entities;

/// <summary>
/// Represents a notification to a user
/// </summary>
public class Notification : BaseEntity
{
    /// <summary>
    /// User to receive the notification
    /// </summary>
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;

    /// <summary>
    /// Notification title
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Notification message
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Notification type (Info, Warning, Error, Success)
    /// </summary>
    public string Type { get; set; } = "Info";

    /// <summary>
    /// Related incident ID (if applicable)
    /// </summary>
    public Guid? IncidentId { get; set; }
    public virtual Incident? Incident { get; set; }

    /// <summary>
    /// Link to navigate to when clicked
    /// </summary>
    public string? ActionUrl { get; set; }

    /// <summary>
    /// Whether the notification has been read
    /// </summary>
    public bool IsRead { get; set; }

    /// <summary>
    /// When the notification was read
    /// </summary>
    public DateTime? ReadAt { get; set; }

    /// <summary>
    /// Whether an email was sent for this notification
    /// </summary>
    public bool EmailSent { get; set; }

    /// <summary>
    /// When the email was sent
    /// </summary>
    public DateTime? EmailSentAt { get; set; }

    /// <summary>
    /// Notification priority (for ordering)
    /// </summary>
    public int Priority { get; set; }

    /// <summary>
    /// Expiration date for the notification
    /// </summary>
    public DateTime? ExpiresAt { get; set; }
}

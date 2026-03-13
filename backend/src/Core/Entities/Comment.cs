namespace SIMP.Core.Entities;

/// <summary>
/// Represents a comment on an incident
/// </summary>
public class Comment : BaseEntity
{
    /// <summary>
    /// The incident this comment belongs to
    /// </summary>
    public Guid IncidentId { get; set; }
    public virtual Incident Incident { get; set; } = null!;

    /// <summary>
    /// User who created the comment
    /// </summary>
    public Guid AuthorId { get; set; }
    public virtual User Author { get; set; } = null!;

    /// <summary>
    /// Comment content (supports markdown)
    /// </summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// Whether this is an internal note (not visible to requester)
    /// </summary>
    public bool IsInternal { get; set; }

    /// <summary>
    /// Whether this is a system-generated comment
    /// </summary>
    public bool IsSystemGenerated { get; set; }

    /// <summary>
    /// Type of comment for filtering
    /// </summary>
    public string CommentType { get; set; } = "Note";

    /// <summary>
    /// Attachments on this comment
    /// </summary>
    public virtual ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
}

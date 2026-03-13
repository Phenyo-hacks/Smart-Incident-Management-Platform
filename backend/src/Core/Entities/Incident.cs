using SIMP.Core.Enums;

namespace SIMP.Core.Entities;

/// <summary>
/// Represents an incident in the system
/// </summary>
public class Incident : BaseEntity
{
    /// <summary>
    /// Human-readable incident number (e.g., INC0001234)
    /// </summary>
    public string IncidentNumber { get; set; } = string.Empty;

    /// <summary>
    /// Short description/title of the incident
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Detailed description of the incident
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Current status of the incident
    /// </summary>
    public IncidentStatus Status { get; set; } = IncidentStatus.New;

    /// <summary>
    /// Priority level of the incident
    /// </summary>
    public IncidentPriority Priority { get; set; } = IncidentPriority.Medium;

    /// <summary>
    /// Impact level (1-3, where 1 is highest)
    /// </summary>
    public int Impact { get; set; } = 2;

    /// <summary>
    /// Urgency level (1-3, where 1 is highest)
    /// </summary>
    public int Urgency { get; set; } = 2;

    /// <summary>
    /// Current SLA breach status
    /// </summary>
    public SLABreachStatus SLAStatus { get; set; } = SLABreachStatus.OnTrack;

    /// <summary>
    /// User who reported the incident
    /// </summary>
    public Guid RequesterId { get; set; }
    public virtual User Requester { get; set; } = null!;

    /// <summary>
    /// User assigned to handle the incident
    /// </summary>
    public Guid? AssignedToId { get; set; }
    public virtual User? AssignedTo { get; set; }

    /// <summary>
    /// Support group assigned to handle the incident
    /// </summary>
    public Guid? SupportGroupId { get; set; }
    public virtual SupportGroup? SupportGroup { get; set; }

    /// <summary>
    /// Category of the incident
    /// </summary>
    public Guid? CategoryId { get; set; }
    public virtual Category? Category { get; set; }

    /// <summary>
    /// Sub-category of the incident
    /// </summary>
    public Guid? SubCategoryId { get; set; }
    public virtual Category? SubCategory { get; set; }

    // SLA tracking properties

    /// <summary>
    /// SLA response deadline
    /// </summary>
    public DateTime? SLAResponseDue { get; set; }

    /// <summary>
    /// SLA resolution deadline
    /// </summary>
    public DateTime? SLAResolutionDue { get; set; }

    /// <summary>
    /// Actual response timestamp
    /// </summary>
    public DateTime? RespondedAt { get; set; }

    /// <summary>
    /// Resolution timestamp
    /// </summary>
    public DateTime? ResolvedAt { get; set; }

    /// <summary>
    /// Closure timestamp
    /// </summary>
    public DateTime? ClosedAt { get; set; }

    /// <summary>
    /// Resolution notes
    /// </summary>
    public string? ResolutionNotes { get; set; }

    /// <summary>
    /// Root cause analysis
    /// </summary>
    public string? RootCause { get; set; }

    /// <summary>
    /// Workaround provided
    /// </summary>
    public string? Workaround { get; set; }

    /// <summary>
    /// Tags for categorization
    /// </summary>
    public List<string> Tags { get; set; } = new();

    /// <summary>
    /// Source channel (email, portal, phone, etc.)
    /// </summary>
    public string Source { get; set; } = "Portal";

    /// <summary>
    /// External reference number (e.g., from other systems)
    /// </summary>
    public string? ExternalReference { get; set; }

    // Navigation properties

    /// <summary>
    /// Comments on this incident
    /// </summary>
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    /// <summary>
    /// Attachments on this incident
    /// </summary>
    public virtual ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();

    /// <summary>
    /// History/audit trail for this incident
    /// </summary>
    public virtual ICollection<IncidentHistory> History { get; set; } = new List<IncidentHistory>();

    /// <summary>
    /// Related incidents
    /// </summary>
    public virtual ICollection<IncidentRelation> RelatedIncidents { get; set; } = new List<IncidentRelation>();
}

using SIMP.Core.Enums;

namespace SIMP.Shared.DTOs;

/// <summary>
/// Incident data transfer object
/// </summary>
public class IncidentDto
{
    public Guid Id { get; set; }
    public string IncidentNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public IncidentStatus Status { get; set; }
    public string StatusDisplay => Status.ToString();
    public IncidentPriority Priority { get; set; }
    public string PriorityDisplay => $"P{(int)Priority} - {Priority}";
    public int Impact { get; set; }
    public int Urgency { get; set; }
    public SLABreachStatus SLAStatus { get; set; }
    public string SLAStatusDisplay => SLAStatus.ToString();

    // Requester info
    public Guid RequesterId { get; set; }
    public string RequesterName { get; set; } = string.Empty;
    public string RequesterEmail { get; set; } = string.Empty;

    // Assignment info
    public Guid? AssignedToId { get; set; }
    public string? AssignedToName { get; set; }
    public Guid? SupportGroupId { get; set; }
    public string? SupportGroupName { get; set; }

    // Category info
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public Guid? SubCategoryId { get; set; }
    public string? SubCategoryName { get; set; }

    // SLA info
    public DateTime? SLAResponseDue { get; set; }
    public DateTime? SLAResolutionDue { get; set; }
    public DateTime? RespondedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public DateTime? ClosedAt { get; set; }

    // Resolution info
    public string? ResolutionNotes { get; set; }
    public string? RootCause { get; set; }
    public string? Workaround { get; set; }

    // Metadata
    public List<string> Tags { get; set; } = new();
    public string Source { get; set; } = string.Empty;
    public string? ExternalReference { get; set; }

    // Audit
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Related counts
    public int CommentCount { get; set; }
    public int AttachmentCount { get; set; }
}

/// <summary>
/// Create incident request
/// </summary>
public class CreateIncidentDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public IncidentPriority Priority { get; set; } = IncidentPriority.Medium;
    public int Impact { get; set; } = 2;
    public int Urgency { get; set; } = 2;
    public Guid? CategoryId { get; set; }
    public Guid? SubCategoryId { get; set; }
    public Guid? AssignToUserId { get; set; }
    public Guid? SupportGroupId { get; set; }
    public List<string>? Tags { get; set; }
    public string Source { get; set; } = "Portal";
    public string? ExternalReference { get; set; }
}

/// <summary>
/// Update incident request
/// </summary>
public class UpdateIncidentDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public IncidentPriority? Priority { get; set; }
    public int? Impact { get; set; }
    public int? Urgency { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? SubCategoryId { get; set; }
    public List<string>? Tags { get; set; }
    public string? ExternalReference { get; set; }
}

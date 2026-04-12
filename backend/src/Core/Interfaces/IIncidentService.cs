using SIMP.Core.Entities;
using SIMP.Core.Enums;
using SIMP.Core.DTOs;

namespace SIMP.Core.Interfaces;

/// <summary>
/// Service interface for incident operations
/// </summary>
public interface IIncidentService
{
    /// <summary>
    /// Get incident by ID
    /// </summary>
    Task<IncidentDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get incident by incident number
    /// </summary>
    Task<IncidentDto?> GetByIncidentNumberAsync(string incidentNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get all incidents with filtering and pagination
    /// </summary>
    Task<PagedResult<IncidentDto>> GetAllAsync(IncidentFilter filter, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a new incident
    /// </summary>
    Task<IncidentDto> CreateAsync(CreateIncidentDto dto, Guid requesterId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Update an incident
    /// </summary>
    Task<IncidentDto> UpdateAsync(Guid id, UpdateIncidentDto dto, Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Assign incident to a user
    /// </summary>
    Task<IncidentDto> AssignAsync(Guid incidentId, Guid? assignToUserId, Guid? supportGroupId, Guid assignedBy, CancellationToken cancellationToken = default);

    /// <summary>
    /// Change incident status
    /// </summary>
    Task<IncidentDto> ChangeStatusAsync(Guid incidentId, IncidentStatus newStatus, string? notes, Guid changedBy, CancellationToken cancellationToken = default);

    /// <summary>
    /// Resolve an incident
    /// </summary>
    Task<IncidentDto> ResolveAsync(Guid incidentId, string resolutionNotes, string? rootCause, Guid resolvedBy, CancellationToken cancellationToken = default);

    /// <summary>
    /// Close an incident
    /// </summary>
    Task<IncidentDto> CloseAsync(Guid incidentId, Guid closedBy, CancellationToken cancellationToken = default);

    /// <summary>
    /// Reopen an incident
    /// </summary>
    Task<IncidentDto> ReopenAsync(Guid incidentId, string reason, Guid reopenedBy, CancellationToken cancellationToken = default);

    /// <summary>
    /// Escalate an incident
    /// </summary>
    Task<IncidentDto> EscalateAsync(Guid incidentId, Guid? escalateToGroupId, string reason, Guid escalatedBy, CancellationToken cancellationToken = default);

    /// <summary>
    /// Add a comment to an incident
    /// </summary>
    Task<CommentDto> AddCommentAsync(Guid incidentId, CreateCommentDto dto, Guid authorId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get incident statistics
    /// </summary>
    Task<IncidentStatistics> GetStatisticsAsync(DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default);
}

/// <summary>
/// Filter criteria for incidents
/// </summary>
public class IncidentFilter
{
    public string? SearchTerm { get; set; }
    public IncidentStatus? Status { get; set; }
    public IncidentPriority? Priority { get; set; }
    public Guid? RequesterId { get; set; }
    public Guid? AssignedToId { get; set; }
    public Guid? SupportGroupId { get; set; }
    public Guid? CategoryId { get; set; }
    public SLABreachStatus? SLAStatus { get; set; }
    public DateTime? CreatedFrom { get; set; }
    public DateTime? CreatedTo { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = true;
}

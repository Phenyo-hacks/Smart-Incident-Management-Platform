using SIMP.Core.Entities;
using SIMP.Core.Enums;

namespace SIMP.Core.Interfaces;

/// <summary>
/// Repository interface for Incident entities with specialized queries
/// </summary>
public interface IIncidentRepository : IRepository<Incident>
{
    /// <summary>
    /// Get incident by incident number
    /// </summary>
    Task<Incident?> GetByIncidentNumberAsync(string incidentNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get incident with all related entities
    /// </summary>
    Task<Incident?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get incidents by requester
    /// </summary>
    Task<IReadOnlyList<Incident>> GetByRequesterAsync(Guid requesterId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get incidents assigned to a user
    /// </summary>
    Task<IReadOnlyList<Incident>> GetByAssignedToAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get incidents by status
    /// </summary>
    Task<IReadOnlyList<Incident>> GetByStatusAsync(IncidentStatus status, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get incidents by support group
    /// </summary>
    Task<IReadOnlyList<Incident>> GetBySupportGroupAsync(Guid supportGroupId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get incidents with SLA breaches
    /// </summary>
    Task<IReadOnlyList<Incident>> GetSLABreachedIncidentsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Get incidents at risk of SLA breach
    /// </summary>
    Task<IReadOnlyList<Incident>> GetSLAAtRiskIncidentsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Get open incidents (not Closed or Cancelled)
    /// </summary>
    Task<IReadOnlyList<Incident>> GetOpenIncidentsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Get next incident number
    /// </summary>
    Task<string> GetNextIncidentNumberAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Search incidents by keyword
    /// </summary>
    Task<IReadOnlyList<Incident>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get incident statistics
    /// </summary>
    Task<IncidentStatistics> GetStatisticsAsync(DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default);
}

/// <summary>
/// Incident statistics DTO
/// </summary>
public class IncidentStatistics
{
    public int TotalCount { get; set; }
    public int OpenCount { get; set; }
    public int ResolvedCount { get; set; }
    public int ClosedCount { get; set; }
    public int SLABreachedCount { get; set; }
    public Dictionary<IncidentPriority, int> ByPriority { get; set; } = new();
    public Dictionary<IncidentStatus, int> ByStatus { get; set; } = new();
    public double AverageResolutionTimeHours { get; set; }
    public double SLACompliancePercent { get; set; }
}

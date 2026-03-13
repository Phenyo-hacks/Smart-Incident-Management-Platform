using SIMP.Core.Entities;
using SIMP.Core.Enums;

namespace SIMP.Core.Interfaces;

/// <summary>
/// Service interface for SLA calculations and monitoring
/// </summary>
public interface ISLAService
{
    /// <summary>
    /// Calculate SLA deadlines for an incident
    /// </summary>
    Task<SLADeadlines> CalculateDeadlinesAsync(Incident incident, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get applicable SLA policy for an incident
    /// </summary>
    Task<SLAPolicy?> GetApplicablePolicyAsync(Incident incident, CancellationToken cancellationToken = default);

    /// <summary>
    /// Update SLA breach status for an incident
    /// </summary>
    Task<SLABreachStatus> UpdateBreachStatusAsync(Incident incident, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get incidents at risk of SLA breach
    /// </summary>
    Task<IReadOnlyList<Incident>> GetAtRiskIncidentsAsync(int warningThresholdMinutes = 30, CancellationToken cancellationToken = default);

    /// <summary>
    /// Calculate time remaining until SLA breach
    /// </summary>
    TimeSpan? GetTimeToResponseBreach(Incident incident);

    /// <summary>
    /// Calculate time remaining until resolution SLA breach
    /// </summary>
    TimeSpan? GetTimeToResolutionBreach(Incident incident);

    /// <summary>
    /// Check if SLA should be paused (e.g., pending status)
    /// </summary>
    bool ShouldPauseSLA(Incident incident);
}

/// <summary>
/// SLA deadline calculations
/// </summary>
public class SLADeadlines
{
    public DateTime? ResponseDue { get; set; }
    public DateTime? ResolutionDue { get; set; }
    public int ResponseTimeMinutes { get; set; }
    public int ResolutionTimeMinutes { get; set; }
    public bool BusinessHoursOnly { get; set; }
}

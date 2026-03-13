namespace SIMP.Core.Enums;

/// <summary>
/// Incident priority levels with associated SLA targets.
/// Based on business impact and urgency matrix.
/// </summary>
public enum IncidentPriority
{
    /// <summary>
    /// P1 - Critical: Business-critical system down
    /// Response: 15 min, Resolution: 4 hours
    /// </summary>
    Critical = 1,

    /// <summary>
    /// P2 - High: Major feature impaired, workaround may exist
    /// Response: 30 min, Resolution: 8 hours
    /// </summary>
    High = 2,

    /// <summary>
    /// P3 - Medium: Minor impact, user can continue working
    /// Response: 4 hours, Resolution: 24 hours
    /// </summary>
    Medium = 3,

    /// <summary>
    /// P4 - Low: Minimal impact, cosmetic or enhancement
    /// Response: 8 hours, Resolution: 72 hours
    /// </summary>
    Low = 4
}

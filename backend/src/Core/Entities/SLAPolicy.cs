using SIMP.Core.Enums;

namespace SIMP.Core.Entities;

/// <summary>
/// Represents an SLA policy configuration
/// </summary>
public class SLAPolicy : BaseEntity
{
    /// <summary>
    /// Policy name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Policy description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Priority this policy applies to
    /// </summary>
    public IncidentPriority Priority { get; set; }

    /// <summary>
    /// Response time target in minutes
    /// </summary>
    public int ResponseTimeMinutes { get; set; }

    /// <summary>
    /// Resolution time target in minutes
    /// </summary>
    public int ResolutionTimeMinutes { get; set; }

    /// <summary>
    /// Warning threshold percentage (e.g., 80 = warn at 80% of SLA time)
    /// </summary>
    public int WarningThresholdPercent { get; set; } = 80;

    /// <summary>
    /// Whether this policy is active
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Whether to pause SLA during pending status
    /// </summary>
    public bool PauseOnPending { get; set; } = true;

    /// <summary>
    /// Whether to only count business hours
    /// </summary>
    public bool BusinessHoursOnly { get; set; } = true;

    /// <summary>
    /// Category this policy applies to (null for default)
    /// </summary>
    public Guid? CategoryId { get; set; }
    public virtual Category? Category { get; set; }

    /// <summary>
    /// Support group this policy applies to (null for all)
    /// </summary>
    public Guid? SupportGroupId { get; set; }
    public virtual SupportGroup? SupportGroup { get; set; }

    /// <summary>
    /// Priority order when multiple policies match
    /// </summary>
    public int PolicyOrder { get; set; }
}

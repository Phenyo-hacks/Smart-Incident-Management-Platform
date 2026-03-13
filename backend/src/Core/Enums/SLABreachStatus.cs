namespace SIMP.Core.Enums;

/// <summary>
/// SLA compliance status for incidents.
/// </summary>
public enum SLABreachStatus
{
    /// <summary>
    /// Within SLA targets - no breach
    /// </summary>
    OnTrack = 0,

    /// <summary>
    /// Response time SLA has been breached
    /// </summary>
    ResponseBreached = 1,

    /// <summary>
    /// Resolution time SLA has been breached
    /// </summary>
    ResolutionBreached = 2,

    /// <summary>
    /// Both response and resolution SLAs breached
    /// </summary>
    FullyBreached = 3,

    /// <summary>
    /// SLA is at risk of being breached (within warning threshold)
    /// </summary>
    AtRisk = 4,

    /// <summary>
    /// SLA is paused (pending status)
    /// </summary>
    Paused = 5
}

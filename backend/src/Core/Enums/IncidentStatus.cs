namespace SIMP.Core.Enums;

/// <summary>
/// Represents the current status of an incident in the system.
/// Follows ITIL-aligned incident lifecycle states.
/// </summary>
public enum IncidentStatus
{
    /// <summary>
    /// Initial state when incident is first created
    /// </summary>
    New = 0,

    /// <summary>
    /// Incident has been assigned to an agent or support group
    /// </summary>
    Assigned = 1,

    /// <summary>
    /// Agent is actively working on the incident
    /// </summary>
    InProgress = 2,

    /// <summary>
    /// Waiting for external input (user, vendor, etc.)
    /// </summary>
    Pending = 3,

    /// <summary>
    /// Technical resolution has been applied
    /// </summary>
    Resolved = 4,

    /// <summary>
    /// Incident is fully closed and archived
    /// </summary>
    Closed = 5,

    /// <summary>
    /// Previously resolved incident has been reopened
    /// </summary>
    Reopened = 6,

    /// <summary>
    /// Incident has been escalated to higher tier support
    /// </summary>
    Escalated = 7,

    /// <summary>
    /// Incident is on hold pending change implementation
    /// </summary>
    OnHold = 8,

    /// <summary>
    /// Incident was cancelled (duplicate, invalid, etc.)
    /// </summary>
    Cancelled = 9
}

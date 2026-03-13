namespace SIMP.Core.Enums;

/// <summary>
/// Represents the escalation level of an incident
/// </summary>
public enum EscalationLevel
{
    /// <summary>No escalation - handled by first-line support</summary>
    None = 0,

    /// <summary>Tier 1 - First level escalation</summary>
    Tier1 = 1,

    /// <summary>Tier 2 - Second level escalation (specialist)</summary>
    Tier2 = 2,

    /// <summary>Tier 3 - Third level escalation (expert/engineering)</summary>
    Tier3 = 3,

    /// <summary>Management escalation</summary>
    Management = 4
}

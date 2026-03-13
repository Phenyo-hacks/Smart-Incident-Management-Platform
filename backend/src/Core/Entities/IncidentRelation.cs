namespace SIMP.Core.Entities;

/// <summary>
/// Represents a relationship between incidents
/// </summary>
public class IncidentRelation : BaseEntity
{
    /// <summary>
    /// Source incident ID
    /// </summary>
    public Guid SourceIncidentId { get; set; }
    public virtual Incident SourceIncident { get; set; } = null!;

    /// <summary>
    /// Target incident ID
    /// </summary>
    public Guid TargetIncidentId { get; set; }
    public virtual Incident TargetIncident { get; set; } = null!;

    /// <summary>
    /// Type of relationship (Duplicate, Related, ParentChild, etc.)
    /// </summary>
    public string RelationType { get; set; } = "Related";

    /// <summary>
    /// Description of the relationship
    /// </summary>
    public string? Description { get; set; }
}

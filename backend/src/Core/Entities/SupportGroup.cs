namespace SIMP.Core.Entities;

/// <summary>
/// Represents a support group/team
/// </summary>
public class SupportGroup : BaseEntity
{
    /// <summary>
    /// Group name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Group description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Group email address
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Team lead user ID
    /// </summary>
    public Guid? TeamLeadId { get; set; }
    public virtual User? TeamLead { get; set; }

    /// <summary>
    /// Whether this group is active
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Support tier level (1, 2, 3)
    /// </summary>
    public int TierLevel { get; set; } = 1;

    /// <summary>
    /// Skills/specializations of this group
    /// </summary>
    public List<string> Skills { get; set; } = new();

    /// <summary>
    /// Business hours start (24h format, e.g., "09:00")
    /// </summary>
    public string? BusinessHoursStart { get; set; }

    /// <summary>
    /// Business hours end (24h format, e.g., "17:00")
    /// </summary>
    public string? BusinessHoursEnd { get; set; }

    /// <summary>
    /// Timezone for business hours
    /// </summary>
    public string TimeZone { get; set; } = "UTC";

    /// <summary>
    /// Working days (0=Sunday, 6=Saturday)
    /// </summary>
    public List<int> WorkingDays { get; set; } = new() { 1, 2, 3, 4, 5 };

    /// <summary>
    /// Members of this support group
    /// </summary>
    public virtual ICollection<User> Members { get; set; } = new List<User>();

    /// <summary>
    /// Incidents assigned to this group
    /// </summary>
    public virtual ICollection<Incident> Incidents { get; set; } = new List<Incident>();

    /// <summary>
    /// Categories this group handles by default
    /// </summary>
    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();
}

namespace SIMP.Core.Entities;

/// <summary>
/// Represents an incident category or subcategory
/// </summary>
public class Category : BaseEntity
{
    /// <summary>
    /// Category name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Category description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Parent category ID (null for top-level categories)
    /// </summary>
    public Guid? ParentCategoryId { get; set; }
    public virtual Category? ParentCategory { get; set; }

    /// <summary>
    /// Child categories
    /// </summary>
    public virtual ICollection<Category> SubCategories { get; set; } = new List<Category>();

    /// <summary>
    /// Whether this category is active
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Display order
    /// </summary>
    public int SortOrder { get; set; }

    /// <summary>
    /// Icon name for UI display
    /// </summary>
    public string? IconName { get; set; }

    /// <summary>
    /// Color code for UI display
    /// </summary>
    public string? ColorCode { get; set; }

    // SLA settings for this category

    /// <summary>
    /// Default response time in minutes for this category
    /// </summary>
    public int? DefaultResponseTimeMinutes { get; set; }

    /// <summary>
    /// Default resolution time in minutes for this category
    /// </summary>
    public int? DefaultResolutionTimeMinutes { get; set; }

    /// <summary>
    /// Default support group for this category
    /// </summary>
    public Guid? DefaultSupportGroupId { get; set; }
    public virtual SupportGroup? DefaultSupportGroup { get; set; }

    /// <summary>
    /// Incidents in this category
    /// </summary>
    public virtual ICollection<Incident> Incidents { get; set; } = new List<Incident>();
}

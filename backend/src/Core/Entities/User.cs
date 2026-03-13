using SIMP.Core.Enums;

namespace SIMP.Core.Entities;

/// <summary>
/// Represents a user in the system
/// </summary>
public class User : BaseEntity
{
    /// <summary>
    /// Azure AD Object ID for SSO integration
    /// </summary>
    public string? AzureAdObjectId { get; set; }

    /// <summary>
    /// User's email address (unique)
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// User's first name
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// User's last name
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// User's display name
    /// </summary>
    public string DisplayName => $"{FirstName} {LastName}".Trim();

    /// <summary>
    /// User's phone number
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// User's job title
    /// </summary>
    public string? JobTitle { get; set; }

    /// <summary>
    /// User's department
    /// </summary>
    public string? Department { get; set; }

    /// <summary>
    /// User's office location
    /// </summary>
    public string? Location { get; set; }

    /// <summary>
    /// User's timezone (IANA format)
    /// </summary>
    public string TimeZone { get; set; } = "UTC";

    /// <summary>
    /// User role in the system
    /// </summary>
    public UserRole Role { get; set; } = UserRole.Requester;

    /// <summary>
    /// Type of user account
    /// </summary>
    public UserType UserType { get; set; } = UserType.Requester;

    /// <summary>
    /// Whether the user account is active
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Last login timestamp
    /// </summary>
    public DateTime? LastLoginAt { get; set; }

    /// <summary>
    /// Profile picture URL
    /// </summary>
    public string? AvatarUrl { get; set; }

    /// <summary>
    /// User's preferred language (ISO 639-1)
    /// </summary>
    public string PreferredLanguage { get; set; } = "en";

    // Navigation properties

    /// <summary>
    /// Support group the user belongs to (for agents)
    /// </summary>
    public Guid? SupportGroupId { get; set; }
    public virtual SupportGroup? SupportGroup { get; set; }

    /// <summary>
    /// Incidents created by this user
    /// </summary>
    public virtual ICollection<Incident> CreatedIncidents { get; set; } = new List<Incident>();

    /// <summary>
    /// Incidents assigned to this user
    /// </summary>
    public virtual ICollection<Incident> AssignedIncidents { get; set; } = new List<Incident>();

    /// <summary>
    /// Comments made by this user
    /// </summary>
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
}

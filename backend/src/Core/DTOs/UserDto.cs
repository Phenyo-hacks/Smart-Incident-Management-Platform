using SIMP.Core.Enums;

namespace SIMP.Core.DTOs;

/// <summary>
/// User data transfer object
/// </summary>
public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? JobTitle { get; set; }
    public string? Department { get; set; }
    public string? Location { get; set; }
    public UserRole Role { get; set; }
    public UserType UserType { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string? AvatarUrl { get; set; }
    public Guid? SupportGroupId { get; set; }
    public string? SupportGroupName { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Create user request
/// </summary>
public class CreateUserDto
{
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? JobTitle { get; set; }
    public string? Department { get; set; }
    public string? Location { get; set; }
    public UserRole Role { get; set; } = UserRole.Requester;
    public UserType UserType { get; set; } = UserType.Requester;
    public Guid? SupportGroupId { get; set; }
    public string? TimeZone { get; set; }
    public string? PreferredLanguage { get; set; }
}

/// <summary>
/// Update user request
/// </summary>
public class UpdateUserDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? JobTitle { get; set; }
    public string? Department { get; set; }
    public string? Location { get; set; }
    public UserRole? Role { get; set; }
    public Guid? SupportGroupId { get; set; }
    public bool? IsActive { get; set; }
    public string? TimeZone { get; set; }
    public string? PreferredLanguage { get; set; }
}

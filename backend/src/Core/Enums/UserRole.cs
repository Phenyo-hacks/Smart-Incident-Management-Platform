namespace SIMP.Core.Enums;

/// <summary>
/// System user roles with hierarchical permissions.
/// </summary>
[Flags]
public enum UserRole
{
    /// <summary>
    /// No role assigned
    /// </summary>
    None = 0,

    /// <summary>
    /// End user who can create and view their own incidents
    /// </summary>
    Requester = 1,

    /// <summary>
    /// Support agent who can manage assigned incidents
    /// </summary>
    Agent = 2,

    /// <summary>
    /// Senior agent with escalation privileges
    /// </summary>
    SeniorAgent = 4,

    /// <summary>
    /// Team lead who can manage support groups
    /// </summary>
    TeamLead = 8,

    /// <summary>
    /// System administrator with full access
    /// </summary>
    Admin = 16,

    /// <summary>
    /// Super admin with configuration access
    /// </summary>
    SuperAdmin = 32
}

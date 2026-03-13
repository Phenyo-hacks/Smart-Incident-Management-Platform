namespace SIMP.Core.Enums;

/// <summary>
/// Type of user account in the system.
/// </summary>
public enum UserType
{
    /// <summary>
    /// End user/requester who submits incidents
    /// </summary>
    Requester = 0,

    /// <summary>
    /// IT support agent who handles incidents
    /// </summary>
    Agent = 1,

    /// <summary>
    /// System administrator
    /// </summary>
    Admin = 2,

    /// <summary>
    /// External contractor or vendor
    /// </summary>
    External = 3,

    /// <summary>
    /// Service account for integrations
    /// </summary>
    Service = 4
}

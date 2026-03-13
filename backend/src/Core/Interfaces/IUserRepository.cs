using SIMP.Core.Entities;
using SIMP.Core.Enums;

namespace SIMP.Core.Interfaces;

/// <summary>
/// Repository interface for User entities with specialized queries
/// </summary>
public interface IUserRepository : IRepository<User>
{
    /// <summary>
    /// Get user by email
    /// </summary>
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get user by Azure AD Object ID
    /// </summary>
    Task<User?> GetByAzureAdObjectIdAsync(string objectId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get users by role
    /// </summary>
    Task<IReadOnlyList<User>> GetByRoleAsync(UserRole role, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get users by support group
    /// </summary>
    Task<IReadOnlyList<User>> GetBySupportGroupAsync(Guid supportGroupId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get active agents
    /// </summary>
    Task<IReadOnlyList<User>> GetActiveAgentsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Search users by name or email
    /// </summary>
    Task<IReadOnlyList<User>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if email is unique
    /// </summary>
    Task<bool> IsEmailUniqueAsync(string email, Guid? excludeUserId = null, CancellationToken cancellationToken = default);
}

using Microsoft.EntityFrameworkCore;
using SIMP.Core.Entities;
using SIMP.Core.Enums;
using SIMP.Core.Interfaces;

namespace SIMP.Infrastructure.Data.Repositories;

/// <summary>
/// User repository implementation
/// </summary>
public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(u => u.SupportGroup)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower(), cancellationToken);
    }

    public async Task<User?> GetByAzureAdObjectIdAsync(string objectId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(u => u.SupportGroup)
            .FirstOrDefaultAsync(u => u.AzureAdObjectId == objectId, cancellationToken);
    }

    public async Task<IReadOnlyList<User>> GetByRoleAsync(UserRole role, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(u => u.Role.HasFlag(role) && u.IsActive)
            .OrderBy(u => u.FirstName)
            .ThenBy(u => u.LastName)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<User>> GetBySupportGroupAsync(Guid supportGroupId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(u => u.SupportGroupId == supportGroupId && u.IsActive)
            .OrderBy(u => u.FirstName)
            .ThenBy(u => u.LastName)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<User>> GetActiveAgentsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(u => u.SupportGroup)
            .Where(u => (u.Role.HasFlag(UserRole.Agent) || u.Role.HasFlag(UserRole.SeniorAgent)) && u.IsActive)
            .OrderBy(u => u.FirstName)
            .ThenBy(u => u.LastName)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<User>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        var term = searchTerm.ToLower();
        return await _dbSet
            .Where(u => u.Email.ToLower().Contains(term) ||
                        u.FirstName.ToLower().Contains(term) ||
                        u.LastName.ToLower().Contains(term))
            .OrderBy(u => u.FirstName)
            .ThenBy(u => u.LastName)
            .Take(50)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> IsEmailUniqueAsync(string email, Guid? excludeUserId = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(u => u.Email.ToLower() == email.ToLower());
        if (excludeUserId.HasValue)
        {
            query = query.Where(u => u.Id != excludeUserId.Value);
        }
        return !await query.AnyAsync(cancellationToken);
    }
}

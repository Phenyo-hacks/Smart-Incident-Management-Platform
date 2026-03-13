using SIMP.Core.Entities;

namespace SIMP.Core.Interfaces;

/// <summary>
/// Unit of Work pattern interface for transaction management
/// </summary>
public interface IUnitOfWork : IDisposable
{
    /// <summary>
    /// Incident repository
    /// </summary>
    IIncidentRepository Incidents { get; }

    /// <summary>
    /// User repository
    /// </summary>
    IUserRepository Users { get; }

    /// <summary>
    /// Comment repository
    /// </summary>
    IRepository<Comment> Comments { get; }

    /// <summary>
    /// Attachment repository
    /// </summary>
    IRepository<Attachment> Attachments { get; }

    /// <summary>
    /// Category repository
    /// </summary>
    IRepository<Category> Categories { get; }

    /// <summary>
    /// Support group repository
    /// </summary>
    IRepository<SupportGroup> SupportGroups { get; }

    /// <summary>
    /// Notification repository
    /// </summary>
    IRepository<Notification> Notifications { get; }

    /// <summary>
    /// SLA Policy repository
    /// </summary>
    IRepository<SLAPolicy> SLAPolicies { get; }

    /// <summary>
    /// Incident history repository
    /// </summary>
    IRepository<IncidentHistory> IncidentHistories { get; }

    /// <summary>
    /// Save all changes to the database
    /// </summary>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Begin a transaction
    /// </summary>
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Commit the current transaction
    /// </summary>
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Rollback the current transaction
    /// </summary>
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}

using Microsoft.EntityFrameworkCore.Storage;
using SIMP.Core.Entities;
using SIMP.Core.Interfaces;
using SIMP.Infrastructure.Data.Repositories;

namespace SIMP.Infrastructure.Data;

/// <summary>
/// Unit of Work implementation
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _transaction;

    private IIncidentRepository? _incidents;
    private IUserRepository? _users;
    private IRepository<Comment>? _comments;
    private IRepository<Attachment>? _attachments;
    private IRepository<Category>? _categories;
    private IRepository<SupportGroup>? _supportGroups;
    private IRepository<Notification>? _notifications;
    private IRepository<SLAPolicy>? _slaPolicies;
    private IRepository<IncidentHistory>? _incidentHistories;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public IIncidentRepository Incidents => _incidents ??= new IncidentRepository(_context);
    public IUserRepository Users => _users ??= new UserRepository(_context);
    public IRepository<Comment> Comments => _comments ??= new Repository<Comment>(_context);
    public IRepository<Attachment> Attachments => _attachments ??= new Repository<Attachment>(_context);
    public IRepository<Category> Categories => _categories ??= new Repository<Category>(_context);
    public IRepository<SupportGroup> SupportGroups => _supportGroups ??= new Repository<SupportGroup>(_context);
    public IRepository<Notification> Notifications => _notifications ??= new Repository<Notification>(_context);
    public IRepository<SLAPolicy> SLAPolicies => _slaPolicies ??= new Repository<SLAPolicy>(_context);
    public IRepository<IncidentHistory> IncidentHistories => _incidentHistories ??= new Repository<IncidentHistory>(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}

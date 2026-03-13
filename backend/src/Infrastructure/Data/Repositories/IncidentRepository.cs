using Microsoft.EntityFrameworkCore;
using SIMP.Core.Entities;
using SIMP.Core.Enums;
using SIMP.Core.Interfaces;

namespace SIMP.Infrastructure.Data.Repositories;

/// <summary>
/// Incident repository implementation
/// </summary>
public class IncidentRepository : Repository<Incident>, IIncidentRepository
{
    public IncidentRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Incident?> GetByIncidentNumberAsync(string incidentNumber, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(i => i.Requester)
            .Include(i => i.AssignedTo)
            .Include(i => i.Category)
            .FirstOrDefaultAsync(i => i.IncidentNumber == incidentNumber, cancellationToken);
    }

    public async Task<Incident?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(i => i.Requester)
            .Include(i => i.AssignedTo)
            .Include(i => i.SupportGroup)
            .Include(i => i.Category)
            .Include(i => i.SubCategory)
            .Include(i => i.Comments.OrderByDescending(c => c.CreatedAt))
                .ThenInclude(c => c.Author)
            .Include(i => i.Attachments)
            .Include(i => i.History.OrderByDescending(h => h.CreatedAt).Take(50))
            .AsSplitQuery()
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Incident>> GetByRequesterAsync(Guid requesterId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(i => i.AssignedTo)
            .Where(i => i.RequesterId == requesterId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Incident>> GetByAssignedToAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(i => i.Requester)
            .Where(i => i.AssignedToId == userId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Incident>> GetByStatusAsync(IncidentStatus status, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(i => i.Requester)
            .Include(i => i.AssignedTo)
            .Where(i => i.Status == status)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Incident>> GetBySupportGroupAsync(Guid supportGroupId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(i => i.Requester)
            .Include(i => i.AssignedTo)
            .Where(i => i.SupportGroupId == supportGroupId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Incident>> GetSLABreachedIncidentsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(i => i.Requester)
            .Include(i => i.AssignedTo)
            .Where(i => i.SLAStatus == SLABreachStatus.ResponseBreached ||
                        i.SLAStatus == SLABreachStatus.ResolutionBreached ||
                        i.SLAStatus == SLABreachStatus.FullyBreached)
            .OrderByDescending(i => i.Priority)
            .ThenBy(i => i.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Incident>> GetSLAAtRiskIncidentsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(i => i.Requester)
            .Include(i => i.AssignedTo)
            .Where(i => i.SLAStatus == SLABreachStatus.AtRisk)
            .OrderByDescending(i => i.Priority)
            .ThenBy(i => i.SLAResolutionDue)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Incident>> GetOpenIncidentsAsync(CancellationToken cancellationToken = default)
    {
        var closedStatuses = new[] { IncidentStatus.Closed, IncidentStatus.Cancelled };
        return await _dbSet
            .Include(i => i.Requester)
            .Include(i => i.AssignedTo)
            .Where(i => !closedStatuses.Contains(i.Status))
            .OrderByDescending(i => i.Priority)
            .ThenByDescending(i => i.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<string> GetNextIncidentNumberAsync(CancellationToken cancellationToken = default)
    {
        var lastIncident = await _dbSet
            .OrderByDescending(i => i.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        int nextNumber = 1;
        if (lastIncident != null && lastIncident.IncidentNumber.StartsWith("INC"))
        {
            if (int.TryParse(lastIncident.IncidentNumber[3..], out int lastNumber))
            {
                nextNumber = lastNumber + 1;
            }
        }

        return $"INC{nextNumber:D7}";
    }

    public async Task<IReadOnlyList<Incident>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        var term = searchTerm.ToLower();
        return await _dbSet
            .Include(i => i.Requester)
            .Include(i => i.AssignedTo)
            .Where(i => i.IncidentNumber.ToLower().Contains(term) ||
                        i.Title.ToLower().Contains(term) ||
                        i.Description.ToLower().Contains(term))
            .OrderByDescending(i => i.CreatedAt)
            .Take(50)
            .ToListAsync(cancellationToken);
    }

    public async Task<IncidentStatistics> GetStatisticsAsync(DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsQueryable();

        if (fromDate.HasValue)
            query = query.Where(i => i.CreatedAt >= fromDate.Value);
        if (toDate.HasValue)
            query = query.Where(i => i.CreatedAt <= toDate.Value);

        var incidents = await query.ToListAsync(cancellationToken);
        var closedStatuses = new[] { IncidentStatus.Closed, IncidentStatus.Cancelled };

        var stats = new IncidentStatistics
        {
            TotalCount = incidents.Count,
            OpenCount = incidents.Count(i => !closedStatuses.Contains(i.Status)),
            ResolvedCount = incidents.Count(i => i.Status == IncidentStatus.Resolved),
            ClosedCount = incidents.Count(i => i.Status == IncidentStatus.Closed),
            SLABreachedCount = incidents.Count(i => i.SLAStatus != SLABreachStatus.OnTrack && i.SLAStatus != SLABreachStatus.Paused),
            ByPriority = incidents.GroupBy(i => i.Priority).ToDictionary(g => g.Key, g => g.Count()),
            ByStatus = incidents.GroupBy(i => i.Status).ToDictionary(g => g.Key, g => g.Count())
        };

        var resolvedIncidents = incidents.Where(i => i.ResolvedAt.HasValue).ToList();
        if (resolvedIncidents.Any())
        {
            stats.AverageResolutionTimeHours = resolvedIncidents
                .Average(i => (i.ResolvedAt!.Value - i.CreatedAt).TotalHours);
        }

        if (incidents.Any())
        {
            stats.SLACompliancePercent = 100.0 * (incidents.Count - stats.SLABreachedCount) / incidents.Count;
        }

        return stats;
    }
}

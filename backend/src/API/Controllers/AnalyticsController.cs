using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIMP.Core.Interfaces;
using SIMP.Core.DTOs;

namespace SIMP.API.Controllers;

/// <summary>
/// Analytics and reporting endpoints
/// </summary>
[Authorize]
public class AnalyticsController : BaseApiController
{
    private readonly IIncidentService _incidentService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AnalyticsController> _logger;

    public AnalyticsController(
        IIncidentService incidentService,
        IUnitOfWork unitOfWork,
        ILogger<AnalyticsController> logger)
    {
        _incidentService = incidentService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Get dashboard summary
    /// </summary>
    [HttpGet("dashboard")]
    [ProducesResponseType(typeof(ApiResponse<DashboardSummary>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<DashboardSummary>>> GetDashboard(CancellationToken cancellationToken = default)
    {
        var stats = await _incidentService.GetStatisticsAsync(
            DateTime.UtcNow.AddDays(-30),
            DateTime.UtcNow,
            cancellationToken);

        var summary = new DashboardSummary
        {
            TotalIncidents = stats.TotalCount,
            OpenIncidents = stats.OpenCount,
            ResolvedIncidents = stats.ResolvedCount,
            SLABreachedIncidents = stats.SLABreachedCount,
            AverageResolutionTimeHours = Math.Round(stats.AverageResolutionTimeHours, 1),
            SLACompliancePercent = Math.Round(stats.SLACompliancePercent, 1),
            IncidentsByPriority = stats.ByPriority.ToDictionary(
                kvp => kvp.Key.ToString(),
                kvp => kvp.Value),
            IncidentsByStatus = stats.ByStatus.ToDictionary(
                kvp => kvp.Key.ToString(),
                kvp => kvp.Value)
        };

        return Success(summary);
    }

    /// <summary>
    /// Get SLA metrics
    /// </summary>
    [HttpGet("sla")]
    [ProducesResponseType(typeof(ApiResponse<SLAMetrics>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<SLAMetrics>>> GetSLAMetrics(
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        CancellationToken cancellationToken = default)
    {
        var from = fromDate ?? DateTime.UtcNow.AddDays(-30);
        var to = toDate ?? DateTime.UtcNow;

        var stats = await _incidentService.GetStatisticsAsync(from, to, cancellationToken);

        var metrics = new SLAMetrics
        {
            Period = new DateRange { From = from, To = to },
            TotalIncidents = stats.TotalCount,
            OnTrackCount = stats.TotalCount - stats.SLABreachedCount,
            BreachedCount = stats.SLABreachedCount,
            CompliancePercent = Math.Round(stats.SLACompliancePercent, 1),
            AverageResponseTimeMinutes = 0, // TODO: Implement
            AverageResolutionTimeMinutes = Math.Round(stats.AverageResolutionTimeHours * 60, 0)
        };

        return Success(metrics);
    }

    /// <summary>
    /// Get agent performance metrics
    /// </summary>
    [HttpGet("agents/performance")]
    [Authorize(Roles = "Admin,TeamLead")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<AgentPerformance>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<AgentPerformance>>>> GetAgentPerformance(
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        CancellationToken cancellationToken = default)
    {
        var agents = await _unitOfWork.Users.GetActiveAgentsAsync(cancellationToken);

        // TODO: Implement actual performance metrics calculation
        var performance = agents.Select(a => new AgentPerformance
        {
            AgentId = a.Id,
            AgentName = a.DisplayName,
            AssignedCount = 0,
            ResolvedCount = 0,
            AverageResolutionTimeHours = 0,
            SLACompliancePercent = 100,
            CustomerSatisfactionScore = 0
        }).ToList();

        return Success<IReadOnlyList<AgentPerformance>>(performance);
    }

    /// <summary>
    /// Get incident trends
    /// </summary>
    [HttpGet("trends")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<TrendDataPoint>>), StatusCodes.Status200OK)]
    public ActionResult<ApiResponse<IReadOnlyList<TrendDataPoint>>> GetTrends(  
        [FromQuery] string period = "daily",
        [FromQuery] int days = 30,
        CancellationToken cancellationToken = default)
    {
        // TODO: Implement actual trend calculation
        var trends = new List<TrendDataPoint>();
        var startDate = DateTime.UtcNow.AddDays(-days);

        for (int i = 0; i <= days; i++)
        {
            trends.Add(new TrendDataPoint
            {
                Date = startDate.AddDays(i),
                Created = 0,
                Resolved = 0,
                Closed = 0
            });
        }

        return Success<IReadOnlyList<TrendDataPoint>>(trends);
    }
}

// Analytics DTOs (consider moving to SIMP.Core.DTOs later)
public class DashboardSummary
{
    public int TotalIncidents { get; set; }
    public int OpenIncidents { get; set; }
    public int ResolvedIncidents { get; set; }
    public int SLABreachedIncidents { get; set; }
    public double AverageResolutionTimeHours { get; set; }
    public double SLACompliancePercent { get; set; }
    public Dictionary<string, int> IncidentsByPriority { get; set; } = new();
    public Dictionary<string, int> IncidentsByStatus { get; set; } = new();
}

public class SLAMetrics
{
    public DateRange Period { get; set; } = new();
    public int TotalIncidents { get; set; }
    public int OnTrackCount { get; set; }
    public int BreachedCount { get; set; }
    public double CompliancePercent { get; set; }
    public double AverageResponseTimeMinutes { get; set; }
    public double AverageResolutionTimeMinutes { get; set; }
}

public class DateRange
{
    public DateTime From { get; set; }
    public DateTime To { get; set; }
}

public class AgentPerformance
{
    public Guid AgentId { get; set; }
    public string AgentName { get; set; } = string.Empty;
    public int AssignedCount { get; set; }
    public int ResolvedCount { get; set; }
    public double AverageResolutionTimeHours { get; set; }
    public double SLACompliancePercent { get; set; }
    public double CustomerSatisfactionScore { get; set; }
}

public class TrendDataPoint
{
    public DateTime Date { get; set; }
    public int Created { get; set; }
    public int Resolved { get; set; }
    public int Closed { get; set; }
}
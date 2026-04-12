using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIMP.Core.Enums;
using SIMP.Core.Interfaces;
using SIMP.Core.DTOs;

namespace SIMP.API.Controllers;

/// <summary>
/// Incidents management endpoints
/// </summary>
[Authorize]
public class IncidentsController : BaseApiController
{
    private readonly IIncidentService _incidentService;
    private readonly ILogger<IncidentsController> _logger;

    public IncidentsController(
        IIncidentService incidentService,
        ILogger<IncidentsController> logger)
    {
        _incidentService = incidentService;
        _logger = logger;
    }

    /// <summary>
    /// Get all incidents with filtering and pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<IncidentDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PagedResult<IncidentDto>>>> GetAll(
        [FromQuery] IncidentFilter filter,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _incidentService.GetAllAsync(filter, page, pageSize, cancellationToken);
        return Success(result);
    }

    /// <summary>
    /// Get incident by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<IncidentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<IncidentDto>>> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        var incident = await _incidentService.GetByIdAsync(id, cancellationToken);
        if (incident == null)
            return NotFoundResponse<IncidentDto>("Incident not found");

        return Success(incident);
    }

    /// <summary>
    /// Get incident by incident number
    /// </summary>
    [HttpGet("number/{incidentNumber}")]
    [ProducesResponseType(typeof(ApiResponse<IncidentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<IncidentDto>>> GetByNumber(string incidentNumber, CancellationToken cancellationToken = default)
    {
        var incident = await _incidentService.GetByIncidentNumberAsync(incidentNumber, cancellationToken);
        if (incident == null)
            return NotFoundResponse<IncidentDto>("Incident not found");

        return Success(incident);
    }

    /// <summary>
    /// Create a new incident
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<IncidentDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<IncidentDto>>> Create(
        [FromBody] CreateIncidentDto dto,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentService.CreateAsync(dto, CurrentUserId, cancellationToken);
        _logger.LogInformation("Incident {IncidentNumber} created by user {UserId}", incident.IncidentNumber, CurrentUserId);
        
        return CreatedAtAction(
            nameof(GetById),
            new { id = incident.Id },
            ApiResponse<IncidentDto>.Ok(incident, "Incident created successfully"));
    }

    /// <summary>
    /// Update an incident
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<IncidentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<IncidentDto>>> Update(
        Guid id,
        [FromBody] UpdateIncidentDto dto,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentService.UpdateAsync(id, dto, CurrentUserId, cancellationToken);
        return Success(incident, "Incident updated successfully");
    }

    /// <summary>
    /// Assign incident to a user or support group
    /// </summary>
    [HttpPost("{id:guid}/assign")]
    [ProducesResponseType(typeof(ApiResponse<IncidentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IncidentDto>>> Assign(
        Guid id,
        [FromBody] AssignIncidentRequest request,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentService.AssignAsync(
            id, request.AssignToUserId, request.SupportGroupId, CurrentUserId, cancellationToken);
        return Success(incident, "Incident assigned successfully");
    }

    /// <summary>
    /// Change incident status
    /// </summary>
    [HttpPost("{id:guid}/status")]
    [ProducesResponseType(typeof(ApiResponse<IncidentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IncidentDto>>> ChangeStatus(
        Guid id,
        [FromBody] ChangeStatusRequest request,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentService.ChangeStatusAsync(
            id, request.Status, request.Notes, CurrentUserId, cancellationToken);
        return Success(incident, $"Status changed to {request.Status}");
    }

    /// <summary>
    /// Resolve an incident
    /// </summary>
    [HttpPost("{id:guid}/resolve")]
    [ProducesResponseType(typeof(ApiResponse<IncidentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IncidentDto>>> Resolve(
        Guid id,
        [FromBody] ResolveIncidentRequest request,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentService.ResolveAsync(
            id, request.ResolutionNotes, request.RootCause, CurrentUserId, cancellationToken);
        return Success(incident, "Incident resolved");
    }

    /// <summary>
    /// Close an incident
    /// </summary>
    [HttpPost("{id:guid}/close")]
    [ProducesResponseType(typeof(ApiResponse<IncidentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IncidentDto>>> Close(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentService.CloseAsync(id, CurrentUserId, cancellationToken);
        return Success(incident, "Incident closed");
    }

    /// <summary>
    /// Reopen an incident
    /// </summary>
    [HttpPost("{id:guid}/reopen")]
    [ProducesResponseType(typeof(ApiResponse<IncidentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IncidentDto>>> Reopen(
        Guid id,
        [FromBody] ReopenIncidentRequest request,
        CancellationToken cancellationToken = default)
    {
        var incident = await _incidentService.ReopenAsync(id, request.Reason, CurrentUserId, cancellationToken);
        return Success(incident, "Incident reopened");
    }

    /// <summary>
    /// Add a comment to an incident
    /// </summary>
    [HttpPost("{id:guid}/comments")]
    [ProducesResponseType(typeof(ApiResponse<CommentDto>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<CommentDto>>> AddComment(
        Guid id,
        [FromBody] CreateCommentDto dto,
        CancellationToken cancellationToken = default)
    {
        var comment = await _incidentService.AddCommentAsync(id, dto, CurrentUserId, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, ApiResponse<CommentDto>.Ok(comment));
    }

    /// <summary>
    /// Get incident statistics
    /// </summary>
    [HttpGet("statistics")]
    [ProducesResponseType(typeof(ApiResponse<IncidentStatistics>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IncidentStatistics>>> GetStatistics(
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        CancellationToken cancellationToken = default)
    {
        var stats = await _incidentService.GetStatisticsAsync(fromDate, toDate, cancellationToken);
        return Success(stats);
    }
}

// Request DTOs
public record AssignIncidentRequest(Guid? AssignToUserId, Guid? SupportGroupId);
public record ChangeStatusRequest(IncidentStatus Status, string? Notes);
public record ResolveIncidentRequest(string ResolutionNotes, string? RootCause);
public record ReopenIncidentRequest(string Reason);

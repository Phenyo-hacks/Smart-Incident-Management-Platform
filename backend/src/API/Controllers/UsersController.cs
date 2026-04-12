using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIMP.Core.Entities;
using SIMP.Core.Enums;
using SIMP.Core.Interfaces;
using SIMP.Core.DTOs;

namespace SIMP.API.Controllers;

/// <summary>
/// Users management endpoints
/// </summary>
[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<UsersController> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// Get all users
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<UserDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<UserDto>>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] UserRole? role,
        [FromQuery] bool? isActive,
        CancellationToken cancellationToken = default)
    {
        IReadOnlyList<User> users;

        if (!string.IsNullOrEmpty(search))
        {
            users = await _unitOfWork.Users.SearchAsync(search, cancellationToken);
        }
        else if (role.HasValue)
        {
            users = await _unitOfWork.Users.GetByRoleAsync(role.Value, cancellationToken);
        }
        else
        {
            users = await _unitOfWork.Users.GetAllAsync(cancellationToken);
        }

        if (isActive.HasValue)
        {
            users = users.Where(u => u.IsActive == isActive.Value).ToList();
        }

        var dtos = _mapper.Map<IReadOnlyList<UserDto>>(users);
        return Success(dtos);
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id, cancellationToken);
        if (user == null)
            return NotFoundResponse<UserDto>("User not found");

        var dto = _mapper.Map<UserDto>(user);
        return Success(dto);
    }

    /// <summary>
    /// Get current user profile
    /// </summary>
    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetCurrentUser(CancellationToken cancellationToken = default)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(CurrentUserId, cancellationToken);
        if (user == null)
            return NotFoundResponse<UserDto>("User not found");

        var dto = _mapper.Map<UserDto>(user);
        return Success(dto);
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<UserDto>>> Create(
        [FromBody] CreateUserDto dto,
        CancellationToken cancellationToken = default)
    {
        // Check email uniqueness
        if (!await _unitOfWork.Users.IsEmailUniqueAsync(dto.Email, cancellationToken: cancellationToken))
        {
            return Error<UserDto>("Email already exists");
        }

        var user = _mapper.Map<User>(dto);
        user.Id = Guid.NewGuid();
        user.CreatedAt = DateTime.UtcNow;
        user.CreatedBy = CurrentUserId;

        await _unitOfWork.Users.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User {Email} created by {AdminId}", user.Email, CurrentUserId);

        var result = _mapper.Map<UserDto>(user);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, ApiResponse<UserDto>.Ok(result));
    }

    /// <summary>
    /// Update a user
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<UserDto>>> Update(
        Guid id,
        [FromBody] UpdateUserDto dto,
        CancellationToken cancellationToken = default)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id, cancellationToken);
        if (user == null)
            return NotFoundResponse<UserDto>("User not found");

        _mapper.Map(dto, user);
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = CurrentUserId;

        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var result = _mapper.Map<UserDto>(user);
        return Success(result, "User updated successfully");
    }

    /// <summary>
    /// Get agents
    /// </summary>
    [HttpGet("agents")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<UserDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<UserDto>>>> GetAgents(CancellationToken cancellationToken = default)
    {
        var agents = await _unitOfWork.Users.GetActiveAgentsAsync(cancellationToken);
        var dtos = _mapper.Map<IReadOnlyList<UserDto>>(agents);
        return Success(dtos);
    }

    /// <summary>
    /// Deactivate a user
    /// </summary>
    [HttpPost("{id:guid}/deactivate")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<UserDto>>> Deactivate(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id, cancellationToken);
        if (user == null)
            return NotFoundResponse<UserDto>("User not found");

        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = CurrentUserId;

        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User {UserId} deactivated by {AdminId}", id, CurrentUserId);

        var result = _mapper.Map<UserDto>(user);
        return Success(result, "User deactivated");
    }
}

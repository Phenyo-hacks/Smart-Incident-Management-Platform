using Microsoft.AspNetCore.Mvc;
using SIMP.Shared.DTOs;

namespace SIMP.API.Controllers;

/// <summary>
/// Base API controller with common functionality
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public abstract class BaseApiController : ControllerBase
{
    /// <summary>
    /// Get current user ID from claims
    /// </summary>
    protected Guid CurrentUserId
    {
        get
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst("oid");
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }
            return Guid.Empty;
        }
    }

    /// <summary>
    /// Get current user email from claims
    /// </summary>
    protected string? CurrentUserEmail => User.FindFirst("email")?.Value ?? User.FindFirst("preferred_username")?.Value;

    /// <summary>
    /// Return success response
    /// </summary>
    protected ActionResult<ApiResponse<T>> Success<T>(T data, string? message = null)
    {
        return Ok(ApiResponse<T>.Ok(data, message));
    }

    /// <summary>
    /// Return error response
    /// </summary>
    protected ActionResult<ApiResponse<T>> Error<T>(string message, int statusCode = 400)
    {
        return StatusCode(statusCode, ApiResponse<T>.Fail(message));
    }

    /// <summary>
    /// Return not found response
    /// </summary>
    protected ActionResult<ApiResponse<T>> NotFoundResponse<T>(string message = "Resource not found")
    {
        return NotFound(ApiResponse<T>.Fail(message));
    }
}

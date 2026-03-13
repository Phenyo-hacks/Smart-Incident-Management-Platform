using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIMP.Core.Entities;
using SIMP.Core.Interfaces;
using SIMP.Shared.DTOs;

namespace SIMP.API.Controllers;

/// <summary>
/// Categories management endpoints
/// </summary>
[Authorize]
public class CategoriesController : BaseApiController
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CategoriesController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>
    /// Get all categories
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<CategoryDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<CategoryDto>>>> GetAll(
        [FromQuery] bool? activeOnly,
        CancellationToken cancellationToken = default)
    {
        var categories = await _unitOfWork.Categories.GetAllAsync(cancellationToken);
        
        if (activeOnly == true)
        {
            categories = categories.Where(c => c.IsActive).ToList();
        }

        var dtos = _mapper.Map<IReadOnlyList<CategoryDto>>(categories);
        return Success(dtos);
    }

    /// <summary>
    /// Get category by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<CategoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id, cancellationToken);
        if (category == null)
            return NotFoundResponse<CategoryDto>("Category not found");

        var dto = _mapper.Map<CategoryDto>(category);
        return Success(dto);
    }

    /// <summary>
    /// Get top-level categories
    /// </summary>
    [HttpGet("root")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<CategoryDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<CategoryDto>>>> GetRootCategories(CancellationToken cancellationToken = default)
    {
        var categories = await _unitOfWork.Categories.FindAsync(c => c.ParentCategoryId == null && c.IsActive, cancellationToken);
        var dtos = _mapper.Map<IReadOnlyList<CategoryDto>>(categories.OrderBy(c => c.SortOrder));
        return Success(dtos);
    }

    /// <summary>
    /// Get subcategories of a category
    /// </summary>
    [HttpGet("{id:guid}/subcategories")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<CategoryDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<CategoryDto>>>> GetSubcategories(Guid id, CancellationToken cancellationToken = default)
    {
        var categories = await _unitOfWork.Categories.FindAsync(c => c.ParentCategoryId == id && c.IsActive, cancellationToken);
        var dtos = _mapper.Map<IReadOnlyList<CategoryDto>>(categories.OrderBy(c => c.SortOrder));
        return Success(dtos);
    }

    /// <summary>
    /// Create a new category
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<CategoryDto>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> Create(
        [FromBody] CreateCategoryDto dto,
        CancellationToken cancellationToken = default)
    {
        var category = _mapper.Map<Category>(dto);
        category.Id = Guid.NewGuid();
        category.CreatedAt = DateTime.UtcNow;
        category.CreatedBy = CurrentUserId;

        await _unitOfWork.Categories.AddAsync(category, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var result = _mapper.Map<CategoryDto>(category);
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, ApiResponse<CategoryDto>.Ok(result));
    }

    /// <summary>
    /// Update a category
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<CategoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> Update(
        Guid id,
        [FromBody] UpdateCategoryDto dto,
        CancellationToken cancellationToken = default)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id, cancellationToken);
        if (category == null)
            return NotFoundResponse<CategoryDto>("Category not found");

        _mapper.Map(dto, category);
        category.UpdatedAt = DateTime.UtcNow;
        category.UpdatedBy = CurrentUserId;

        _unitOfWork.Categories.Update(category);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var result = _mapper.Map<CategoryDto>(category);
        return Success(result, "Category updated successfully");
    }

    /// <summary>
    /// Delete a category (soft delete)
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id, cancellationToken);
        if (category == null)
            return NotFound();

        _unitOfWork.Categories.SoftDelete(category);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}

// DTOs
public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public string? ParentCategoryName { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
    public string? IconName { get; set; }
    public string? ColorCode { get; set; }
    public int? DefaultResponseTimeMinutes { get; set; }
    public int? DefaultResolutionTimeMinutes { get; set; }
}

public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public int SortOrder { get; set; }
    public string? IconName { get; set; }
    public string? ColorCode { get; set; }
    public int? DefaultResponseTimeMinutes { get; set; }
    public int? DefaultResolutionTimeMinutes { get; set; }
    public Guid? DefaultSupportGroupId { get; set; }
}

public class UpdateCategoryDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public bool? IsActive { get; set; }
    public int? SortOrder { get; set; }
    public string? IconName { get; set; }
    public string? ColorCode { get; set; }
    public int? DefaultResponseTimeMinutes { get; set; }
    public int? DefaultResolutionTimeMinutes { get; set; }
    public Guid? DefaultSupportGroupId { get; set; }
}

namespace SIMP.Core.DTOs;

/// <summary>
/// Comment data transfer object
/// </summary>
public class CommentDto
{
    public Guid Id { get; set; }
    public Guid IncidentId { get; set; }
    public Guid AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string? AuthorAvatarUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsInternal { get; set; }
    public bool IsSystemGenerated { get; set; }
    public string CommentType { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<AttachmentDto> Attachments { get; set; } = new();
}

/// <summary>
/// Create comment request
/// </summary>
public class CreateCommentDto
{
    public string Content { get; set; } = string.Empty;
    public bool IsInternal { get; set; }
    public string CommentType { get; set; } = "Note";
}

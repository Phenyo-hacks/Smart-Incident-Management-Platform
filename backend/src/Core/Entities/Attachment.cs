namespace SIMP.Core.Entities;

/// <summary>
/// Represents a file attachment
/// </summary>
public class Attachment : BaseEntity
{
    /// <summary>
    /// Original file name
    /// </summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// Stored file name (with unique identifier)
    /// </summary>
    public string StoredFileName { get; set; } = string.Empty;

    /// <summary>
    /// MIME type of the file
    /// </summary>
    public string ContentType { get; set; } = string.Empty;

    /// <summary>
    /// File size in bytes
    /// </summary>
    public long FileSize { get; set; }

    /// <summary>
    /// Azure Blob Storage URL
    /// </summary>
    public string BlobUrl { get; set; } = string.Empty;

    /// <summary>
    /// Container name in Azure Blob Storage
    /// </summary>
    public string ContainerName { get; set; } = string.Empty;

    /// <summary>
    /// User who uploaded the file
    /// </summary>
    public Guid UploadedById { get; set; }
    public virtual User UploadedBy { get; set; } = null!;

    /// <summary>
    /// Incident this attachment belongs to (if any)
    /// </summary>
    public Guid? IncidentId { get; set; }
    public virtual Incident? Incident { get; set; }

    /// <summary>
    /// Comment this attachment belongs to (if any)
    /// </summary>
    public Guid? CommentId { get; set; }
    public virtual Comment? Comment { get; set; }

    /// <summary>
    /// Description of the attachment
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Whether the file has been scanned for viruses
    /// </summary>
    public bool IsScanned { get; set; }

    /// <summary>
    /// Whether the file passed virus scan
    /// </summary>
    public bool IsSafe { get; set; }
}

namespace SIMP.Core.DTOs;

/// <summary>
/// Attachment data transfer object
/// </summary>
public class AttachmentDto
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string FileSizeDisplay => FormatFileSize(FileSize);
    public string DownloadUrl { get; set; } = string.Empty;
    public Guid UploadedById { get; set; }
    public string UploadedByName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }

    private static string FormatFileSize(long bytes)
    {
        string[] sizes = { "B", "KB", "MB", "GB" };
        int order = 0;
        double size = bytes;
        while (size >= 1024 && order < sizes.Length - 1)
        {
            order++;
            size /= 1024;
        }
        return $"{size:0.##} {sizes[order]}";
    }
}

namespace SIMP.Core.Interfaces;

/// <summary>
/// Service interface for file storage operations
/// </summary>
public interface IFileStorageService
{
    /// <summary>
    /// Upload a file
    /// </summary>
    Task<FileUploadResult> UploadAsync(Stream fileStream, string fileName, string contentType, string? containerName = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Download a file
    /// </summary>
    Task<Stream?> DownloadAsync(string blobName, string? containerName = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Delete a file
    /// </summary>
    Task<bool> DeleteAsync(string blobName, string? containerName = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get a SAS URL for secure access
    /// </summary>
    Task<string> GetSasUrlAsync(string blobName, string? containerName = null, TimeSpan? validFor = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if a file exists
    /// </summary>
    Task<bool> ExistsAsync(string blobName, string? containerName = null, CancellationToken cancellationToken = default);
}

/// <summary>
/// Result of a file upload operation
/// </summary>
public class FileUploadResult
{
    public bool Success { get; set; }
    public string BlobName { get; set; } = string.Empty;
    public string BlobUrl { get; set; } = string.Empty;
    public string ContainerName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string? ErrorMessage { get; set; }
}

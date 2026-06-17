using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DealZy.Infrastructure.Services;

public interface ICloudinaryService
{
    Task<string> UploadImageAsync(IFormFile file, string folder);
    Task<string> UploadAdPhotoAsync(IFormFile file, Guid adId);
    Task<bool> DeleteImageByUrlAsync(string url);
}

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;
    private readonly ILogger<CloudinaryService> _logger;
    private readonly string _folderPrefix;

    public CloudinaryService(IConfiguration configuration, ILogger<CloudinaryService> logger)
    {
        var account = new Account(
            configuration["Cloudinary:CloudName"],
            configuration["Cloudinary:ApiKey"],
            configuration["Cloudinary:ApiSecret"]
        );
        _cloudinary = new Cloudinary(account);
        _logger = logger;
        _folderPrefix = configuration["Cloudinary:FolderPrefix"] ?? "dev";
    }

    public async Task<string> UploadImageAsync(IFormFile file, string folder)
    {
        if (file.Length == 0) throw new ArgumentException("File is empty");

        using var stream = file.OpenReadStream();
        var publicId = $"{_folderPrefix}/{folder}/{Guid.NewGuid()}";

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            PublicId = publicId,
            Overwrite = true,
            Invalidate = true,
            Transformation = new Transformation().Quality("auto").FetchFormat("auto")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
        {
            _logger.LogError("Cloudinary upload failed: folder={Folder} error={Error}", folder, result.Error.Message);
            throw new Exception(result.Error.Message);
        }

        _logger.LogInformation("Image uploaded: publicId={PublicId} folder={Folder}", result.PublicId, folder);
        return $"{result.SecureUrl}?v={DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
    }

    public async Task<string> UploadAdPhotoAsync(IFormFile file, Guid adId)
    {
        if (file.Length == 0) throw new ArgumentException("File is empty");

        using var stream = file.OpenReadStream();
        var publicId = $"{_folderPrefix}/ads/{adId}/{Guid.NewGuid()}";

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            PublicId = publicId,
            Overwrite = false,
            Transformation = new Transformation().Quality("auto").FetchFormat("auto")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
        {
            _logger.LogError("Cloudinary upload failed: adId={AdId} error={Error}", adId, result.Error.Message);
            throw new Exception(result.Error.Message);
        }

        _logger.LogInformation("Photo uploaded: publicId={PublicId} adId={AdId}", result.PublicId, adId);
        return result.SecureUrl.ToString();
    }

    public async Task<bool> DeleteImageByUrlAsync(string url)
    {
        try
        {
            var uri = new Uri(url.Split('?')[0]);
            var segments = uri.AbsolutePath.Split('/');
            var uploadIndex = Array.IndexOf(segments, "upload");
            if (uploadIndex < 0) return false;

            var start = uploadIndex + 1;
            if (start < segments.Length && segments[start].StartsWith("v") &&
                long.TryParse(segments[start][1..], out _))
                start++;

            var publicIdWithExt = string.Join("/", segments[start..]);
            var publicId = Path.ChangeExtension(publicIdWithExt, null);

            var deleteParams = new DeletionParams(publicId);
            var deleteResult = await _cloudinary.DestroyAsync(deleteParams);

            _logger.LogInformation("Photo deleted: publicId={PublicId} result={Result}", publicId, deleteResult.Result);
            return deleteResult.Result == "ok";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete image: url={Url}", url);
            return false;
        }
    }
}

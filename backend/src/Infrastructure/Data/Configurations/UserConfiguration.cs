using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SIMP.Core.Entities;

namespace SIMP.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.Property(u => u.AzureAdObjectId)
            .HasMaxLength(36);

        builder.HasIndex(u => u.AzureAdObjectId)
            .IsUnique()
            .HasFilter("[AzureAdObjectId] IS NOT NULL");

        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(u => u.JobTitle)
            .HasMaxLength(100);

        builder.Property(u => u.Department)
            .HasMaxLength(100);

        builder.Property(u => u.Location)
            .HasMaxLength(200);

        builder.Property(u => u.TimeZone)
            .HasMaxLength(50)
            .HasDefaultValue("UTC");

        builder.Property(u => u.PreferredLanguage)
            .HasMaxLength(10)
            .HasDefaultValue("en");

        builder.Property(u => u.AvatarUrl)
            .HasMaxLength(500);

        builder.Property(u => u.RowVersion)
            .IsRowVersion();

        builder.Ignore(u => u.DisplayName);

        // Relationships
        builder.HasOne(u => u.SupportGroup)
            .WithMany(sg => sg.Members)
            .HasForeignKey(u => u.SupportGroupId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(u => u.Role);
        builder.HasIndex(u => u.IsActive);
        builder.HasIndex(u => u.SupportGroupId);
    }
}

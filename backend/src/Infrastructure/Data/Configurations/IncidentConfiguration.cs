using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SIMP.Core.Entities;

namespace SIMP.Infrastructure.Data.Configurations;

public class IncidentConfiguration : IEntityTypeConfiguration<Incident>
{
    public void Configure(EntityTypeBuilder<Incident> builder)
    {
        builder.ToTable("Incidents");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.IncidentNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.HasIndex(i => i.IncidentNumber)
            .IsUnique();

        builder.Property(i => i.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(i => i.Description)
            .IsRequired()
            .HasMaxLength(4000);

        builder.Property(i => i.Status)
            .IsRequired();

        builder.Property(i => i.Priority)
            .IsRequired();

        builder.Property(i => i.ResolutionNotes)
            .HasMaxLength(4000);

        builder.Property(i => i.RootCause)
            .HasMaxLength(2000);

        builder.Property(i => i.Workaround)
            .HasMaxLength(2000);

        builder.Property(i => i.Source)
            .HasMaxLength(50);

        builder.Property(i => i.ExternalReference)
            .HasMaxLength(100);

        builder.Property(i => i.Tags)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            );

        builder.Property(i => i.RowVersion)
            .IsRowVersion();

        // Relationships
        builder.HasOne(i => i.Requester)
            .WithMany(u => u.CreatedIncidents)
            .HasForeignKey(i => i.RequesterId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.AssignedTo)
            .WithMany(u => u.AssignedIncidents)
            .HasForeignKey(i => i.AssignedToId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.SupportGroup)
            .WithMany(sg => sg.Incidents)
            .HasForeignKey(i => i.SupportGroupId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.Category)
            .WithMany(c => c.Incidents)
            .HasForeignKey(i => i.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.SubCategory)
            .WithMany()
            .HasForeignKey(i => i.SubCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes for common queries
        builder.HasIndex(i => i.Status);
        builder.HasIndex(i => i.Priority);
        builder.HasIndex(i => i.RequesterId);
        builder.HasIndex(i => i.AssignedToId);
        builder.HasIndex(i => i.SupportGroupId);
        builder.HasIndex(i => i.CreatedAt);
        builder.HasIndex(i => i.SLAStatus);
    }
}

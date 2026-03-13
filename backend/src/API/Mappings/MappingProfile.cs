using AutoMapper;
using SIMP.Core.Entities;
using SIMP.Shared.DTOs;

namespace SIMP.API.Mappings;

/// <summary>
/// AutoMapper profile for entity to DTO mappings
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Incident mappings
        CreateMap<Incident, IncidentDto>()
            .ForMember(d => d.RequesterName, opt => opt.MapFrom(s => s.Requester != null ? s.Requester.DisplayName : string.Empty))
            .ForMember(d => d.RequesterEmail, opt => opt.MapFrom(s => s.Requester != null ? s.Requester.Email : string.Empty))
            .ForMember(d => d.AssignedToName, opt => opt.MapFrom(s => s.AssignedTo != null ? s.AssignedTo.DisplayName : null))
            .ForMember(d => d.SupportGroupName, opt => opt.MapFrom(s => s.SupportGroup != null ? s.SupportGroup.Name : null))
            .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.Category != null ? s.Category.Name : null))
            .ForMember(d => d.SubCategoryName, opt => opt.MapFrom(s => s.SubCategory != null ? s.SubCategory.Name : null))
            .ForMember(d => d.CommentCount, opt => opt.MapFrom(s => s.Comments != null ? s.Comments.Count : 0))
            .ForMember(d => d.AttachmentCount, opt => opt.MapFrom(s => s.Attachments != null ? s.Attachments.Count : 0));

        CreateMap<CreateIncidentDto, Incident>()
            .ForMember(d => d.Id, opt => opt.Ignore())
            .ForMember(d => d.IncidentNumber, opt => opt.Ignore())
            .ForMember(d => d.Status, opt => opt.Ignore())
            .ForMember(d => d.SLAStatus, opt => opt.Ignore())
            .ForMember(d => d.RequesterId, opt => opt.Ignore())
            .ForMember(d => d.CreatedAt, opt => opt.Ignore());

        CreateMap<UpdateIncidentDto, Incident>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // User mappings
        CreateMap<User, UserDto>()
            .ForMember(d => d.DisplayName, opt => opt.MapFrom(s => s.DisplayName))
            .ForMember(d => d.SupportGroupName, opt => opt.MapFrom(s => s.SupportGroup != null ? s.SupportGroup.Name : null));

        CreateMap<CreateUserDto, User>()
            .ForMember(d => d.Id, opt => opt.Ignore())
            .ForMember(d => d.IsActive, opt => opt.MapFrom(_ => true))
            .ForMember(d => d.CreatedAt, opt => opt.Ignore());

        CreateMap<UpdateUserDto, User>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // Comment mappings
        CreateMap<Comment, CommentDto>()
            .ForMember(d => d.AuthorName, opt => opt.MapFrom(s => s.Author != null ? s.Author.DisplayName : string.Empty))
            .ForMember(d => d.AuthorAvatarUrl, opt => opt.MapFrom(s => s.Author != null ? s.Author.AvatarUrl : null));

        CreateMap<CreateCommentDto, Comment>()
            .ForMember(d => d.Id, opt => opt.Ignore())
            .ForMember(d => d.CreatedAt, opt => opt.Ignore());

        // Attachment mappings
        CreateMap<Attachment, AttachmentDto>()
            .ForMember(d => d.UploadedByName, opt => opt.MapFrom(s => s.UploadedBy != null ? s.UploadedBy.DisplayName : string.Empty))
            .ForMember(d => d.DownloadUrl, opt => opt.MapFrom(s => s.BlobUrl));

        // Category mappings
        CreateMap<Category, CategoryDto>()
            .ForMember(d => d.ParentCategoryName, opt => opt.MapFrom(s => s.ParentCategory != null ? s.ParentCategory.Name : null));

        CreateMap<CreateCategoryDto, Category>()
            .ForMember(d => d.Id, opt => opt.Ignore())
            .ForMember(d => d.IsActive, opt => opt.MapFrom(_ => true))
            .ForMember(d => d.CreatedAt, opt => opt.Ignore());

        CreateMap<UpdateCategoryDto, Category>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}

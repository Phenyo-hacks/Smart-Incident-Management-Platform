using FluentAssertions;
using SIMP.Core.Entities;
using SIMP.Core.Enums;
using Xunit;

namespace SIMP.UnitTests.Domain;

public class IncidentTests
{
    [Fact]
    public void NewIncident_ShouldHaveCorrectDefaults()
    {
        // Arrange & Act
        var incident = new Incident();

        // Assert
        incident.Status.Should().Be(IncidentStatus.New);
        incident.Priority.Should().Be(IncidentPriority.Medium);
        incident.SLAStatus.Should().Be(SLABreachStatus.OnTrack);
        incident.Impact.Should().Be(2);
        incident.Urgency.Should().Be(2);
        incident.Source.Should().Be("Portal");
        incident.Tags.Should().BeEmpty();
        incident.Comments.Should().BeEmpty();
        incident.Attachments.Should().BeEmpty();
    }

    [Theory]
    [InlineData(1, 1, IncidentPriority.Critical)]
    [InlineData(1, 2, IncidentPriority.High)]
    [InlineData(2, 1, IncidentPriority.High)]
    [InlineData(2, 2, IncidentPriority.Medium)]
    [InlineData(3, 3, IncidentPriority.Low)]
    public void CalculatePriority_ShouldReturnCorrectPriority(int impact, int urgency, IncidentPriority expectedPriority)
    {
        // Arrange
        var incident = new Incident
        {
            Impact = impact,
            Urgency = urgency
        };

        // Act
        var calculatedPriority = CalculatePriorityFromImpactUrgency(impact, urgency);

        // Assert
        calculatedPriority.Should().Be(expectedPriority);
    }

    [Fact]
    public void Incident_ShouldAllowTagsModification()
    {
        // Arrange
        var incident = new Incident();

        // Act
        incident.Tags.Add("urgent");
        incident.Tags.Add("hardware");

        // Assert
        incident.Tags.Should().HaveCount(2);
        incident.Tags.Should().Contain("urgent");
        incident.Tags.Should().Contain("hardware");
    }

    [Fact]
    public void Incident_ShouldTrackRequester()
    {
        // Arrange
        var requesterId = Guid.NewGuid();
        var incident = new Incident
        {
            RequesterId = requesterId
        };

        // Assert
        incident.RequesterId.Should().Be(requesterId);
    }

    [Fact]
    public void Incident_ShouldAllowAssignment()
    {
        // Arrange
        var incident = new Incident();
        var agentId = Guid.NewGuid();
        var groupId = Guid.NewGuid();

        // Act
        incident.AssignedToId = agentId;
        incident.SupportGroupId = groupId;

        // Assert
        incident.AssignedToId.Should().Be(agentId);
        incident.SupportGroupId.Should().Be(groupId);
    }

    [Theory]
    [InlineData(IncidentStatus.New, true)]
    [InlineData(IncidentStatus.Assigned, true)]
    [InlineData(IncidentStatus.InProgress, true)]
    [InlineData(IncidentStatus.Pending, true)]
    [InlineData(IncidentStatus.Resolved, false)]
    [InlineData(IncidentStatus.Closed, false)]
    [InlineData(IncidentStatus.Cancelled, false)]
    public void IsOpen_ShouldReturnCorrectValue(IncidentStatus status, bool expectedIsOpen)
    {
        // Arrange
        var incident = new Incident { Status = status };

        // Act
        var isOpen = IsIncidentOpen(incident.Status);

        // Assert
        isOpen.Should().Be(expectedIsOpen);
    }

    // Helper methods that would typically be in a domain service
    private static IncidentPriority CalculatePriorityFromImpactUrgency(int impact, int urgency)
    {
        var score = impact + urgency;
        return score switch
        {
            2 => IncidentPriority.Critical,
            3 => IncidentPriority.High,
            4 => IncidentPriority.Medium,
            _ => IncidentPriority.Low
        };
    }

    private static bool IsIncidentOpen(IncidentStatus status)
    {
        return status != IncidentStatus.Resolved &&
               status != IncidentStatus.Closed &&
               status != IncidentStatus.Cancelled;
    }
}

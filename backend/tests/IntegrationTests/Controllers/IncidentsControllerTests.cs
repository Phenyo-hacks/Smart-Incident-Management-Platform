using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using SIMP.Shared.DTOs;
using Xunit;

namespace SIMP.IntegrationTests.Controllers;

public class IncidentsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public IncidentsControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetAll_WithoutAuth_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/incidents");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task HealthCheck_ReturnsOk()
    {
        // Act
        var response = await _client.GetAsync("/health");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    // TODO: Add more integration tests with proper test authentication setup
    // These tests would typically:
    // 1. Use a test database (e.g., SQL Server container via Testcontainers)
    // 2. Set up test authentication tokens
    // 3. Seed test data
    // 4. Test full request/response cycles

    /*
    [Fact]
    public async Task CreateIncident_WithValidData_ReturnsCreated()
    {
        // Arrange
        var dto = new CreateIncidentDto
        {
            Title = "Test Incident",
            Description = "Test description",
            Priority = IncidentPriority.Medium
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/incidents", dto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<IncidentDto>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data!.Title.Should().Be("Test Incident");
        result.Data.IncidentNumber.Should().StartWith("INC");
    }
    */
}

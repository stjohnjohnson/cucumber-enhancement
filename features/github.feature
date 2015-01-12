Feature: Example feature
  As a user of cucumber.js
  I want to have documentation on cucumber
  So that I can concentrate on building awesome applications

  @github_api
  Scenario: List Branches
    Given I am on the "hapijs/hoek" repository on GitHub
    When I list the branches
    Then I should see "master" as one of the branches

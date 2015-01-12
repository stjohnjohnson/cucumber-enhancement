Feature: Example feature2
  As a user of cucumber.js
  I want to have documentation on cucumber
  So that I can concentrate on building awesome applications

  @github_api
  Scenario: List Languages
    Given I am on the "hapijs/hoek" repository on GitHub
    When I list the languages
    Then I should see "JavaScript" as one of the languages

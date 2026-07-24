Feature: Burger menu
  As a logged-in user
  I want to use the burger menu
  So that I can navigate and logout from the app

  Scenario Outline: Open burger menu and navigate to inventory
    Given I am logged in as the "<userType>" user
    When I open the burger menu
    And I navigate to all items
    Then I should remain on the products page

    Examples:
      | userType |
      | standard |
      | problem |
      | performanceGlitch |
      | error |
      | visual |

  Scenario Outline: Logout from the burger menu
    Given I am logged in as the "<userType>" user
    When I open the burger menu
    And I logout
    Then I should be returned to the login page

    Examples:
      | userType |
      | standard |
      | problem |
      | performanceGlitch |
      | error |
      | visual |

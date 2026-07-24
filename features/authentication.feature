Feature: Authentication
  As a SauceDemo user
  I want to authenticate using valid and invalid credentials
  So that I can access the products page or see proper error messages

  Scenario: Login with valid credentials
    Given I am on the login page
    When I login with a standard user
    Then I should be redirected to the products page

  Scenario Outline: Login with supported users from shared test data
    Given I am on the login page
    When I login with the "<userType>" user
    Then I should be redirected to the products page

    Examples:
      | userType |
      | standard |
      | problem |
      | performanceGlitch |
      | error |
      | visual |

  Scenario: Login with locked out user credentials
    Given I am on the login page
    When I login with a locked out user
    Then I should see a locked out error message

  Scenario: Login with invalid credentials
    Given I am on the login page
    When I login with invalid credentials
    Then I should see a login error message

  Scenario: Login with empty credentials
    Given I am on the login page
    When I login with empty credentials
    Then I should see a login error message

  Scenario Outline: Users from the valid group can log in and then log out
    Given I am on the login page
    When I login with the "<userType>" user
    And I open the burger menu
    And I logout
    Then I should be returned to the login page

    Examples:
      | userType |
      | standard |
      | problem |
      | performanceGlitch |
      | error |
      | visual |

  Scenario: Navigate directly to the inventory page without login
    When I navigate directly to the inventory page
    Then I should be redirected to the login page

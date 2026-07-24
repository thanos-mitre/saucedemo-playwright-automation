Feature: Checkout flow
  As a user with items in the cart
  I want to complete checkout or see validation errors
  So that purchase flow works correctly

  Scenario Outline: Complete checkout successfully
    Given I am logged in as the "<userType>" user
    And I add a product to the cart
    And I am on the checkout information page
    When I submit valid checkout information
    Then I should see a successful order confirmation

    Examples:
      | userType |
      | standard |
      | problem |
      | performanceGlitch |
      | error |
      | visual |

  Scenario Outline: Checkout fails when required information is missing
    Given I am logged in as the "<userType>" user
    And I add a product to the cart
    And I am on the checkout information page
    When I submit incomplete checkout information
    Then I should see a first name required error

    Examples:
      | userType |
      | standard |
      | problem |
      | performanceGlitch |
      | error |
      | visual |

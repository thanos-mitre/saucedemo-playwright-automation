Feature: Cart management
  As a user who adds items to the cart
  I want to verify cart contents and remove products
  So that the cart behaves correctly

  Scenario Outline: Add multiple items to the cart and verify contents
    Given I am logged in as the "<userType>" user
    When I add two products to the cart
    And I go to the cart page
    Then I should see both products in the cart

    Examples:
      | userType |
      | standard |
      | problem |
      | performanceGlitch |
      | error |
      | visual |

  Scenario: Remove an item from the cart
    Given I have added a product to the cart
    When I remove that product from the cart
    Then it should no longer appear in the cart

  Scenario Outline: Cart persists after logout and re-login
    Given I am logged in as the "<userType>" user
    When I add a product to the cart
    And I open the burger menu
    And I logout
    And I login with the "<userType>" user
    Then I should see the product in the cart

    Examples:
      | userType |
      | standard |
      | problem |
      | performanceGlitch |
      | error |
      | visual |

  Scenario Outline: Users can add and remove a product to leave an empty cart
    Given I am logged in as the "<userType>" user
    When I add a product to the cart
    And I remove that product from the cart
    Then the cart should be empty

    Examples:
      | userType |
      | standard |
      | problem |
      | performanceGlitch |
      | error |
      | visual |

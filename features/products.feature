Feature: Products page
  As a logged-in user
  I want to view and interact with product listings
  So that I can add items to my cart

  Scenario Outline: View products page with supported users
    Given I am logged in as the "<userType>" user
    Then I should see the Products page
    And I should see the available products

    Examples:
      | userType |
      | standard |
      | problem |
      | performanceGlitch |
      | error |
      | visual |

  Scenario Outline: Add a product to the cart from products page
    Given I am logged in as the "<userType>" user
    When I add a product to the cart
    Then the cart badge should show 1 item

    Examples:
      | userType |
      | standard |
      | problem |
      | performanceGlitch |
      | error |
      | visual |

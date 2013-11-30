require 'test_helper'

class ExpenceTest < ActiveSupport::TestCase
  should validate_presence_of(:when)
  should validate_presence_of(:amount)
  should validate_numericality_of(:amount)
  should have_many(:categories)
  should belong_to(:user)
end

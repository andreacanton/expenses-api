require 'test_helper'

class UserTest < ActiveSupport::TestCase
  should validate_presence_of(:email)
  should validate_presence_of(:password)
  should have_many(:categories)
  should have_many(:expences)
  should validate_uniqueness_of(:email)
end

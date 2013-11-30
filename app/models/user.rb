class User < ActiveRecord::Base
  has_many :expences
  has_many :categories
  
  validates :email, :password, presence: true
  validates :email, uniqueness: true
end

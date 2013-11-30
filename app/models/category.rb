class Category < ActiveRecord::Base
  belongs_to :user
  has_many :expence_taxonomies
  has_many :expences, through: :expence_taxonomies
  
  
  validates :name, presence: true
end

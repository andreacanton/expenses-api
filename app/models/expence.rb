class Expence < ActiveRecord::Base
  belongs_to :user
  has_many :expence_taxonomies
  has_many :categories, through: :expence_taxonomies
  
  validates :when, :amount, presence: true
  validates :amount, numericality: true
end

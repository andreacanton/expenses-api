class ExpenceTaxonomy < ActiveRecord::Base
  belongs_to :expence
  belongs_to :category
end

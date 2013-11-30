class CreateExpenceTaxonomy < ActiveRecord::Migration
  def change
    create_table :expence_taxonomies do |t|
      t.integer :expence_id
      t.integer :category_id
    end
    add_index :expence_taxonomies, :expence_id
    add_index :expence_taxonomies, :category_id
  end
end

class CreateExpences < ActiveRecord::Migration
  def change
    create_table :expences do |t|
      t.date :when
      t.float :amount
      t.references :user, index: true

      t.timestamps
    end
  end
end

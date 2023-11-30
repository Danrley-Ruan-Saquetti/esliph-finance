# https://dbdiagram.io
# Docs: https://dbml.dbdiagram.io/docs
# https://dbdiagram.io/d/portal-finance-656716f83be1495787f68936

Table account {
  id int [primary key]
  name varchar(45) [not null]
  email varchar(25) [not null, unique]
  password varchar(15) [not null]
  balance double [default: 0]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

enum notification_type {
  Push
  Internal
  Mail
}

Table notification {
  id int [primary key]
  account_id int [not null, ref: > account.id]
  subject varchar(45) [not null]
  content text [not null]
  was_read boolean [default: false]
  type notification_type [not null]
  is_send boolean [default: false]
  send_at timestamp
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table mail {
  id int [primary key]
  notification_id int [not null, ref: > notification.id]
  recipient varchar(45) [not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table category {
  id int [primary key]
  account_id int [not null, ref: > account.id]
  name varchar(45) [not null]
  color varchar(15) [not null]
  is_favorite boolean [default: false]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

enum financial_transaction_type {
  Expense
  Income
}

enum financial_transaction_occurrence {
  Single
  Programmatic
}

enum financial_transaction_situation {
  Pending
  PaidOut
  PartiallyPaid
  Received
  PartiallyReceived
  Late
  Canceled
}

Table financial_transaction {
  id int [primary key]
  account_id int [not null, ref: > account.id]
  title varchar(55) [not null]
  description text
  value double [not null]
  priority int
  is_observable boolean [default: false]
  is_send_notification boolean [default: false]
  times_to_repeat int [default: 0]
  count_repeated_occurrences int [default: 0]
  type financial_transaction_type [not null]
  receiver string
  sender string
  type_occurrence financial_transaction_occurrence [default: 'Single']
  situation financial_transaction_situation [default: 'Pending']
  expires_in timestamp [not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Ref financeial_transaction_category: financial_transaction.id <> category.id // many-to-many

Table note {
  id int [primary key]
  financial_transaction_id int [not null, ref: > financial_transaction.id]
  description text
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table payment {
  id int [primary key]
  financial_transaction_id int [not null, ref: > financial_transaction.id]
  value double [not null]
  discount double [default: 0]
  increase double [default: 0]
  paid_at timestamp [default: `now()`]
  created_at timestamp [default: `now()`]
}

Table midia {
  id int [primary key]
  financial_transaction_id int [not null, ref: > financial_transaction.id]
  name varchar(75)
  created_at timestamp [default: `now()`]
}

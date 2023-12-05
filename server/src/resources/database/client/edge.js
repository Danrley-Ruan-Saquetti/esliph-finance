
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
} = require('./runtime/edge')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.6.0
 * Query Engine version: e95e739751f42d8ca026f6b910f5a2dc5adeaeee
 */
Prisma.prismaVersion = {
  client: "5.6.0",
  engine: "e95e739751f42d8ca026f6b910f5a2dc5adeaeee"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BankAccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  name: 'name',
  passwordMaster: 'passwordMaster',
  balance: 'balance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  bankAccountId: 'bankAccountId',
  subject: 'subject',
  content: 'content',
  wasRead: 'wasRead',
  type: 'type',
  isSend: 'isSend',
  sendAt: 'sendAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MailScalarFieldEnum = {
  id: 'id',
  notificationId: 'notificationId',
  recipient: 'recipient',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  bankAccountId: 'bankAccountId',
  name: 'name',
  color: 'color',
  isFavorite: 'isFavorite',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FinancialTransactionScalarFieldEnum = {
  id: 'id',
  bankAccountId: 'bankAccountId',
  title: 'title',
  description: 'description',
  value: 'value',
  priority: 'priority',
  isObservable: 'isObservable',
  isSendNotification: 'isSendNotification',
  timesToRepeat: 'timesToRepeat',
  countRepeatedOccurrences: 'countRepeatedOccurrences',
  type: 'type',
  receiver: 'receiver',
  sender: 'sender',
  typeOccurrence: 'typeOccurrence',
  situation: 'situation',
  expiresIn: 'expiresIn',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NoteScalarFieldEnum = {
  id: 'id',
  financialTransactionId: 'financialTransactionId',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  financialTransactionId: 'financialTransactionId',
  value: 'value',
  discount: 'discount',
  increase: 'increase',
  paidAt: 'paidAt',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};
exports.NotificationType = exports.$Enums.NotificationType = {
  Push: 'Push',
  Internal: 'Internal',
  Mail: 'Mail'
};

exports.FinancialTransactionType = exports.$Enums.FinancialTransactionType = {
  EXPENSE: 'EXPENSE',
  INCOME: 'INCOME'
};

exports.FinancialTransactionOccurrence = exports.$Enums.FinancialTransactionOccurrence = {
  SINGLE: 'SINGLE',
  PROGRAMMATIC: 'PROGRAMMATIC'
};

exports.FinancialTransactionSituation = exports.$Enums.FinancialTransactionSituation = {
  PENDING: 'PENDING',
  PAID_OUT: 'PAID_OUT',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  RECEIVED: 'RECEIVED',
  PARTIALLY_RECEIVED: 'PARTIALLY_RECEIVED',
  LATE: 'LATE',
  CANCELED: 'CANCELED'
};

exports.Prisma.ModelName = {
  User: 'User',
  BankAccount: 'BankAccount',
  Notification: 'Notification',
  Mail: 'Mail',
  Category: 'Category',
  FinancialTransaction: 'FinancialTransaction',
  Note: 'Note',
  Payment: 'Payment'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/workspace/server/src/resources/database/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "debian-openssl-3.0.x",
        "native": true
      }
    ],
    "previewFeatures": [],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../../../.env",
    "schemaEnvPath": "../../../../.env"
  },
  "relativePath": "../../../../database",
  "clientVersion": "5.6.0",
  "engineVersion": "e95e739751f42d8ca026f6b910f5a2dc5adeaeee",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "Ly8gRE9DUzogaHR0cHM6Ly9wcmlzLmx5L2QvcHJpc21hLXNjaGVtYQoKZGF0YXNvdXJjZSBkYiB7CiAgcHJvdmlkZXIgPSAicG9zdGdyZXNxbCIKICB1cmwgICAgICA9IGVudigiREFUQUJBU0VfVVJMIikKfQoKLy8gZGF0YXNvdXJjZSBkYiB7Ci8vICAgcHJvdmlkZXIgPSAic3FsaXRlIgovLyAgIHVybCAgICAgID0gImZpbGU6LnNyYy9yZXNvdXJjZXMvZGF0YWJhc2UvZGF0YWJhc2UuZGIiCi8vICAgb3V0cHV0ICAgPSAiLi9zcmMvcmVzb3VyY2VzL2RhdGFiYXNlL2NsaWVudCIKLy8gfQoKZ2VuZXJhdG9yIGNsaWVudCB7CiAgcHJvdmlkZXIgPSAicHJpc21hLWNsaWVudC1qcyIKICBvdXRwdXQgICA9ICIuLi9zcmMvcmVzb3VyY2VzL2RhdGFiYXNlL2NsaWVudCIKfQoKbW9kZWwgVXNlciB7CiAgaWQgSW50IEBpZCBAZGVmYXVsdChhdXRvaW5jcmVtZW50KCkpCiAgbmFtZSBTdHJpbmcgQGRiLlZhckNoYXIoNDUpCiAgZW1haWwgU3RyaW5nIEBkYi5WYXJDaGFyKDI1KSBAdW5pcXVlCiAgcGFzc3dvcmQgU3RyaW5nIEBkYi5WYXJDaGFyKDE1KQogIGNyZWF0ZWRBdCBEYXRlVGltZSBAZGVmYXVsdChub3coKSkgQG1hcCgiY3JlYXRlZF9hdCIpCiAgdXBkYXRlZEF0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKSBAdXBkYXRlZEF0IEBtYXAoInVwZGF0ZWRfYXQiKQogIGJhbmtBY2NvdW50cyBCYW5rQWNjb3VudFtdCgogIEBAbWFwKCJ1c2VyIikKfQoKbW9kZWwgQmFua0FjY291bnQgewogIGlkIEludCBAaWQgQGRlZmF1bHQoYXV0b2luY3JlbWVudCgpKQogIHVzZXIgVXNlciBAcmVsYXRpb24oZmllbGRzOiBbdXNlcklkXSwgcmVmZXJlbmNlczogW2lkXSkKICB1c2VySWQgSW50IEBtYXAoInVzZXJfaWQiKQogIG5hbWUgU3RyaW5nIEBkYi5WYXJDaGFyKDQ1KQogIHBhc3N3b3JkTWFzdGVyIFN0cmluZyBAZGIuVmFyQ2hhcigxNSkgQG1hcCgicGFzc3dvcmRfbWFzdGVyIikKICBiYWxhbmNlIEZsb2F0IEBkZWZhdWx0KDApCiAgY3JlYXRlZEF0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKSBAbWFwKCJjcmVhdGVkX2F0IikKICB1cGRhdGVkQXQgRGF0ZVRpbWUgQGRlZmF1bHQobm93KCkpIEB1cGRhdGVkQXQgQG1hcCgidXBkYXRlZF9hdCIpCiAgZmluYW5jaWFsVHJhbnNhY3Rpb25zIEZpbmFuY2lhbFRyYW5zYWN0aW9uW10KICBjYXRlZ29yaWVzIENhdGVnb3J5W10KICBub3RpZmljYXRpb25zIE5vdGlmaWNhdGlvbltdCgogIEBAbWFwKCJiYW5rX2FjY291bnQiKQp9CgplbnVtIE5vdGlmaWNhdGlvblR5cGUgewogIFB1c2gKICBJbnRlcm5hbAogIE1haWwKCiAgQEBtYXAoIm5vdGlmaWNhdGlvbl90eXBlIikKfQoKbW9kZWwgTm90aWZpY2F0aW9uIHsKICBpZCBJbnQgQGlkIEBkZWZhdWx0KGF1dG9pbmNyZW1lbnQoKSkKICBiYW5rQWNjb3VudCBCYW5rQWNjb3VudCBAcmVsYXRpb24oZmllbGRzOiBbYmFua0FjY291bnRJZF0sIHJlZmVyZW5jZXM6IFtpZF0pCiAgYmFua0FjY291bnRJZCBJbnQgQG1hcCgiYmFua19hY2NvdW50X2lkIikKICBzdWJqZWN0IFN0cmluZyBAZGIuVmFyQ2hhcig0NSkKICBjb250ZW50IFN0cmluZwogIHdhc1JlYWQgQm9vbGVhbiBAZGVmYXVsdChmYWxzZSkgQG1hcCgid2FzX3JlYWQiKQogIHR5cGUgTm90aWZpY2F0aW9uVHlwZSBAbWFwKCJ0eXBlIikKICBpc1NlbmQgQm9vbGVhbiBAZGVmYXVsdChmYWxzZSkgQG1hcCgiaXNfc2VuZCIpCiAgc2VuZEF0IERhdGVUaW1lIEBtYXAoInNlbmRfYXQiKQogIGNyZWF0ZWRBdCBEYXRlVGltZSBAZGVmYXVsdChub3coKSkgQG1hcCgiY3JlYXRlZF9hdCIpCiAgdXBkYXRlZEF0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKSBAdXBkYXRlZEF0IEBtYXAoInVwZGF0ZWRfYXQiKQogIG1haWwgTWFpbD8KCiAgQEBtYXAoIm5vdGlmaWNhdGlvbiIpCn0KCm1vZGVsIE1haWwgewogIGlkIEludCBAaWQgQGRlZmF1bHQoYXV0b2luY3JlbWVudCgpKQogIG5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb24gQHJlbGF0aW9uKGZpZWxkczogW25vdGlmaWNhdGlvbklkXSwgcmVmZXJlbmNlczogW2lkXSkKICBub3RpZmljYXRpb25JZCBJbnQgQG1hcCgibm90aWZpY2F0aW9uX2lkIikgQHVuaXF1ZQogIHJlY2lwaWVudCBTdHJpbmcgQGRiLlZhckNoYXIoNDUpCiAgY3JlYXRlZEF0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKSBAbWFwKCJjcmVhdGVkX2F0IikKICB1cGRhdGVkQXQgRGF0ZVRpbWUgQGRlZmF1bHQobm93KCkpIEB1cGRhdGVkQXQgQG1hcCgidXBkYXRlZF9hdCIpCgogIEBAbWFwKCJtYWlsIikKfQoKbW9kZWwgQ2F0ZWdvcnkgewogIGlkIEludCBAaWQgQGRlZmF1bHQoYXV0b2luY3JlbWVudCgpKQogIGJhbmtBY2NvdW50IEJhbmtBY2NvdW50IEByZWxhdGlvbihmaWVsZHM6IFtiYW5rQWNjb3VudElkXSwgcmVmZXJlbmNlczogW2lkXSkKICBiYW5rQWNjb3VudElkIEludCBAbWFwKCJiYW5rX2FjY291bnRfaWQiKQogIG5hbWUgU3RyaW5nIEBkYi5WYXJDaGFyKDQ1KQogIGNvbG9yIFN0cmluZyBAZGIuVmFyQ2hhcigxNSkKICBpc0Zhdm9yaXRlIEJvb2xlYW4gQGRlZmF1bHQoZmFsc2UpIEBtYXAoImlzX2Zhdm9yaXRlIikKICBjcmVhdGVkQXQgRGF0ZVRpbWUgQGRlZmF1bHQobm93KCkpIEBtYXAoImNyZWF0ZWRfYXQiKQogIHVwZGF0ZWRBdCBEYXRlVGltZSBAZGVmYXVsdChub3coKSkgQHVwZGF0ZWRBdCBAbWFwKCJ1cGRhdGVkX2F0IikKCiAgQEBtYXAoImNhdGVnb3J5IikKfQoKZW51bSBGaW5hbmNpYWxUcmFuc2FjdGlvblR5cGUgewogIEVYUEVOU0UKICBJTkNPTUUKCiAgQEBtYXAoImZpbmFuY2lhbF90cmFuc2FjdGlvbl90eXBlIikKfQoKZW51bSBGaW5hbmNpYWxUcmFuc2FjdGlvbk9jY3VycmVuY2UgewogIFNJTkdMRQogIFBST0dSQU1NQVRJQwoKICBAQG1hcCgiZmluYW5jaWFsX3RyYW5zYWN0aW9uX29jY3VycmVuY2UiKQp9CgplbnVtIEZpbmFuY2lhbFRyYW5zYWN0aW9uU2l0dWF0aW9uIHsKICBQRU5ESU5HCiAgUEFJRF9PVVQKICBQQVJUSUFMTFlfUEFJRAogIFJFQ0VJVkVECiAgUEFSVElBTExZX1JFQ0VJVkVECiAgTEFURQogIENBTkNFTEVECgogIEBAbWFwKCJmaW5hbmNpYWxfdHJhbnNhY3Rpb25fc2l0dWF0aW9uIikKfQoKbW9kZWwgRmluYW5jaWFsVHJhbnNhY3Rpb24gewogIGlkIEludCBAaWQgQGRlZmF1bHQoYXV0b2luY3JlbWVudCgpKQogIGJhbmtBY2NvdW50IEJhbmtBY2NvdW50IEByZWxhdGlvbihmaWVsZHM6IFtiYW5rQWNjb3VudElkXSwgcmVmZXJlbmNlczogW2lkXSkKICBiYW5rQWNjb3VudElkIEludCBAbWFwKCJiYW5rX2FjY291bnRfaWQiKQogIHRpdGxlIFN0cmluZyBAZGIuVmFyQ2hhcig1NSkKICBkZXNjcmlwdGlvbiBTdHJpbmcgQGRlZmF1bHQoIiIpCiAgdmFsdWUgRmxvYXQKICBwcmlvcml0eSBJbnQKICBpc09ic2VydmFibGUgQm9vbGVhbiBAZGVmYXVsdChmYWxzZSkgQG1hcCgiaXNfb2JzZXJ2YWJsZSIpCiAgaXNTZW5kTm90aWZpY2F0aW9uIEJvb2xlYW4gQGRlZmF1bHQoZmFsc2UpIEBtYXAoImlzX3NlbmRfbm90aWZpY2F0aW9uIikKICB0aW1lc1RvUmVwZWF0IEludCBAZGVmYXVsdCgwKSBAbWFwKCJ0aW1lc190b19yZXBlYXQiKQogIGNvdW50UmVwZWF0ZWRPY2N1cnJlbmNlcyBJbnQgQGRlZmF1bHQoMCkgQG1hcCgiY291bnRfcmVwZWF0ZWRfb2NjdXJyZW5jZXMiKQogIHR5cGUgRmluYW5jaWFsVHJhbnNhY3Rpb25UeXBlIEBtYXAoInR5cGUiKQogIHJlY2VpdmVyIFN0cmluZyBAZGVmYXVsdCgiIikKICBzZW5kZXIgU3RyaW5nIEBkZWZhdWx0KCIiKQogIHR5cGVPY2N1cnJlbmNlIEZpbmFuY2lhbFRyYW5zYWN0aW9uT2NjdXJyZW5jZSBAZGVmYXVsdChTSU5HTEUpIEBtYXAoInR5cGVfb2NjdXJyZW5jZSIpCiAgc2l0dWF0aW9uIEZpbmFuY2lhbFRyYW5zYWN0aW9uU2l0dWF0aW9uIEBkZWZhdWx0KFBFTkRJTkcpIEBtYXAoInNpdHVhdGlvbiIpCiAgZXhwaXJlc0luIERhdGVUaW1lIEBtYXAoImV4cGlyZXNfaW4iKQogIGNyZWF0ZWRBdCBEYXRlVGltZSBAZGVmYXVsdChub3coKSkgQG1hcCgiY3JlYXRlZF9hdCIpCiAgdXBkYXRlZEF0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKSBAdXBkYXRlZEF0IEBtYXAoInVwZGF0ZWRfYXQiKQogIHBheW1lbnRzIFBheW1lbnRbXQogIG5vdGVzIE5vdGVbXQoKICBAQG1hcCgiZmluYW5jaWFsX3RyYW5zYWN0aW9uIikKfQoKbW9kZWwgTm90ZSB7CiAgaWQgSW50IEBpZCBAZGVmYXVsdChhdXRvaW5jcmVtZW50KCkpCiAgZmluYW5jaWFsVHJhbnNhY3Rpb24gRmluYW5jaWFsVHJhbnNhY3Rpb24gQHJlbGF0aW9uKGZpZWxkczogW2ZpbmFuY2lhbFRyYW5zYWN0aW9uSWRdLCByZWZlcmVuY2VzOiBbaWRdKQogIGZpbmFuY2lhbFRyYW5zYWN0aW9uSWQgSW50IEBtYXAoImZpbmFuY2lhbF90cmFuc2FjdGlvbl9pZCIpCiAgZGVzY3JpcHRpb24gU3RyaW5nIEBkZWZhdWx0KCIiKQogIGNyZWF0ZWRBdCBEYXRlVGltZSBAZGVmYXVsdChub3coKSkgQG1hcCgiY3JlYXRlZF9hdCIpCiAgdXBkYXRlZEF0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKSBAdXBkYXRlZEF0IEBtYXAoInVwZGF0ZWRfYXQiKQoKICBAQG1hcCgibm90ZSIpCn0KCm1vZGVsIFBheW1lbnQgewogIGlkIEludCBAaWQgQGRlZmF1bHQoYXV0b2luY3JlbWVudCgpKQogIGZpbmFuY2lhbFRyYW5zYWN0aW9uIEZpbmFuY2lhbFRyYW5zYWN0aW9uIEByZWxhdGlvbihmaWVsZHM6IFtmaW5hbmNpYWxUcmFuc2FjdGlvbklkXSwgcmVmZXJlbmNlczogW2lkXSkKICBmaW5hbmNpYWxUcmFuc2FjdGlvbklkIEludCBAbWFwKCJmaW5hbmNpYWxfdHJhbnNhY3Rpb25faWQiKQogIHZhbHVlIEZsb2F0CiAgZGlzY291bnQgRmxvYXQgQGRlZmF1bHQoMCkKICBpbmNyZWFzZSBGbG9hdCBAZGVmYXVsdCgwKQogIHBhaWRBdCBEYXRlVGltZSBAZGVmYXVsdChub3coKSkgQG1hcCgicGFpZF9hdCIpCiAgY3JlYXRlZEF0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKSBAbWFwKCJjcmVhdGVkX2F0IikKCiAgQEBtYXAoInBheW1lbnQiKQp9",
  "inlineSchemaHash": "08c45be19e7a19515636910eca509c69fc3c1aa2e59ad8efeff2835a5eb3b94a",
  "noEngine": false
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":\"user\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"bankAccounts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BankAccount\",\"relationName\":\"BankAccountToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"BankAccount\":{\"dbName\":\"bank_account\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"BankAccountToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"passwordMaster\",\"dbName\":\"password_master\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balance\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"financialTransactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FinancialTransaction\",\"relationName\":\"BankAccountToFinancialTransaction\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"categories\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Category\",\"relationName\":\"BankAccountToCategory\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notifications\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Notification\",\"relationName\":\"BankAccountToNotification\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Notification\":{\"dbName\":\"notification\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bankAccount\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BankAccount\",\"relationName\":\"BankAccountToNotification\",\"relationFromFields\":[\"bankAccountId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bankAccountId\",\"dbName\":\"bank_account_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subject\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wasRead\",\"dbName\":\"was_read\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"dbName\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"NotificationType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isSend\",\"dbName\":\"is_send\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sendAt\",\"dbName\":\"send_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"mail\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Mail\",\"relationName\":\"MailToNotification\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Mail\":{\"dbName\":\"mail\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notification\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Notification\",\"relationName\":\"MailToNotification\",\"relationFromFields\":[\"notificationId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notificationId\",\"dbName\":\"notification_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recipient\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Category\":{\"dbName\":\"category\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bankAccount\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BankAccount\",\"relationName\":\"BankAccountToCategory\",\"relationFromFields\":[\"bankAccountId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bankAccountId\",\"dbName\":\"bank_account_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"color\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isFavorite\",\"dbName\":\"is_favorite\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"FinancialTransaction\":{\"dbName\":\"financial_transaction\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bankAccount\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BankAccount\",\"relationName\":\"BankAccountToFinancialTransaction\",\"relationFromFields\":[\"bankAccountId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bankAccountId\",\"dbName\":\"bank_account_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isObservable\",\"dbName\":\"is_observable\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isSendNotification\",\"dbName\":\"is_send_notification\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"timesToRepeat\",\"dbName\":\"times_to_repeat\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"countRepeatedOccurrences\",\"dbName\":\"count_repeated_occurrences\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"dbName\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FinancialTransactionType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receiver\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sender\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"typeOccurrence\",\"dbName\":\"type_occurrence\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"FinancialTransactionOccurrence\",\"default\":\"SINGLE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"situation\",\"dbName\":\"situation\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"FinancialTransactionSituation\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresIn\",\"dbName\":\"expires_in\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"payments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Payment\",\"relationName\":\"FinancialTransactionToPayment\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Note\",\"relationName\":\"FinancialTransactionToNote\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Note\":{\"dbName\":\"note\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"financialTransaction\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FinancialTransaction\",\"relationName\":\"FinancialTransactionToNote\",\"relationFromFields\":[\"financialTransactionId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"financialTransactionId\",\"dbName\":\"financial_transaction_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Payment\":{\"dbName\":\"payment\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"financialTransaction\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FinancialTransaction\",\"relationName\":\"FinancialTransactionToPayment\",\"relationFromFields\":[\"financialTransactionId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"financialTransactionId\",\"dbName\":\"financial_transaction_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"discount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"increase\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paidAt\",\"dbName\":\"paid_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"NotificationType\":{\"values\":[{\"name\":\"Push\",\"dbName\":null},{\"name\":\"Internal\",\"dbName\":null},{\"name\":\"Mail\",\"dbName\":null}],\"dbName\":\"notification_type\"},\"FinancialTransactionType\":{\"values\":[{\"name\":\"EXPENSE\",\"dbName\":null},{\"name\":\"INCOME\",\"dbName\":null}],\"dbName\":\"financial_transaction_type\"},\"FinancialTransactionOccurrence\":{\"values\":[{\"name\":\"SINGLE\",\"dbName\":null},{\"name\":\"PROGRAMMATIC\",\"dbName\":null}],\"dbName\":\"financial_transaction_occurrence\"},\"FinancialTransactionSituation\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"PAID_OUT\",\"dbName\":null},{\"name\":\"PARTIALLY_PAID\",\"dbName\":null},{\"name\":\"RECEIVED\",\"dbName\":null},{\"name\":\"PARTIALLY_RECEIVED\",\"dbName\":null},{\"name\":\"LATE\",\"dbName\":null},{\"name\":\"CANCELED\",\"dbName\":null}],\"dbName\":\"financial_transaction_situation\"}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.getQueryEngineWasmModule = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)


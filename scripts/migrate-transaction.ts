/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @fileoverview Migration script for updating transaction documents in MongoDB.
 * npx ts-node scripts/migrate-transaction.ts
 */

import * as dotenv from 'dotenv'
import mongoose, { Schema } from 'mongoose'

dotenv.config()

const { MONGO_Test: MONGO_URI } = process.env

if (!MONGO_URI) {
  console.error('Error: MONGO_URI must be set in the .env file.')
  process.exit(1)
}

/**
 * A flexible schema to read any document from the collection without
 * validating against a strict structure. This is the safest way to ensure
 * all data fields are preserved during migration.
 */
const flexibleSchema = new Schema(
  {
    _id: Schema.Types.Mixed, // Allow both string and ObjectId
    userId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['deposit', 'withdraw'],
      required: true
    },
    location: {
      type: String,
      enum: ['bank', 'balance']
    },
    currency: String,
    amount: Number,
    timestamp: Date,
    source: String,
    content: String
  },
  { timestamps: true, strict: false }
)

/**
 * The main function to run the migration.
 */
async function migrateTransactionIds() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGO_URI)
  console.log('Successfully connected to MongoDB.')

  try {
    // Create a Mongoose model for your collection using the flexible schema
    const TransactionModel = mongoose.model('transaction', flexibleSchema)

    console.log(`Searching for documents with string _id in collection: "transaction"...`)

    // Find all documents where the _id field is a string (not ObjectId)
    const stringIdDocs = await TransactionModel.find({
      _id: { $type: 'string' }
    }).exec()

    let documentsProcessed = 0
    const documentsFound = stringIdDocs.length

    console.log(`Found ${documentsFound} documents with string _id`)

    // Process documents one by one to save memory
    for (const doc of stringIdDocs) {
      const oldId = doc._id
      console.log(`\nProcessing transaction with string _id: ${oldId}`)

      try {
        // 1. Create a new document object, excluding the _id and __v fields
        const docObject = doc.toObject()
        // This destructuring trick creates a new object `docData` with all fields except _id and __v
        const { _id, __v, ...docData } = docObject

        // 2. Create and save the new document. Mongoose will generate a new ObjectId.
        const newDoc = new TransactionModel(docData)
        await newDoc.save()
        console.log(`  ✅ New transaction created with ObjectId: ${newDoc._id}`)

        // 3. Delete the old document with the string _id
        await TransactionModel.deleteOne({ _id: oldId })
        console.log(`  ✅ Old transaction with string _id "${oldId}" deleted.`)

        documentsProcessed++
      } catch (error) {
        console.error(`  ❌ Failed to process transaction with _id: ${oldId}. Error:`, error)
      }
    }

    if (documentsFound === 0) {
      console.log('\nNo transactions with string _ids were found. Your collection seems to be fine!')
    } else {
      console.log(
        `\nMigration complete. Successfully processed ${documentsProcessed} out of ${documentsFound} found documents.`
      )
    }
  } catch (error) {
    console.error('An unexpected error occurred during the migration process:', error)
  } finally {
    // Always disconnect from the database
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB.')
  }
}

// Run the migration
migrateTransactionIds()

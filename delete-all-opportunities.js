// This is a utility script to delete all opportunities for testing purposes
// Run with: node delete-all-opportunities.js

const { MongoClient } = require("mongodb");

async function deleteAllOpportunities() {
  // Replace with your MongoDB connection string
  const uri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/your-database";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();

    // Delete all events
    const eventsResult = await db.collection("events").deleteMany({});
    console.log(`Deleted ${eventsResult.deletedCount} events`);

    // Clear events array from all organizations
    const orgsResult = await db
      .collection("organizations")
      .updateMany({}, { $set: { events: [] } });
    console.log(`Updated ${orgsResult.modifiedCount} organizations`);

    console.log("All opportunities deleted successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

// Uncomment the line below to run the script
// deleteAllOpportunities();

console.log(
  "Script loaded. Call deleteAllOpportunities() to delete all opportunities."
);
console.log(
  "WARNING: This will delete ALL opportunities from ALL organizations!"
);

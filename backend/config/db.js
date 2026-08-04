import mongoose from "mongoose";

const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017";

function maskMongoUri(uri) {
  if (!uri) return "";
  return uri.replace(/(mongodb\+srv:\/\/|mongodb:\/\/)([^:@/]+):([^@/]+)@/i, "$1$2:***@");
}

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_LOCAL_URI;
  const dbName = process.env.MONGODB_DB_NAME || "duvix";
  const connectionOptions = {
    dbName,
    serverSelectionTimeoutMS: 5000,
    retryWrites: true,
    retryReads: true,
  };

  try {
    await mongoose.connect(mongoUri, connectionOptions);
    const safeUri = maskMongoUri(mongoUri);
    console.log(`MongoDB connected successfully: ${safeUri} (db: ${dbName})`);
    return true;
  } catch (primaryError) {
    console.warn("Primary MongoDB connection failed:", primaryError.message);

    if (mongoUri !== DEFAULT_LOCAL_URI) {
      try {
        await mongoose.connect(DEFAULT_LOCAL_URI, connectionOptions);
        console.warn(
          `Primary MongoDB was unavailable, falling back to local database: ${DEFAULT_LOCAL_URI} (db: ${dbName})`,
        );
        return true;
      } catch (fallbackError) {
        console.error("Local MongoDB fallback failed:", fallbackError.message);
      }
    }

    return false;
  }
}

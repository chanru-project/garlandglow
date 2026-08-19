import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";

const DEFAULT_GOOGLE_CLIENT_ID = "57607920385-v1q70t4adphnq1q1ceo9ii3n7ig8pao6.apps.googleusercontent.com";

function getGoogleClientId() {
  return (
    process.env.GOOGLE_CLIENT_ID ||
    process.env.VITE_GOOGLE_CLIENT_ID ||
    DEFAULT_GOOGLE_CLIENT_ID
  );
}

export async function googleAuth(req, res) {
  try {
    const { credential } = req.body || {};

    if (!credential || typeof credential !== "string") {
      return res.status(400).json({
        success: false,
        message: "Google credential ID token is required.",
      });
    }

    const clientId = getGoogleClientId();
    const client = new OAuth2Client(clientId);

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
    } catch (verifyError) {
      console.error("[auth] Google ID token verification failed:", verifyError?.message || verifyError);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Google token. Please sign in again.",
      });
    }

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Unable to extract user profile from Google token.",
      });
    }

    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account does not have an associated email address.",
      });
    }

    if (email_verified === false) {
      return res.status(400).json({
        success: false,
        message: "Google email address is not verified. Please verify your Google email first.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const displayName = (name || normalizedEmail.split("@")[0] || "User").trim();

    // Check if user exists by googleId or email
    let user = await User.findOne({
      $or: [{ googleId }, { email: normalizedEmail }],
    });

    if (user) {
      let updated = false;

      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (picture && !user.picture) {
        user.picture = picture;
        updated = true;
      }
      if (!user.name && displayName) {
        user.name = displayName;
        updated = true;
      }

      if (updated) {
        await user.save();
      }
    } else {
      user = await User.create({
        googleId,
        email: normalizedEmail,
        name: displayName,
        picture: picture || "",
        authProvider: "google",
      });
      console.log(`[auth] New Google user registered: ${normalizedEmail} (${user._id})`);
    }

    return res.status(200).json({
      success: true,
      message: "Google authentication successful.",
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        picture: user.picture || picture || "",
        authProvider: user.authProvider || "google",
      },
    });
  } catch (error) {
    console.error("[auth] googleAuth unhandled error:", error?.message || error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during Google authentication.",
    });
  }
}

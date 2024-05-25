import { cookies } from "next/headers";

export async function getSessionData() {
  const encryptedSessionData = cookies().get("currentUser")?.value;
  return encryptedSessionData ? encryptedSessionData : null;
}

export async function setSessionData(sessionData: string) {
  const encryptedSessionData = sessionData; // Encrypt your session data
  cookies().set("currentUser", encryptedSessionData, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  });
}

export async function clearSessionData() {
  cookies().delete("currentUser");
}

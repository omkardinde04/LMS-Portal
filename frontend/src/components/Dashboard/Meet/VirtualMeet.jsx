import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import "../Meet/VirtualMeet.css";

const CLIENT_ID = "770586536781-f159t1m2p5olmb2u3d1h1n5jle49q7ge.apps.googleusercontent.com";
const API_KEY =  "AIzaSyC1UIx_iFQL8JgtTwwL1UqGLOKVHF0lc0s";
const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/calendar";

export default function VirtualMeet() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [meetLink, setMeetLink] = useState("");
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiLoading, setApiLoading] = useState(false);

    useEffect(() => {
        const initClient = async () => {
            try {
                await new Promise((resolve) => gapi.load("client:auth2", resolve));

                await gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: DISCOVERY_DOCS,
                    scope: SCOPES,
                });

                const auth = gapi.auth2.getAuthInstance();
                const signedIn = auth.isSignedIn.get();
                setIsSignedIn(signedIn);

                auth.isSignedIn.listen((status) => {
                    setIsSignedIn(status);
                    if (status) {
                        // Wait for token before fetching
                        waitForTokenAndFetch();
                    } else {
                        setMeetings([]);
                        setMeetLink("");
                    }
                });

                if (signedIn) {
                    waitForTokenAndFetch();
                }
            } catch (error) {
                console.error("GAPI initialization error:", error);
                alert("Failed to initialize Google API. Check console for details.");
            } finally {
                setLoading(false);
            }
        };

        const waitForTokenAndFetch = async () => {
            const auth = gapi.auth2.getAuthInstance();
            let tokenResponse = auth.currentUser .get()?.getAuthResponse();
            let attempts = 0;
            while (!tokenResponse && attempts < 50) { // Poll up to 5 seconds
                await new Promise(resolve => setTimeout(resolve, 100));
                tokenResponse = auth.currentUser .get()?.getAuthResponse();
                attempts++;
            }
            if (tokenResponse) {
                await fetchMeetings();
            } else {
                console.error("Token not available after sign-in");
                alert("Sign-in succeeded, but authentication token failed to load. Try refreshing the page.");
            }
        };

        initClient();
    }, []);

   const handleAuthClick = async () => {
  try {
    setApiLoading(true);
    const auth = gapi.auth2.getAuthInstance();

    const user = await auth.signIn(); // Popup opens here
    const token = user.getAuthResponse(true).access_token;

    if (!token) {
      throw new Error("No access token received");
    }

    setIsSignedIn(true);
    await fetchMeetings();
  } catch (error) {
    console.error("Sign-in error:", error);
    if (error.error === "popup_closed_by_user") {
      alert("You closed the Google sign-in popup before finishing login.");
    } else {
      alert("Sign-in failed: " + (error.error || error.message));
    }
  } finally {
    setApiLoading(false);
  }
};


    const handleSignOut = async () => {
        try {
            await gapi.auth2.getAuthInstance().signOut();
            setIsSignedIn(false);
            setMeetings([]);
            setMeetLink("");
        } catch (error) {
            console.error("Sign-out error:", error);
        }
    };

    const createMeet = async () => {
        try {
            setApiLoading(true);
            const now = new Date();
            const startTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 min in future
            const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 min duration

            const event = {
                summary: "Learnify Virtual Meet",
                description: "Meeting created via Learnify Dashboard",
                start: {
                    dateTime: startTime.toISOString(),
                    timeZone: "Asia/Kolkata",
                },
                end: {
                    dateTime: endTime.toISOString(),
                    timeZone: "Asia/Kolkata",
                },
                conferenceData: {
                    createRequest: {
                        requestId: `learnify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // More unique
                        conferenceSolutionKey: { type: "hangoutsMeet" },
                    },
                },
            };

            const response = await gapi.client.calendar.events.insert({
                calendarId: "primary",
                resource: event,
                conferenceDataVersion: 1,
            });

            const meet = response.result.hangoutLink;
            if (meet) {
                setMeetLink(meet);
                // Auto-refresh list
                setTimeout(fetchMeetings, 2000);
                alert("Meeting created successfully! Check the list or join below.");
            } else {
                alert("Meeting created, but no Meet link generated. Check your Google Calendar.");
            }
        } catch (error) {
            console.error("Create Meet error:", error);
            const msg = error.result?.error?.message || error.message || "Unknown error";
            alert(`Could not create Meet: ${msg}. Ensure you granted calendar permissions.`);
        } finally {
            setApiLoading(false);
        }
    };

    const fetchMeetings = async (retryCount = 0) => {
        try {
            setApiLoading(true);
            const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString(); // Include recent events
            const response = await gapi.client.calendar.events.list({
                calendarId: "primary",
                timeMin: tenMinsAgo,
                showDeleted: false,
                singleEvents: true,
                orderBy: "startTime",
            });

            const events = response.result.items?.filter(
                (event) => event.conferenceData && (event.conferenceData.entryPoints || event.hangoutLink)
            ) || [];

            // Filter to future/upcoming only for display
            const upcoming = events.filter(event => 
                new Date(event.start.dateTime || event.start.date) > new Date()
            );

            setMeetings(upcoming);
        } catch (error) {
            console.error("Fetch meetings error:", error);
            const msg = error.result?.error?.message || error.message || "Unknown error";
            if (msg.includes("401") || msg.includes("auth") || retryCount < 2) {
                // Retry on auth errors
                console.log(`Retrying fetch... (attempt ${retryCount + 1})`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                await fetchMeetings(retryCount + 1);
            } else {
                alert(`Failed to fetch meetings: ${msg}. Try signing out/in or check console.`);
            }
        } finally {
            setApiLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="virtual-meet-container">
                <p>Loading Google API client...</p>
            </div>
        );
    }

    return (
        <div className="virtual-meet-container">
            <h2>Virtual Meet</h2>

            {!isSignedIn ? (
                <button onClick={handleAuthClick} disabled={apiLoading} className="meet-btn">
                    {apiLoading ? "Signing in..." : "Sign in with Google"}
                </button>
            ) : (
                <>
                    <div className="meet-actions">
                        <button onClick={createMeet} disabled={apiLoading} className="meet-btn">
                            {apiLoading ? "Creating..." : "Create Meet"}
                        </button>
                        <button onClick={() => fetchMeetings()} disabled={apiLoading} className="meet-btn">
                            {apiLoading ? "Refreshing..." : "Refresh Meetings"}
                        </button>
                        <button onClick={handleSignOut} className="signout-btn">
                            Sign Out
                        </button>
                    </div>

                    {meetLink && (
                        <div className="meet-link">
                            <h3>Latest Created Meeting</h3>
                            <a
                                href={meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="join-link"
                            >
                                Join Meet Now
                            </a>
                            <p><small>Opens in a new tab. Allow camera/microphone when prompted.</small></p>
                        </div>
                    )}

                    <div className="meeting-list">
                        <h3>Upcoming Google Meet Sessions</h3>
                        {apiLoading ? (
                            <p>Loading meetings...</p>
                        ) : meetings.length === 0 ? (
                            <p>No upcoming meetings found. Create one above or check your Google Calendar for events with Meet links.</p>
                        ) : (
                            <ul>
                                {meetings.map((m) => (
                                    <li key={m.id}>
                                        <strong>{m.summary || "Untitled Meeting"}</strong> —{" "}
                                        {new Date(m.start.dateTime || m.start.date).toLocaleString()}
                                        <br />
                                        <a
                                            href={m.hangoutLink || m.conferenceData?.entryPoints?.[0]?.uri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="join-link"
                                        >
                                            Join Meet
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

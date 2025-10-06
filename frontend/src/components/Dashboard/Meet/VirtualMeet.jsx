
import React, { useEffect, useState } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import "../Meet/VirtualMeet.css";


export default function VirtualMeet() {
    const CLIENT_ID = "770586536781-f159t1m2p5olmb2u3d1h1n5jle49q7ge.apps.googleusercontent.com";
    const SCOPES = "https://www.googleapis.com/auth/calendar";

    const [isSignedIn, setIsSignedIn] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const [meetLink, setMeetLink] = useState("");
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);

    // Fetch meetings if already signed in (e.g. after refresh)
    useEffect(() => {
        if (accessToken) {
            fetchMeetings();
        }
        // eslint-disable-next-line
    }, [accessToken]);


    // Google OAuth login handler using useGoogleLogin
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            // tokenResponse contains access_token
            if (tokenResponse && tokenResponse.access_token) {
                setAccessToken(tokenResponse.access_token);
                setIsSignedIn(true);
            } else {
                alert("Google sign-in failed. No access token received.");
            }
        },
        onError: () => {
            alert("Google sign-in failed. Please try again.");
        },
        scope: SCOPES,
        flow: "implicit", // or "auth-code" if you have backend
    });

    const handleSignOut = () => {
        googleLogout();
        setIsSignedIn(false);
        setAccessToken("");
        setMeetings([]);
        setMeetLink("");
    };

    const createMeet = async () => {
        console.log("Creating Meet with access token:", accessToken);
        if (!accessToken) {
            alert("You must be signed in to create a meeting.");
            return;
        }
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
                        requestId: `learnify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        conferenceSolutionKey: { type: "hangoutsMeet" },
                    },
                },
            };

            const response = await fetch(
                "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(event),
                }
            );
            const data = await response.json();
            const meet = data.hangoutLink;
            if (meet) {
                setMeetLink(meet);
                setTimeout(fetchMeetings, 2000);
                alert("Meeting created successfully! Check the list or join below.");
            } else {
                alert("Meeting created, but no Meet link generated. Check your Google Calendar.");
            }
        } catch (error) {
            console.error("Create Meet error:", error);
            alert("Could not create Meet. Ensure you granted calendar permissions.");
        } finally {
            setApiLoading(false);
        }
    };

    const fetchMeetings = async () => {
        if (!accessToken) return;
        try {
            setApiLoading(true);
            const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
            const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(tenMinsAgo)}&showDeleted=false&singleEvents=true&orderBy=startTime&conferenceDataVersion=1`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            const events = data.items?.filter(
                (event) => event.conferenceData && (event.conferenceData.entryPoints || event.hangoutLink)
            ) || [];
            const upcoming = events.filter(event =>
                new Date(event.start.dateTime || event.start.date) > new Date()
            );
            setMeetings(upcoming);
        } catch (error) {
            console.error("Fetch meetings error:", error);
            alert("Failed to fetch meetings. Try signing out/in or check console.");
        } finally {
            setApiLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="virtual-meet-container">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="virtual-meet-container">
            <h2>Virtual Meet</h2>

            {!isSignedIn ? (
                <button onClick={() => login()} className="meet-btn" style={{ width: 300 }}>
                    Sign in with Google
                </button>
            ) : (
                <>
                    <div className="meet-actions">
                        <button onClick={createMeet} disabled={apiLoading} className="meet-btn">
                            {apiLoading ? "Creating..." : "Create Meet"}
                        </button>
                        <button onClick={fetchMeetings} disabled={apiLoading} className="meet-btn">
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

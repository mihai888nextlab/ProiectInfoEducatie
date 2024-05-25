"use client";

import search from "@/assets/search-heart.svg";
import PlacesService from "./PlacesService";

import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { use, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

import "./dashboard.scss";
import DashHeader from "@/Components/DashHeader";
import { checkSession } from "@/lib/actions";

export default function Dashboard() {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [user, setUser] = useState<{
    _id: string;
    email: string;
    username: string;
    fullName: string;
    password: string;
  } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
      });
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      const response = await checkSession();
      setUser(JSON.parse(response));
    };

    getData();
  }, []);

  return (
    <div>
      {location.latitude && location.longitude ? (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GMAPS_API_KEY || ""}>
          <Map
            style={{ width: "100%", height: "100vh" }}
            defaultCenter={{ lat: location.latitude, lng: location.longitude }}
            defaultZoom={12}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
          />
          <PlacesService lat={location.latitude} long={location.longitude} />
        </APIProvider>
      ) : (
        <div className="flex items-center justify-center absolute top-0 bottom-0 left-0 right-0 z-20">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      <DashHeader name={user?.username ? user.username : ""} />
    </div>
  );
}

"use client";

import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import "./dashboard.scss";
import { runActivities, runHotels, runTransport } from "@/aiActions/generate";
import { Button, Spinner } from "react-bootstrap";
import { set } from "mongoose";

interface Props {
  lat: number;
  long: number;
}

export default function PlacesService(props: Props) {
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");
  const [placesService, setPlacesService] =
    useState<google.maps.places.Autocomplete | null>(null);

  const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(
    null
  );

  const [activs, setActivs] = useState<
    {
      activity_name: string;
      activity_location: string;
      activity_lat: number;
      activity_long: number;
      price: string;
    }[]
  >([]);

  const [trans, setTrans] = useState<
    { transport_method: string; transport_description: string; price: string }[]
  >([]);

  const [hotels, setHotels] = useState<
    {
      hotel_name: string;
      price: string;
      location: string;
      long: number;
      lat: number;
    }[]
  >([]);

  const [loadActivs, setLoadActivs] = useState<boolean>(false);
  const [loadTrans, setLoadTrans] = useState<boolean>(false);
  const [loadHotels, setLoadHotels] = useState<boolean>(false);

  let inputRef = useRef<HTMLInputElement | null>(null);

  const [wereToGo, setWereToGo] = useState(true);
  const [displayActivities, setDisplayActivities] = useState("");

  const [activeSubsection, setActiveSubsection] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!map || !inputRef.current?.value) return;

    console.log("Place: ", place?.geometry?.viewport);

    if (place?.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
      setWereToGo(false);
      setDisplayActivities("collapsed");
    }
  };

  const handleAiGenerateActivities = async () => {
    if (activeSubsection == "activities") {
      setActiveSubsection("");
      return;
    }

    setActiveSubsection("activities");
    console.log(activs);

    if (activs.length == 0) {
      setLoadActivs(true);
      const res = await runActivities(place?.formatted_address || "");
      console.log(res);
      setLoadActivs(false);

      try {
        console.log(JSON.parse(res));
        setActivs(JSON.parse(res));
      } catch (error) {
        console.log(error);
        setActivs([
          {
            activity_name: "No activities found",
            activity_location: "",
            activity_lat: 0,
            activity_long: 0,
            price: "0",
          },
        ]);
      }
    }
  };

  const handleAiGenerateTrans = async () => {
    if (activeSubsection == "transport") {
      setActiveSubsection("");
      return;
    }

    setActiveSubsection("transport");

    if (trans.length == 0) {
      setLoadTrans(true);
      const res = await runTransport(place?.formatted_address || "");
      setLoadTrans(false);
      console.log(res);

      try {
        console.log(JSON.parse(res));
        setTrans(JSON.parse(res));
      } catch (error) {
        console.log(error);
        setTrans([
          {
            transport_method: "No transport methods found",
            transport_description: "",
            price: "",
          },
        ]);
      }
    }
  };

  const handleAiGenerateHotels = async () => {
    if (activeSubsection == "hotels") {
      setActiveSubsection("");
      return;
    }

    setActiveSubsection("hotels");

    if (trans.length == 0) {
      setLoadHotels(true);
      const res = await runHotels(place?.formatted_address || "");
      setLoadHotels(false);
      console.log(res);

      try {
        console.log(JSON.parse(res));
        setHotels(JSON.parse(res));
      } catch (error) {
        console.log(error);
        setHotels([
          {
            hotel_name: "No hotels found",
            location: "",
            price: "",
            long: 0,
            lat: 0,
          },
        ]);
      }
    }
  };

  useEffect(() => {
    if (!map || !place) return;

    if (place?.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
      setWereToGo(false);
      setDisplayActivities("collapsed");
    }
  }, [map]);

  useEffect(() => {
    if (!placesLibrary || !inputRef.current) return;

    const options = {
      types: ["(cities)"],
    };

    setPlacesService(
      new placesLibrary.Autocomplete(
        inputRef.current as HTMLInputElement,
        options
      )
    );
  }, [placesLibrary]);

  useEffect(() => {
    if (!placesService) return;

    placesService.addListener("place_changed", () => {
      setPlace(placesService.getPlace());
    });
  }, [placesService]);

  return (
    <>
      {wereToGo && (
        <div className="where-to-go absolute flex justify-center items-center top-0 left-0 bottom-0 right-0 z-10">
          <div className="bg-white rounded-lg w-2/3 h-2/3 shadow-lg grid grid-rows-3 p-1.5">
            <h1 className=" text-center">
              Where do you want to go on your next vacation?
            </h1>

            <div className="options flex items-center justify-center flex-col">
              <form
                onSubmit={(e) => handleSubmit(e)}
                className="mb-10 flex w-full items-center justify-center"
              >
                <input
                  type="text"
                  className="rounded-lg w-1/3"
                  placeholder="Search a city or a country"
                  ref={inputRef}
                />
                <button
                  type="submit"
                  className="w-10 h-full bg-sky-600 flex items-center justify-center rounded-lg ml-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-search-heart text-white"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018" />
                    <path d="M13 6.5a6.47 6.47 0 0 1-1.258 3.844q.06.044.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11" />
                  </svg>
                </button>
              </form>

              <div className="mb-10 text-gray-700 font-bold text-lg flex justify-center items-center w-2/3">
                <div className="line w-1/3 h-0.5 bg-gray-700 m-3"></div>
                <p className="m-0">OR</p>
                <div className="line w-1/3 h-0.5 bg-gray-700 m-3"></div>
              </div>

              <Button size="lg" className="cursor-not-allowed">
                Choose by your preferences (COMMING SOON)
              </Button>
            </div>
          </div>
        </div>
      )}

      {displayActivities && (
        <div className={"activities " + displayActivities}>
          <div className="menu shadow-lg">
            <div className="title">
              <h1>{place?.formatted_address}</h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-caret-up-square-fill"
                viewBox="0 0 16 16"
                onClick={() => {
                  setDisplayActivities(
                    displayActivities == "full" ? "collapsed" : "full"
                  );
                }}
              >
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4 9h8a.5.5 0 0 0 .374-.832l-4-4.5a.5.5 0 0 0-.748 0l-4 4.5A.5.5 0 0 0 4 11" />
              </svg>
            </div>

            <div className="content">
              <div
                className={
                  "act" + (activeSubsection == "activities" ? " active" : "")
                }
              >
                <div className="title">
                  <h1>Activities</h1>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-caret-down-fill"
                    viewBox="0 0 16 16"
                    onClick={() => handleAiGenerateActivities()}
                  >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                </div>
                {loadActivs && (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
                <div className="list">
                  {activs.map((act, i) => (
                    <div key={i} className="actlis">
                      <h1>{act.activity_name}</h1>
                      <p>{act.activity_location}</p>
                      <p>{act.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={
                  "act" + (activeSubsection == "transport" ? " active" : "")
                }
              >
                <div className="title">
                  <h1>Methods of transportation</h1>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-caret-down-fill"
                    viewBox="0 0 16 16"
                    onClick={() => handleAiGenerateTrans()}
                  >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                </div>

                {loadTrans && (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
                <div className="list">
                  {trans.map((trs, i) => (
                    <div key={i} className="actlis">
                      <h1>{trs.transport_method}</h1>
                      <p>{trs.transport_description}</p>
                      <p>{trs.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={
                  "act" + (activeSubsection == "hotels" ? " active" : "")
                }
              >
                <div className="title">
                  <h1>Hotels</h1>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-caret-down-fill"
                    viewBox="0 0 16 16"
                    onClick={() => handleAiGenerateHotels()}
                  >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                </div>

                {loadHotels && (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
                <div className="list">
                  {hotels.map((hot, i) => (
                    <div key={i} className="actlis">
                      <h1>{hot.hotel_name}</h1>
                      <p>{hot.location}</p>
                      <p>{hot.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

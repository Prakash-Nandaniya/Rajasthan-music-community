// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { Icon } from "leaflet";
// import MarkerClusterGroup from "react-leaflet-markercluster";
// import { useNavigate } from "react-router-dom";
// const MapPage = () => {
//     const navigate = useNavigate();
//   const markers = [
//     { position: [26.9124, 75.7873], name: "Manganiyar" },
//     { position: [25.9124, 73.7873], name: "See Label" },
//   ];

//   const customIcon = new Icon({
//     iconUrl: "https://cdn-icons-png.flaticon.com/128/535/535239.png",
//     iconSize: [25, 41],
//   });
//   const handleMarkerClick = (name) => {
//     console.log(`Clicked on marker for ${name}`);
//     navigate('/community/1'); // Redirect to community list page
//   }
//   return (
//     <div>
//       <h1>Map Page</h1>
//       <p>Explore the map of music communities in Rajasthan.</p>
//       <MapContainer     
//         center={[26.5, 72.5]} // Centered in western Rajasthan
//         zoom={7}
//         style={{ height: "500px", width: "100%" }}
//         minZoom={7} // Prevents zooming out beyond Rajasthan
//         maxZoom={18} // Allows zooming in to see small villages
//         scrollWheelZoom={true} // Enables zoom with scroll wheel
//         doubleClickZoom={true} // Allows zoom with double click
//         dragging={true} // Enables panning inside Rajasthan
//         maxBounds={[
//           [23.3, 69.3], // Southwest corner
//           [30.2, 78.2], // Northeast corner
//         ]}
//         maxBoundsViscosity={1}
//       >
//         {/* <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         /> */}
// <TileLayer
//   url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
//   attribution="&copy; Esri"
// />

//         <MarkerClusterGroup>
//           {markers.map((marker, index) => (
//             <Marker key={index} position={marker.position} icon={customIcon}  eventHandlers={{
//                 click: (e) => {handleMarkerClick(marker.name);
//                 }, // Redirect on click
//               }}>
//               <Popup>{marker.name}</Popup>
//             </Marker>
//           ))}
//         </MarkerClusterGroup>
//       </MapContainer>
//     </div>
//   );
// };

// export default MapPage;


import React,{ useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-leaflet";
import API from "../../../api"; 
import { useEffect } from "react";

const MapPage = () => {
  const navigate = useNavigate();

  // 🎯 Sample markers with filter categories


  // 🛠️ State for search and filters
  const [markers, setMarkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await API.get("map");
        console.log(response.data);
        const transformedData = response.data.map((item) => ({
          position: [parseFloat(item.latitude), parseFloat(item.longitude)],
          name: item.groupName,
          community: item.community,
          location: item.address || "Unknown",
          instrument: item.quickInfo || "Not specified",
        }));
        setMarkers(transformedData);
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    };
    fetchMarkers();
  }, []);

  // 🎯 Function to filter markers 
  const filteredMarkers = markers.filter((marker) => {
    const query = searchQuery.toLowerCase();
    return (
      marker.name.toLowerCase().includes(query) ||
      marker.community.toLowerCase().includes(query) ||
      marker.location.toLowerCase().includes(query) ||
      marker.instrument.toLowerCase().includes(query)
    );
  });

  // 🎨 Custom Icon
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/535/535239.png",
    iconSize: [25, 41],
  });

  const handleMarkerClick = (name) => {
    console.log(`Clicked on marker for ${name}`);
    navigate("/community/1"); // Redirect to community list page
  };

  return (
    <div>
      <h1>Map Page</h1>
      <p>Explore the map of music communities in Rajasthan.</p>

      {/* 🎯 Search and Filter UI */}
      <input
        type="text"
        placeholder="Search by name, community, location, or instrument..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: "5px", width: "300px", marginBottom: "10px" }}
      />

       
 



      {/* 🗺️ Map Container */}
      <MapContainer
        center={[26.5, 72.5]}
        zoom={7}
        style={{ height: "500px", width: "100%" }}
        minZoom={7}
        maxZoom={18}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        maxBounds={[
          [23.3, 69.3], // Southwest corner
          [30.2, 78.2], // Northeast corner
        ]}
        maxBoundsViscosity={1}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
        />

        <MarkerClusterGroup>
          {filteredMarkers.map((marker, index) => (
 <Marker
 key={index}
 position={marker.position}
 icon={customIcon}
 eventHandlers={{
   click: () => handleMarkerClick(marker.name),
 }}
>
<Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
    <div>
      
      <p><strong>Community:</strong> {marker.community}</p>
      <p><strong>Location:</strong> {marker.location}</p>
      <p><strong>Instrument:</strong> {marker.instrument}</p>
    </div>
  </Tooltip>
</Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapPage;


